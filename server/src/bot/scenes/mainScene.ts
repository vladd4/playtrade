import { Injectable } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { MyContext } from '../bot';
import { MenuService } from '../service/menu.service';

@Injectable()
export class MainScene {
  constructor(private menuService: MenuService) {}

  createScene() {
    const scene = new Scenes.BaseScene<MyContext>('main');

    scene.enter(async (ctx) => {
      console.log(`Entering main scene for user ${ctx.from.id}`);
      await ctx.reply(
        'Вітаємо у нашому PlayTrade Marketplace! Як я можу допомогти вам сьогодні?',
        this.menuService.createMainMenu(),
      );
    });

    scene.action('support', (ctx) => ctx.reply('Як ми можемо вам допомогти?'));

    return scene;
  }
}
