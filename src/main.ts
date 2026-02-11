import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Trackio Backend')
    .setDescription('Trackio Backend API - Multi-tenant base project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI with download options
  SwaggerModule.setup('api/v1/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Trackio API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Endpoint to download OpenAPI spec as JSON
  app.use('/api/v1/swagger/json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="openapi-spec.json"',
    );
    res.send(JSON.stringify(document, null, 2));
  });

  // Endpoint to download OpenAPI spec as YAML
  app.use('/api/v1/swagger/yaml', (_req: Request, res: Response) => {
    const yamlSpec = yaml.dump(document, { skipInvalid: true });
    res.setHeader('Content-Type', 'application/x-yaml');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="openapi-spec.yaml"',
    );
    res.send(yamlSpec);
  });

  // Save OpenAPI spec as JSON file
  const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });

  // Save OpenAPI spec as YAML file
  const yamlOutputPath = path.resolve(process.cwd(), 'swagger-spec.yaml');
  const yamlSpec = yaml.dump(document, { skipInvalid: true });
  fs.writeFileSync(yamlOutputPath, yamlSpec, { encoding: 'utf8' });

  logger.log(`📄 OpenAPI JSON spec written to: ${outputPath}`);
  logger.log(`📄 OpenAPI YAML spec written to: ${yamlOutputPath}`);

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.HOST_API}`);
}
bootstrap();
