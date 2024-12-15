import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import { Review } from '../reviews/review.entity';
import { ReviewDto } from '../reviews/reviewDto';

@Injectable()
export class ProductReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
    ) {}

    async getReviewCountForProduct(productId: string): Promise<number> {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        return this.reviewRepository.count({
            where: {
                product: { id: productId },
                reviewDate: In([oneYearAgo, new Date()]),
            },
        });
    }

    async getLatestReviewsForProduct(productId: string, limit: number = 4): Promise<ReviewDto[]> {
        const reviews = await this.reviewRepository.find({
            where: { product: { id: productId } },
            order: { reviewDate: 'DESC' },
            take: limit,
            relations: ['buyer', 'seller'],
        });

        return reviews.map(review => ({
            content: review.content,
            rating: review.rating,
            buyerId: review.buyer.id,
            sellerId: review.seller.id,
            productId: review.product.id,
            reviewDate: review.reviewDate,
        }));
    }
}
