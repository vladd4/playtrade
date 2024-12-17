import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
  HttpStatus,
  Query,
  NotFoundException,
  Delete,
  UseGuards,
  Patch,
  ParseEnumPipe,
} from '@nestjs/common';
import { MessageCreationService } from './messageCreation.service';
import { CreateMessageDto } from './createMessageDTO';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MessageEntity } from './message.entity';
import { MessageQueryService } from './messageQuery.service';
import { MessageType } from '../../utils/enum/MessageType';

@ApiTags('api/messages')
@ApiBearerAuth()
@Controller('api/messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(
    private readonly messagesCreationService: MessageCreationService,
    private readonly messagesQueryService: MessageQueryService,
  ) {}

  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const message =
        await this.messagesCreationService.create(createMessageDto);
      return res.status(HttpStatus.CREATED).json({
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        sender: {
          id: message.sender.id,
          username: message.sender.name,
        },
        receiver: {
          id: message.receiver.id,
          username: message.receiver.name,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Error creating message', error: error.message });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех сообщений' })
  @ApiResponse({
    status: 200,
    description: 'Сообщения успешно получены',
    type: [MessageEntity],
  })
  @ApiResponse({ status: 500, description: 'Ошибка при получении сообщений' })
  async findAll(@Res() res: Response): Promise<Response> {
    try {
      const messages = await this.messagesQueryService.findAll();
      return res.status(HttpStatus.OK).json(messages);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error retrieving messages', error: error.message });
    }
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Получение сообщения по ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID сообщения',
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
  })
  @ApiResponse({
    status: 200,
    description: 'Сообщение успешно найдено',
    type: MessageEntity,
  })
  @ApiResponse({ status: 404, description: 'Сообщение не найдено' })
  @ApiResponse({ status: 500, description: 'Ошибка при получении сообщения' })
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const message = await this.messagesQueryService.findOne(id);
      if (!message) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Message not found' });
      }
      return res.status(HttpStatus.OK).json(message);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Error retrieving the message',
          error: error.message,
        });
    }
  }

  @Patch('mark-as-read')
  @ApiOperation({ summary: 'Пометить сообщения как прочитанные' })
  @ApiQuery({ name: 'chatId', description: 'UUID чата' })
  @ApiQuery({ name: 'userId', description: 'UUID пользователя' })
  async markMessagesAsRead(
    @Query('chatId') chatId: string,
    @Query('userId') userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      await this.messagesQueryService.markMessagesAsRead(chatId, userId);
      return res.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Messages marked as read',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to mark messages as read',
      });
    }
  }

  @Get('by-chat')
  @ApiOperation({
    summary: 'Получение сообщений пользователя в определенном чате',
  })
  @ApiQuery({
    name: 'userId',
    description: 'UUID пользователя',
    required: true,
  })
  @ApiQuery({ name: 'chatId', description: 'UUID чата', required: true })
  @ApiQuery({
    name: 'type',
    description: 'Тип сообщений: отправленные (sent) или полученные (received)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Сообщения пользователя успешно найдены',
    type: [MessageEntity],
  })
  @ApiResponse({ status: 500, description: 'Ошибка при получении сообщений' })
  async findMessages(
    @Query('userId') userId: string,
    @Query('chatId') chatId: string,
    @Query('type', new ParseEnumPipe(MessageType)) type: MessageType,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const messages =
        await this.messagesQueryService.findMessagesByUserAndChat(
          userId,
          chatId,
          type,
        );
      return res.status(HttpStatus.OK).json(messages);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error retrieving messages', error: error.message });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление сообщения' })
  @ApiParam({
    name: 'id',
    description: 'UUID сообщения',
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
  })
  @ApiResponse({ status: 200, description: 'Сообщение успешно удалено' })
  @ApiResponse({ status: 404, description: 'Сообщение не найдено' })
  @ApiResponse({ status: 500, description: 'Ошибка при удалении сообщения' })
  async delete(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const deletedMessage = await this.messagesQueryService.deleteMessage(id);
      if (!deletedMessage) {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Message deleted successfully' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error deleting message', error: error.message });
    }
  }
}
