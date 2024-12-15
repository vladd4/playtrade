import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { MessageCreationService } from './messageCreation.service';
import { MessageQueryService } from './messageQuery.service';
import { ChatValidationService } from '../chats/chatValidation.service';
import { Chat } from '../chats/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, Chat]),
    UsersModule,
    ProductsModule,
  ],
  providers: [
    MessageCreationService,
    MessageQueryService,
    ChatValidationService,
  ],
  controllers: [MessagesController],
  exports: [MessageCreationService, MessageQueryService, ChatValidationService],
})
export class MessagesModule {}
