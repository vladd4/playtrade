import {IsUUID, IsString, IsNumber, IsBoolean, IsOptional, IsEnum, ValidateNested, IsArray} from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewDto } from '../reviews/reviewDto';
import { Platform } from '../../utils/enum/platforms.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ProductType } from '../../utils/enum/productType.enum';

export class ProductDto {
    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'Уникальный идентификатор продукта' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 'Gaming Mouse', description: 'Название продукта' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'A high-end gaming mouse', description: 'Описание продукта' })
    @IsString()
    description: string;

    @ApiProperty({ example: 'Detailed description of the gaming mouse', description: 'Детальное описание продукта' })
    @IsString()
    detailDescription: string;

    @ApiProperty({ example: 'PC', description: 'Платформа продукта' })
    @IsString()
    platform: string;

    @ApiProperty({ example: 'Europe', description: 'Сервер продукта' })
    @IsString()
    server: string;

    @ApiProperty({ example: 'Europe', description: 'Регион продукта' })
    @IsString()
    @IsOptional()
    region?: string;

    @ApiProperty({ example: 59.99, description: 'Цена продукта' })
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @ApiProperty({ type: [String], description: 'Массив URL изображений продукта', required: false })
    @IsArray()
    @IsOptional()
    imageUrls?: string[];

    @ApiProperty({ example: false, description: 'Находится ли продукт в процессе покупки' })
    @IsBoolean()
    inProcess: boolean;

    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'ID связанной игры' })
    @IsUUID()
    gameId: string;

    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'ID владельца продукта' })
    @IsUUID()
    ownerId: string;

    @ApiProperty({ example: 0, description: 'Количество успешных сделок' })
    @IsNumber()
    successfulTransactions: number;

    @ApiProperty({ type: () => [ReviewDto], description: 'Отзывы о продукте' })
    @ValidateNested({ each: true })
    @Type(() => ReviewDto)
    reviews: ReviewDto[];

    @ApiProperty({ example: 'item', description: 'Тип продукта', enum: ProductType })
    @IsEnum(ProductType)
    type: ProductType;

    @ApiProperty({ example: '2023-08-15T15:03:23Z', description: 'Дата и время создания продукта' })
    createdAt: Date; // Добавляем поле даты создания

    @ApiProperty({ example: '2023-09-01T12:45:10Z', description: 'Дата и время последнего обновления продукта' })
    updatedAt: Date; // Добавляем поле даты последнего обновления

    @ApiProperty({ example: true, description: 'Активность продукта' })
    @IsBoolean()
    isActive: boolean;

}
