import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';

@Injectable()
export class MenuService {
  createMainMenu() {
    return Markup.inlineKeyboard([
      [Markup.button.webApp('📦 Магазин', 'https://gamebuzz.com.ua')],
      [
        Markup.button.webApp(
          '🔄 Продати ігровий товар',
          'https://gamebuzz.com.ua/profile/products/create-product',
        ),
      ],
      [
        Markup.button.webApp(
          '💬 Мої листування',
          'https://gamebuzz.com.ua/messages',
        ),
      ],
      [
        Markup.button.webApp(
          '👤 Мій аккаунт',
          'https://gamebuzz.com.ua/profile',
        ),
      ],
      [
        Markup.button.webApp(
          '📃 Мої товари',
          'https://gamebuzz.com.ua/profile/products',
        ),
      ],
    ]);
  }
}
