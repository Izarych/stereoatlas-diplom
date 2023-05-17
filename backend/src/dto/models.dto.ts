import {ApiProperty} from "@nestjs/swagger";

export class ModelsDto {
    @ApiProperty({example: 'senecio', description: 'Название модели'})
    readonly name: string;
}