import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Models} from "../models.model";
import {ApiProperty} from "@nestjs/swagger";


@Table({tableName: 'textures'})
export class Textures extends Model<Textures> {
    @ApiProperty({example: 1, description: 'id текстуры'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'senecio_texture', description: 'Название текстуры'})
    @Column({type: DataType.TEXT})
    texture: string;

    @ApiProperty({example: 1, description: 'id модели с которой связана текстура'})
    @ForeignKey(() => Models)
    @Column
    modelId: number;

    @ApiProperty({example: {
        id: 1,
        name: 'senecio'
        }, description: 'Модель'})
    @BelongsTo(() => Models)
    model: Models;
}