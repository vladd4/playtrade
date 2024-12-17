import {
  Controller,
  Post,
  HttpStatus,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { UsersService } from '../../entities/users/users.service';
import { OtpService } from '../../utils/otp.service';
import { EmailService } from '../../utils/email/email.service';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AdminLoginDto } from '../../entities/users/login-admin.dto';
import { v4 as uuidv4 } from 'uuid';
import * as base64 from 'base-64';
import { UserRole } from '../../utils/enum/userRole.enum';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('api/auth-admin')
@UseGuards(AuthGuard('jwt'))
@Controller('api/auth-admin')
export class AuthAdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Логин для ролей кроме USER' })
  @ApiResponse({ status: 200, description: 'Требуется подтверждение OTP' })
  @ApiResponse({
    status: 401,
    description: 'Неверные учетные данные или доступ запрещен',
  })
  @ApiResponse({ status: 500, description: 'Ошибка сервера при логине' })
  async loginAdminRoles(
    @Body() adminLoginDto: AdminLoginDto,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(adminLoginDto.email);
      if (!user) {
        throw new UnauthorizedException(
          'Неправильні облікові дані або доступ заборонено',
        );
      }

      if (user.role === UserRole.USER) {
        throw new UnauthorizedException('Доступ запрещен для роли USER');
      }

      const isMatch = await bcrypt.compare(
        adminLoginDto.password,
        base64.decode(user.password),
      );
      if (!isMatch) {
        throw new UnauthorizedException(
          'Неправильні облікові дані. Помилка з паролем',
        );
      }

      const { code, id } = this.otpService.generateOtp();
      await this.emailService.sendVerificationEmail(
        user.email,
        user.name,
        code,
      );

      this.usersService.saveUserOtp(id, user);

      return {
        message: 'OTP отправлен на почту',
        otpId: id,
        role: user.role,
      };
    } catch (e) {
      console.error('Error during admin login:', e); // Логирование ошибки
      throw new InternalServerErrorException('Помилка при логіні');
    }
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Проверка OTP' })
  @ApiResponse({ status: 200, description: 'OTP подтвержден' })
  @ApiResponse({ status: 401, description: 'Неверный OTP' })
  @ApiResponse({ status: 500, description: 'Ошибка при проверке OTP' })
  async verifyOtp(
    @Body() body: { otpId: string; code: string },
    @Req() req: Request,
  ): Promise<any> {
    try {
      const isValid = this.otpService.validateOtp(body.otpId, body.code);
      if (!isValid) {
        throw new UnauthorizedException('Неправильний OTP код');
      }

      const user = await this.usersService.findByOtpId(body.otpId);
      if (!user) {
        throw new UnauthorizedException('Користувач не знайдений');
      }

      const sessionId = uuidv4();
      const refresh_token = this.usersService.generateRefreshToken(user);

      req.res.cookie('session_id', sessionId, {
        httpOnly: true,
        secure: true, // всегда использовать secure для HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 день
        path: '/', // Установить путь '/' для глобальной доступности
        sameSite: 'none', // Разрешает отправку куки в кросс-доменных запросах
      });

      req.res.cookie('admin_refresh_token', refresh_token, {
        httpOnly: true,
        secure: true, // всегда использовать secure для HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 день
        path: '/', // Установить путь '/' для глобальной доступности
        sameSite: 'none', // Разрешает отправку куки в кросс-доменных запросах
      });
      user.sessionId = sessionId;
      await this.usersService.update(user.id, { sessionId });

      return {
        message: 'OTP підтверджено, вхід успішний',
        userId: user.id,
        role: user.role,
      };
    } catch (e) {
      console.error('Error during admin login:', e); // Логирование ошибки
      throw new InternalServerErrorException('Помилка при логіні');
    }
  }

  @Post('refresh-session')
  @ApiOperation({ summary: 'Продление сессии администратора' })
  @ApiResponse({ status: 200, description: 'Сессия продлена' })
  @ApiResponse({ status: 401, description: 'Сессия не валидна' })
  @ApiResponse({ status: 500, description: 'Ошибка при обновлении сессии' })
  async refreshSession(@Req() req: Request): Promise<any> {
    try {
      const refreshToken = req.cookies['admin_refresh_token'];

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token відсутній');
      }

      const user = await this.usersService.validateRefreshToken(refreshToken);
      if (!user) {
        throw new UnauthorizedException('Сесія не валідна');
      }

      const sessionId = uuidv4();
      const newRefreshToken = this.usersService.generateRefreshToken(user);

      req.res.cookie('session_id', sessionId, {
        httpOnly: true,
        secure: true, // всегда использовать secure для HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 день
        path: '/', // Установить путь '/' для глобальной доступности
        sameSite: 'none', // Разрешает отправку куки в кросс-доменных запросах
      });

      req.res.cookie('admin_refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: true, // всегда использовать secure для HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 день
        path: '/', // Установить путь '/' для глобальной доступности
        sameSite: 'none', // Разрешает отправку куки в кросс-доменных запросах
      });
      user.sessionId = sessionId;
      await this.usersService.update(user.id, { sessionId }); // Сохранение сессии

      return {
        message: 'Сесія продовжена',
        userId: user.id,
        role: user.role,
      };
    } catch (e) {
      console.error('Error during admin login:', e);
      throw new InternalServerErrorException('Помилка при логіні');
    }
  }
  @Post('logout')
  @ApiOperation({ summary: 'Логаут для администратора' })
  @ApiResponse({ status: 200, description: 'Успешный логаут' })
  @ApiResponse({ status: 500, description: 'Ошибка при логауте' })
  async logout(@Req() req: Request): Promise<any> {
    try {
      console.log('Cookies in request:', req.cookies);
      const sessionId = req.cookies['session_id'];
      if (!sessionId) {
        throw new UnauthorizedException('Сессия не найдена');
      }

      await this.usersService.invalidateSession(sessionId);
      req.res?.clearCookie('session_id', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      req.res?.clearCookie('admin_refresh_token', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'You have successfully logged out',
      };
    } catch (e) {
      console.error('Ошибка при логауте:', e);
      throw new InternalServerErrorException('Error during logout');
    }
  }
}
