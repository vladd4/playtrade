import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('api/photo')
@UseGuards(AuthGuard('jwt'))
@Controller('api/photo')
export class ChatImageUploadController {
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './api/uploads/chat-images',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Загрузка изображения в чат' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Файл изображения',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Изображение успешно загружено и возвращен URL',
    schema: {
      example: {
        imageUrl: 'http://localhost:3001/uploads/chat-images/unique-image.jpg',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Ошибка при загрузке изображения' })
  async uploadImage(@UploadedFile() file: Multer.File) {
    if (!file) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Ошибка при загрузке изображения',
      };
    }

    const imageUrl = `https://gamebuzz.com.ua/api/uploads/chat-images/${file.filename}`;
    return {
      statusCode: HttpStatus.CREATED,
      imageUrl,
    };
  }

  @Delete('delete-image/:imageName')
  @ApiOperation({ summary: 'Удаление изображения по имени файла' })
  @ApiParam({
    name: 'imageName',
    description: 'Имя файла изображения для удаления',
    example: 'unique-image.jpg',
  })
  @ApiResponse({ status: 200, description: 'Изображение успешно удалено' })
  @ApiResponse({ status: 404, description: 'Изображение не найдено' })
  @ApiResponse({ status: 500, description: 'Ошибка при удалении изображения' })
  async deleteImage(@Param('imageName') imageName: string) {
    const imagePath = path.join(
      process.cwd(),
      'api/uploads/chat-images',
      imageName,
    );

    console.log('Путь к изображению:', imagePath);

    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        return {
          statusCode: HttpStatus.OK,
          message: 'Изображение успешно удалено',
        };
      } catch (err) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Ошибка при удалении изображения',
        };
      }
    } else {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Изображение не найдено',
      };
    }
  }
}
