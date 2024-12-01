import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger: Logger = new Logger('API');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS,PATCH',
    allowedHeaders: '*',
    exposedHeaders: 'X-Total-Count',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  /** Swagger document */
  const config = new DocumentBuilder()
    .setTitle('Server')
    .setDescription('Api Documentations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'API Documentation',
  });

  const port = process.env.APP_PORT;

  /** app port */
  await app.listen(port, () =>
    logger.log(
      `Server is listening on port ${port} on ${process.env.APP_ENV} mode`,
    ),
  );
}
bootstrap();
