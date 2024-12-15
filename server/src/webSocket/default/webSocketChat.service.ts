import { Injectable } from '@nestjs/common';
import {ChatsService} from "../../entities/chats/chat.service";
import {CreateMessageDto} from "../../entities/messages/createMessageDTO";
import {MessageCreationService} from "../../entities/messages/messageCreation.service";
import {MessageQueryService} from "../../entities/messages/messageQuery.service";
import {UsersService} from "../../entities/users/users.service";
import {ProductsService} from "../../entities/products/products.service";
@Injectable()
export class WebSocketChatService {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly messageCreationService: MessageCreationService,
        private readonly messageQueryService: MessageQueryService,
        private readonly usersService: UsersService,
        private readonly productsService: ProductsService,
    ) {}

    async handleChatCreation(createMessageDto: CreateMessageDto) {
        const { senderId, receiverId, productId, content, timestamp } = createMessageDto;

        if (!senderId || !receiverId || !productId || !content) {
            throw new Error('Missing required fields');
        }

        const sender = await this.usersService.findOne(senderId);
        const receiver = await this.usersService.findOne(receiverId);
        const product = await this.productsService.findOne(productId);

        if (!sender || !receiver || !product) {
            throw new Error('Sender, receiver, or product not found');
        }

        let chat = await this.chatsService.findChatBetweenUsers(senderId, receiverId, productId);

        if (!chat) {
            chat = await this.chatsService.createChat(sender, receiver, product);
        }

        const existingMessages = await this.messageQueryService.findMessagesByChat(chat.id);
        const duplicateMessage = existingMessages.find(msg => msg.content === content && msg.timestamp === timestamp);

        if (duplicateMessage) {
            return null;
        }

        const message = await this.messageCreationService.create({
            ...createMessageDto,
            chatId: chat.id,
            timestamp: createMessageDto.timestamp || new Date(),
        });

        return { chat, message };
    }
    async findMessagesByChat(chatId: string) {
        return this.messageQueryService.findMessagesByChat(chatId);
    }
}