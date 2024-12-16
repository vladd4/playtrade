import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Review {
  @ApiProperty({
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
    description: 'UUID отзыва',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Отличный продукт, рекомендую!',
    description: 'Содержимое отзыва',
  })
  @Column('text')
  content: string;

  @ApiProperty({ example: 5, description: 'Рейтинг продукта' })
  @Column()
  rating: number;

  @ApiProperty({
    type: () => UserEntity,
    description: 'Покупатель, оставляющий отзыв',
  })
  @ManyToOne(() => UserEntity, (user) => user.reviewsLeft, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  buyer: UserEntity;

  @ApiProperty({
    type: () => UserEntity,
    description: 'Продавец, получающий отзыв',
  })
  @ManyToOne(() => UserEntity, (user) => user.reviewsReceived, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  seller: UserEntity;

  @ApiProperty({
    type: () => Product,
    description: 'Товар, на который оставляется отзыв',
  })
  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  product: Product;
  @ApiProperty({
    example: '2024-08-30T14:48:00.000Z',
    description: 'Дата создания отзыва',
  })
  @CreateDateColumn({ type: 'timestamp', nullable: false })
  reviewDate: Date; // Дата создания отзыва
}
