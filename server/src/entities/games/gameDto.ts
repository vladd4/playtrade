import {IsUUID, IsString, IsOptional, IsArray} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { File as MulterFile } from 'multer';

export class GameDto {

    @ApiProperty({ example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56', description: 'Уникальный идентификатор игры' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 'Chess', description: 'Название игры' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'A classic strategy game', description: 'Описание игры', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: ['PC', 'PS4', 'XBOX'], description: 'Платформы, доступные для игры', isArray: true })
    @IsArray()
    platforms?: string[];

    @ApiProperty({ example: ['Europe', 'NA'], description: 'Сервера, доступные для игры', isArray: true })
    @IsArray()
    servers?: string[];

    @ApiProperty({ example: ['Europe', 'NA'], description: 'Регионы, доступные для игры', isArray: true })
    @IsArray()
    region?: string[];

    @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Аватарка игры' })
    @IsOptional()
    photo?: MulterFile;
}
