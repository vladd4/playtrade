import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { Review } from '../reviews/review.entity';
import { MessageEntity } from '../messages/message.entity';
import { TransactionEntity } from '../transactions/transaction.entity';
import { Chat } from '../chats/chat.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../utils/enum/userRole.enum';
import { SupportChat } from '../supportChat/supportChat.entity';

@Entity()
export class UserEntity {
  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'Уникальный идентификатор пользователя',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'http://example.com/avatar.jpg',
    description: 'URL фотографии аватара пользователя',
    nullable: true,
  })
  @Column({ nullable: true, default: null })
  avatarPhoto: string;

  @ApiProperty({ example: 'John Doe', description: 'Имя пользователя' })
  @Column({ nullable: false, default: null })
  name: string;

  @ApiProperty({ example: 123456789, description: 'Telegram ID пользователя' })
  @Column({ nullable: false, type: 'numeric' })
  telegramId: number;

  @ApiProperty({
    example: '+1234567890',
    description: 'Номер телефона пользователя',
    nullable: true,
  })
  @Column({ nullable: true, default: null })
  phoneNumber: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'Email пользователя',
    nullable: true,
  })
  @Column({ nullable: true, default: null })
  email: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Имя пользователя в Telegram',
    nullable: true,
  })
  @Column({ nullable: true, default: null })
  userNameInTelegram: string;

  @ApiProperty({
    example: 'superSecurePassword',
    description: 'Зашифрованный пароль пользователя',
  })
  @Exclude()
  @Column({ nullable: false })
  password: string;

  @ApiProperty({ example: false, description: 'Заблокирован ли пользователь' })
  @Column({ nullable: false, default: false })
  isBanned: boolean;

  @ApiProperty({ example: true, description: 'Подтвержден ли пользователь' })
  @Column({ nullable: false, default: false })
  isVerified: boolean;

  @ApiProperty({ example: true, description: 'Онлайн ли пользователь' })
  @Column({ nullable: false, default: false })
  isOnline: boolean;

  @ApiProperty({
    example: 100,
    description: 'Баланс пользователя',
    nullable: true,
  })
  @Column({ nullable: true, default: null })
  balance: number;

  @ApiProperty({
    example: 4.5,
    description: 'Рейтинг пользователя',
    nullable: true,
  })
  @Column({ type: 'float', default: 0 })
  rating: number;

  @ApiProperty({
    example: UserRole.USER,
    description: 'Роль пользователя',
    enum: UserRole,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Идентификатор сессии пользователя',
    nullable: true,
  })
  @Column({ nullable: true })
  sessionId: string;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Дата створення користувача',
    nullable: false,
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Дата, до которой пользователь забанен',
    nullable: true,
  })
  @Column({ nullable: true, type: 'timestamp' })
  banUntil: Date | null;

  @ApiProperty({ example: true, description: 'Активен ли чат с поддержкой' })
  @Column({ nullable: false, default: false })
  isSupportChatActive: boolean;

  @Exclude()
  @OneToMany(() => Product, (product) => product.buyer, { eager: false })
  purchases: Product[];

  @Exclude()
  @OneToMany(() => Review, (review) => review.buyer, { eager: false })
  reviewsLeft: Review[];

  @Exclude()
  @OneToMany(() => Review, (review) => review.seller, { eager: false })
  reviewsReceived: Review[];

  @Exclude()
  @OneToMany(() => MessageEntity, (message) => message.sender, { eager: false })
  messagesSent: MessageEntity[];

  @Exclude()
  @OneToMany(() => MessageEntity, (message) => message.receiver, {
    eager: false,
  })
  messagesReceived: MessageEntity[];

  @Exclude()
  @OneToMany(() => TransactionEntity, (transaction) => transaction.sender, {
    eager: false,
  })
  sentTransactions: TransactionEntity[];

  @Exclude()
  @OneToMany(() => TransactionEntity, (transaction) => transaction.receiver, {
    eager: false,
  })
  receivedTransactions: TransactionEntity[];

  @Exclude()
  @OneToMany(() => Product, (product) => product.owner, { eager: false })
  products: Product[];

  @Exclude()
  @OneToMany(() => Chat, (chat) => chat.owner, { eager: false })
  chats: Chat[];

  @OneToMany(() => SupportChat, (chat) => chat.user, { eager: false })
  supportChats: SupportChat[];
}
