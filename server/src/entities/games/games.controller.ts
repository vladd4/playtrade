import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
  Param,
  Delete, NotFoundException, InternalServerErrorException, Query,
} from '@nestjs/common';
import { Response } from 'express';
import { GamesService } from './games.service';
import { GameDto } from './gameDto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBody, ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {extname, join} from 'path';
import { File as MulterFile } from 'multer';
import {plainToInstance} from "class-transformer";

@ApiTags('api/games')
@ApiBearerAuth()
@Controller('api/games')
@UseGuards(AuthGuard('jwt'))
export class GamesController {
  private readonly logger = new Logger(GamesController.name);

  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой игры' })
  @ApiResponse({
    status: 201,
    description: 'Игра успешно создана',
    type: GameDto,
  })
  @ApiResponse({ status: 500, description: 'Ошибка при создании игры' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './api/uploads/gamePhoto',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createGame(
    @Body() createGameDto: GameDto,
    @UploadedFile() photo: MulterFile,
    @Res() res: Response,
  ): Promise<Response> {
    this.logger.log('Received request to create a new game');
    try {
      const newGame = await this.gamesService.createGame(createGameDto, photo);
      this.logger.log(`Game created with ID: ${newGame.id}`);
      return res.status(HttpStatus.CREATED).json(newGame);
    } catch (e) {
      this.logger.error('Error creating game', e.stack);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating game' });
    }
  }
  @Get(':gameId')
  @ApiOperation({ summary: 'Получение информации об игре по ID' })
  @ApiParam({
    name: 'gameId',
    description: 'ID игры, которую нужно получить',
    example: 'c9b1a16e-5f2f-46b3-b8e4-79f4162b2c56',
  })
  @ApiResponse({
    status: 200,
    description: 'Игра успешно получена',
    type: GameDto,
  })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  async getGameById(
      @Param('gameId') gameId: string,
      @Res() res: Response,
  ): Promise<Response> {
    this.logger.log(`Получение информации об игре с ID: ${gameId}`);
    try {
      const game = await this.gamesService.getGameById(gameId);
      if (!game) {
        this.logger.warn(`Игра с ID: ${gameId} не найдена`);
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Игра не найдена' });
      }
      this.logger.log(`Игра с ID: ${gameId} успешно получена`);
      return res.status(HttpStatus.OK).json(game);
    } catch (error) {
      this.logger.error(`Ошибка при получении игры с ID: ${gameId}`, error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Ошибка при получении игры' });
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление игры с загрузкой одной картинки' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
      FileInterceptor('photo', {
        storage: diskStorage({
          destination: './api/uploads/gamePhoto',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
      }),
  )
  @ApiResponse({ status: 200, description: 'Игра успешно обновлена', type: GameDto })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Название игры' },
        description: { type: 'string', description: 'Описание игры' },
        platforms: { type: 'array', items: { type: 'string' }, description: 'Платформы' },
        servers: { type: 'array', items: { type: 'string' }, description: 'Серверы' },
        region: { type: 'array', items: { type: 'string' }, description: 'Регионы' },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Файл с изображением игры',
        },
      },
    },
  })
  async updateGame(
      @Param('id') id: string,
      @Body() updateGameDto: GameDto,
      @UploadedFile() photo?: MulterFile,
  ): Promise<GameDto> {
    try {
      const game = await this.gamesService.getGameById(id);
      if (!game) {
        throw new NotFoundException('Игра не найдена');
      }

      console.log('Uploaded file:', photo); // Проверка загрузки файла

      if (photo) {
        game.photoPath = `/api/uploads/gamePhoto/${photo.filename}`;
      }

      Object.assign(game, updateGameDto);
      const updatedGame = await this.gamesService.updateGame(id, game, photo ? photo : undefined);

      return updatedGame;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при обновлении игры');
    }
  }


  @Put(':id/platforms')
  @ApiOperation({ summary: 'Добавление новых платформ в игру' })
  @ApiResponse({ status: 200, description: 'Платформы успешно добавлены' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  async addPlatforms(
    @Param('id') gameId: string,
    @Body('platforms') platforms: string[],
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedGame = await this.gamesService.addPlatformsToGame(
        gameId,
        platforms,
      );
      return res.status(HttpStatus.OK).json(updatedGame);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }

  @Put(':id/servers')
  @ApiOperation({ summary: 'Добавление новых серверов в игру' })
  @ApiResponse({ status: 200, description: 'Серверы успешно добавлены' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  async addServers(
    @Param('id') gameId: string,
    @Body('servers') servers: string[],
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedGame = await this.gamesService.addServersToGame(
        gameId,
        servers,
      );
      return res.status(HttpStatus.OK).json(updatedGame);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }
  @Get()
  @ApiOperation({ summary: 'Получение списка всех игр' })
  @ApiResponse({
    status: 200,
    description: 'Список игр успешно получен',
    type: [GameDto],
  })
  @ApiResponse({ status: 500, description: 'Ошибка при получении списка игр' })
  async getGames(): Promise<GameDto[]> {
    this.logger.log('Received request to get all games');
    try {
      const games = await this.gamesService.getGames();
      this.logger.log(`Returning ${games.length} games`);
      return games;
    } catch (e) {
      this.logger.error('Error retrieving games', e.stack);
      throw new InternalServerErrorException('Error retrieving games');
    }
  }
  @Delete(':gameId/platforms/:platform')
  @ApiOperation({ summary: 'Удаление платформы из игры' })
  @ApiParam({
    name: 'gameId',
    description: 'ID игры',
    example: '8f6160c1-dbe4-48dd-ae32-f581ad8c5f1d',
  })
  @ApiParam({
    name: 'platform',
    description: 'Название платформы для удаления',
    example: 'PS4',
  })
  @ApiResponse({ status: 200, description: 'Платформа успешно удалена' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка при удалении платформы' })
  @ApiBody({
    schema: {
      example: {
        method: 'DELETE',
        url: '/games/8f6160c1-dbe4-48dd-ae32-f581ad8c5f1d/platforms/PS4',
        description:
          'Удаление платформы PS4 из игры с ID 8f6160c1-dbe4-48dd-ae32-f581ad8c5f1d',
      },
    },
  })
  async removePlatform(
    @Param('gameId') gameId: string,
    @Param('platform') platform: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedGame = await this.gamesService.removePlatform(
        gameId,
        platform,
      );
      return res.status(HttpStatus.OK).json(updatedGame);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Ошибка при удалении платформы',
        details: error.message,
      });
    }
  }

  @Delete(':gameId/servers/:server')
  @ApiOperation({ summary: 'Удаление сервера из игры' })
  @ApiParam({
    name: 'gameId',
    description: 'ID игры',
    example: '8f6160c1-dbe4-48dd-ae32-f581ad8c5f1d',
  })
  @ApiParam({
    name: 'server',
    description: 'Название сервера для удаления',
    example: 'EU',
  })
  @ApiResponse({ status: 200, description: 'Сервер успешно удален' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка при удалении сервера' })
  @ApiBody({
    schema: {
      example: {
        method: 'DELETE',
        url: '/games/8f6160c1-dbe4-48dd-ae32-f581ad8c5f1d/servers/EU',
        description:
          'Удаление сервера EU из игры с ID 8f6160c1-dbe4-48dd-ae32-f581ad8c5f1d',
      },
    },
  })
  async removeServer(
    @Param('gameId') gameId: string,
    @Param('server') server: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedGame = await this.gamesService.removeServer(gameId, server);
      return res.status(HttpStatus.OK).json(updatedGame);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Ошибка при удалении сервера',
        details: error.message,
      });
    }
  }
  @Put(':id/regions')
  @ApiOperation({ summary: 'Добавление новых регионов в игру' })
  @ApiResponse({ status: 200, description: 'Регионы успешно добавлены' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  async addRegions(
      @Param('id') gameId: string,
      @Body('regions') regions: string[],
      @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedGame = await this.gamesService.addRegionsToGame(
          gameId,
          regions,
      );
      return res.status(HttpStatus.OK).json(updatedGame);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }

  @Delete(':gameId/regions/:region')
  @ApiOperation({ summary: 'Удаление региона из игры' })
  @ApiParam({
    name: 'gameId',
    description: 'ID игры',
    example: '8f6160c1-dbe4-48dd-ae32-f581ad8c5f1d',
  })
  @ApiParam({
    name: 'region',
    description: 'Название региона для удаления',
    example: 'Europe',
  })
  @ApiResponse({ status: 200, description: 'Регион успешно удален' })
  @ApiResponse({ status: 404, description: 'Игра не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка при удалении региона' })
  @ApiBody({
    schema: {
      example: {
        method: 'DELETE',
        url: '/games/8f6160c1-dbe4-48dd-ae32-f581ad8c5f1d/regions/Europe',
        description:
            'Удаление региона Europe из игры с ID 8f6160c1-dbe4-48dd-ae32-f581ad8c5f1d',
      },
    },
  })
  async removeRegion(
      @Param('gameId') gameId: string,
      @Param('region') region: string,
      @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedGame = await this.gamesService.removeRegion(gameId, region);
      return res.status(HttpStatus.OK).json(updatedGame);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Ошибка при удалении региона',
        details: error.message,
      });
    }
  }
  @Get('admin/search')
  @ApiOperation({ summary: 'Поиск игр по названию' })
  @ApiQuery({
    name: 'name',
    description: 'Название игры для поиска',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Игры успешно найдены',
    type: [GameDto],
  })
  @ApiResponse({ status: 404, description: 'Игры не найдены' })
  @ApiResponse({ status: 500, description: 'Ошибка при поиске игр' })
  async searchGamesByName(
      @Query('name') name: string
  ): Promise<GameDto[]> {
    if (!name) {
      throw new NotFoundException('Название игры должно быть указано');
    }

    try {
      const cleanName = name.trim().toLowerCase();
      const games = await this.gamesService.findByName(cleanName);

      if (!games.length) {
        return [];
      }

      return plainToInstance(GameDto, games);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при поиске игр');
    }
  }
  @Get('sort/alphabetical')
  @ApiOperation({ summary: 'Сортировка игр по названию (английский алфавит)' })
  @ApiResponse({
    status: 200,
    description: 'Игры успешно отсортированы',
    type: [GameDto],
  })
  @ApiResponse({ status: 500, description: 'Ошибка при сортировке игр' })
  async getGamesSortedAlphabetically(
      @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<GameDto[]> {
    try {
      const games = await this.gamesService.findAllSortedByName(order);

      return plainToInstance(GameDto, games);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при сортировке игр');
    }
  }
}
