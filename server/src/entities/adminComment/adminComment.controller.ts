import { Controller, Post, Param, Body, Get, Delete } from '@nestjs/common';
import { AdminCommentService } from './adminComment.service';
import { CreateAdminCommentDto } from './adminComment.dto';
import { AdminComment } from './adminComment.entity';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('api/chats/:chatId/comments')
export class AdminCommentController {
  constructor(private readonly adminCommentService: AdminCommentService) {}

  @Post()
  @ApiOperation({ summary: 'Добавление комментария администратора к чату' })
  @ApiResponse({
    status: 201,
    description: 'Комментарий успешно добавлен',
    type: AdminComment,
  })
  @ApiBody({
    description: 'Данные для создания комментария администратора',
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string', example: 'Комментарий о чате' },
        author: { type: 'string', example: 'admin-uuid' },
      },
    },
  })
  async addComment(
    @Param('chatId') chatId: string,
    @Body() createAdminCommentDto: CreateAdminCommentDto,
  ): Promise<AdminComment> {
    return this.adminCommentService.addComment(chatId, createAdminCommentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Получение всех комментариев администратора для чата',
  })
  @ApiResponse({
    status: 200,
    description: 'Список комментариев успешно получен',
    type: [AdminComment],
  })
  async getCommentsByChat(
    @Param('chatId') chatId: string,
  ): Promise<AdminComment[]> {
    return this.adminCommentService.findCommentsByChat(chatId);
  }
  @Delete(':commentId')
  @ApiOperation({ summary: 'Удаление комментария администратора по ID' })
  @ApiResponse({ status: 200, description: 'Комментарий успешно удален' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  async deleteComment(
    @Param('commentId') commentId: string,
  ): Promise<{ message: string }> {
    await this.adminCommentService.deleteCommentById(commentId);
    return { message: `Comment with ID ${commentId} successfully deleted.` };
  }
}
