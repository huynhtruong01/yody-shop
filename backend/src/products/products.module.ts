import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './products.schema'
import { ColorsModule } from '../colors/colors.module'
import { CategoriesModule } from '../categories/categories.module'
import { UsersModule } from '../users/users.module'

@Module({
    providers: [ProductsService],
    controllers: [ProductsController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Product.name,
                schema: ProductSchema,
            },
        ]),
        ColorsModule,
        CategoriesModule,
        UsersModule,
    ],
    exports: [ProductsService],
})
export class ProductsModule {}
