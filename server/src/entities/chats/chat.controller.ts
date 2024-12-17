import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { ChatsService } from './chat.service';
import { Chat } from './chat.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ChatSummaryDto } from './chatSummaryDto';
import { AuthGuard } from '@nestjs/passport';
import { validate as isUuid } from 'uuid';

@ApiTags('api/chats')
@ApiBearerAuth()
@Controller('api/chats')
@UseGuards(AuthGuard('jwt'))
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}
  @Get('existing')
  @ApiOperation({
    summary: 'Проверка существования чата между пользователями по продукту',
  })
  @ApiQuery({
    name: 'ownerId',
    required: true,
    description: 'ID владельца чата',
  })
  @ApiQuery({
    name: 'receiverId',
    required: true,
    description: 'ID получателя чата',
  })
  @ApiQuery({ name: 'productId', required: true, description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Чат найден', type: Chat })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  async checkExistingChat(
    @Query('ownerId') ownerId: string,
    @Query('receiverId') receiverId: string,
    @Query('productId') productId: string,
  ): Promise<Chat> {
    const chat = await this.chatsService.findChatBetweenUsers(
      ownerId,
      receiverId,
      productId,
    );

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  @Post()
  @ApiOperation({ summary: 'Создание нового чата' })
  @ApiBody({
    description: 'ID участников и продукта чата',
    schema: {
      type: 'object',
      properties: {
        ownerId: {
          type: 'string',
          example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
        },
        receiverId: {
          type: 'string',
          example: 'a4d8b4a1-4c3f-48b6-b2e3-df0a5671c1a5',
        },
        productId: {
          type: 'string',
          example: 'a4d8b4a1-4c3f-48b6-b2e3-df0a5671c1a5',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Чат успешно создан', type: Chat })
  @ApiResponse({
    status: 404,
    description: 'Пользователь или продукт не найден',
  })
  async createChat(
    @Body('ownerId') ownerId: string,
    @Body('receiverId') receiverId: string,
    @Body('productId') productId: string,
  ): Promise<Chat> {
    const owner = await this.usersService.findOne(ownerId);
    const receiver = await this.usersService.findOne(receiverId);
    const product = await this.productsService.findOne(productId);

    if (!owner || !receiver) {
      throw new NotFoundException('One or both users not found');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const chat = await this.chatsService.createChat(owner, receiver, product);
    console.log(chat);
    return chat;
  }
  @Get('/all/admin')
  @ApiOperation({ summary: 'Получение всех чатов с пагинацией' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Количество чатов на страницу',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Номер страницы',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Список всех чатов успешно получен',
    type: [ChatSummaryDto],
  })
  async getAllChats(
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ): Promise<{
    chats: ChatSummaryDto[];
    totalPages: number;
    currentPage: number;
    totalChats: number;
  }> {
    const { chats, totalCount } = await this.chatsService.findAllChats(
      limit,
      page,
    );

    const totalPages = Math.ceil(totalCount / limit);

    return {
      chats,
      totalPages,
      currentPage: page,
      totalChats: totalCount,
    };
  }

  @Get('/search/:chatId')
  @ApiOperation({ summary: 'Поиск чата по chatId с кастомным ответом' })
  @ApiParam({
    name: 'chatId',
    description: 'ID чата',
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о чате успешно получена',
  })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  async searchChatById(@Param('chatId') chatId: string): Promise<any> {
    if (!isUuid(chatId)) {
      throw new NotFoundException(`Invalid UUID: ${chatId}`);
    }

    const chat = await this.chatsService.findOne(chatId);

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    const response = {
      chatId: chat.id,
      productName: chat.product ? chat.product.name : null,
      productId: chat.product ? chat.product.id : null,
      lastMessageDate: chat.messages.length
        ? chat.messages
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
            .timestamp.toISOString()
        : null,
      lastMessageContent: chat.messages.length
        ? chat.messages.sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
          )[0].content
        : null,
      isFavorite: chat.isFavorite,
      participants: chat.participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
        avatar: participant.avatarPhoto,
      })),
    };

    return response;
  }
  @Get(':userId')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Получение всех чатов пользователя с последним сообщением',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID пользователя',
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
  })
  @ApiResponse({
    status: 200,
    description: 'Чаты с последними сообщениями успешно получены',
    type: [Chat],
  })
  async getUserChats(
    @Param('userId') userId: string,
  ): Promise<{ chats: Chat[] }> {
    return this.chatsService.findChatsByUser(userId);
  }

  @Get('one/:chatId')
  @ApiOperation({
    summary: 'Получение полной информации о чате с комментариями админа',
  })
  @ApiParam({
    name: 'chatId',
    description: 'ID чата',
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о чате успешно получена',
    type: Chat,
  })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  async getChatById(@Param('chatId') chatId: string): Promise<any> {
    if (!isUuid(chatId)) {
      return [];
    }

    const chat = await this.chatsService.findOne(chatId);

    if (!chat) {
      return [];
    }

    const response = {
      ...chat,
      adminComments: chat.adminComments.map((comment) => ({
        id: comment.id,
        comment: comment.comment,
        createdAt: comment.createdAt,
        author: {
          id: comment.author.id,
          name: comment.author.name,
          avatar: comment.author.avatarPhoto,
        },
      })),
      messages: chat.messages.map((message) => ({
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        sender: {
          id: message.sender?.id,
          name: message.sender?.name,
          avatar: message.sender?.avatarPhoto,
        },
        receiver: {
          id: message.receiver?.id,
          name: message.receiver?.name,
          avatar: message.receiver?.avatarPhoto,
        },
        isDealCompleted: message.isDealCompleted,
        seenByUser: message.seenByUser,
      })),
    };

    return response;
  }

  @Patch(':chatId/favorite')
  @ApiOperation({ summary: 'Обновление статуса "Избранное" для чата' })
  @ApiResponse({ status: 200, description: 'Чат успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isFavorite: {
          type: 'boolean',
          example: true,
          description: 'Отметка, является ли чат избранным (true или false)',
        },
      },
      required: ['isFavorite'],
    },
    description: 'Изменение значения поля isFavorite (true или false)',
  })
  async updateIsFavorite(
    @Param('chatId') chatId: string,
    @Body('isFavorite') isFavorite: boolean,
  ): Promise<{ message: string; chat: { id: string; isFavorite: boolean } }> {
    const updatedChat = await this.chatsService.updateIsFavorite(
      chatId,
      isFavorite,
    );

    return {
      message: `Chat ${chatId} updated successfully.`,
      chat: {
        id: updatedChat.id,
        isFavorite: updatedChat.isFavorite,
      },
    };
  }
}
