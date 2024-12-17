import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { UserEntity } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { ChatSummaryDto } from './chatSummaryDto';
import { Logger } from '@nestjs/common';
import { ChatProductDto } from '../products/chatProduct.dto';

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async createChat(
    owner: UserEntity,
    receiver: UserEntity,
    product: Product,
  ): Promise<Chat> {
    const chat = this.chatsRepository.create({
      owner,
      participants: [owner, receiver],
      product,
    });
    return this.chatsRepository.save(chat);
  }
  async findChatBetweenUsers(
    ownerId: string,
    receiverId: string,
    productId: string,
  ): Promise<Chat | null> {
    return this.chatsRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.participants', 'participants')
      .where(
        'chat.ownerId = :ownerId AND participants.id = :receiverId AND chat.productId = :productId',
        { ownerId, receiverId, productId },
      )
      .orWhere(
        'chat.ownerId = :receiverId AND participants.id = :ownerId AND chat.productId = :productId',
        { ownerId: receiverId, receiverId: ownerId, productId },
      )
      .getOne();
  }

  async findChatsByUser(userId: string): Promise<{ chats: Chat[] }> {
    const chats = await this.chatsRepository
      .createQueryBuilder('chat')
      .innerJoinAndSelect('chat.participants', 'participants')
      .leftJoinAndSelect('chat.product', 'product')
      .leftJoinAndSelect('chat.owner', 'owner')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('chat.id')
          .from(Chat, 'chat')
          .innerJoin('chat.participants', 'p')
          .where('p.id = :userId')
          .orWhere('chat.ownerId = :userId') // Условие для владельца чата
          .getQuery();
        return 'chat.id IN ' + subQuery;
      })
      .setParameter('userId', userId)
      .orderBy('chat.id', 'DESC')
      .getMany();

    // Обрабатываем чаты и подгружаем последние сообщения
    for (const chat of chats) {
      const latestMessage = await this.chatsRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.messages', 'message')
        .leftJoinAndSelect('message.sender', 'sender')
        .where('chat.id = :chatId', { chatId: chat.id })
        .orderBy('message.timestamp', 'DESC')
        .limit(1)
        .getOne();

      // Присваиваем последнее сообщение
      chat['latestMessage'] =
        latestMessage?.messages &&
        latestMessage.messages[0] &&
        latestMessage.messages[0].sender
          ? {
              ...latestMessage.messages[0],
              senderId: latestMessage.messages[0].sender.id,
            }
          : null;

      // Владелец чата первым в списке участников
      if (chat.owner) {
        chat.participants = [
          chat.participants.find(
            (participant) => participant.id === chat.owner.id,
          ),
          ...chat.participants.filter(
            (participant) => participant.id !== chat.owner.id,
          ),
        ];
      }

      // Присваиваем продукт
      chat['product'] = chat.product
        ? ({
            id: chat.product.id,
            name: chat.product.name,
          } as ChatProductDto)
        : null;
    }

    return { chats };
  }

  async findOne(chatId: string): Promise<Chat> {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: [
        'participants',
        'messages',
        'messages.sender',
        'messages.receiver',
        'product',
        'adminComments',
        'adminComments.author',
        'owner',
      ],
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    return chat;
  }

  async findAllChats(
    limit: number,
    page: number,
  ): Promise<{ chats: ChatSummaryDto[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const [chats, totalCount] = await this.chatsRepository.findAndCount({
      skip,
      take: limit,
      relations: ['participants', 'product', 'messages'],
      order: {
        isFavorite: 'DESC',
        createdAt: 'DESC',
      },
    });

    const chatSummaries = chats.map((chat) => {
      const lastMessage = chat.messages.length
        ? chat.messages.sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
          )[0]
        : null;

      return {
        chatId: chat.id,
        isFavorite: chat.isFavorite,
        productName: chat.product ? chat.product.name : 'Unknown Product',
        productId: chat.product ? chat.product.id : null,
        lastMessageDate: lastMessage
          ? lastMessage.timestamp.toISOString()
          : null,
        lastMessageContent: lastMessage ? lastMessage.content : null,
        participants: chat.participants.map((participant) => ({
          id: participant.id,
          name: participant.name ? participant.name : 'Unknown User',
          avatar: participant.avatarPhoto ? participant.avatarPhoto : null,
        })),
      };
    });

    return { chats: chatSummaries, totalCount };
  }
  async updateIsFavorite(chatId: string, isFavorite: boolean): Promise<Chat> {
    const chat = await this.chatsRepository.findOne({ where: { id: chatId } });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    chat.isFavorite = isFavorite;
    return await this.chatsRepository.save(chat);
  }
}
