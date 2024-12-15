import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Res,
    HttpStatus,
    NotFoundException,
    BadRequestException, UseGuards
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from './reviewDto';
import { Response } from 'express';
import { MessageQueryService } from '../messages/messageQuery.service';
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('api/reviews')
@ApiBearerAuth()
@Controller('api/reviews')
@UseGuards(AuthGuard('jwt'))
export class ReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly messagesService: MessageQueryService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Создание нового отзыва' })
    @ApiBody({ type: ReviewDto, description: 'Данные для создания отзыва' })
    @ApiResponse({ status: 201, description: 'Отзыв успешно создан', type: ReviewDto })
    @ApiResponse({ status: 400, description: 'Ошибка при создании отзыва' })
    async create(@Body() createReviewDto: ReviewDto, @Res() res: Response): Promise<Response> {
        try {
            if (!createReviewDto.productId || !createReviewDto.buyerId || !createReviewDto.sellerId) {
                throw new BadRequestException('Missing required fields.');
            }

            const messages = await this.messagesService.findMessagesByUserAndProduct(
                createReviewDto.buyerId,
            );

            if (!messages || messages.length === 0) {
                throw new NotFoundException('No messages found for this user.');
            }

            const hasPurchased = messages.some(msg => msg.receiver.id === createReviewDto.sellerId);

            if (!hasPurchased) {
                throw new BadRequestException('User has not purchased this product.');
            }

            // Создаем отзыв
            const review = await this.reviewsService.create(createReviewDto);
            return res.status(HttpStatus.CREATED).json(review);
        } catch (error) {
            console.error('Error creating review:', error);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    @Get('seller/:sellerId')
    @ApiOperation({ summary: 'Получение всех отзывов по ID продавца' })
    @ApiParam({ name: 'sellerId', description: 'UUID продавца', example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56' })
    @ApiResponse({ status: 200, description: 'Отзывы успешно получены', type: [ReviewDto] })
    @ApiResponse({ status: 404, description: 'Отзывы не найдены' })
    async findAllBySeller(@Param('sellerId') sellerId: string, @Res() res: Response): Promise<Response> {
        try {
            const reviews = await this.reviewsService.findAllBySellerId(sellerId);
            return res.status(HttpStatus.OK).json(reviews);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving reviews by seller ID' });
        }
    }

    @Get('latest')
    @ApiOperation({ summary: 'Получение последних 4 отзывов' })
    @ApiResponse({ status: 200, description: 'Последние отзывы успешно получены', type: [ReviewDto] })
    async findLatest(@Res() res: Response): Promise<Response> {
        try {
            const reviews = await this.reviewsService.findLatestReviews();
            return res.status(HttpStatus.OK).json(reviews);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving latest reviews' });
        }
    }

    @Get('count/year')
    @ApiOperation({ summary: 'Получение количества отзывов за последний год' })
    @ApiResponse({ status: 200, description: 'Количество отзывов успешно получено' })
    async countReviewsLastYear(@Res() res: Response): Promise<Response> {
        try {
            const count = await this.reviewsService.countReviewsLastYear();
            return res.status(HttpStatus.OK).json({ count });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving review count for last year' });
        }
    }
    @Get()
    @ApiOperation({ summary: 'Получение всех отзывов' })
    @ApiResponse({ status: 200, description: 'Отзывы успешно получены', type: [ReviewDto] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении отзывов' })
    async findAll(@Res() res: Response): Promise<Response> {
        try {
            const reviews = await this.reviewsService.findAll();
            return res.status(HttpStatus.OK).json(reviews);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving reviews', error: error.message });
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получение отзыва по ID' })
    @ApiParam({ name: 'id', description: 'UUID отзыва', example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56' })
    @ApiResponse({ status: 200, description: 'Отзыв успешно найден', type: ReviewDto })
    @ApiResponse({ status: 404, description: 'Отзыв не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при получении отзыва' })
    async findOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        try {
            const review = await this.reviewsService.findOne(id);
            if (!review) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'Review not found' });
            }
            return res.status(HttpStatus.OK).json(review);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving the review', error: error.message });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удаление отзыва' })
    @ApiParam({ name: 'id', description: 'UUID отзыва', example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56' })
    @ApiResponse({ status: 200, description: 'Отзыв успешно удален' })
    @ApiResponse({ status: 404, description: 'Отзыв не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при удалении отзыва' })
    async remove(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        try {
            await this.reviewsService.remove(id);
            return res.status(HttpStatus.OK).json({ message: 'Review deleted successfully' });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting the review', error: error.message });
        }
    }
}
