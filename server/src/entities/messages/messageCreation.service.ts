import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { CreateMessageDto } from './createMessageDTO';
import { UsersService } from '../users/users.service';
import { Product } from '../products/product.entity';
import { ChatValidationService } from '../chats/chatValidation.service';
import { CreateSupportMessageDTO } from './createSupportMessageDTO';
import { UserEntity } from '../users/user.entity';
import { SupportChat } from '../supportChat/supportChat.entity';

@Injectable()
export class MessageCreationService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    private usersService: UsersService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private chatValidationService: ChatValidationService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    const sender = await this.usersService.findOne(createMessageDto.senderId);
    const receiver = await this.usersService.findOne(
      createMessageDto.receiverId,
    );

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    let product: Product | null = null;
    if (createMessageDto.productId) {
      product = await this.productRepository.findOne({
        where: { id: createMessageDto.productId },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (createMessageDto.isDealCompleted) {
        product.buyer = sender;
        await this.productRepository.save(product);
      }
    }

    const chat = await this.chatValidationService.validateChatExists(
      createMessageDto.chatId,
    );
    if (!chat) {
      throw new NotFoundException(
        `Chat with id ${createMessageDto.chatId} not found`,
      );
    }

    const message = this.messageRepository.create({
      ...createMessageDto,
      chat,
      sender,
      receiver,
      seenByUser: false,
    });

    return this.messageRepository.save(message);
  }

  async createSupportMessage(
    createSupportMessageDTO: CreateSupportMessageDTO,
  ): Promise<MessageEntity> {
    const { chatId, content, senderId, receiverId } = createSupportMessageDTO;

    const message = this.messageRepository.create({
      content,
      timestamp: new Date(),
      supportChat: { id: chatId } as SupportChat,
      sender: { id: senderId } as UserEntity,
      seenByUser: false,
      ...(receiverId && { receiver: { id: receiverId } as UserEntity }),
    });

    return await this.messageRepository.save(message);
  }
}
