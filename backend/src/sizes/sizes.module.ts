import { Module } from '@nestjs/common'
import { SizesController } from './sizes.controller'
import { SizesService } from './sizes.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Size, SizeSchema } from './sizes.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Size.name,
                schema: SizeSchema,
            },
        ]),
    ],
    controllers: [SizesController],
    providers: [SizesService],
})
export class SizesModule {}
