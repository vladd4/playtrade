import { Context, Scenes } from 'telegraf';
import { Sessions } from './sessions';

export interface MyContext extends Context, Scenes.SceneContext {
  session: Sessions;
}
