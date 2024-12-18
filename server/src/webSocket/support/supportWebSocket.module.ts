import { Module, forwardRef } from '@nestjs/common';
import { SharedModule } from '../../utils/SharedModule';
import { WebSocketBotGateway } from './supportBotGateway';
import { SupportChatGateway } from './supportChatGateway';
import { MessagesModule } from '../../entities/messages/messages.module';

@Module({
  imports: [forwardRef(() => SharedModule), MessagesModule],
  providers: [SupportChatGateway, WebSocketBotGateway],
  exports: [WebSocketBotGateway],
})
export class WebSocketBotModule {}
