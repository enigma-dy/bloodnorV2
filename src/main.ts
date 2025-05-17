import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('BloodDonor API')
    .setDescription('The BloodDonor API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync(
    join(__dirname, '..', 'public', 'openapi.json'),
    JSON.stringify(document),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/docs/',
  });

  app.getHttpAdapter().get('/docs', (_req, res: Response) => {
    res.redirect('/docs/docs.html');
  });

  app.getHttpAdapter().get('/docs/docs.html', (_req, res: Response) => {
    res.sendFile(join(__dirname, '..', 'public', 'docs.html'));
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
