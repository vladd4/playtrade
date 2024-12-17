import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';

@Injectable()
export class MenuService {
  createMainMenu() {
    return Markup.inlineKeyboard([
      [Markup.button.webApp('📦 Магазин', 'https://playtrade.pp.ua')],
      [
        Markup.button.webApp(
          '🔄 Продати ігровий товар',
          'https://playtrade.pp.ua/profile/products/create-product',
        ),
      ],
      [
        Markup.button.webApp(
          '💬 Мої листування',
          'https://playtrade.pp.ua/messages',
        ),
      ],
      [
        Markup.button.webApp(
          '👤 Мій аккаунт',
          'https://playtrade.pp.ua/profile',
        ),
      ],
      [
        Markup.button.webApp(
          '📃 Мої товари',
          'https://playtrade.pp.ua/profile/products',
        ),
      ],
    ]);
  }
}
