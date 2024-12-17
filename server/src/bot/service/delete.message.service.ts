import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { MyContext } from '../config/context';

@Injectable()
export class DeleteMessageService {
  private bot: Telegraf<MyContext>;

  constructor() {
    this.bot = new Telegraf<MyContext>(process.env.TELEGRAM_BOT_TOKEN);
  }

  async deleteMessage(chatId: number, messageId: number): Promise<void> {
    try {
      await this.bot.telegram.deleteMessage(chatId, messageId);
      console.log(
        `Сообщение с ID ${messageId} в чате ${chatId} успешно удалено.`,
      );
    } catch (error) {
      console.error(
        `Не удалось удалить сообщение с ID ${messageId} в чате ${chatId}:`,
        error,
      );
    }
  }
}
