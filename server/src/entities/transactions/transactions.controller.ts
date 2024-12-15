import {Controller, Get, Post, Body, Param, UseGuards, Res, Query, HttpStatus} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './transactionsDto';
import { AuthGuard } from "@nestjs/passport";
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiQuery} from '@nestjs/swagger';
import {TransactionEntity} from "./transaction.entity";
import { Response } from 'express';

@ApiTags('api/transactions')
@ApiBearerAuth()
@Controller('api/transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

    @Post()
    @ApiOperation({ summary: 'Создание новой транзакции' })
    @ApiBody({ type: CreateTransactionDto, description: 'Данные для создания транзакции' })
    @ApiResponse({ status: 201, description: 'Транзакция успешно создана', type: TransactionEntity })
    async create(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionsService.createTransaction(createTransactionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Получение списка всех транзакций с пагинацией и общим количеством страниц' })
    @ApiResponse({ status: 200, description: 'Список транзакций успешно получен', type: [TransactionEntity] })
    @ApiResponse({ status: 500, description: 'Ошибка при получении списка транзакций' })
    async findAll(
        @Res() res: Response,
        @Query('limit') limit: number = 10, // Лимит по умолчанию - 10 транзакций
        @Query('page') page: number = 1,    // Страница по умолчанию - 1
    ): Promise<Response> {
        try {
            const { transactions, totalCount } = await this.transactionsService.findAllTransactions(limit, page);

            const totalPages = Math.ceil(totalCount / limit);

            const result = transactions.map(transaction => ({
                id: transaction.id,
                amount: transaction.amount,
                status: transaction.status,
                createdAt: transaction.createdAt,
                sender: {
                    id: transaction.sender.id,
                    name: transaction.sender.name,
                    email: transaction.sender.email,
                },
                receiver: {
                    id: transaction.receiver.id,
                    name: transaction.receiver.name,
                    email: transaction.receiver.email,
                }
            }));

            return res.status(HttpStatus.OK).json({
                transactions: result,
                totalPages,
                currentPage: page,
                totalTransactions: totalCount
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при получении списка транзакций' });
        }
    }


    @Get(':id')
    @ApiOperation({ summary: 'Получение транзакции по ID' })
    @ApiParam({ name: 'id', description: 'UUID транзакции', example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56' })
    @ApiResponse({ status: 200, description: 'Транзакция успешно найдена', type: TransactionEntity })
    @ApiResponse({ status: 404, description: 'Транзакция не найдена' })
    async findOne(@Param('id') id: string) {
        return this.transactionsService.findTransactionById(id);
    }
}
