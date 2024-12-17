import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Chat } from '../chats/chat.entity';
import { UserEntity } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AdminComment {
  @ApiProperty({
    example: 'e0b8d937-f84a-4e78-bc1d-1234567890ab',
    description: 'Уникальный идентификатор комментария',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: () => UserEntity,
    description: 'Автор комментария (администратор)',
  })
  @ManyToOne(() => UserEntity, { nullable: false })
  author: UserEntity;

  @ApiProperty({
    example: 'Комментарий о чате',
    description: 'Текст комментария',
  })
  @Column('text')
  comment: string;

  @ApiProperty({
    example: '2024-10-02T00:00:00Z',
    description: 'Дата создания комментария',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    type: () => Chat,
    description: 'Чат, к которому относится комментарий',
  })
  @ManyToOne(() => Chat, (chat) => chat.adminComments, { onDelete: 'CASCADE' })
  chat: Chat;
}
