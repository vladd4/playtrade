import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { GamesModule } from '../games/games.module';
import { UserEntity } from '../users/user.entity';
import { ProductReviewService } from './productReview.service';
import { ProductValidationService } from './productValidation.service';
import {Review} from "../reviews/review.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, UserEntity, Review]),
    GamesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductReviewService, ProductValidationService],
  exports: [ProductsService, TypeOrmModule, ProductValidationService],
})
export class ProductsModule {}
