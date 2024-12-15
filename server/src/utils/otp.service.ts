import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OtpService {
    private otps = new Map<string, { code: string, expiresAt: Date }>();

    generateOtp(): { code: string, id: string } {
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-значный код
        const id = uuidv4();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

        this.otps.set(id, { code, expiresAt });
        return { code, id };
    }

    validateOtp(id: string, code: string): boolean {
        const otp = this.otps.get(id);
        if (!otp) return false;

        const isValid = otp.code === code && otp.expiresAt > new Date();
        if (isValid) {
            this.otps.delete(id);
        }
        return isValid;
    }
}
