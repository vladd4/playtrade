import { Injectable, BadRequestException, InternalServerErrorException, Inject } from '@nestjs/common';
import { SupportChatService } from './supportChat.service';
import { UsersService } from '../users/users.service';
import * as fs from 'fs';
import { Multer } from 'multer';
import { WebSocketBotGateway } from "../../webSocket/support/supportBotGateway"; // Импортируйте WebSocketBotGateway

@Injectable()
export class SupportChatPhotoService {
    constructor(
        private readonly supportChatService: SupportChatService,
        private readonly usersService: UsersService,
        @Inject('BOT') private readonly bot: any,
        private readonly webSocketBotGateway: WebSocketBotGateway
    ) {}

    async processPhoto(
        file: Multer.File,
        senderId: string,
        adminId: string
    ) {
        const imageUrl = `https://gamebuzz.com.ua/api/uploads/support-images/${file.filename}`;
        const localPath = `./api/uploads/support-images/${file.filename}`;

        try {
            if (!fs.existsSync(localPath)) {
                throw new InternalServerErrorException('File was not saved properly');
            }

            const user = await this.usersService.findOne(senderId);
            if (!user || !user.telegramId) {
                throw new BadRequestException('User not found or does not have Telegram ID');
            }

            try {
                await this.bot.telegram.sendPhoto(user.telegramId, {
                    source: localPath
                });
            } catch (telegramError) {
                if (telegramError.response?.error_code === 400 &&
                    telegramError.response?.description?.includes('chat not found')) {
                    throw new BadRequestException('Telegram chat not found. User might have blocked the bot or deleted the chat');
                }

                if (telegramError.response?.error_code === 403) {
                    throw new BadRequestException('Bot was blocked by the user');
                }

                throw new InternalServerErrorException(
                    `Failed to send photo to Telegram: ${telegramError.response?.description || telegramError.message}`
                );
            }

            const message = await this.supportChatService.createOrUpdateChatWithLastMessage(
                senderId, imageUrl,
                adminId
            );

            this.webSocketBotGateway.server.emit('supportMessage', {
                sender: {
                    id: senderId,
                },
                receiver: {
                    id: adminId,
                },
                content: imageUrl,
                timestamp: new Date(),
                seenByUser: false,
            });

            return {
                success: true,
                imageUrl,
                message
            };

        } catch (error) {
            try {
                if (fs.existsSync(localPath)) {
                    fs.unlinkSync(localPath);
                }
            } catch (unlinkError) {
                console.error('Error while deleting file:', unlinkError);
            }

            throw error;
        }
    }
}
