import { Module } from '@nestjs/common';
import { TexturesService } from './textures.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Models} from "../models.model";
import {Textures} from "./textures.model";

@Module({
  providers: [TexturesService],
  imports: [
      SequelizeModule.forFeature([Models, Textures])
  ],
  exports: [
      TexturesService
  ]
})
export class TexturesModule {}
