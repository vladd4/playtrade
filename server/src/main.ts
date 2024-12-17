import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { TelegrafService } from './bot/bot';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('PlayTrade API')
    .setDescription('API для PlayTrade Marketplace')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(express.static(join(__dirname, '..', 'public')));

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: ['http://localhost:3000', 'https://playtrade.pp.ua'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-Session-Token',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  });
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'api/uploads'), {
    prefix: '/api/uploads',
  });

  const PORT = process.env.PORT || 2000;
  /*const server*/ await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });

  const telegramService = app.get(TelegrafService);
  telegramService.getBot();
}
bootstrap();
