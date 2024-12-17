import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { MessageEntity } from '../messages/message.entity';
import { UserEntity } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ChatProductDto } from '../products/chatProduct.dto';
import { AdminComment } from '../adminComment/adminComment.entity';

@Entity()
export class Chat {
  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'Уникальный идентификатор чата',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'true, false',
    description: 'Чат в избранном или нет',
  })
  @Column({ default: false })
  isFavorite: boolean;

  @ApiProperty({ type: () => UserEntity, description: 'Владелец чата' })
  @ManyToOne(() => UserEntity, (user) => user.chats)
  owner: UserEntity;

  @ApiProperty({ type: () => [UserEntity], description: 'Участники чата' })
  @ManyToMany(() => UserEntity, (user) => user.chats, { eager: true })
  @JoinTable()
  participants: UserEntity[];

  @ApiProperty({ type: () => [MessageEntity], description: 'Сообщения в чате' })
  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @ApiProperty({
    type: () => Product,
    description: 'Продукт, связанный с чатом',
  })
  @ManyToOne(() => Product, { nullable: true })
  product: ChatProductDto;

  @ApiProperty({
    type: () => [AdminComment],
    description: 'Комментарии администратора, связанные с чатом',
  })
  @OneToMany(() => AdminComment, (comment) => comment.chat)
  adminComments: AdminComment[];

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Дата создания чата',
  })
  @CreateDateColumn()
  createdAt: Date;
}
