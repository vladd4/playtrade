import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';

@Injectable()
export class MenuService {
  createMainMenu() {
    return Markup.inlineKeyboard([
      [Markup.button.webApp('📦 Магазин', 'http://playtrade.pp.ua')],
      [
        Markup.button.webApp(
          '🔄 Продати ігровий товар',
          'http://playtrade.pp.ua/profile/products/create-product',
        ),
      ],
      [
        Markup.button.webApp(
          '💬 Мої листування',
          'http://playtrade.pp.ua/messages',
        ),
      ],
      [
        Markup.button.webApp(
          '👤 Мій аккаунт',
          'http://playtrade.pp.ua/profile',
        ),
      ],
      [
        Markup.button.webApp(
          '📃 Мої товари',
          'http://playtrade.pp.ua/profile/products',
        ),
      ],
    ]);
  }
}
