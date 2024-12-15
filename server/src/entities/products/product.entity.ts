import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Game } from '../games/game.entity';
import { Review } from '../reviews/review.entity';
import { UserEntity } from '../users/user.entity';
import { MessageEntity } from '../messages/message.entity';
import { ProductType } from '../../utils/enum/productType.enum';
import { MaxLength } from 'class-validator';
import {Exclude} from "class-transformer";

@Entity()
export class Product {
    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'Уникальный идентификатор продукта' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'Gaming Mouse', description: 'Название продукта' })
    @Column({ nullable: false })
    name: string;

    @ApiProperty({ example: 'A high-end gaming mouse', description: 'Описание продукта' })
    @Column({ nullable: false })
    description: string;

    @ApiProperty({ example: 'Detailed description of the gaming mouse', description: 'Детальное описание продукта' })
    @Column({ nullable: false })
    detailDescription: string;

    @ApiProperty({ example: 'PC', description: 'Платформа продукта' })
    @Column({ nullable: true })
    platform: string;

    @ApiProperty({ example: 'Europe', description: 'Сервер продукта' })
    @Column({ nullable: true })
    server: string;

    @ApiProperty({ example: 'Europe', description: 'Регион продукта' })
    @Column({ nullable: true })
    region: string;

    @ApiProperty({ example: 59.99, description: 'Цена продукта' })
    @Column('decimal', { nullable: false, precision: 10, scale: 2 })
    price: number;

    @ApiProperty({ type: [String], description: 'Массив URL изображений продукта' })
    @Column('text', { array: true, nullable: true })
    @MaxLength(5, { each: true, message: 'Максимум 5 изображений разрешено для продукта.' })
    imageUrls: string[];

    @ApiProperty({ example: false, description: 'Находится ли продукт в процессе покупки' })
    @Column({ nullable: false, default: false })
    inProcess: boolean;

    @ApiProperty({ type: () => Game, description: 'Связанная игра' })
    @Exclude()
    @ManyToOne(() => Game, game => game.products)
    game: Game;

    @ApiProperty({ type: () => [Review], description: 'Отзывы о продукте' })
    @Exclude()
    @OneToMany(() => Review, review => review.product, { eager: false })
    reviews: Review[];

    @ApiProperty({ type: () => UserEntity, description: 'Владелец продукта' })
    @ManyToOne(() => UserEntity, user => user.products, { onDelete: 'SET NULL', nullable: true })
    owner: UserEntity;

    @ApiProperty({ enum: ProductType, description: 'Тип продукта' })
    @Column({
        type: 'enum',
        enum: ProductType,
        nullable: true,
    })
    type: ProductType;

    @ApiProperty({ type: () => UserEntity, description: 'Покупатель продукта' })
    @ManyToOne(() => UserEntity, user => user.purchases, { onDelete: 'SET NULL', nullable: true })
    buyer: UserEntity;

    @ApiProperty({ example: 0, description: 'Количество успешных сделок' })
    @Column({ type: 'int', default: 0 })
    successfulTransactions: number;

    @ApiProperty({ example: '2023-08-15T15:03:23Z', description: 'Дата и время создания продукта' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ example: '2023-09-01T12:45:10Z', description: 'Дата и время последнего обновления продукта' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ example: true, description: 'Активность продукта' })
    @Column({ nullable: false, default: true })
    isActive: boolean;
}
