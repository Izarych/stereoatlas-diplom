import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Textures} from "./textures/textures.model";
import {ApiProperty} from "@nestjs/swagger";


@Table({tableName: 'models'})
export class Models extends Model<Models> {
    @ApiProperty({example: 1, description: 'id модели'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'senecio', description: 'название модели'})
    @Column({type: DataType.TEXT, allowNull: false})
    name: string;

    @HasMany(() => Textures)
    textures: Textures[];
}