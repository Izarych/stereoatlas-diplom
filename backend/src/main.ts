import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from "@nestjs/swagger";
import {INestApplication} from "@nestjs/common";

async function bootstrap() : Promise<void> {
  const app : INestApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 5000;
  const config : Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle('Документация сервера')
      .setDescription('Документация серверной части приложения')
      .setVersion('1.0.0')
      .addTag('stereoatlas-backend')
      .build();
  const document : OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(PORT, () => console.log(`Server is started on PORT: ${PORT}`));
}
bootstrap();
