import { ApiProperty } from '@nestjs/swagger';

export class ChatSummaryDto {
  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'Уникальный идентификатор чата',
  })
  chatId: string;

  @ApiProperty({ example: 'Огненный меч', description: 'Название продукта' })
  productName: string;

  @ApiProperty({
    example: '256f0ca9-4562-4563-9fd6-0f40e1665718',
    description: 'Уникальный идентификатор продукта',
  })
  productId: string;

  @ApiProperty({
    example: '2024-09-16T10:32:07.172Z',
    description: 'Дата последнего сообщения в чате',
  })
  lastMessageDate: string;

  @ApiProperty({
    example: 'Привет, как дела?',
    description: 'Текст последнего сообщения в чате',
  })
  lastMessageContent: string;

  @ApiProperty({
    example: [
      {
        id: '7622c265-a107-4b5b-b7bd-f14ca010db20',
        name: 'Новое Имя',
        avatar: 'url_to_avatar',
      },
    ],
    description: 'Информация о пользователях, которые участвуют в чате',
  })
  participants: { id: string; name: string; avatar: string }[];
}
