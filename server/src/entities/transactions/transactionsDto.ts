import { IsUUID, IsDecimal, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'UUID отправителя',
  })
  @IsUUID()
  senderId: string;

  @ApiProperty({
    example: 'a4d8b4a1-4c3f-48b6-b2e3-df0a5671c1a5',
    description: 'UUID получателя',
  })
  @IsUUID()
  receiverId: string;

  @ApiProperty({
    example: 100.5,
    description: 'Сумма транзакции',
    type: 'number',
  })
  @IsDecimal()
  amount: number;

  @ApiProperty({
    example: 'pending',
    description: 'Статус транзакции',
    enum: ['pending', 'completed', 'failed'],
  })
  @IsString()
  status: string; // e.g., 'pending', 'completed', 'failed'
}
