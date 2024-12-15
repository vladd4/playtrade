import {Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {ILike, In, Repository} from 'typeorm';
import { Product } from './product.entity';
import { ProductDto } from './ProductDto';
import { UserEntity } from '../users/user.entity';
import { Game } from "../games/game.entity";
import { ProductType } from '../../utils/enum/productType.enum';
import {ProductMiniDto} from "./miniProductDTO";
import {ReviewDto} from "../reviews/reviewDto";
import {ProductReviewService} from "./productReview.service";
import { File as MulterFile } from 'multer';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        private readonly productReviewService: ProductReviewService,

    ) {}

    async findOne(id: string): Promise<Product> {
        return this.productRepository.findOne({
            where: { id },
            relations: ['owner', 'buyer', 'game'],
        });
    }

    async findOneWithIds(id: string): Promise<Partial<ProductDto & { reviewCount: number, latestReviews: ReviewDto[] }>> {
        const product = await this.productRepository.findOne({ where: { id }, relations: ['owner', 'game'] });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const reviewCount = await this.productReviewService.getReviewCountForProduct(id);
        const latestReviews = await this.productReviewService.getLatestReviewsForProduct(id);

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            detailDescription: product.detailDescription,
            platform: product.platform,
            price: product.price,
            imageUrls: product.imageUrls,
            inProcess: product.inProcess,
            gameId: product.game ? product.game.id : null,
            ownerId: product.owner ? product.owner.id : null,
            type: product.type,
            reviewCount,
            latestReviews,
        };
    }
    async findAllIds(): Promise<{ id: string }[]> {
        return this.productRepository.find({
            select: ['id'],
        });
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find({
            relations: ['owner', 'game'],
        });
    }
    async findAllWithPagination(limit: number, page: number): Promise<{ products: Product[], totalCount: number }> {
        const skip = (page - 1) * limit;

        const [products, totalCount] = await this.productRepository.findAndCount({
            skip: skip,
            take: limit,
            relations: ['owner', 'game'],
            order: {
                createdAt: 'DESC',  // Сортировка по новизне
            },
        });

        return { products, totalCount };
    }


    async create(productDto: ProductDto, images: MulterFile[]): Promise<Partial<Product>> {
        const user = await this.userRepository.findOne({ where: { id: productDto.ownerId } });
        if (!user) {
            throw new NotFoundException('Користувача не знайдено');
        }

        const game = await this.gameRepository.findOne({ where: { id: productDto.gameId } });
        if (!game) {
            throw new NotFoundException('Гра не знайдена');
        }

        const newImageUrls = images.map(file => `/uploads/products/${file.filename}`);

        if (newImageUrls.length > 5) {
            throw new Error('Не можна додати більше 5 зображень до продукту');
        }

        const product = this.productRepository.create({
            ...productDto,
            imageUrls: newImageUrls,
            owner: user,
            game: game,
        });

        const savedProduct = await this.productRepository.save(product);

        const { owner, ...productData } = savedProduct;

        return productData;
    }


    async update(id: string, productDto: Partial<ProductDto>, images?: MulterFile[]): Promise<Product> {
        const product = await this.findOne(id);
        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        if (images && images.length > 0) {
            const newImageUrls = images.map(file => `/uploads/products/${file.filename}`);
            const totalImages = (product.imageUrls || []).length + newImageUrls.length;

            if (totalImages > 5) {
                throw new Error('Нельзя добавить больше 5 изображений к продукту');
            }

            product.imageUrls = [...(product.imageUrls || []), ...newImageUrls];
        }

        Object.assign(product, productDto);

        return this.productRepository.save(product);
    }

    async clearProductImages(productId: string, ownerId: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['owner'],
        });

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        if (!product.owner || product.owner.id !== ownerId) {
            throw new UnauthorizedException('Вы не владелец продукта');
        }

        product.imageUrls = [];

        return this.productRepository.save(product);
    }

    async delete(id: string): Promise<void> {
        const result = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Product not found');
        }
    }
    async findProductsByOwner(userId: string): Promise<Product[]> {
        try {
            const products = await this.productRepository.find({
                where: { owner: { id: userId } }, // Поиск по полю owner
                relations: ['owner', 'game'], // Загрузка связанных сущностей
                order: {
                    updatedAt: 'DESC', // Сортировка по времени обновления (сначала последние)
                    createdAt: 'DESC', // Сортировка по времени создания (если время обновления одинаковое)
                },
            });

            return products;
        } catch (error) {
            console.error('Ошибка при поиске продуктов для владельца:', error);
            throw new Error('Ошибка при поиске продуктов');
        }
    }

    async findPurchasesByUser(userId: string): Promise<Product[]> {
        try {
            const purchases = await this.productRepository.find({
                where: { buyer: { id: userId } },
                relations: ['owner'],
            });

            console.log('Найденные покупки:', purchases);
            return purchases;
        } catch (error) {
            console.error('Ошибка при получении покупок для пользователя:', error);
            throw new Error('Ошибка при получении покупок');
        }
    }



    async findByTypeAndGameMiniWithPagination(type: ProductType, gameId: string, limit: number, page: number): Promise<{ products: ProductMiniDto[], totalPages: number, currentPage: number }> {
        const skip = (page - 1) * limit;

        const [products, totalCount] = await this.productRepository.findAndCount({
            where: { type, game: { id: gameId }, isActive: true },
            relations: ['owner', 'game'],
            skip: skip,
            take: limit,
        });

        const productDtos = products.map(product => ({
            id: product.id,
            imageUrl: product.owner.avatarPhoto,
            platform: product.platform,
            server: product.server,
            seller: product.owner.name,
            rating: product.owner.rating,
            description: product.description,
            price: product.price,
            isActive: product.isActive,
        }));

        const totalPages = Math.ceil(totalCount / limit);

        return {
            products: productDtos,
            totalPages,
            currentPage: page,
        };
    }


    async deleteImageByIndex(productId: string, index: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['owner'],
        });

        if (!product) {
            throw new NotFoundException('Продукт не найден');
        }

        if (index < 0 || index >= product.imageUrls.length) {
            throw new NotFoundException('Картинка с таким индексом не найдена');
        }

        product.imageUrls.splice(index, 1);

        return this.productRepository.save(product);
    }
    async findByTypeAndGameWithFilters(
        type: ProductType,
        gameId: string,
        platforms?: string | string[],
        servers?: string | string[],
        regions?: string | string[],
        minPrice?: number,
        maxPrice?: number,
        page: number = 1,
        limit: number = 20
    ): Promise<{ products: ProductMiniDto[], total: number }> {
        try {
            const queryBuilder = this.productRepository.createQueryBuilder('product')
                .leftJoinAndSelect('product.owner', 'owner')
                .leftJoinAndSelect('product.game', 'game')
                .where('product.type = :type', { type })
                .andWhere('product.gameId = :gameId', { gameId })
                .andWhere('product.isActive = :isActive', { isActive: true });

            if (platforms && platforms.length > 0) {
                if (typeof platforms === 'string') {
                    platforms = [platforms];
                }
                queryBuilder.andWhere('product.platform IN (:...platforms)', { platforms });
            }

            if (servers && servers.length > 0) {
                if (typeof servers === 'string') {
                    servers = [servers];
                }
                queryBuilder.andWhere('product.server IN (:...servers)', { servers });
            }

            if (regions && regions.length > 0) {
                if (typeof regions === 'string') {
                    regions = [regions];
                }
                queryBuilder.andWhere('product.region IN (:...regions)', { regions });
            }

            if (minPrice !== undefined) {
                queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
            }

            if (maxPrice !== undefined) {
                queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
            }

            queryBuilder.skip((page - 1) * limit).take(limit);

            const [products, total] = await queryBuilder.getManyAndCount();

            const formattedProducts = products.map(product => ({
                id: product.id,
                imageUrl: product.owner.avatarPhoto || null,
                platform: product.platform,
                server: product.server,
                region: product.region,
                seller: product.owner ? product.owner.name : 'Unknown',
                description: product.description,
                price: product.price,
                isActive: product.isActive,
            }));


            return { products: formattedProducts, total };
        } catch (error) {
            console.error('Error during filtering:', error);
            throw new InternalServerErrorException('Error while filtering products.');
        }
    }


    async markAsSold(productId: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        product.successfulTransactions += 1;

        return this.productRepository.save(product);
    }
    async toggleActiveStatus(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        product.isActive = !product.isActive;

        return this.productRepository.save(product);
    }
    async findByName(name: string): Promise<Product[]> {
        return this.productRepository.createQueryBuilder('product')
            .where('LOWER(product.name) LIKE :name', { name: `%${name}%` }) // Поиск по имени без учета регистра
            .leftJoinAndSelect('product.owner', 'owner')
            .leftJoinAndSelect('product.game', 'game')
            .getMany();
    }

}
