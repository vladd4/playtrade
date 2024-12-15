import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

class LoginDto {
  username: string;
  password: string;
  secret: string;
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Авторизация фронтенд-программы',
    description:
        'Этот эндпоинт используется для авторизации программы фронтенда. При успешной авторизации возвращается access_token в теле ответа, и refresh_token устанавливается в httpOnly cookie.',
  })
  @ApiBody({
    description: 'Параметры для авторизации фронтенд-программы',
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Пример авторизации',
        value: {
          username: 'test',
          password: 'test',
          secret: 'test',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
        'Успешная авторизация. В теле ответа возвращается access_token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Неверные учетные данные или секрет.',
  })
  async login(
      @Body() body: LoginDto,
      @Req() req: Request,
  ) {
    const user = await this.authService.validateUser(
        body.username,
        body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (body.secret !== process.env.JWT_SECRET) {
      throw new UnauthorizedException('Invalid secret');
    }

    const { access_token, refresh_token } = await this.authService.login(user);

    // Установка куки
    req.res.cookie('frontend_refresh_token', refresh_token, {
      httpOnly: true,
      secure: true, // true если используется HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 день
      path: '/', // Путь куки
      sameSite: 'none', // Обязательно 'none' для кросс-доменных запросов
    });

    return { access_token };
  }
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Обновление токена фронтенд-программы',
    description:
        'Этот эндпоинт используется для обновления access_token фронтенд-программы, используя refresh_token, который хранится в HTTP-only cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Токен успешно обновлен. Возвращается новый access_token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Неверный токен или отсутствует refresh token в cookie.',
  })
  async refreshToken(
      @Req() req: Request,
  ) {
    try {
      const refresh_token = req.cookies['frontend_refresh_token'];

      if (!refresh_token) {
        throw new UnauthorizedException('Refresh token отсутствует');
      }

      try {
        this.authService.jwtService.verify(refresh_token, {
          secret: process.env.JWT_SECRET,
        });
      } catch (error) {
        console.error('JWT verification failed:', error.message);
        throw new UnauthorizedException('Invalid token');
      }

      // Генерация нового access_token
      const access_token = this.authService.jwtService.sign(
          {},
          {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
          },
      );

      return { access_token };
    } catch (e) {
      console.error('Error refreshing token:', e.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

}
