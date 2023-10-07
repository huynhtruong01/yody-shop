import { Address, AddressSchema } from '../address/address.schema'
import { Cart } from '../carts/carts.schema'
import { Comment } from '../comments/comments.schema'
import { BaseEntity } from '../entities'
import { Order } from '../orders/orders.schema'
import { Product } from '../products/products.schema'
import { Role } from '../roles/roles.schema'
import { IGender, ITypeRegister, TypeRegister } from './users.model'
import { hashPassword } from '../utils'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import mongoose from 'mongoose'
import { Gender } from '../enums'

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
export class User extends BaseEntity {
    @ApiProperty()
    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    username: string

    @ApiProperty()
    @Prop({
        type: String,
        required: true,
    })
    fullName: string

    @ApiProperty()
    @Prop({
        type: String,
        required: true,
        unique: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    })
    emailAddress: string

    @ApiProperty()
    @Prop({
        type: String,
        default: TypeRegister.EMAIL,
        enum: TypeRegister,
    })
    type: ITypeRegister

    @ApiProperty()
    @Prop({
        type: String,
        required: true,
    })
    password: string

    @ApiProperty()
    @Prop({
        type: String,
        default: process.env.DEFAULT_AVATAR,
    })
    avatar?: string

    @ApiProperty()
    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role',
            },
        ],
        default: process.env.ROLE_DEFAULT,
    })
    roles: Role[] | string[]

    @ApiProperty()
    @Prop({
        type: String,
        default: Gender.OTHER,
        enum: Gender,
    })
    gender?: IGender

    @ApiProperty()
    @Prop({
        type: String,
        default: new Date(),
    })
    dateOfBirth?: Date

    @Prop({
        type: Object,
        default: {},
    })
    @ApiProperty()
    address: Address

    @Prop({
        type: [AddressSchema],
        default: [],
    })
    @ApiProperty()
    addresses: Address[]

    @ApiProperty()
    @Prop({
        type: String,
        unique: true,
        match: /^([+]\d{2})?\d{10}$/,
        default: '',
    })
    phoneNumber: string

    @ApiProperty()
    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ])
    favoriteProducts: Product[]

    @ApiProperty()
    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
        },
    ])
    carts: Cart[]

    @ApiProperty()
    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ])
    orders: Order[]

    @ApiProperty()
    @Prop([
        {
            type: mongoose.Types.ObjectId,
            ref: 'Comment',
        },
    ])
    comments: (Comment | string)[]
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.pre<User>('save', async function (next) {
    this.password = await hashPassword(this.password)
    next()
})
