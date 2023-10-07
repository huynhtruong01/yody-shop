import { Module } from '@nestjs/common'
import { ColorsService } from './colors.service'
import { ColorsController } from './colors.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Color, ColorSchema } from './colors.schema'

@Module({
    providers: [ColorsService],
    controllers: [ColorsController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Color.name,
                schema: ColorSchema,
            },
        ]),
    ],
    exports: [ColorsService],
})
export class ColorsModule {}
