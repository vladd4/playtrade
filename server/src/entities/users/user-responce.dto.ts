import { ApiProperty } from '@nestjs/swagger';

export class UserResponceDto {
  @ApiProperty({ example: '6e2d3005-22a5-4730-afec-7668aa34ccf0' })
  id: string;

  @ApiProperty({ example: 'http://example.com/avatar.jpg', nullable: true })
  avatarPhoto: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 123456789 })
  telegramId: number;

  @ApiProperty({ example: '+1234567890', nullable: true })
  phoneNumber: string;

  @ApiProperty({ example: 'example@example.com', nullable: true })
  email: string;

  @ApiProperty({ example: 'johndoe', nullable: true })
  userNameInTelegram: string;

  @ApiProperty({ example: false })
  isBanned: boolean;

  @ApiProperty({ example: true })
  isVerified: boolean;

  @ApiProperty({ example: true })
  isOnline: boolean;

  @ApiProperty({ example: 100, nullable: true })
  balance: number;

  @ApiProperty({ example: 4.5, nullable: true })
  rating: number;

  @ApiProperty({
    example: 'manager',
    enum: ['admin', 'manager', 'user', 'moderator'],
  })
  role: string;

  @ApiProperty({ nullable: true })
  sessionId: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        product: { type: 'string' },
        id: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        amount: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  transactions: {
    product: string;
    id: string;
    date: string;
    amount: string;
    status: string;
  }[];
}
