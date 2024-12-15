import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportChat } from './supportChat.entity';
import { SupportChatService } from './supportChat.service';
import { SupportChatController } from './supportChat.controller';
import { SupportChatPhotoService } from './support-chat-photo.service';
import { SharedModule } from "../../utils/SharedModule";
import { MessagesModule } from "../messages/messages.module";
import { WebSocketBotModule } from "../../webSocket/support/supportWebSocket.module"; // Импортируйте WebSocketBotModule

@Module({
    imports: [
        TypeOrmModule.forFeature([SupportChat]),
        SharedModule,
        MessagesModule,
        WebSocketBotModule, // Импортируйте WebSocketBotModule
    ],
    providers: [
        SupportChatService,
        SupportChatPhotoService,
    ],
    exports: [SupportChatService, TypeOrmModule],
    controllers: [SupportChatController]
})
export class SupportChatModule {}
