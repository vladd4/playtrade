import {
    Controller,
    Post,
    Body,
    Res,
    HttpStatus,
    Param,
    UseGuards,
    Put,
} from '@nestjs/common';
import { UsersService } from '../../entities/users/users.service';
import { Response } from 'express';
import { AuthGuard } from "@nestjs/passport";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody} from '@nestjs/swagger';
import { UpdatePasswordDto } from '../../entities/users/update-password.dto';
import * as bcrypt from 'bcryptjs';
import * as base64 from 'base-64';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from "../../utils/email/email.service";

@ApiTags('api/password')
@ApiBearerAuth()
@Controller('api/password')
@UseGuards(AuthGuard('jwt'))
export class PasswordController {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
    ) {}

    @Post(':telegramId/reset')
    @ApiOperation({ summary: 'Запрос на сброс пароля для пользователя' })
    @ApiResponse({ status: 200, description: 'Запрос на сброс пароля успешно обработан' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден или email не совпадает' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера при обработке запроса' })
    @ApiParam({ name: 'telegramId', description: 'Telegram ID пользователя', type: 'number' })
    @ApiBody({
        description: 'Email пользователя для валидации',
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
            },
        },
    })
    async requestPasswordReset(
        @Res() res: Response,
        @Param('telegramId') telegramId: number,
        @Body('email') email: string,
    ): Promise<Response> {
        try {
            const user = await this.usersService.findUser(telegramId);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'Користувача не знайдено' });
            }

            if (user.email !== email) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'Email не збігається із зареєстрованим' });
            }

            const temporaryPassword = uuidv4().slice(0, 8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(temporaryPassword, salt);
            const encryptedPassword = base64.encode(hashedPassword);

            await this.usersService.update(user.id, { password: encryptedPassword });

            await this.emailService.sendTemporaryPassword(user.email, user.name, temporaryPassword);

            return res.status(HttpStatus.OK).json({ message: 'Тимчасовий пароль було надіслано на ваш email' });
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Помилка під час скидання пароля' });
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Изменение пароля пользователя' })
    @ApiResponse({ status: 200, description: 'Пароль успешно обновлен' })
    @ApiResponse({ status: 400, description: 'Неверный текущий пароль' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера при обновлении пароля' })
    @ApiParam({ name: 'id', description: 'ID пользователя', type: 'string' })
    async updatePassword(
        @Res() res: Response,
        @Param('id') id: string,
        @Body() updatePasswordDto: UpdatePasswordDto
    ): Promise<Response> {
        try {
            const user = await this.usersService.findOne(id);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'Пользователь не найден' });
            }

            const isMatch = await bcrypt.compare(updatePasswordDto.currentPassword, base64.decode(user.password));
            if (!isMatch) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Неверный текущий пароль' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, salt);
            const encryptedPassword = base64.encode(hashedPassword);

            await this.usersService.update(id, { password: encryptedPassword });

            return res.status(HttpStatus.OK).json({ message: 'Пароль успешно обновлен' });
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при обновлении пароля' });
        }
    }
}
