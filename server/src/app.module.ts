import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './entities/users/users.module';
import { ProductsModule } from './entities/products/products.module';
import { GamesModule } from './entities/games/games.module';
import { ReviewsModule } from './entities/reviews/reviews.module';
import { MessagesModule } from './entities/messages/messages.module';
import { TransactionsModule } from './entities/transactions/transactions.module';
import { TelegramModule } from './bot/telegram.module';
import { ChatsModule } from './entities/chats/chat.module';
import { AuthModule } from './auth/auth.module';
import { AdminCommentModule } from './entities/adminComment/adminComment.module';
import { SupportChatModule } from './entities/supportChat/supportChat.module';
import { WebSocketModule } from './webSocket/default/webSocket.module';
import { WebSocketBotModule } from './webSocket/support/supportWebSocket.module';
import { BotProviderModule } from './bot/bot-provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'db',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'postgres',
        database: configService.get<string>('DB_NAME') || 'FunGames',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    WebSocketModule,
    UsersModule,
    GamesModule,
    ProductsModule,
    ReviewsModule,
    MessagesModule,
    TransactionsModule,
    TelegramModule,
    WebSocketBotModule,
    ChatsModule,
    AuthModule,
    AdminCommentModule,
    BotProviderModule,
    SupportChatModule,
  ],
})
export class AppModule {}
