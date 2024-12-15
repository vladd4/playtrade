import { SceneSessionData, SceneSession } from 'telegraf/typings/scenes';

export interface Sessions extends SceneSession<SceneSessionData> {
    step?: number;
    phone?: string;
    email?: string;
    verificationCode?: string;
    lastResendTime?: number;
    messageIds?: number[];
    password?: string;
}


