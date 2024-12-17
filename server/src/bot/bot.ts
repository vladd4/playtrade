import { Injectable } from '@nestjs/common';
import { Telegraf, Scenes, session, Context } from 'telegraf';
import * as process from 'process';
import { UsersService } from '../entities/users/users.service';
import { RegistrationScene } from './scenes/registrationScene';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { MenuService } from './service/menu.service';
import { DeleteMessageService } from './service/delete.message.service';
import { TechnicalSupportScene } from './scenes/TechnicalSupportScene';
import { MainScene } from './scenes/mainScene';

export interface MyContext extends Context {
  scene: Scenes.SceneContextScene<MyContext>;
}

@Injectable()
export class TelegrafService {
  private bot: Telegraf<MyContext>;

  constructor(
    private usersService: UsersService,
    private registrationScene: RegistrationScene,
    private technicalSupportScene: TechnicalSupportScene,
    private mainScene: MainScene,
    @InjectEntityManager() private entityManager: EntityManager,
    public menuService: MenuService,
    private deleteMessageService: DeleteMessageService,
  ) {
    this.bot = new Telegraf<MyContext>(process.env.TELEGRAM_BOT_TOKEN);

    const stage = new Scenes.Stage<MyContext>(
      [this.registrationScene.createScene(), this.mainScene.createScene()],
      { ttl: 300 },
    );

    this.bot.use(session());
    this.bot.use(stage.middleware());

    this.setupMiddleware();
    this.setupCommands();

    // Добавляем обработку всех сообщений
    this.setupMessageHandler();

    this.bot.launch();
  }

  private setupMiddleware() {
    this.bot.use(async (ctx, next) => {
      const user = await this.usersService.findUser(ctx.from.id);

      if (user) {
        const wasUnbanned = await this.usersService.checkAndUpdateBanStatus(
          user.id,
        );

        if (wasUnbanned) {
          await ctx.reply(
            'Ваш обліковий запис було успішно розблоковано. Ось ваше головне меню:',
            this.menuService.createMainMenu(),
          );
          return;
        }
      }

      if (user && user.isBanned && !ctx.scene.current) {
        const isSupportCommand =
          ctx.message &&
          'text' in ctx.message &&
          ctx.message.text === '/technical_support';

        if (!isSupportCommand) {
          const banMessage = user.banUntil
            ? formatRemainingTime(new Date(user.banUntil))
            : 'Ви заблоковані перманентно. \nЗа деталями зверніться в службу підтримки.';

          await ctx.reply(banMessage);
          return;
        }
      }

      await next();
    });
  }

  private setupCommands() {
    this.bot.command('technical_support', async (ctx) => {
      console.log(`User ${ctx.from.id} entering technical support`);
      await this.technicalSupportScene.handleTechnicalSupportCommand(ctx); // Включаем режим техподдержки
    });

    this.bot.start(async (ctx) => {
      const user = await this.usersService.findUser(ctx.from.id);
      if (user) {
        console.log(`User ${ctx.from.id} entering main scene`);
        ctx.scene.enter('main');
      } else {
        console.log(`User ${ctx.from.id} entering registration scene`);
        ctx.scene.enter('registration');
      }
    });

    this.bot.command('delete', async (ctx) => {
      const messageId = ctx.message.message_id;
      const chatId = ctx.chat.id;

      await this.deleteMessageService.deleteMessage(chatId, messageId);
      ctx.reply('Сообщение было удалено.');
    });

    this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Перезапуск бота' },
      { command: 'technical_support', description: 'Технічна підтримка' },
    ]);
  }

  private setupMessageHandler() {
    this.bot.on('message', async (ctx) => {
      const user = await this.usersService.findUser(ctx.from.id);
      if (user && user.isSupportChatActive) {
        // Если пользователь в режиме поддержки, передаем его сообщение в техподдержку
        await this.technicalSupportScene.handleUserMessage(ctx);
      } else {
        // Обработка других сообщений, если пользователь не в режиме техподдержки
        await ctx.reply('Ви не в режимі технічної підтримки.');
      }
    });
  }

  async sendMessageToUser(chatId: number, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      console.error('Ошибка при отправке сообщения в бот:', error);
    }
  }
  async sendPhotoToUser(telegramId: number, imageUrl: string): Promise<void> {
    try {
      await this.bot.telegram.sendPhoto(telegramId, imageUrl);
    } catch (error) {
      console.error('Error sending photo:', error);
      throw error;
    }
  }
  getBot() {
    return this.bot;
  }
}

function formatRemainingTime(until: Date): string {
  const now = new Date();
  const difference = until.getTime() - now.getTime();

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  let formattedTime = '';
  if (days > 0) {
    formattedTime += `${days} дн. `;
  }
  if (hours > 0) {
    formattedTime += `${hours} г. `;
  }
  if (minutes > 0 || (!days && !hours)) {
    formattedTime += `${minutes} хв.`;
  }

  return `Ваш акаунт заблоковано ще на ${formattedTime} \nЗа деталями зверніться в службу підтримки.`;
}
