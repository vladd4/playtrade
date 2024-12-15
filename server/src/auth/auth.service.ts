import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(public jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    if (
      username === process.env.JWT_USER &&
      password === process.env.JWT_PASSWORD
    ) {
      return { userId: 1, username: process.env.JWT_USER };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    const refresh_token = this.generateRefreshToken(payload);

    return {
      access_token,
      refresh_token,
    };
  }

  generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
  }
}
