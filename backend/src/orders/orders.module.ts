import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Order, OrderSchema } from './orders.schema'
import { CartsModule } from '../carts/carts.module'
import { UsersModule } from '../users/users.module'
import { ProductsModule } from '../products/products.module'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Order.name,
                schema: OrderSchema,
            },
        ]),
        CartsModule,
        UsersModule,
        ProductsModule,
    ],
    providers: [OrdersService],
    controllers: [OrdersController],
})
export class OrdersModule {}
