import {IsOptional, IsString, IsNumber, IsBoolean, IsEnum, IsUUID, IsDateString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../utils/enum/userRole.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Имя пользователя' })
    @IsString()
    name: string;

    @ApiProperty({ example: 123456789, description: 'Telegram ID пользователя' })
    @IsNumber()
    telegramId: number;

    @ApiProperty({ example: '+1234567890', description: 'Номер телефона пользователя', required: false })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiProperty({ example: 'example@example.com', description: 'Email пользователя', required: false })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ example: 'johndoe', description: 'Имя пользователя в Telegram', required: false })
    @IsOptional()
    @IsString()
    userNameInTelegram?: string;

    @ApiProperty({ example: 'http://example.com/avatar.jpg', description: 'URL фотографии аватара', required: false })
    @IsOptional()
    @IsString()
    avatarPhoto?: string;

    @ApiProperty({ example: 'superSecurePassword', description: 'Зашифрованный пароль пользователя' })
    @IsString()
    password: string;

    @ApiProperty({ example: false, description: 'Заблокирован ли пользователь' })
    @IsBoolean()
    isBanned: boolean;

    @ApiProperty({ example: true, description: 'Подтвержден ли пользователь' })
    @IsBoolean()
    isVerified: boolean;

    @ApiProperty({ example: true, description: 'Онлайн ли пользователь' })
    @IsBoolean()
    isOnline: boolean;

    @ApiProperty({ example: 100, description: 'Баланс пользователя', required: false })
    @IsOptional()
    @IsNumber()
    balance?: number;

    @ApiProperty({ example: '2023-12-31T23:59:59Z', description: 'Дата створення користувача', required: false })
    @IsOptional()
    @IsDateString()
    createdAt?: string;

    @ApiProperty({ example: UserRole.USER, description: 'Роль пользователя', enum: UserRole })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole = UserRole.USER;
}
