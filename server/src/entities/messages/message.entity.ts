import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { Chat } from '../chats/chat.entity';
import { ApiProperty } from '@nestjs/swagger';
import {SupportChat} from "../supportChat/supportChat.entity";

@Entity()
export class MessageEntity {
    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'UUID сообщения' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'Hello, how are you?', description: 'Содержимое сообщения' })
    @Column('text')
    content: string;

    @ApiProperty({ example: '2023-08-21T12:00:00Z', description: 'Время отправки сообщения' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;

    @ApiProperty({ type: () => UserEntity, description: 'Отправитель сообщения' })
    @ManyToOne(() => UserEntity, user => user.messagesSent, { onDelete: 'SET NULL', nullable: true })
    sender: UserEntity;

    @ApiProperty({ type: () => UserEntity, description: 'Получатель сообщения' })
    @ManyToOne(() => UserEntity, user => user.messagesReceived, { onDelete: 'SET NULL', nullable: true })
    receiver: UserEntity;

    @ApiProperty({ example: true, description: 'Флаг завершенности сделки' })
    @Column({ type: 'boolean', default: false })
    isDealCompleted: boolean;

    @ApiProperty({ type: () => Chat, description: 'Связанный чат' })
    @ManyToOne(() => Chat, chat => chat.messages)
    @JoinColumn({ name: 'chat_id' })
    chat: Chat;

    @ApiProperty({ type: () => SupportChat, description: 'Связанный чат с техподдержкой' })
    @ManyToOne(() => SupportChat, supportChat => supportChat.messages, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'support_chat_id' })
    supportChat: SupportChat;

    @ApiProperty({ example: false, description: 'Было ли сообщение прочитано получателем' })
    @Column({ type: 'boolean', default: false })
    seenByUser: boolean;
}
