import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommentService } from './adminComment.service';
import { AdminCommentController } from './adminComment.controller';
import { AdminComment } from './adminComment.entity';
import { Chat } from '../chats/chat.entity';
import { UserEntity } from '../users/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AdminComment, Chat, UserEntity]),
    ],
    controllers: [AdminCommentController],
    providers: [AdminCommentService],
    exports: [AdminCommentService],
})
export class AdminCommentModule {}
