import { Context } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../entities/users/users.service';
import { SupportChatService } from '../../entities/supportChat/supportChat.service';
import { SupportChatGateway } from '../../webSocket/support/supportChatGateway';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Message } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class TechnicalSupportScene {
  constructor(
    private readonly usersService: UsersService,
    private readonly supportChatService: SupportChatService,
    private readonly supportChatGateway: SupportChatGateway,
  ) {}

  async handleTechnicalSupportCommand(ctx: Context) {
    const user = await this.usersService.findUser(ctx.from.id);
    if (!user) {
      await ctx.reply('Користувача не знайдено.');
      console.log('User not found');
      return;
    }

    await this.usersService.update(user.id, { isSupportChatActive: true });
    console.log(`User ${user.id} has activated support chat mode`);

    await ctx.reply(
      "Ви знаходитесь у режимі зв'язку з технічною підтримкою. Напишіть ваше повідомлення, і ми зв'яжемося з вами якнайшвидше.",
      { reply_markup: { remove_keyboard: true } },
    );
  }

  async handleUserMessage(ctx: Context) {
    const user = await this.usersService.findUser(ctx.from.id);
    if (!user) {
      await ctx.reply('Користувача не знайдено.');
      console.log('User not found');
      return;
    }

    if (user.isSupportChatActive && ctx.message) {
      if ('photo' in ctx.message) {
        const messageWithPhoto = ctx.message as Message.PhotoMessage;
        const fileId =
          messageWithPhoto.photo[messageWithPhoto.photo.length - 1].file_id;
        const file = await ctx.telegram.getFile(fileId);
        const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

        const uploadDir = path.join(
          process.cwd(),
          'api/uploads/support-images',
        );
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
          console.log(`Directory created: ${uploadDir}`);
        }

        const uniqueFileName = `${uuidv4()}.jpg`;
        const filePath = path.join(uploadDir, uniqueFileName);

        const response = await axios({
          url: fileUrl,
          method: 'GET',
          responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
          const imageUrl = `http://playtrade.pp.ua/api/uploads/support-images/${uniqueFileName}`;
          console.log(`Image successfully saved at ${filePath}`);

          await this.supportChatService.createOrUpdateChatWithLastMessage(
            user.id,
            imageUrl,
            TECH_PLACEHOLDER_ID,
          );

          const server = this.supportChatGateway.getServerInstance();
          if (server) {
            server.emit('supportMessage', {
              sender: {
                id: user.id,
                username: user.name,
              },
              receiver: {
                id: TECH_PLACEHOLDER_ID,
              },
              content: imageUrl,
              timestamp: new Date(),
              seenByUser: false,
            });
            console.log('Image URL sent to support chat via WebSocket');
          }

          await ctx.reply(
            `Ваше фото успішно відправлено в техпідтримку. Посилання на зображення: ${imageUrl}`,
          );
        });

        writer.on('error', (error) => {
          console.error('Error saving image:', error);
          ctx.reply(
            'Сталася помилка при завантаженні зображення. Спробуйте ще раз.',
          );
        });
      } else if ('text' in ctx.message) {
        const message = ctx.message.text;

        await this.supportChatService.createOrUpdateChatWithLastMessage(
          user.id,
          message,
          TECH_PLACEHOLDER_ID,
        );
        const server = this.supportChatGateway.getServerInstance();
        if (server) {
          server.emit('supportMessage', {
            sender: {
              id: user.id,
              username: user.name,
            },
            receiver: {
              id: TECH_PLACEHOLDER_ID,
            },
            content: message,
            timestamp: new Date(),
            seenByUser: false,
          });
          console.log('Text message sent to support chat via WebSocket');
        }

        await ctx.reply(
          `Ваше повідомлення: "${message}" успішно відправлено в техпідтримку.`,
        );
      } else {
        await ctx.reply(
          "Будь ласка, використовуйте лише текст або фото для зв'язку з техпідтримкою.",
        );
        console.log(
          'Unsupported message type received. Only text or photo is allowed.',
        );
      }
    } else {
      await ctx.reply(
        'Будь ласка, активуйте чат з техпідтримкою перед відправкою повідомлення.',
      );
      console.log(
        'User attempted to send message without activating support chat',
      );
    }
  }
}
