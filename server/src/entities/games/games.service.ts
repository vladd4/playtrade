import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { GameDto } from './gameDto';
import { plainToClass } from 'class-transformer';
import { join } from 'path';
import { File as MulterFile } from 'multer';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async createGame(gameDto: GameDto, photo?: MulterFile): Promise<Game> {
    this.logger.log(`Creating a new game with name: ${gameDto.name}`);

    gameDto.platforms = JSON.parse(gameDto.platforms as unknown as string);
    gameDto.servers = JSON.parse(gameDto.servers as unknown as string);
    gameDto.region = JSON.parse(gameDto.region as unknown as string);

    const game = plainToClass(Game, gameDto);

    if (photo) {
      game.photoPath = join('api', 'uploads', 'gamePhoto', photo.filename);
    }

    const savedGame = await this.gameRepository.save(game);

    this.logger.log(`Game created with ID: ${savedGame.id}`);
    return savedGame;
  }

  async getGameById(gameId: string): Promise<Game> {
    this.logger.log(`Поиск игры с ID: ${gameId}`);
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Игра с ID: ${gameId} не найдена`);
    }
    return game;
  }

  async updateGame(
    id: string,
    gameDto: GameDto,
    photo?: MulterFile,
  ): Promise<Game> {
    console.log('Received photo:', photo);
    if (photo) {
      console.log('Photo filename:', photo.filename);
    }
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (typeof gameDto.platforms === 'string') {
      gameDto.platforms = JSON.parse(gameDto.platforms);
    }

    if (typeof gameDto.servers === 'string') {
      gameDto.servers = JSON.parse(gameDto.servers);
    }

    if (typeof gameDto.region === 'string') {
      gameDto.region = JSON.parse(gameDto.region);
    }

    if (photo) {
      game.photoPath = join('api', 'uploads', 'gamePhoto', photo.filename);
    }
    game.name = gameDto.name;
    game.description = gameDto.description;
    game.platforms = gameDto.platforms;
    game.servers = gameDto.servers;
    game.region = gameDto.region;

    return this.gameRepository.save(game);
  }

  async getGames(): Promise<Game[]> {
    this.logger.log('Retrieving all games, sorted by newest first');
    const games = await this.gameRepository.find({
      order: {
        createdAt: 'DESC', // Сортируем по новизне (по убыванию даты создания)
      },
    });
    this.logger.log(`Retrieved ${games.length} games`);
    return games;
  }

  async addPlatformsToGame(
    gameId: string,
    newPlatforms: string[],
  ): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    game.platforms = Array.from(
      new Set([...(game.platforms || []), ...newPlatforms]),
    );

    return this.gameRepository.save(game);
  }
  async addServersToGame(gameId: string, newServers: string[]): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    game.servers = Array.from(
      new Set([...(game.servers || []), ...newServers]),
    );

    return this.gameRepository.save(game);
  }
  async removePlatform(gameId: string, platform: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException('Игра не найдена');
    }

    game.platforms = game.platforms.filter(
      (existingPlatform) => existingPlatform !== platform,
    );

    return this.gameRepository.save(game);
  }

  async removeServer(gameId: string, server: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException('Игра не найдена');
    }

    game.servers = game.servers.filter(
      (existingServer) => existingServer !== server,
    );

    return this.gameRepository.save(game);
  }
  async addRegionsToGame(gameId: string, newRegions: string[]): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    game.region = Array.from(new Set([...(game.region || []), ...newRegions]));

    return this.gameRepository.save(game);
  }

  async removeRegion(gameId: string, region: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    game.region = game.region.filter(
      (existingRegion) => existingRegion !== region,
    );

    return this.gameRepository.save(game);
  }
  async findByName(name: string): Promise<Game[]> {
    return this.gameRepository
      .createQueryBuilder('game')
      .where('LOWER(game.name) LIKE :name', { name: `%${name}%` })
      .getMany();
  }
  async findAllSortedByName(order: 'ASC' | 'DESC' = 'ASC'): Promise<Game[]> {
    return this.gameRepository
      .createQueryBuilder('game')
      .orderBy('game.name', order)
      .getMany();
  }
}
