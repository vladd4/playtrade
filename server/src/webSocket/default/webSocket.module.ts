import { Module } from '@nestjs/common';
import {WebSocketChatService} from "./webSocketChat.service";
import {WebSocketCoreModule} from "./webSocketCore.module";
import {ChatsModule} from "../../entities/chats/chat.module";
import {MessagesModule} from "../../entities/messages/messages.module";
import {UsersModule} from "../../entities/users/users.module";
import {ProductsModule} from "../../entities/products/products.module";


@Module({
    imports: [
        WebSocketCoreModule,
        ChatsModule,
        MessagesModule,
        UsersModule,
        ProductsModule,
    ],
    providers: [WebSocketChatService ],
    exports: [WebSocketCoreModule, WebSocketChatService ],
})
export class WebSocketModule {}