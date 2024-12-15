import {IsUUID, IsString, IsNumber, IsDate} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
    @ApiProperty({ example: 'Отличный продукт, рекомендую!', description: 'Содержимое отзыва' })
    @IsString()
    content: string;

    @ApiProperty({ example: 5, description: 'Рейтинг продукта' })
    @IsNumber()
    rating: number;

    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'UUID покупателя' })
    @IsUUID()
    buyerId: string;  // ID покупателя

    @ApiProperty({ example: 'a4d8b4a1-4c3f-48b6-b2e3-df0a5671c1a5', description: 'UUID продавца' })
    @IsUUID()
    sellerId: string;  // ID продавца

    @ApiProperty({ example: 'f8b6c7f2-7c53-41c6-afe6-d6b6ec0d02d6', description: 'UUID продукта' })
    @IsUUID()
    productId: string;  // ID продукта

    @ApiProperty({ example: '2024-08-30T14:48:00.000Z', description: 'Дата создания отзыва' })
    @IsDate()
    reviewDate: Date;  // Дата создания отзыва
}
