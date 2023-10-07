import { Category } from '../categories/categories.schema'
import { Color } from '../colors/colors.schema'
import { Comment } from '../comments/comments.schema'
import { BaseEntity } from '../entities'
import { SubCategory } from '../sub-category/sub-category.schema'
import { User } from '../users/users.schema'
import { calcPrice, generateSlug } from '../utils'
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
export class Product extends BaseEntity {
    @Prop({
        type: String,
        required: true,
        trim: true,
        unique: true,
    })
    @ApiProperty()
    name: string

    @Prop({
        type: String,
        trim: true,
    })
    @ApiProperty({
        required: false,
    })
    subContent: string

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    @ApiProperty()
    content: string

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    featuredImage: string

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    summary: string

    @Prop({
        type: Number,
        required: true,
    })
    @ApiProperty()
    originPrice: number

    @Prop({
        type: Number,
    })
    @ApiProperty()
    price: number

    @Prop({
        type: Number,
        default: 0,
        min: 0,
    })
    @ApiProperty({
        required: false,
        default: 0,
        minimum: 0,
    })
    discount: number

    @Prop({
        type: [
            {
                type: {
                    color: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Color',
                    },
                    images: [String],
                },
            },
        ],
        required: true,
    })
    @ApiProperty()
    imageUrls: string[]

    @Prop({
        type: Boolean,
        default: false,
    })
    @ApiProperty({
        required: false,
        default: false,
    })
    isFreeShip: boolean

    @Prop({
        type: Number,
        default: 0,
        min: 0,
    })
    @ApiProperty({
        required: false,
        default: 0,
    })
    views: number

    @Prop({
        type: Number,
        default: 0,
    })
    @ApiProperty({
        required: false,
        default: 0,
    })
    ratingAverage: number

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Color',
            },
        ],
        required: true,
    })
    @ApiProperty({
        type: String,
        isArray: true,
    })
    colors: Color[]

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    })
    @ApiProperty()
    category: Category

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
    })
    @ApiProperty()
    subCategory: SubCategory

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Size',
            },
        ],
        required: true,
        validate: {
            validator: (val: []) => val.length > 0,
            message: 'Sizes must be at least 1 size',
        },
    })
    @ApiProperty()
    sizes: string[]

    @Prop({
        type: Number,
        required: true,
        min: 10,
    })
    @ApiProperty()
    availableQuantities: number

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        default: [],
    })
    @ApiProperty({
        type: Comment,
        required: false,
        isArray: true,
        default: [],
    })
    comments?: Comment[]

    @Prop({
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
    })
    @ApiProperty({
        type: User,
        required: false,
        isArray: true,
        default: [],
    })
    likes: (User | string)[]

    @Prop({
        type: Number,
        default: 0,
        min: 0,
    })
    @ApiProperty({
        type: Number,
        required: false,
        default: 0,
        minimum: 0,
    })
    unitsSold: number

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
        },
    ])
    @ApiProperty({
        type: User,
        required: false,
        isArray: true,
        default: [],
    })
    usersSold: (string | User)[]

    @Prop({
        type: String,
    })
    @ApiProperty()
    slug: string
}

export const ProductSchema = SchemaFactory.createForClass(Product)
ProductSchema.pre<Product>('save', function (next) {
    this.price = calcPrice(this.originPrice, this.discount)
    this.slug = generateSlug(this.name)
    next()
})
