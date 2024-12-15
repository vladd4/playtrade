import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminComment } from './adminComment.entity';
import { CreateAdminCommentDto } from './adminComment.dto';
import { Chat } from '../chats/chat.entity';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class AdminCommentService {
    constructor(
        @InjectRepository(AdminComment)
        private readonly adminCommentRepository: Repository<AdminComment>,
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async addComment(chatId: string, dto: CreateAdminCommentDto): Promise<AdminComment> {
        const chat = await this.chatRepository.findOne({ where: { id: chatId } });
        if (!chat) {
            throw new NotFoundException(`Chat with ID ${chatId} not found`);
        }

        const author = await this.userRepository.findOne({ where: { id: dto.author } });
        if (!author) {
            throw new NotFoundException(`Author with ID ${dto.author} not found`);
        }

        const adminComment = this.adminCommentRepository.create({
            comment: dto.comment,
            author: author,
            chat: chat,
        });

        return this.adminCommentRepository.save(adminComment);
    }

    async findCommentsByChat(chatId: string): Promise<AdminComment[]> {
        const chat = await this.chatRepository.findOne({ where: { id: chatId }, relations: ['adminComments'] });
        if (!chat) {
            throw new NotFoundException(`Chat with ID ${chatId} not found`);
        }

        return this.adminCommentRepository.find({
            where: { chat: { id: chatId } },
            relations: ['author'],
        });
    }
    async deleteCommentById(commentId: string): Promise<void> {
        const comment = await this.adminCommentRepository.findOne({ where: { id: commentId } });
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${commentId} not found`);
        }

        await this.adminCommentRepository.remove(comment);
    }
}
