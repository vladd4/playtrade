import {
    Controller,
    Put,
    HttpStatus,
    UploadedFile,
    UseInterceptors,
    Param,
    UseGuards,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../../entities/users/users.service';
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiParam, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Multer } from 'multer';
import { UserEntity } from "../../entities/users/user.entity";

@ApiTags('api/avatar')
@ApiBearerAuth()
@Controller('api/avatar')
@UseGuards(AuthGuard('jwt'))
export class AvatarController {
    constructor(private readonly usersService: UsersService) {}

    @Put(':id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './api/uploads/avatars',
            filename: (req, file, cb) => {
                const uniqueSuffix = uuidv4() + extname(file.originalname);
                cb(null, `${uniqueSuffix}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return cb(new Error('Разрешены только файлы изображений формата JPG, JPEG, PNG!'), false);
            }
            cb(null, true);
        },
    }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Загрузка аватарки пользователя' })
    @ApiResponse({ status: 200, description: 'Аватар успешно загружен и обновлен', type: UserEntity })
    @ApiResponse({ status: 400, description: 'Неверный формат файла' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера при загрузке аватарки' })
    @ApiParam({ name: 'id', description: 'ID пользователя', type: 'string' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Изображение для загрузки (JPG, JPEG, PNG)',
                },
            },
        },
        description: 'Пример запроса',
        examples: {
            uploadAvatarExample: {
                summary: 'Пример загрузки аватарки',
                description: 'Пример multipart запроса для загрузки аватарки пользователя',
                value: {
                    file: 'file',
                },
            },
        },
    })
    async uploadAvatar(
        @UploadedFile() file: Multer.File,
        @Param('id') id: string,
    ): Promise<any> {
        try {
            if (!file) {
                throw new BadRequestException('Неверный формат файла');
            }

            const updatedUser = await this.usersService.update(id, { avatarPhoto: `/api/uploads/avatars/${file.filename}` });
            return updatedUser;
        } catch (e) {
            throw new InternalServerErrorException('Ошибка при загрузке аватара');
        }
    }
}
