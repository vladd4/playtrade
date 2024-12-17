import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatValidationService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async validateChatExists(chatId: string): Promise<Chat> {
    const chat = await this.chatsRepository.findOne({
      where: { id: chatId },
      relations: ['participants'],
    });
    if (!chat) {
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }
    return chat;
  }
}
