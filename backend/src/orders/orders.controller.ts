import { Controller, Param, Get, Post, Body, Delete, Request } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { Order } from './orders.schema'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { CartsService } from '../carts/carts.service'
import { RequestUser } from '../models'
import { UsersService } from '../users/users.service'
import { ProductsService } from '../products/products.service'

@ApiSecurity('JWT-auth')
@Controller('orders')
@ApiTags('Order')
export class OrdersController {
    constructor(
        private readonly orderService: OrdersService,
        private readonly cartService: CartsService,
        private readonly userService: UsersService,
        private readonly productService: ProductsService
    ) {}

    @Get('/')
    async getAllOrders() {
        const [orders, total] = await this.orderService.findAllAndCount()

        return {
            orders,
            total,
        }
    }

    @Get('/:userId')
    async getAllOrdersByUserId(@Param('userId') id: string) {
        const [orders, total] = await this.orderService.findAllByUserIdAndCount(id)
        return {
            orders,
            total,
        }
    }

    @Post('/')
    async createOrder(@Body() data: Partial<Order>, @Request() req: RequestUser) {
        const order = await this.orderService.create(data)
        await this.userService.updateAny(req.user._id, {
            $push: { orders: { $each: [order._id], $position: 0 } },
        })
        const { carts } = await this.cartService.findAllByUserIdAndCount(req.user._id)
        const ids = carts.map((c) => c._id)
        await this.userService.updateAny(req.user._id, {
            $pullAll: {
                carts: ids,
            },
        })
        await this.cartService.deleteByUser(req.user._id)
        for (const item of data.items) {
            await this.productService.updateAny(item.product as string, {
                $inc: {
                    unitsSold: item.quantities,
                },
                $addToSet: { usersSold: req.user._id },
            })
        }
        return {
            message: 'Tạo đơn hàng thành công',
            order,
        }
    }

    @Delete('/all')
    async deleteAllOrders() {
        const orders = await this.orderService.deleteAll()
        return {
            orders,
            message: `Xóa tất cả đơn hàng thành công`,
        }
    }

    @Delete('/:orderId')
    async deleteOrder(@Param('orderId') id: string) {
        const order = await this.orderService.delete(id)
        return {
            order,
            message: `Xóa đơn hàng bằng id ${order._id} thành công`,
        }
    }
}
