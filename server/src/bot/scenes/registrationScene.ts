import { Injectable } from '@nestjs/common';
import { Scenes, Markup, Telegram } from 'telegraf';
import { MyContext } from '../config/context';
import { UsersService } from '../../entities/users/users.service';
import { CreateUserDto } from '../../entities/users/create-user.dto';
import { EmailService } from '../../utils/email/email.service';
import { MenuService } from '../service/menu.service';
import { DeleteMessageService } from '../service/delete.message.service';
import { ValidationService } from '../../utils/validation.service';
import * as bcrypt from 'bcryptjs';
import * as base64 from 'base-64';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import fetch from 'node-fetch';

@Injectable()
export class RegistrationScene {
  private bot: Telegram;

  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private menuService: MenuService,
    private deleteMessageService: DeleteMessageService,
    private validationService: ValidationService,
    botToken: string,
  ) {
    this.bot = new Telegram(botToken);
  }

  createScene() {
    const registrationScene = new Scenes.BaseScene<MyContext>('registration');

    registrationScene.enter(async (ctx) => {
      const message = await ctx.reply(
        'Вітання! Для початку реєстрації, будь ласка, надішліть свій номер телефону або натисніть кнопку нижче.',
        Markup.keyboard([Markup.button.contactRequest('Надати номер телефону')])
          .oneTime()
          .resize(),
      );

      if ('message_id' in message) {
        ctx.session.messageIds = [message.message_id];
      }
      ctx.session.step = 1;
    });

    registrationScene.on('contact', async (ctx) => {
      const message = ctx.message;
      if ('message_id' in message) {
        ctx.session.messageIds.push(message.message_id);
      }

      if (
        this.validationService.validatePhoneNumber(
          ctx.message.contact.phone_number,
        )
      ) {
        ctx.session.phone = ctx.message.contact.phone_number;
        const replyMessage = await ctx.reply(
          'Чудово! Тепер надішліть свою електронну пошту.',
          Markup.removeKeyboard(),
        );
        if ('message_id' in replyMessage) {
          ctx.session.messageIds.push(replyMessage.message_id);
        }
        ctx.session.step = 2;
      } else {
        const replyMessage = await ctx.reply(
          'Введений номер телефону здається неправильним. Будь ласка, спробуйте ще раз.',
        );
        if ('message_id' in replyMessage) {
          ctx.session.messageIds.push(replyMessage.message_id);
        }
      }
    });

    registrationScene.on('text', async (ctx) => {
      if ('message_id' in ctx.message) {
        ctx.session.messageIds.push(ctx.message.message_id);
      }

      switch (ctx.session.step) {
        case 1:
          if (this.validationService.validatePhoneNumber(ctx.message.text)) {
            ctx.session.phone = ctx.message.text;
            const replyMessage = await ctx.reply(
              'Чудово! Тепер надішліть свою електронну пошту.',
            );
            if ('message_id' in replyMessage) {
              ctx.session.messageIds.push(replyMessage.message_id);
            }
            ctx.session.step = 2;
          } else {
            const replyMessage = await ctx.reply(
              'Введений номер телефону здається неправильним. Будь ласка, спробуйте ще раз.',
            );
            if ('message_id' in replyMessage) {
              ctx.session.messageIds.push(replyMessage.message_id);
            }
          }
          break;
        case 2:
          if (this.validationService.validateEmail(ctx.message.text)) {
            const existingUser = await this.usersService.findByEmail(
              ctx.message.text,
            );
            if (existingUser) {
              const replyMessage = await ctx.reply(
                'Ця електронна адреса вже використовується. Будь ласка, введіть іншу.',
              );
              if ('message_id' in replyMessage) {
                ctx.session.messageIds.push(replyMessage.message_id);
              }
              return;
            }

            ctx.session.email = ctx.message.text;
            const verificationCode = Math.floor(
              100000 + Math.random() * 900000,
            ).toString();
            await this.emailService.sendVerificationEmail(
              ctx.session.email,
              ctx.from.first_name,
              verificationCode,
              true,
            );
            ctx.session.verificationCode = verificationCode;
            console.log('Verification Code is: ' + verificationCode);
            ctx.session.lastResendTime = Date.now();
            const replyMessage = await ctx.reply(
              'Будь ласка, введи код підтвердження, який ми надіслали на твою пошту.',
              Markup.inlineKeyboard([
                Markup.button.callback('Відправити код ще раз', 'resend_code'),
              ]),
            );
            if ('message_id' in replyMessage) {
              ctx.session.messageIds.push(replyMessage.message_id);
            }
            ctx.session.step = 3;
          } else {
            const replyMessage = await ctx.reply(
              'Введена адреса електронної пошти неправильна. Будь ласка, спробуйте ще раз.',
            );
            if ('message_id' in replyMessage) {
              ctx.session.messageIds.push(replyMessage.message_id);
            }
          }
          break;
        case 3:
          if (ctx.message.text === ctx.session.verificationCode) {
            const replyMessage = await ctx.reply(
              'Код підтвердження правильний! Тепер, будь ласка, створіть надійний пароль.',
            );
            if ('message_id' in replyMessage) {
              ctx.session.messageIds.push(replyMessage.message_id);
            }
            ctx.session.step = 4;
          } else {
            const replyMessage = await ctx.reply(
              'Код підтвердження невірний. Будь ласка, спробуйте ще раз.',
              Markup.inlineKeyboard([
                Markup.button.callback('Відправити код ще раз', 'resend_code'),
              ]),
            );
            if ('message_id' in replyMessage) {
              ctx.session.messageIds.push(replyMessage.message_id);
            }
          }
          break;
        case 4:
          if (this.validationService.validatePassword(ctx.message.text)) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(ctx.message.text, salt);
            const encryptedPassword = base64.encode(hashedPassword);

            ctx.session.password = encryptedPassword;

            const photos = await this.bot.getUserProfilePhotos(ctx.from.id);
            let avatarUrl = null;

            if (photos.total_count > 0) {
              const highestResolutionPhoto = photos.photos[0].pop();
              const fileId = highestResolutionPhoto.file_id;
              const file = await this.bot.getFile(fileId);

              const localFilePath = await this.saveUserAvatar(file);
              avatarUrl = localFilePath;
            }
            const firstName = ctx.from.first_name ? ctx.from.first_name : '';
            const lastName = ctx.from.last_name ? ctx.from.last_name : '';

            const name =
              (firstName + ' ' + lastName).trim() || 'No name provided';
            const createUserDto: CreateUserDto = {
              telegramId: ctx.from.id,
              name: name,
              userNameInTelegram: ctx.from.username,
              phoneNumber: ctx.session.phone,
              email: ctx.session.email,
              avatarPhoto: avatarUrl,
              password: ctx.session.password,
              isBanned: false,
              isVerified: true,
              isOnline: true,
            };
            const newUser = await this.usersService.create(createUserDto);
            const sentMessage = await ctx.reply(
              `Реєстрацію завершено! Вітаємо, ${newUser.name}. Тепер ти можеш використовувати всі функції боту. Краще видали повідомлення з паролем із чату, для безпеки твого акаунту!`,
            );
            setTimeout(() => {
              this.deleteMessageService.deleteMessage(
                ctx.chat.id,
                sentMessage.message_id,
              );
            }, 30000);

            for (const messageId of ctx.session.messageIds) {
              await this.deleteMessageService.deleteMessage(
                ctx.chat.id,
                messageId,
              );
            }

            ctx.scene.leave();

            const user = await this.usersService.findUser(ctx.from.id);
            if (user) {
              await ctx.reply(
                'Вітаємо у нашому PlayTrade Marketplace! Як я можу допомогти вам сьогодні?',
                this.menuService.createMainMenu(),
              );
            } else {
              ctx.scene.enter('registration');
            }
          } else {
            const replyMessage = await ctx.reply(
              'Пароль не відповідає вимогам. Мінімум 8 символів. Спробуйте ще раз.',
            );
            if ('message_id' in replyMessage) {
              ctx.session.messageIds.push(replyMessage.message_id);
            }
          }
          break;
      }
    });

    registrationScene.action('resend_code', async (ctx) => {
      const currentTime = Date.now();
      if (currentTime - ctx.session.lastResendTime < 120000) {
        // 120000ms = 2 minutes
        await ctx.answerCbQuery(
          'Ми можемо відправити код ще раз тільки через 2 хвилини.',
        );
        return;
      }
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      await this.emailService.sendVerificationEmail(
        ctx.session.email,
        ctx.from.first_name,
        verificationCode,
      );
      ctx.session.verificationCode = verificationCode;
      ctx.session.lastResendTime = currentTime;
      console.log('Verification Code is: ' + verificationCode);
      await ctx.answerCbQuery('Код було відправлено повторно.');
      const editedMessage = await ctx.editMessageText(
        'Новий код підтвердження було відправлено на вашу електронну пошту. Будь ласка, введіть його тут.',
        Markup.inlineKeyboard([
          Markup.button.callback('Відправити код ще раз', 'resend_code'),
        ]),
      );
      if (typeof editedMessage === 'object' && 'message_id' in editedMessage) {
        ctx.session.messageIds.push(editedMessage.message_id);
      }
    });

    return registrationScene;
  }
  private async saveUserAvatar(file): Promise<string> {
    const avatarPath = path.resolve('api/uploads/avatars');
    const uniqueFilename = `${uuidv4()}${path.extname(file.file_path)}`;
    const fullPath = path.join(avatarPath, uniqueFilename);

    // Загружаем файл с телеграма на сервер
    const fileStream = fs.createWriteStream(fullPath);
    const fileUrl = `https://api.telegram.org/file/bot${this.bot.token}/${file.file_path}`;
    const request = await fetch(fileUrl);
    const buffer = await request.buffer();

    return new Promise((resolve, reject) => {
      fileStream.write(buffer, () => {
        resolve(`api/uploads/avatars/${uniqueFilename}`);
      });
    });
  }
}
