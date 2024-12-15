import { Module } from '@nestjs/common';
import { ChatGateway } from './chatGateway';
import { WebSocketChatService } from './webSocketChat.service';
import {MessagesModule} from "../../entities/messages/messages.module";
import {ChatsModule} from "../../entities/chats/chat.module";
import {UsersModule} from "../../entities/users/users.module";
import {ProductsModule} from "../../entities/products/products.module";

@Module({
    imports: [
        MessagesModule,
        ChatsModule,
        UsersModule,
        ProductsModule,

    ],
    providers: [ChatGateway, WebSocketChatService],
    exports: [ChatGateway],
})
export class WebSocketCoreModule {}