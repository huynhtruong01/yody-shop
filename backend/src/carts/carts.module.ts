import { Module } from '@nestjs/common'
import { CartsService } from './carts.service'
import { CartsController } from './carts.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Cart, CartSchema } from './carts.schema'
import { UsersModule } from '../users/users.module'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
        UsersModule,
    ],
    providers: [CartsService],
    controllers: [CartsController],
    exports: [CartsService],
})
export class CartsModule {}
