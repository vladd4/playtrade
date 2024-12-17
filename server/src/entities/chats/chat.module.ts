import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { ChatsService } from './chat.service';
import { ChatsController } from './chat.controller';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { ChatImageUploadController } from './chatImageUploadController';
import { ChatValidationService } from './chatValidation.service';
import { SupportChat } from '../supportChat/supportChat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, SupportChat]),
    UsersModule,
    ProductsModule,
  ],
  providers: [ChatsService, ChatValidationService],
  controllers: [ChatsController, ChatImageUploadController],
  exports: [ChatsService, ChatValidationService],
})
export class ChatsModule {}
