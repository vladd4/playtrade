import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportChat } from '../entities/supportChat/supportChat.entity';
import { SupportChatService } from '../entities/supportChat/supportChat.service';
import { UsersService } from '../entities/users/users.service';
import { MessagesModule } from '../entities/messages/messages.module';
import { MessageQueryService } from '../entities/messages/messageQuery.service';
import { UsersModule } from '../entities/users/users.module';
import { WebSocketBotModule } from '../webSocket/support/supportWebSocket.module';
import { JwtModule } from '@nestjs/jwt';
import { MessageEntity } from '../entities/messages/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportChat, MessageEntity]),
    UsersModule,
    JwtModule,
    forwardRef(() => WebSocketBotModule),
    MessagesModule,
  ],
  providers: [SupportChatService, UsersService, MessageQueryService],
  exports: [SupportChatService, UsersService, JwtModule],
})
export class SharedModule {}
