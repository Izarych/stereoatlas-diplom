import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Textures} from "./textures.model";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class TexturesService {
    constructor(@InjectModel(Textures) private texturesRepository: typeof Textures) {
    }

    async createTexture(file): Promise<Textures> {
        try {
            const fileName = file.originalname;
            const filePath: string = path.resolve(__dirname, '..', '..', '..', 'frontend', 'models')
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return await this.texturesRepository.create({texture: fileName});
        } catch(e) {
            throw e;
        }
    }
}
