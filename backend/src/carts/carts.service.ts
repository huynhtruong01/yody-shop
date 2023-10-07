import { CreateItemCartDto, ItemCartDto } from './dtos'
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Cart, IItemCart } from './carts.schema'
import { configThrowError } from '../utils'
import { StatusCode } from '../enums'

const populate = ['user', 'items.product', 'items.color', 'items.size']

@Injectable()
export class CartsService {
    constructor(
        @InjectModel(Cart.name) private readonly cartModel: mongoose.Model<Cart>
    ) {}

    async findAllByUserIdAndCount(userId: string) {
        const carts = await this.cartModel
            .find({ user: userId })
            .sort({
                createdAt: -1,
            })
            .populate(populate)
        const total = await this.cartModel.find({ user: userId }).count()

        return { carts, total: total }
    }

    async findOne(id: string) {
        const cart = await this.cartModel.findById(id)
        if (!cart) configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy cart này')
        return cart
    }

    async findOneByUser(userId: string) {
        const cart = await this.cartModel.findOne({ user: userId })
        if (!cart) return null
        return cart
    }

    async updateQuantities(
        id: string,
        productId: string,
        colorId: string,
        sizeId: string,
        quantities: number
    ) {
        const cart = await this.cartModel.findOneAndUpdate(
            {
                user: id,
                'items.color': colorId,
                'items.size': sizeId,
                'items.product': new mongoose.Types.ObjectId(productId),
            },
            {
                $inc: {
                    'items.$.quantities': quantities,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
        if (!cart) {
            configThrowError(
                StatusCode.NOT_FOUND,
                'Không tìm thấy cart này để cập nhật số lượng'
            )
        }
        return cart
    }

    async create(data: Partial<CreateItemCartDto>) {
        const cartUser = await this.findOneByUser(data.user)
        try {
            if (!cartUser) {
                const cart = new this.cartModel({ user: data.user, items: [data.item] })
                await cart.save()
                return cart.populate(populate)
            } else {
                const findCart = cartUser.items.find((c) => {
                    return (
                        c.product.toString() === data.item.product.toString() &&
                        c.color.toString() === data.item.color.toString() &&
                        c.size.toString() === data.item.size.toString()
                    )
                })
                let cart: any
                if (findCart) {
                    cart = await this.updateQuantities(
                        cartUser.user as string,
                        findCart.product as string,
                        findCart.color as string,
                        findCart.size as string,
                        data.item.quantities
                    )
                } else {
                    cart = await this.cartModel.findOneAndUpdate(
                        { user: data.user },
                        {
                            $push: {
                                items: data.item,
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    )
                }
                return cart.populate(populate)
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateItems(id: string, userId: string, items: IItemCart[]) {
        const cart = await this.findOneByUser(userId)
        try {
            cart.items = items
            const newCart = await this.cartModel.findOneAndUpdate(
                { _id: id, user: userId },
                {
                    $set: {
                        ...cart,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            return newCart
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateItem(userId: string, item: ItemCartDto) {
        const cart = await this.findOneByUser(userId)
        try {
            const newItems = [...(cart.items || [])]
            const indexItem = newItems.findIndex(
                (i) => i.product.toString() === item.product.toString()
            )
            if (indexItem > -1) {
                newItems[indexItem] = item as IItemCart
                const newCart = await this.cartModel.findOneAndUpdate(
                    { user: userId },
                    {
                        items: newItems,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                )

                return newCart
            }

            throw new BadRequestException('Không tìm thấy item để cập nhật')
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async deleteItem(id: string, itemId: string) {
        const cart = await this.findOneByUser(id)
        const newItems = [...cart.items]
        const idx = newItems.findIndex((i) => i._id.toString() === itemId.toString())
        try {
            if (idx > -1) {
                newItems.splice(idx, 1)
                if (newItems.length === 0) {
                    await this.cartModel.findByIdAndDelete(cart._id)
                    return {}
                } else {
                    const newCart = await this.cartModel.findOneAndUpdate(
                        {
                            user: id,
                        },
                        {
                            $set: {
                                items: newItems,
                            },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    )
                    return newCart.populate(populate)
                }
            }
            throw new BadRequestException('Không tìm thấy item này để xóa')
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(id: string) {
        try {
            const cart = await this.cartModel.findByIdAndDelete(id)
            if (!cart) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy cart này để xóa')
            }
            return cart
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async deleteByUser(userId: string) {
        try {
            const cart = await this.cartModel.findOneAndDelete({
                user: userId,
            })
            if (!cart) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy cart bằng id user này để xóa'
                )
            }
            return cart
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
