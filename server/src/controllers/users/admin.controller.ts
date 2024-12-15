import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    Query,
    UseGuards,
    NotFoundException,
    BadRequestException, InternalServerErrorException
} from '@nestjs/common';
import { UsersService } from '../../entities/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import {ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import { UserRole } from '../../utils/enum/userRole.enum';
import {UserEntity} from "../../entities/users/user.entity";
import {plainToInstance} from "class-transformer";

@ApiTags('api/users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))

@Controller('api/users')
export class AdminController {
    constructor(private readonly usersService: UsersService) {}

    @Put('admin/:id/role')
    @ApiOperation({ summary: 'Изменение роли пользователя (только для админов)' })
    @ApiResponse({ status: 200, description: 'Роль успешно изменена' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    async changeUserRole(
        @Param('id') id: string,
        @Body() body: { role: UserRole }
    ): Promise<any> {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        user.role = body.role;
        const updatedUser = await this.usersService.update(user.id, { role: body.role });

        return {
            message: 'Role successfully changed',
            user: {
                id: updatedUser.id,
                role: updatedUser.role
            }
        };
    }

    @Get('admin/roles/admins-managers')
    @ApiOperation({ summary: 'Получение всех администраторов и менеджеров' })
    @ApiResponse({ status: 200, description: 'Список администраторов и менеджеров с пагинацией' })
    async getAdminsAndManagers(
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1
    ): Promise<any> {
        const { users, totalCount } = await this.usersService.findAllAdminsAndManagers(limit, page);
        const totalPages = Math.ceil(totalCount / limit);

        return {
            users: this.usersService.formatUsersResponse(users),
            totalPages,
            currentPage: page,
            totalUsers: totalCount,
        };
    }

    @Get('/check-ban/admin')
    @ApiOperation({ summary: 'Проверка статуса бана пользователя по Telegram ID' })
    @ApiQuery({ name: 'telegramId', required: true, description: 'Telegram ID пользователя', type: Number })
    @ApiResponse({ status: 200, description: 'Статус бана проверен', type: Boolean })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при проверке статуса бана' })
    async checkUserBanStatus(
        @Query('telegramId') telegramId: number
    ): Promise<{ isBanned: boolean } | { message: string }> {
        try {
            const isBanned = await this.usersService.isUserBannedByTelegramId(telegramId);
            return { isBanned };
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { message: error.message };
            }
            return { message: 'Ошибка при проверке статуса бана' };
        }
    }
    @Get('admin/search')
    @ApiOperation({ summary: 'Поиск пользователей по имени без пагинации' })
    @ApiResponse({ status: 200, description: 'Пользователи успешно найдены', type: [UserEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при поиске пользователей' })
    async searchByName(
        @Query('name') name: string
    ): Promise<UserEntity[]> {
        try {
            if (!name) {
                throw new BadRequestException('Имя пользователя должно быть указано');
            }

            const cleanName = name.trim().toLowerCase();

            const users = await this.usersService.findByName(cleanName);

            if (!users.length) {
                return [];
            }

            return plainToInstance(UserEntity, users);
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при поиске пользователей');
        }
    }

    @Put(':id/ban')
    @ApiOperation({ summary: 'Блокировка пользователя на определённый срок' })
    @ApiResponse({ status: 200, description: 'Пользователь заблокирован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при блокировке пользователя' })
    @ApiParam({ name: 'id', description: 'ID пользователя', type: 'string' })
    async banUser(
        @Param('id') id: string,
        @Body() body: { period: '24h' | '3d' | '7d' | 'forever' | '5s' }
    ): Promise<any> {
        try {
            let user: UserEntity;

            switch (body.period) {
                case '24h':
                    await this.usersService.banUserForPeriod(id, 24 * 60 * 60 * 1000);
                    break;
                case '3d':
                    await this.usersService.banUserForPeriod(id, 3 * 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    await this.usersService.banUserForPeriod(id, 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'forever':
                    await this.usersService.banUserPermanently(id);
                    break;
                case '5s':
                    await this.usersService.banUserForPeriod(id, 5 * 1000);
                    break;
                default:
                    throw new BadRequestException('Неверный период блокировки');
            }

            user = await this.usersService.findOne(id);

            return {
                userId: user.id,
                isBanned: user.isBanned,
            };
        } catch (e) {
            throw new InternalServerErrorException('Ошибка при блокировке пользователя');
        }
    }


    @Put(':id/unban')
    @ApiOperation({ summary: 'Разблокировка пользователя' })
    @ApiResponse({ status: 200, description: 'Пользователь разблокирован' })
    @ApiResponse({ status: 404, description: 'Пользователь не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при разблокировке пользователя' })
    @ApiParam({ name: 'id', description: 'ID пользователя', type: 'string' })
    async unbanUser(@Param('id') id: string): Promise<any> {
        try {
            const user = await this.usersService.unbanUser(id);
            if (!user) {
                throw new NotFoundException('Пользователь не найден');
            }

            return {
                userId: user.id,
                isBanned: user.isBanned,
            };
        } catch (e) {
            throw new InternalServerErrorException('Ошибка при разблокировке пользователя');
        }
    }
    @Put(':id/balance')
    @ApiOperation({ summary: 'Зміна балансу користувача' })
    @ApiParam({ name: 'id', description: 'ID користувача', type: 'string' })
    @ApiResponse({ status: 200, description: 'Баланс користувача успішно оновлено' })
    @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
    @ApiResponse({ status: 400, description: 'Невірне значення балансу' })
    @ApiResponse({ status: 500, description: 'Помилка при оновленні балансу користувача' })
    async updateUserBalance(
        @Param('id') id: string,
        @Body() body: { balance: number }
    ): Promise<any> {
        try {
            const { balance } = body;
            if (balance === undefined || balance < 0) {
                throw new BadRequestException('Невірне значення балансу');
            }

            const user = await this.usersService.updateBalance(id, balance);

            return { message: 'Баланс користувача успішно оновлено', user };
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException(e.message);
            }
            throw new InternalServerErrorException('Помилка при оновленні балансу користувача');
        }
    }

    @Put(':id/verification')
    @ApiOperation({ summary: 'Зміна статусу верифікації користувача' })
    @ApiParam({ name: 'id', description: 'ID користувача', type: 'string' })
    @ApiResponse({ status: 200, description: 'Статус верифікації користувача успішно оновлено' })
    @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
    @ApiResponse({ status: 400, description: 'Невірне значення статусу верифікації' })
    @ApiResponse({ status: 500, description: 'Помилка при оновленні статусу верифікації користувача' })
    async updateUserVerificationStatus(
        @Param('id') id: string,
        @Body() body: { isVerified: boolean }
    ): Promise<any> {
        try {
            const { isVerified } = body;
            if (typeof isVerified !== 'boolean') {
                throw new BadRequestException('Невірне значення статусу верифікації');
            }

            const user = await this.usersService.updateVerificationStatus(id, isVerified);

            return { message: 'Статус верифікації користувача успішно оновлено', user };
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException(e.message);
            }
            throw new InternalServerErrorException('Помилка при оновленні статусу верифікації користувача');
        }
    }
}
