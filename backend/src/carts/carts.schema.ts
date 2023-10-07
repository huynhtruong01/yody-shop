/*
- user: ref to User
- [{
    + productId: ref to Product | required
    + quantity: min: 1 | required
}]
*/

export interface IItemCart {
    _id: string
    product: Product | string
    quantities: number
    color: string | Color
    size: string | Size
}

import { Color } from '../colors/colors.schema'
import { Product } from '../products/products.schema'
import { Size } from '../sizes/sizes.schema'
import { User } from '../users/users.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import mongoose from 'mongoose'

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Cart {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    @ApiProperty()
    user: User | string

    @Prop({
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                    unique: true,
                },
                quantities: {
                    type: Number,
                    min: 1,
                    required: true,
                },
                color: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Color',
                    required: true,
                },
                size: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Size',
                    required: true,
                },
            },
        ],
        validate: {
            validator: (items: IItemCart[]) => items.length > 0,
            message: 'Your cart must be at least 1 item',
        },
    })
    @ApiProperty()
    items: IItemCart[]
}

export const CartSchema = SchemaFactory.createForClass(Cart)
CartSchema.virtual<Cart>('dateCart').get(function () {
    return new Date()
})
