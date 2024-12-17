import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { UsersModule } from '../users/users.module';
import { ProductValidationService } from '../products/productValidation.service';
import { Product } from '../products/product.entity';
import { MessagesModule } from '../messages/messages.module'; // Добавляем зависимость

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Product]), // Добавляем Product сюда
    UsersModule,
    MessagesModule,
  ],
  providers: [ReviewsService, ProductValidationService], // Добавляем сервис для валидации продуктов
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
