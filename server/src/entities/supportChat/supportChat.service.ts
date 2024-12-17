import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportChat } from './supportChat.entity';
import { MessageCreationService } from '../messages/messageCreation.service';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { MessageEntity } from '../messages/message.entity';

@Injectable()
export class SupportChatService {
  constructor(
    @InjectRepository(SupportChat)
    private readonly supportChatRepository: Repository<SupportChat>,
    private readonly messageCreationService: MessageCreationService,
    private readonly usersService: UsersService,
  ) {}

  async createOrUpdateChatWithLastMessage(
    userId: string,
    content: string,
    receiverId: string,
  ): Promise<MessageEntity> {
    let chat = await this.supportChatRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (chat && chat.isClosed) {
      chat.isClosed = false;
      await this.supportChatRepository.save(chat);
      console.log(`Чат для пользователя с ID ${userId} был открыт снова.`);
    } else if (!chat) {
      chat = this.supportChatRepository.create({
        user: { id: userId } as UserEntity,
        isClosed: false,
      });
      chat = await this.supportChatRepository.save(chat);
      console.log(`Создан новый чат для пользователя с ID ${userId}.`);
    } else {
      console.log(
        `Используется существующий активный чат для пользователя с ID ${userId}.`,
      );
    }

    const message = await this.messageCreationService.createSupportMessage({
      chatId: chat.id,
      content,
      timestamp: new Date(),
      senderId: userId,
      receiverId: receiverId,
    });

    chat.lastMessage = message;
    await this.supportChatRepository.save(chat);

    console.log(
      `Сообщение отправлено в чат с ID ${chat.id}. Сообщение: ${JSON.stringify(message)}`,
    );

    return message;
  }

  async findActiveChatByUserId(userId: string): Promise<SupportChat | null> {
    return this.supportChatRepository.findOne({
      where: { user: { id: userId }, isClosed: false },
      relations: ['user'],
    });
  }
  async closeChat(userId: string): Promise<void> {
    const chat = await this.findActiveChatByUserId(userId);
    if (!chat) {
      throw new NotFoundException('Активный чат не найден.');
    }

    chat.isClosed = true;
    await this.supportChatRepository.save(chat);

    await this.usersService.update(userId, { isSupportChatActive: false });
  }
  async findAllWithPagination(
    limit: number,
    page: number,
  ): Promise<{ chats: SupportChat[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const [chats, totalCount] = await this.supportChatRepository.findAndCount({
      skip: skip,
      take: limit,
      order: {
        lastMessage: {
          timestamp: 'DESC',
        },
      },
      relations: ['user', 'lastMessage'],
    });

    return { chats, totalCount };
  }

  async getChatById(chatId: string): Promise<SupportChat> {
    const chat = await this.supportChatRepository.findOne({
      where: { id: chatId },
      relations: [
        'user',
        'messages',
        'messages.sender',
        'messages.receiver',
        'lastMessage',
        'lastMessage.sender',
        'lastMessage.receiver',
      ],
    });

    if (!chat) {
      console.error(`Chat with ID ${chatId} not found`); // Лог ошибки
      throw new NotFoundException(`Чат с ID ${chatId} не найден`);
    }

    if (chat.user) {
      delete chat.user.password;
    }

    const chatWithUserIdAndSenderId = {
      ...chat,
      userId: chat.user.id,
      messages: chat.messages.map((message) => ({
        ...message,
        senderId: message.sender ? message.sender.id : null,
        sender: undefined,
        receiverId: message.receiver ? message.receiver.id : null,
        receiver: undefined,
      })),
      lastMessage: chat.lastMessage
        ? {
            ...chat.lastMessage,
            senderId: chat.lastMessage.sender
              ? chat.lastMessage.sender.id
              : null,
            sender: undefined,
            receiverId: chat.lastMessage.receiver
              ? chat.lastMessage.receiver.id
              : null,
            receiver: undefined,
          }
        : null,
    };

    return chatWithUserIdAndSenderId;
  }
}
