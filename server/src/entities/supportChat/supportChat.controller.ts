import {
    Controller,
    Get,
    Param,
    NotFoundException,
    Query,
    Post,
    UseInterceptors,
    UploadedFile, Body, HttpStatus, InternalServerErrorException, BadRequestException
} from '@nestjs/common';
import { SupportChatService } from './supportChat.service';
import {ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery} from '@nestjs/swagger';
import { SupportChat } from './supportChat.entity';
import {UserEntity} from "../users/user.entity";
import {plainToClass} from "class-transformer";
import {AuthGuard} from "@nestjs/passport";
import {FileInterceptor} from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { Multer } from 'multer';
import {SupportChatPhotoService} from "./support-chat-photo.service";

@ApiTags('api/support-chats')
@Controller('api/support-chats')
/*
@UseGuards(AuthGuard('jwt'))
*/
export class SupportChatController {
    constructor(
        private readonly supportChatService: SupportChatService,
        private readonly supportChatPhotoService: SupportChatPhotoService,

    ) {}
    @Get()
    @ApiOperation({ summary: 'Получение всех чатов техподдержки с пагинацией и общим количеством страниц' })
    @ApiQuery({ name: 'limit', required: false, description: 'Количество чатов на странице', type: Number })
    @ApiQuery({ name: 'page', required: false, description: 'Номер страницы', type: Number })
    @ApiResponse({ status: 200, description: 'Список чатов успешно получен', type: [SupportChat] })
    async getAllChats(
        @Query('limit') limit: number = 10,
        @Query('page') page: number = 1,
    ): Promise<any> {
        const { chats, totalCount } = await this.supportChatService.findAllWithPagination(limit, page);
        const totalPages = Math.ceil(totalCount / limit);

        const sanitizedChats = chats.map(chat => ({
            ...chat,
            user: plainToClass(UserEntity, chat.user),
        }));

        return {
            chats: sanitizedChats,
            totalPages,
            currentPage: page,
            totalChats: totalCount,
        };
    }

    @Get(':chatId')
    @ApiOperation({ summary: 'Получение информации о чате техподдержки по ID' })
    @ApiParam({ name: 'chatId', description: 'ID чата техподдержки', type: 'string' })
    @ApiResponse({ status: 200, description: 'Информация о чате успешно получена', type: SupportChat })
    @ApiResponse({ status: 404, description: 'Чат не найден' })
    async getChatById(@Param('chatId') chatId: string) {
        const chat = await this.supportChatService.getChatById(chatId);
        if (!chat) {
            throw new NotFoundException(`Чат с ID ${chatId} не найден`);
        }
        return chat;
    }
    @Post('upload-image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './api/uploads/support-images',
            filename: (req, file, cb) => {
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const fileExt = extname(file.originalname).toLowerCase();

                if (!allowedExtensions.includes(fileExt)) {
                    return cb(new BadRequestException('Invalid file type. Only jpg, jpeg, png and gif are allowed'), null);
                }

                const uniqueSuffix = `${uuidv4()}${fileExt}`;
                cb(null, uniqueSuffix);
            },
        }),
    }))
    async uploadImage(
        @UploadedFile() file: Multer.File,
        @Body('senderId') senderId: string,
        @Body('adminId') adminId: string,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        if (!senderId || !adminId) {
            throw new BadRequestException('senderId and adminId are required');
        }

        try {
            const result = await this.supportChatPhotoService.processPhoto(file, senderId, adminId);

            return {
                statusCode: HttpStatus.CREATED,
                imageUrl: result.imageUrl,
                messageId: result.message.id,
                message: 'Image was successfully uploaded and sent'
            };

        } catch (error) {
            console.error('Error while processing image:', error);

            if (error.status) {
                throw error;
            }

            throw new InternalServerErrorException({
                message: 'Unexpected error while processing image',
                error: error.message,
                details: error.response?.description || null
            });
        }
    }
}
