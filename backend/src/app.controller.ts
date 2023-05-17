import {Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { AppService } from './app.service';
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {Models} from "./models.model";
import {ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";
import {ModelsDto} from "./dto/models.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Получение всех моделей' })
  @ApiResponse({ status: 200, type: Models, description: 'Получаем все модели в ответе'})
  @Get()
  async getAllModels() : Promise<Models[]> {
    return this.appService.getAllModels();
  }

  @ApiOperation({summary: 'Добавление моделей'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Массив моделей',
    type: ModelsDto
  })
  @ApiResponse({status: 201, type: Models, description: 'Получаем созданные модели в ответе'})
  @Post()
  @UseInterceptors(FilesInterceptor('models'))
  async addModel(@UploadedFiles() models: Array<Express.Multer.File>): Promise<Models[]> {
    return this.appService.addModel(models);
  }

  @ApiOperation({summary: 'Добавление MTL - файлов'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Массив MTL - файлов',
    type: Array
  })
  @ApiResponse({
    status: 201,
    description: 'Получаем сообщение об успешной загрузке MTL - файлов',
  })
  @Post('/mtl')
  @UseInterceptors(FilesInterceptor('mtl'))
  async addMtlFiles(@UploadedFiles() mtl: Array<Express.Multer.File>) : Promise<{message: string}> {
    return this.appService.addMtl(mtl);
  }

  @ApiOperation({summary: 'Добавление файлов текстур'})
  @ApiParam({
    name: 'name',
    description: 'Название модели',
    example: 'senecio'
      })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Массив файлов текстур',
    type: Array
  })
  @ApiResponse({
    status: 201,
    description: 'Получаем сообщение об успешной загрузке файлов текстур',
  })
  @Post(':name')
  @UseInterceptors(FilesInterceptor('images'))
  async addTexturesToModel(@Param('name') modelName: string, @UploadedFiles() images: Array<Express.Multer.File>) {
    return this.appService.addTexturesToModel(modelName, images);
  }
}
