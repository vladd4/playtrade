import { UserEntity } from '../users/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {MessageEntity} from "../messages/message.entity";

@Entity()
export class SupportChat {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    isClosed: boolean;

    @ManyToOne(() => UserEntity, user => user.supportChats, { eager: false })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => MessageEntity, message => message.supportChat)
    messages: MessageEntity[];

    @ManyToOne(() => MessageEntity, { nullable: true, eager: true })
    @JoinColumn({ name: 'lastMessageId' })
    lastMessage: MessageEntity | null;
}
