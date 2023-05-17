import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {SequelizeModule} from "@nestjs/sequelize";
import {Models} from "./models.model";
import {CorsMiddleware} from "./cors/cors.middleware";
import { TexturesModule } from './textures/textures.module';
import {Textures} from "./textures/textures.model";

@Module({
  imports: [
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`
      }),
      SequelizeModule.forRoot({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port:Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        models: [Models, Textures],
        autoLoadModels: true
    }),
      SequelizeModule.forFeature([Models, Textures]),
      TexturesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(CorsMiddleware)
        .forRoutes({path: '*', method: RequestMethod.ALL})
  }
}
