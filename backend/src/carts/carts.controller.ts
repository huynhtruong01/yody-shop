import { IItemCart } from './carts.schema'
import { CartsService } from './carts.service'
import { CreateItemCartDto, ItemCartDto } from './dtos'
import { RequestUser } from '../models'
import { UsersService } from '../users/users.service'
import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

export interface IParamsCart {
    cartId?: string
    itemId?: string
}

@ApiSecurity('JWT-auth')
@Controller('carts')
@ApiTags('Cart')
export class CartsController {
    constructor(
        private readonly cartService: CartsService,
        private readonly userService: UsersService
    ) {}

    @Get('/:userId')
    async getAllCartsByUserId(@Param('userId') userId: string) {
        const { carts, total } = await this.cartService.findAllByUserIdAndCount(userId)

        return {
            carts,
            total,
        }
    }

    @Post('/')
    async createCart(
        @Body() data: Partial<CreateItemCartDto>,
        @Request() req: RequestUser
    ) {
        const cart = await this.cartService.create(data)
        await this.userService.updateAny(req.user._id, {
            $push: {
                carts: cart.id,
            },
        })
        return {
            message: 'Create cart successfully',
            cart,
        }
    }

    @Put('/items-list/:cartId')
    async updateItemsCart(
        @Param('cartId') id: string,
        @Body() data: IItemCart[],
        @Request() req: RequestUser
    ) {
        const cart = await this.cartService.updateItems(id, req.user._id, data)
        return {
            message: 'Cập nhập danh sách item thành công',
            cart,
        }
    }

    @Put('/items/:cartId')
    async updateItemCart(@Param('cartId') id: string, @Body() data: ItemCartDto) {
        const cart = await this.cartService.updateItem(id, data)
        return {
            message: 'Cập nhập item thành công',
            cart,
        }
    }

    @Delete('/items/:cartId/:itemId')
    async deleteItemCart(@Param() params: IParamsCart) {
        const { cartId, itemId } = params
        const cart = await this.cartService.deleteItem(cartId, itemId)
        return {
            message: 'Delete item cart successfully',
            cart,
        }
    }

    @Delete('/:cartId')
    async deleteCart(@Param('cartId') id: string) {
        const cart = await this.cartService.delete(id)
        return {
            message: 'Delete cart successfully',
            cart,
        }
    }

    @Delete('/user')
    async deleteCartByUser(@Request() req: RequestUser) {
        const cart = await this.cartService.deleteByUser(req.user._id)
        return {
            message: 'Xóa giỏ hàng bằng userId thành công',
            cart,
        }
    }
}
