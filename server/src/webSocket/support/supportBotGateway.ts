import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../entities/users/users.service';
import { SupportChatService } from '../../entities/supportChat/supportChat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebSocketBotGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly usersService: UsersService,
    private readonly supportChatService: SupportChatService,
    @Inject('BOT') private readonly bot: any,
  ) {}

  @SubscribeMessage('closeSupportChat')
  async handleCloseChat(@MessageBody() data: { senderId: string }) {
    const { senderId } = data;
    const user = await this.usersService.findOne(senderId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.supportChatService.closeChat(senderId);
    await this.usersService.update(user.id, { isSupportChatActive: false });

    await this.bot.telegram.sendMessage(
      user.telegramId,
      'Чат з ТП завершено. Натисніть /start щоб далі користуватись ботом',
    );

    this.server.emit('chatClosed', {
      status: 'success',
      userId: user.id,
    });
  }

  @SubscribeMessage('sendMessageToBot')
  async handleMessage(
    @MessageBody() data: { senderId: string; content: string; adminId: string },
  ) {
    try {
      const { senderId, content, adminId } = data;

      if (!content) {
        console.log('Сообщение отсутствует!');
        throw new BadRequestException('Сообщение не может быть пустым.');
      }

      const user = await this.usersService.findOne(senderId);
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      if (user.telegramId) {
        await this.bot.telegram.sendMessage(user.telegramId, content);
      }

      const message =
        await this.supportChatService.createOrUpdateChatWithLastMessage(
          user.id,
          content,
          adminId,
        );

      this.server.emit('messageSent', {
        sender: {
          id: adminId,
        },
        receiver: {
          id: senderId,
        },
        status: 'success',
        timestamp: new Date(),
        chatId: user.id,
        content: message.content,
      });
    } catch (error) {
      console.error('Ошибка при обработке сообщения:', error);
      throw new BadRequestException('Произошла ошибка при отправке сообщения.');
    }
  }
  @SubscribeMessage('sendPhotoToBot')
  async handleSendPhoto(
    @MessageBody()
    data: {
      senderId: string;
      photoUrl: string;
      adminId: string;
    },
  ) {
    try {
      const { senderId, photoUrl, adminId } = data;

      const user = await this.usersService.findOne(senderId);
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      if (user.telegramId) {
        await this.bot.telegram.sendPhoto(user.telegramId, { url: photoUrl });
      }

      const message =
        await this.supportChatService.createOrUpdateChatWithLastMessage(
          user.id,
          photoUrl,
          adminId,
        );

      this.server.emit('messageSent', {
        sender: {
          id: adminId,
        },
        receiver: {
          id: senderId,
        },
        status: 'success',
        timestamp: new Date(),
        chatId: user.id,
        content: message.content,
      });
    } catch (error) {
      console.error('Ошибка при отправке фотографии:', error);
      throw new BadRequestException(
        'Произошла ошибка при отправке фотографии.',
      );
    }
  }
}
