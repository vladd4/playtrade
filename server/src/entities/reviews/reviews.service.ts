import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Review } from './review.entity';
import { ReviewDto } from './reviewDto';
import { UsersService } from '../users/users.service';
import { ProductValidationService } from '../products/productValidation.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private readonly usersService: UsersService,
    private readonly productValidationService: ProductValidationService,
  ) {}
  async create(createReviewDto: ReviewDto): Promise<Review> {
    const buyer = await this.usersService.findOne(createReviewDto.buyerId);
    if (!buyer) {
      throw new Error('Buyer not found');
    }

    const seller = await this.usersService.findOne(createReviewDto.sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }

    const product = await this.productValidationService.validateProductExists(
      createReviewDto.productId,
    );

    const review = this.reviewRepository.create({
      content: createReviewDto.content,
      rating: createReviewDto.rating,
      buyer: buyer,
      seller: seller,
      product: product,
    });

    const savedReview = await this.reviewRepository.save(review);

    const reviews = await this.reviewRepository.find({
      where: { seller: seller },
      relations: ['seller'],
    });
    if (reviews.length > 0) {
      const validRatings = reviews.filter(
        (review) => typeof review.rating === 'number' && !isNaN(review.rating),
      );

      if (validRatings.length > 0) {
        const totalRating = validRatings.reduce(
          (acc, cur) => acc + cur.rating,
          0,
        );
        seller.rating = totalRating / validRatings.length;
      } else {
        seller.rating = 0;
      }
    } else {
      seller.rating = 0;
    }
    await this.usersService.update(seller.id, { rating: seller.rating });

    return savedReview;
  }
  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find();
  }
  async findLatestReviews(limit: number = 4): Promise<Review[]> {
    return this.reviewRepository.find({
      order: { reviewDate: 'DESC' },
      take: limit,
    });
  }

  async countReviewsLastYear(): Promise<number> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return this.reviewRepository.count({
      where: { reviewDate: In([oneYearAgo, new Date()]) },
    });
  }

  async getReviewCountForUser(userId: string): Promise<number> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return this.reviewRepository.count({
      where: {
        seller: { id: userId },
        reviewDate: In([oneYearAgo, new Date()]),
      },
    });
  }

  async getLatestReviewsForUser(
    userId: string,
    limit: number = 4,
  ): Promise<ReviewDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { seller: { id: userId } },
      order: { reviewDate: 'DESC' },
      take: limit,
      relations: ['buyer', 'seller'],
    });

    return reviews.map((review) => ({
      content: review.content,
      rating: review.rating,
      buyerId: review.buyer.id,
      sellerId: review.seller.id,
      productId: review.product.id,
      reviewDate: review.reviewDate,
    }));
  }

  async findAllBySellerId(sellerId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { seller: { id: sellerId } },
    });
  }
  async findOne(id: string): Promise<Review> {
    return this.reviewRepository.findOne({ where: { id: id } });
  }

  // Удаление отзыва
  async remove(id: string): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id: id } });
    if (!review) {
      throw new Error('Review not found');
    }
    await this.reviewRepository.remove(review);
  }
}
