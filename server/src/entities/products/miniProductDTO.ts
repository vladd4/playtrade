import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber, IsBoolean } from 'class-validator';

export class ProductMiniDto {
  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'Уникальный идентификатор продукта',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: 'URL изображения продукта',
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: 'PC', description: 'Платформа продукта' })
  @IsString()
  platform: string;

  @ApiProperty({ example: 'Europe', description: 'Сервер продукта' })
  @IsString()
  server: string;

  @ApiProperty({ example: 'John Doe', description: 'Имя продавца продукта' })
  @IsString()
  seller: string;

  @ApiProperty({
    example: 'A high-end gaming mouse',
    description: 'Краткое описание продукта',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 59.99, description: 'Цена продукта' })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @ApiProperty({ example: true, description: 'Активность продукта' })
  @IsBoolean()
  isActive: boolean;
}
