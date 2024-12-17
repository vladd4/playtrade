import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { UsersService } from '../../entities/users/users.service';

@Injectable()
export class UserRateLimitMiddleware implements NestMiddleware {
  private readonly HOUR = 60 * 60 * 1000; // 1 час в миллисекундах
  private readonly LIMIT = 200; // Лимит запросов

  constructor(
    @Inject('REDIS') private readonly redisClient: Redis,
    private readonly usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (
      req.path === '/api/auth/login' ||
      req.path === '/api/auth/refresh-token'
    ) {
      return next();
    }

    const sessionId = req.cookies['session_id'];

    const key = `user_rate_limit:${sessionId}`;
    try {
      let userData = await this.redisClient.get(key);

      if (!userData) {
        userData = JSON.stringify({ count: 0, timestamp: Date.now() });
        await this.redisClient.set(key, userData, 'PX', this.HOUR);
      }

      let { count, timestamp } = JSON.parse(userData);
      const currentTime = Date.now();
      const elapsedTime = currentTime - timestamp;

      if (elapsedTime > this.HOUR) {
        count = 0;
        timestamp = currentTime;
      }

      count += 1;

      if (count > this.LIMIT) {
        const user = await this.usersService.findUserBySessionId(sessionId);
        if (user) {
          await this.usersService.banUser(user.id);
          return next(
            new UnauthorizedException(
              'Вы были заблокированы за превышение лимита запросов',
            ),
          );
        }
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

    next();
  }
}
