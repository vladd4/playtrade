import { Module } from '@nestjs/common';
import { TelegrafService } from './bot';
import { UsersModule } from '../entities/users/users.module';
import { RegistrationScene } from './scenes/registrationScene';
import { EmailModule } from '../utils/email/email.module';
import { MenuService } from './service/menu.service';
import { ProductsModule } from '../entities/products/products.module';
import { MessagesModule } from '../entities/messages/messages.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from '../entities/users/users.service';
import { EmailService } from '../utils/email/email.service';
import { DeleteMessageService } from './service/delete.message.service';
import { ValidationService } from '../utils/validation.service';
import { TechnicalSupportScene } from './scenes/TechnicalSupportScene';
import { SupportChatModule } from '../entities/supportChat/supportChat.module';
import { MainScene } from './scenes/mainScene';
import { SupportChatGateway } from '../webSocket/support/supportChatGateway';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    ProductsModule,
    MessagesModule,
    ConfigModule,
    SupportChatModule,
  ],
  providers: [
    TelegrafService,
    MenuService,
    DeleteMessageService,
    ValidationService,
    SupportChatGateway,
    TechnicalSupportScene,
    MainScene,
    {
      provide: RegistrationScene,
      useFactory: (
        usersService: UsersService,
        emailService: EmailService,
        menuService: MenuService,
        configService: ConfigService,
        deleteMessageService: DeleteMessageService,
        validationService: ValidationService,
      ) => {
        const botToken = configService.get('TELEGRAM_BOT_TOKEN');
        return new RegistrationScene(
          usersService,
          emailService,
          menuService,
          deleteMessageService,
          validationService,
          botToken,
        );
      },
      inject: [
        UsersService,
        EmailService,
        MenuService,
        ConfigService,
        DeleteMessageService,
        ValidationService,
      ],
    },
  ],
  exports: [
    TelegrafService,
    MenuService,
    RegistrationScene,
    DeleteMessageService,
    ValidationService,
    TechnicalSupportScene,
    MainScene,
  ],
})
export class TelegramModule {}
