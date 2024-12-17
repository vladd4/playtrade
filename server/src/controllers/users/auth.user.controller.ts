import {
  Controller,
  Post,
  HttpStatus,
  Req,
  Body,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../../entities/users/users.service';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { LoginDto } from '../../entities/users/login.dto';
import { v4 as uuidv4 } from 'uuid';
import * as base64 from 'base-64';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('api/auth-user')
@Controller('api/auth-user')
@UseGuards(AuthGuard('jwt'))
export class AuthUserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @ApiOperation({ summary: 'Логин пользователя' })
  @ApiResponse({ status: 200, description: 'Успешный логин' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера при логине' })
  @ApiBody({
    description: 'Параметры для авторизации пользователя',
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Пример авторизации пользователя',
        value: {
          telegramId: 123456789,
          password: '107324DdD107324',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<any> {
    try {
      const user = await this.usersService.findUser(loginDto.telegramId);
      if (!user) {
        throw new UnauthorizedException(
          'Неправильні облікові дані. Помилка у телеграм айді',
        );
      }

      if (user.isBanned) {
        const banMessage = user.banUntil
          ? `Ваш обліковий запис заблоковано до ${user.banUntil.toISOString()}.`
          : 'Ваш обліковий запис заблокований перманентно.';
        throw new UnauthorizedException(banMessage);
      }

      const isMatch = await bcrypt.compare(
        loginDto.password,
        base64.decode(user.password),
      );
      if (!isMatch) {
        throw new UnauthorizedException(
          'Неправильні облікові дані. Помилка з паролем',
        );
      }

      const sessionId = uuidv4();
      const refresh_token = this.usersService.generateRefreshToken(user);

      // Установка куки
      req.res.cookie('session_id', sessionId, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 день
        path: '/',
        sameSite: 'none',
      });

      req.res.cookie('user_refresh_token', refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 день
        path: '/',
        sameSite: 'none',
      });

      return {
        message: 'Login successful',
        userId: user.id,
      };
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new InternalServerErrorException('Помилка при логіні');
    }
  }

  @Post('refresh-session')
  @ApiOperation({ summary: 'Продление сессии пользователя' })
  @ApiResponse({ status: 200, description: 'Сессия продлена' })
  @ApiResponse({ status: 401, description: 'Сессия не валидна' })
  @ApiResponse({
    status: 500,
    description: 'Ошибка сервера при обновлении сессии',
  })
  async refreshSession(@Req() req: Request): Promise<any> {
    try {
      const refresh_token = req.cookies['user_refresh_token'];

      if (!refresh_token) {
        throw new UnauthorizedException('Refresh token відсутній');
      }

      const user = await this.usersService.validateRefreshToken(refresh_token);
      if (!user) {
        throw new UnauthorizedException('Сесія не валідна');
      }

      const sessionId = uuidv4();
      const new_refresh_token = this.usersService.generateRefreshToken(user);

      // Установка куки
      req.res.cookie('session_id', sessionId, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 день
        path: '/',
        sameSite: 'none',
      });

      req.res.cookie('user_refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 день
        path: '/',
        sameSite: 'none',
      });

      return {
        message: 'Сесія подовжена',
        userId: user.id,
      };
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new InternalServerErrorException('Помилка під час оновлення сесії');
    }
  }
}
