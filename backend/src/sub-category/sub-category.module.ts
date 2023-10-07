import { Module } from '@nestjs/common'
import { SubCategoryService } from './sub-category.service'
import { SubCategoryController } from './sub-category.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { SubCategory, SubCategorySchema } from './sub-category.schema'
import { CategoriesModule } from '../categories/categories.module'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: SubCategory.name,
                schema: SubCategorySchema,
            },
        ]),
        CategoriesModule,
    ],
    providers: [SubCategoryService],
    controllers: [SubCategoryController],
})
export class SubCategoryModule {}
