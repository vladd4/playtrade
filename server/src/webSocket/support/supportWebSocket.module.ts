import { Module, forwardRef } from '@nestjs/common';
import { SharedModule } from '../../utils/SharedModule';
import { WebSocketBotGateway } from './supportBotGateway';
import { SupportChatGateway } from './supportChatGateway';
import { MessagesModule } from "../../entities/messages/messages.module";

@Module({
    imports: [forwardRef(() => SharedModule), MessagesModule], // Используйте forwardRef для SharedModule
    providers: [SupportChatGateway, WebSocketBotGateway],
    exports: [WebSocketBotGateway], // Экспортируйте WebSocketBotGateway
})
export class WebSocketBotModule {}
