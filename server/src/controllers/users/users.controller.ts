import {
  Controller,
  Get,
  HttpStatus,
  Param,
  UseGuards,
  Put,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../../entities/users/users.service';
import { UserEntity } from '../../entities/users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { classToPlain, plainToInstance } from 'class-transformer';
import { ProductsService } from '../../entities/products/products.service';

@ApiTags('api/users')
@ApiBearerAuth()
@Controller('api/users')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Отримання списку всіх користувачів з пагінацією' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Кількість користувачів на сторінку',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Номер сторінки',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Список користувачів успішно отримано',
    type: [UserEntity],
  })
  @ApiResponse({
    status: 500,
    description: 'Помилка сервера при отриманні списку користувачів',
  })
  async findAll(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ): Promise<any> {
    const { users, totalCount } = await this.usersService.findAllWithPagination(
      limit,
      page,
    );
    const totalPages = Math.ceil(totalCount / limit);

    return {
      users: this.usersService.formatUsersResponse(users),
      totalPages,
      currentPage: page,
      totalUsers: totalCount,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно найден',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({
    status: 500,
    description: 'Ошибка сервера при поиске пользователя',
  })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: 'string' })
  async findOne(@Param('id') id: string): Promise<any> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return this.usersService.formatUserResponse(user);
  }

  @Put(':id/name')
  @ApiOperation({ summary: 'Изменение имени пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Имя пользователя успешно обновлено',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при изменении имени пользователя',
  })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: 'string' })
  async updateUserName(
    @Param('id') id: string,
    @Body() body: { newName: string },
  ): Promise<any> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      const updatedUser = await this.usersService.update(id, {
        name: body.newName,
      });

      return {
        message: 'Имя пользователя успешно обновлено',
        user: classToPlain(updatedUser),
      };
    } catch (e) {
      throw new InternalServerErrorException(
        'Ошибка при изменении имени пользователя',
      );
    }
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Получение продуктов, где пользователь владелец' })
  @ApiResponse({ status: 200, description: 'Продукты успешно найдены' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({
    status: 500,
    description: 'Ошибка сервера при поиске продуктов',
  })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: 'string' })
  async getUserProducts(@Param('id') id: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      const products = await this.productsService.findProductsByOwner(id);

      return products.length > 0 ? products : [];
    } catch (e) {
      throw new InternalServerErrorException('Ошибка при поиске продуктов');
    }
  }

  @Get(':id/purchases')
  @ApiOperation({ summary: 'Получение списка покупок пользователя' })
  @ApiResponse({ status: 200, description: 'Список покупок успешно получен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({
    status: 500,
    description: 'Ошибка сервера при поиске покупок',
  })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: 'string' })
  async getUserPurchases(@Param('id') id: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      const purchases = await this.productsService.findPurchasesByUser(id);

      if (!purchases || purchases.length === 0) {
        return [];
      }

      const purchasesWithSeller = purchases.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        detailDescription: product.detailDescription,
        platform: product.platform,
        price: product.price,
        imageUrls: product.imageUrls,
        inProcess: product.inProcess,
        type: product.type,
        seller: {
          id: product.owner.id,
          name: product.owner.name,
          avatar: product.owner.avatarPhoto,
          rating: product.owner.rating,
        },
      }));

      return purchasesWithSeller;
    } catch (e) {
      console.error('Ошибка при поиске покупок:', e);
      throw new InternalServerErrorException('Ошибка при поиске покупок');
    }
  }
}
