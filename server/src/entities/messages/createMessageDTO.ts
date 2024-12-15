import { IsString, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({ example: 'Hello, how are you?', description: 'Содержимое сообщения' })
    @IsString()
    content: string;

    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'UUID отправителя сообщения' })
    @IsUUID()
    senderId: string;

    @ApiProperty({ example: 'a4d8b4a1-4c3f-48b6-b2e3-df0a5671c1a5', description: 'UUID получателя сообщения' })
    @IsUUID()
    receiverId: string;

    @ApiProperty({ example: '2023-08-21T12:00:00Z', description: 'Время отправки сообщения', required: false })
    @IsOptional()
    timestamp?: Date;

    @ApiProperty({ example: 'f8b6c7f2-7c53-41c6-afe6-d6b6ec0d02d6', description: 'UUID товара', required: false })
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiProperty({ example: true, description: 'Флаг завершенности сделки', required: false })
    @IsBoolean()
    @IsOptional()
    isDealCompleted?: boolean;

    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'UUID чата', required: false })
    @IsUUID()
    @IsOptional()
    chatId?: string;
}
