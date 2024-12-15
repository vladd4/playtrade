import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TransactionEntity {
    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'UUID транзакции' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 100.50, description: 'Сумма транзакции', type: 'number' })
    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @ApiProperty({ example: '2023-08-21T12:00:00Z', description: 'Дата создания транзакции' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty({ type: () => UserEntity, description: 'Отправитель транзакции' })
    @ManyToOne(() => UserEntity, user => user.sentTransactions)
    sender: UserEntity;

    @ApiProperty({ type: () => UserEntity, description: 'Получатель транзакции' })
    @ManyToOne(() => UserEntity, user => user.receivedTransactions)
    receiver: UserEntity;

    @ApiProperty({ example: 'completed', description: 'Статус транзакции', enum: ['pending', 'completed', 'failed'] })
    @Column({ type: 'varchar', length: 100 })
    status: string;
}
