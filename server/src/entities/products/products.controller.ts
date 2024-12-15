import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpStatus,
    UseGuards,
    UploadedFile,
    UseInterceptors, UploadedFiles, Query, InternalServerErrorException,
    NotFoundException, BadRequestException
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './ProductDto';
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Multer } from 'multer';
import { ProductType } from "../../utils/enum/productType.enum";
import { ProductMiniDto } from "./miniProductDTO";
import {plainToInstance} from "class-transformer";

@ApiTags('api/products')
@ApiBearerAuth()
@Controller('api/products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    @ApiOperation({ summary: 'Получение списка всех продуктов с пагинацией и общим количеством страниц' })
    @ApiResponse({ status: 200, description: 'Список продуктов успешно получен', type: [ProductDto] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении списка продуктов' })
    async findAll(
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1,
    ): Promise<any> {
        try {
            const { products, totalCount } = await this.productsService.findAllWithPagination(limit, page);
            const totalPages = Math.ceil(totalCount / limit);

            // Преобразование сущностей в DTO
            const result = plainToInstance(ProductDto, products);

            return {
                products: result,
                totalPages,
                currentPage: page,
                totalProducts: totalCount,
            };
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при получении списка продуктов');
        }
    }

    @Get('ids')
    @ApiOperation({ summary: 'Получение списка ID всех продуктов' })
    @ApiResponse({ status: 200, description: 'Список ID продуктов успешно получен' })
    @ApiResponse({ status: 500, description: 'Ошибка при получении списка ID продуктов' })
    async findAllIds(): Promise<any> {
        try {
            const productIds = await this.productsService.findAllIds();
            return productIds;
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при получении списка ID продуктов');
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получение информации о продукте по ID с ID игры и владельца' })
    @ApiResponse({ status: 200, description: 'Продукт успешно найден', type: ProductDto })
    @ApiResponse({ status: 404, description: 'Продукт не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при получении информации о продукте' })
    async findOneWithIds(@Param('id') id: string): Promise<any> {
        try {
            const product = await this.productsService.findOneWithIds(id);
            if (!product) {
                throw new NotFoundException('Продукт не найден');
            }
            return product;
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при получении информации о продукте');
        }
    }

    @Get('type/:type/game/:gameId')
    @ApiOperation({ summary: 'Получение продуктов по типу и ID игры с фильтрацией' })
    @ApiResponse({ status: 200, description: 'Продукты успешно найдены', type: [ProductMiniDto] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении продуктов' })
    async findByTypeAndGameAndFiltration(
        @Param('type') type: ProductType,
        @Param('gameId') gameId: string,
        @Query('platforms') platforms?: string[],
        @Query('servers') servers?: string[],
        @Query('regions') regions?: string[],
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20
    ): Promise<any> {
        try {
            // Получаем продукты и общее количество
            const { products, total } = await this.productsService.findByTypeAndGameWithFilters(
                type,
                gameId,
                platforms,
                servers,
                regions,
                minPrice,
                maxPrice,
                page,
                limit
            );

            // Вычисляем общее количество страниц
            const totalPages = Math.ceil(total / limit);

            // Возвращаем форматированный ответ
            return {
                products,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при получении продуктов по типу и ID игры');
        }
    }
    @Get('admin/search')
    @ApiOperation({ summary: 'Поиск продуктов по имени без пагинации' })
    @ApiResponse({ status: 200, description: 'Продукты успешно найдены', type: [ProductDto] })
    @ApiResponse({ status: 500, description: 'Ошибка при поиске продуктов' })
    async searchByName(
        @Query('name') name: string
    ): Promise<ProductDto[]> {
        try {
            if (!name) {
                throw new BadRequestException('Название продукта должно быть указано');
            }

            const cleanName = name.trim().toLowerCase();

            const products = await this.productsService.findByName(cleanName);

            if (!products.length) {
                return [];
            }

            return plainToInstance(ProductDto, products);
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при поиске продуктов');
        }
    }



    @Post()
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: './api/uploads/products',
            filename: (req, file, cb) => {
                const uniqueSuffix = uuidv4() + extname(file.originalname);
                cb(null, `${uniqueSuffix}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return cb(new Error('Разрешены только файлы изображений формата JPG, JPEG, PNG!'), false);
            }
            cb(null, true);
        },
    }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Создание нового продукта с фотографиями, ID игры и ID владельца' })
    @ApiResponse({ status: 201, description: 'Продукт успешно создан', type: ProductDto })
    @ApiResponse({ status: 400, description: 'Ошибка при создании продукта' })
    async create(
        @Body() productDto: ProductDto,
        @UploadedFiles() images: Multer.File[],
    ): Promise<any> {
        try {
            if (images && images.length > 0) {
                productDto.imageUrls = images.map(file => `/api/uploads/products/${file.filename}`);
            }

            const newProduct = await this.productsService.create(productDto, images);
            return newProduct;
        } catch (error) {
            throw new BadRequestException('Ошибка при создании продукта');
        }
    }

    @Put(':id')
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: './api/uploads/products',
            filename: (req, file, cb) => {
                const uniqueSuffix = uuidv4() + extname(file.originalname);
                cb(null, `${uniqueSuffix}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return cb(new Error('Разрешены только файлы изображений формата JPG, JPEG, PNG!'), false);
            }
            cb(null, true);
        },
    }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Обновление информации о продукте с фотографиями' })
    @ApiResponse({ status: 200, description: 'Продукт успешно обновлен', type: ProductDto })
    @ApiResponse({ status: 404, description: 'Продукт не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при обновлении продукта' })
    async update(
        @Param('id') id: string,
        @Body() body: any,
        @UploadedFiles() images: Multer.File[],
    ): Promise<any> {
        try {
            const existingProduct = await this.productsService.findOne(id);
            if (!existingProduct) {
                throw new NotFoundException('Продукт не найден');
            }

            const currentImages = existingProduct.imageUrls ? existingProduct.imageUrls.length : 0;
            const newImages = images.length;

            if (currentImages + newImages > 5) {
                throw new BadRequestException('Нельзя добавить больше 5 изображений к продукту');
            }

            const updateData: Partial<ProductDto> = {};

            if (body.name) updateData.name = body.name;
            if (body.description) updateData.description = body.description;
            if (body.detailDescription) updateData.detailDescription = body.detailDescription;
            if (body.platform) updateData.platform = body.platform;
            if (body.region) updateData.region = body.region;
            if (body.server) updateData.server = body.server;
            if (body.price) updateData.price = body.price;
            if (body.gameId) updateData.gameId = body.gameId;
            if (body.ownerId) updateData.ownerId = body.ownerId;

            if (images && images.length > 0) {
                const newImageUrls = images.map(file => `/api/uploads/products/${file.filename}`);
                updateData.imageUrls = [...(existingProduct.imageUrls || []), ...newImageUrls];
            }

            const updatedProduct = await this.productsService.update(id, updateData);

            return updatedProduct;
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при обновлении продукта');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удаление продукта' })
    @ApiResponse({ status: 200, description: 'Продукт успешно удален' })
    @ApiResponse({ status: 404, description: 'Продукт не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при удалении продукта' })
    async delete(@Param('id') id: string): Promise<any> {
        try {
            await this.productsService.delete(id);
            return { message: 'Продукт успешно удален' };
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при удалении продукта');
        }
    }

    @Delete('one/:productId/images/:index')
    @ApiOperation({ summary: 'Удаление одной картинки из продукта по индексу' })
    @ApiResponse({ status: 200, description: 'Картинка успешно удалена' })
    @ApiResponse({ status: 404, description: 'Продукт или картинка не найдены' })
    @ApiResponse({ status: 500, description: 'Ошибка при удалении картинки' })
    async deleteImage(
        @Param('productId') productId: string,
        @Param('index') index: number,
    ): Promise<void> {
        try {
            await this.productsService.deleteImageByIndex(productId, index);
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при удалении картинки');
        }
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Изменение статуса активности продукта по ID' })
    @ApiResponse({ status: 200, description: 'Статус активности успешно изменен' })
    @ApiResponse({ status: 404, description: 'Продукт не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка при изменении статуса активности' })
    async toggleActiveStatus(@Param('id') id: string): Promise<any> {
        try {
            const updatedProduct = await this.productsService.toggleActiveStatus(id);
            return updatedProduct;
        } catch (error) {
            throw new InternalServerErrorException('Ошибка при изменении статуса активности');
        }
    }
}
