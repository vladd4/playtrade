import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

@Injectable()
export class FrontendRateLimitMiddleware implements NestMiddleware {
  private readonly HOUR = 60 * 60 * 1000; // 1 час в миллисекундах
  private readonly LIMIT = 100; // Лимит запросов

  constructor(@Inject('REDIS') private readonly redisClient: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (
      req.path === '/api/auth/login' ||
      req.path === '/api/auth/refresh-token'
    ) {
      const clientIp = req.ip;

      const key = `auth_rate_limit:${clientIp}`;
      try {
        let clientData = await this.redisClient.get(key);

        if (!clientData) {
          clientData = JSON.stringify({ count: 0, timestamp: Date.now() });
          await this.redisClient.set(key, clientData, 'PX', this.HOUR);
        }

        let { count, timestamp } = JSON.parse(clientData);
        const currentTime = Date.now();
        const elapsedTime = currentTime - timestamp;

        if (elapsedTime > this.HOUR) {
          count = 0;
          timestamp = currentTime;
        }

        count += 1;

        if (count > this.LIMIT) {
          return next(
            new UnauthorizedException(
              'Превышен лимит запросов для логина или обновления токена',
            ),
          );
        }

        await this.redisClient.set(
          key,
          JSON.stringify({ count, timestamp }),
          'PX',
          this.HOUR,
        );
      } catch (error) {
        console.error('Error with Redis:', error);
        return next(
          new UnauthorizedException('Ошибка сервера при проверке лимитов'),
        );
      }
    }

    next();
  }
}
