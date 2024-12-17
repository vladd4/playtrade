import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { UserEntity } from '../users/user.entity';
import { CreateTransactionDto } from './transactionsDto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const { senderId, receiverId, amount, status } = createTransactionDto;
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });

    if (!sender || !receiver) {
      throw new NotFoundException('Відправника або отримувача не знайдено');
    }

    const transaction = this.transactionRepository.create({
      sender,
      receiver,
      amount,
      status,
    });
    return this.transactionRepository.save(transaction);
  }

  async findAllTransactions(
    limit: number,
    page: number,
  ): Promise<{ transactions: TransactionEntity[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const [transactions, totalCount] =
      await this.transactionRepository.findAndCount({
        relations: ['sender', 'receiver'],
        order: { createdAt: 'DESC' }, // Сортировка по новизне
        skip,
        take: limit,
      });

    return { transactions, totalCount };
  }

  async findTransactionById(id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
    if (!transaction) {
      throw new NotFoundException(`Транзакція з ID ${id} не знайдена`);
    }
    return transaction;
  }
}
