import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn} from 'typeorm';
import { Product } from 'src/entities/products/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import {Exclude} from "class-transformer";

@Entity()
export class Game {
    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'Уникальный идентификатор игры' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'Chess', description: 'Название игры' })
    @Column()
    name: string;

    @ApiProperty({ example: 'A classic strategy game', description: 'Описание игры', nullable: true })
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ example: 'uploads/gamePhoto/chess.png', description: 'Путь к фотографии игры', nullable: true })
    @Column({ nullable: true })
    photoPath: string;

    @ApiProperty({ example: ['PC', 'PS4', 'XBOX'], description: 'Платформы, доступные для игры', isArray: true })
    @Column('text', { array: true, nullable: true })
    platforms: string[];

    @ApiProperty({ example: ['Europe', 'NA'], description: 'Сервера, доступные для игры', isArray: true })
    @Column('text', { array: true, nullable: true })
    servers: string[];

    @ApiProperty({ example: ['Europe', 'NA'], description: 'Регионы, доступные для игры', isArray: true })
    @Column('text', { array: true, nullable: true })
    region: string[];

    @ApiProperty({ type: () => [Product], description: 'Список продуктов, связанных с игрой' })
    @OneToMany(() => Product, product => product.game)
    products: Product[];

    @ApiProperty({ example: '2024-01-01T12:34:56Z', description: 'Дата создания игры' })
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
