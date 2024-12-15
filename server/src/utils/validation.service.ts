import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationService {

    validatePhoneNumber(number: string): boolean {
        const phoneRegex = /^\+?[1-9]\d{1,3}\d{6,12}$/;
        return phoneRegex.test(number);
    }

    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password: string): boolean {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    }
}
