import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupportMessageDTO {
  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Содержимое сообщения',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'UUID отправителя сообщения',
    required: false,
  })
  @IsUUID()
  senderId: string;

  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'UUID получателя сообщения',
    required: false,
  })
  @IsUUID()
  receiverId: string;

  @ApiProperty({
    example: '2023-08-21T12:00:00Z',
    description: 'Время отправки сообщения',
  })
  @IsOptional()
  timestamp: Date;

  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'UUID чата',
  })
  @IsUUID()
  @IsOptional()
  chatId: string;
}
