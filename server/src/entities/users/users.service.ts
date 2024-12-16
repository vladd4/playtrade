import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcryptjs';
import * as base64 from 'base-64';
import { JwtService } from '@nestjs/jwt';
import { Product } from '../products/product.entity';
import { CreateUserDto } from './create-user.dto';
import { JwtPayload } from '../../auth/jwtStrategy';
import { UserRole } from '../../utils/enum/userRole.enum';

@Injectable()
export class UsersService {
  private otpUserMap = new Map<string, UserEntity>();

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['products', 'purchases'],
    });
  }

  async findUser(telegramId: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { telegramId } });
  }

  async findUserBySessionId(sessionId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { sessionId } });
  }

  async banUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isBanned: true });
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(createUserDto);
    if (!newUser.createdAt) {
      newUser.createdAt = new Date();
    }
    await this.userRepository.save(newUser);
    return newUser;
  }

  async update(
    userId: string,
    updateData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    await this.userRepository.update(userId, updateData);

    return this.findOne(userId);
  }

  generateRefreshToken(user: UserEntity) {
    const payload = { userId: user.id, username: user.name };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
  }

  async validateRefreshToken(token: string): Promise<UserEntity | null> {
    try {
      const payload: JwtPayload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.findOne(payload.userId);
      if (!user) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      return user;
    } catch (error) {
      return null;
    }
  }
  async findAllWithPagination(
    limit: number,
    page: number,
  ): Promise<{ users: UserEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const [users, totalCount] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      relations: ['receivedTransactions', 'sentTransactions'],
      order: { createdAt: 'DESC' },
    });

    return { users, totalCount };
  }

  async banUserForPeriod(userId: string, period: number): Promise<void> {
    const banUntil = new Date(Date.now() + period);
    await this.userRepository.update(userId, { isBanned: true, banUntil });
  }

  async banUserPermanently(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isBanned: true,
      banUntil: null,
    });
  }

  async unbanUser(userId: string): Promise<UserEntity> {
    await this.userRepository.update(userId, {
      isBanned: false,
      banUntil: null,
    });
    return this.findOne(userId);
  }

  async isUserBannedByTelegramId(telegramId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { telegramId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    await this.checkAndUpdateBanStatus(user.id);

    if (user.isBanned && (!user.banUntil || new Date() < user.banUntil)) {
      return true;
    }

    return false;
  }

  async checkAndUpdateBanStatus(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && user.isBanned && user.banUntil) {
      if (new Date() > user.banUntil) {
        user.isBanned = false;
        user.banUntil = null;
        await this.userRepository.save(user);
        return true; // Пользователь разбанен
      }
    }
    return false; // Пользователь не разбанен
  }

  async saveUserOtp(otpId: string, user: UserEntity) {
    this.otpUserMap.set(otpId, user);
  }

  async findByOtpId(otpId: string): Promise<UserEntity | undefined> {
    return this.otpUserMap.get(otpId);
  }
  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
  async updateBalance(userId: string, balance: number): Promise<UserEntity> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.balance = balance;
    return this.userRepository.save(user);
  }

  async updateVerificationStatus(
    userId: string,
    isVerified: boolean,
  ): Promise<UserEntity> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    user.isVerified = isVerified;
    return this.userRepository.save(user);
  }
  async findByName(name: string): Promise<UserEntity[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.name) LIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async findAllAdminsAndManagers(
    limit: number,
    page: number,
  ): Promise<{ users: UserEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    const [users, totalCount] = await this.userRepository.findAndCount({
      where: [
        { role: UserRole.ADMIN },
        { role: UserRole.MANAGER },
        { role: UserRole.MODERATOR },
      ],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['receivedTransactions'], // Подгружаем связанные транзакции
    });

    return { users, totalCount };
  }

  

  async invalidateSession(sessionId: string): Promise<void> {
    const user = await this.findUserBySessionId(sessionId);
    if (!user) {
      throw new UnauthorizedException('Сессия не найдена');
    }

    user.sessionId = null;
    await this.userRepository.save(user);
  }

  formatUserResponse(user: UserEntity): any {
    return {
      id: user.id,
      avatarPhoto: user.avatarPhoto,
      name: user.name,
      telegramId: user.telegramId,
      phoneNumber: user.phoneNumber,
      email: user.email,
      userNameInTelegram: user.userNameInTelegram,
      isBanned: user.isBanned,
      isVerified: user.isVerified,
      isOnline: user.isOnline,
      balance: user.balance,
      rating: user.rating,
      role: user.role,
      sessionId: user.sessionId,
      isSupportChatActive: user.isSupportChatActive,
      createdAt: user.createdAt,
      transactions:
        user.receivedTransactions?.map((transaction) => ({
          product: transaction.sender
            ? transaction.sender.name
            : 'Невідомий товар',
          id: transaction.id,
          date: transaction.createdAt,
          amount: `${transaction.amount} GB coins`,
          status:
            transaction.status === 'completed' ? 'успішно' : transaction.status,
        })) || [],
    };
  }

  formatUsersResponse(users: UserEntity[]): any[] {
    return users.map((user) => this.formatUserResponse(user));
  }
}
