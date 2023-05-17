import {Injectable} from '@nestjs/common';
import {Models} from "./models.model";
import {InjectModel} from "@nestjs/sequelize";
import {TexturesService} from "./textures/textures.service";
import {Textures} from "./textures/textures.model";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class AppService {
  constructor(@InjectModel(Models) private modelsRepository: typeof Models,
              private texturesService: TexturesService) {
  }


  async getAllModels():Promise<Models[]> {
    return this.modelsRepository.findAll({include: {all: true}});
  }

  async addModel(files) : Promise<Models[]>{
    return await Promise.all(
        files.map(async (model): Promise<Models> => {
          return await this.createModel(model);
        })
    );
  }

  async addTexturesToModel(modelName: string, images): Promise<{message: string}> {
      const model : Models = await this.modelsRepository.findOne({where: {name: modelName}})
        const textureNames: string[] = await Promise.all(
            images.map(async (image):Promise<Textures> => {
                return await this.texturesService.createTexture(image);
        }))
        await model.$set('textures', textureNames);
      return {message: 'Текстуры были успешно загружены'}
    }

  private async createModel(file) : Promise<Models> {
    try {
      const fileName = file.originalname;
      const filePath: string = path.resolve(__dirname, '..', '..', 'frontend', 'models')
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      const name = fileName.split('.obj')[0];
      return await this.modelsRepository.create({name: name});
    } catch(e) {
      throw e;
    }
  }

  async addMtl(files): Promise<{message: string}> {
    await Promise.all(
        files.map(async (mtl) : Promise<void> => {
          return await this.createMtl(mtl);
        })
    );
    return {message: 'Mtl были успешно загружены'}
  }

  private async createMtl(file) : Promise<void> {
    try {
      const fileName = file.originalname;
      const filePath: string = path.resolve(__dirname, '..', '..', 'frontend', 'models')
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
    } catch(e) {
      throw e;
    }
  }
}
