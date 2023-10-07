/*
- user
- address
- phoneNumber
- status: PENDING
- paymentMethod: VNPAY & MOMO & PAYPAL
- isPayment: boolean
- items: [{
    product,
    quantities
}]
- subTotal
- shippingFee
- total

 */

import { IItemCart } from '../carts/carts.schema'
import { PaymentMethodOrder, StatusOrder } from '../enums'
import { IAddress, IPaymentMethodOrder, IStatusOrder } from '../models'
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
export class Order {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    user: User

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    fullName: string

    @Prop({
        type: String,
        required: true,
        trim: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    })
    emailAddress: string

    @Prop({
        type: Object,
        required: true,
    })
    address: IAddress

    @Prop({
        type: String,
        required: true,
        trim: true,
        match: /^([+]\d{2})?\d{10}$/,
    })
    phoneNumber: string

    @Prop({
        type: String,
    })
    noteAddress?: string

    @Prop({
        type: String,
        enum: StatusOrder,
        default: StatusOrder.PENDING,
    })
    @ApiProperty({
        required: false,
        default: StatusOrder.PENDING,
    })
    status: IStatusOrder

    @Prop({
        type: String,
        enum: PaymentMethodOrder,
        default: PaymentMethodOrder.CASH,
    })
    @ApiProperty({
        required: false,
        default: PaymentMethodOrder.CASH,
    })
    paymentMethod: IPaymentMethodOrder

    @Prop({
        type: String,
        default: false,
    })
    @ApiProperty({
        required: false,
        default: false,
    })
    isPayment: boolean

    @Prop({
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
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
                quantities: {
                    type: Number,
                    min: 1,
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

    @Prop({
        type: Number,
        required: true,
    })
    @ApiProperty()
    subTotal: number

    @Prop({
        type: Number,
        required: true,
    })
    @ApiProperty()
    shippingFee: number

    @Prop({
        type: Number,
        required: true,
    })
    @ApiProperty()
    total: number
}

export const OrderSchema = SchemaFactory.createForClass(Order)
