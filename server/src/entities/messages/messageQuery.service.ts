import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class MessageQueryService {
  private readonly logger = new Logger(MessageQueryService.name);

  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async findAll(): Promise<MessageEntity[]> {
    return this.messageRepository.find();
  }

  async findOne(id: string): Promise<MessageEntity> {
    return this.messageRepository.findOne({ where: { id: id } });
  }
  async findMessagesByUserAndChat(
    userId: string,
    chatId: string,
    type: 'sent' | 'received',
  ): Promise<MessageEntity[]> {
    console.log(type);
    console.log(chatId);
    console.log(userId);
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .leftJoinAndSelect('message.product', 'product')
      .leftJoinAndSelect('message.chat', 'chat')
      .select([
        'message.id',
        'message.content',
        'message.timestamp',
        'message.isDealCompleted',
        'message.seenByUser',
        'receiver.id',
        'product.id',
        'chat.id',
      ])
      .where('chat.id = :chatId', { chatId }); // Явное указание на поле chat.id
    console.log(queryBuilder);

    if (type === 'sent') {
      queryBuilder.andWhere('message.senderId = :userId', { userId }); // Используем senderId напрямую
    } else if (type === 'received') {
      queryBuilder.andWhere('message.receiverId = :userId', { userId }); // Используем receiverId напрямую
    } else {
      throw new Error('Invalid type parameter');
    }

    // Логируем параметры и SQL-запрос
    console.log('SQL Query:', queryBuilder.getSql());
    console.log('Parameters:', { userId, chatId, type });

    // Выполняем запрос
    const result = await queryBuilder.getMany();
    console.log('Query Result:', result);

    return result;
  }

  async findMessagesByUser(
    userId: string,
    type: 'sent' | 'received',
  ): Promise<any[]> {
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .leftJoinAndSelect('message.product', 'product')
      .leftJoinAndSelect('message.chat', 'chat')
      .select([
        'message.id',
        'message.content',
        'message.timestamp',
        'message.isDealCompleted',
        'message.seenByUser',
        'receiver.id',
        'product.id',
        'chat.id',
      ]);

    if (type === 'sent') {
      queryBuilder.where('message.senderId = :userId', { userId });
    } else {
      queryBuilder.where('message.receiverId = :userId', { userId });
    }

    return queryBuilder.getMany();
  }

  async findMessagesByUserAndProduct(
    buyerId: string,
  ): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      where: {
        sender: { id: buyerId },
      },
      relations: ['product', 'receiver'],
    });
  }
  async findMessagesBySupportChat(chatId: string): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      where: {
        supportChat: { id: chatId },
      },
      relations: ['sender', 'receiver'],
      order: {
        timestamp: 'ASC',
      },
    });
  }

  async findMessagesByChat(chatId: string): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender', 'receiver'],
      order: { timestamp: 'ASC' },
    });
    return messages;
  }
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    this.logger.log(
      `Attempting to mark messages as read for chatId: ${chatId} and userId: ${userId}`,
    );

    const chatExists = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.chat_id = :chatId', { chatId })
      .andWhere(
        '(message.senderId = :userId OR message.receiverId = :userId)',
        { userId },
      )
      .getOne();

    if (!chatExists) {
      throw new NotFoundException(
        `Chat with ID ${chatId} between user ${userId} not found`,
      );
    }

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.chat_id = :chatId', { chatId })
      .andWhere('message.receiverId = :userId', { userId }) // Здесь подставляем userId
      .andWhere('message.seenByUser = false') // Сообщения, которые еще не прочитаны
      .getMany();

    if (messages.length > 0) {
      await this.messageRepository
        .createQueryBuilder()
        .update(MessageEntity)
        .set({ seenByUser: true }) // Обновляем статус на "прочитано"
        .where('chat_id = :chatId', { chatId })
        .andWhere('receiverId = :userId', { userId }) // Условие: текущий пользователь получатель
        .andWhere('seenByUser = false') // Только непрочитанные сообщения
        .execute();

      this.logger.log(`Updated ${messages.length} messages to read.`);
    } else {
      this.logger.log('No unread messages found for this chat.');
    }
  }

  async deleteMessage(id: string): Promise<MessageEntity | null> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      return null;
    }
    await this.messageRepository.remove(message);
    return message;
  }
}
