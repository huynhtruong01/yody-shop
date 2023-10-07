import { Category } from '../categories/categories.schema'
import { BaseEntity } from '../entities'
import { Product } from '../products/products.schema'
import { generateSlug } from '../utils'
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
export class SubCategory extends BaseEntity {
    @Prop({
        type: String,
        required: true,
        lowercase: true,
    })
    @ApiProperty({
        type: String,
        required: true,
    })
    name: string

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
    ])
    @ApiProperty({
        type: Category,
        required: true,
        isArray: true,
        default: [],
    })
    categoryParents: (string | Category)[]

    @Prop({
        type: String,
    })
    @ApiProperty({
        type: String,
        default: '',
        required: false,
    })
    imageUrl?: string

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        default: [],
    })
    @ApiProperty({
        isArray: true,
        required: false,
        default: [],
    })
    products?: Product[]

    @Prop({
        type: String,
    })
    @ApiProperty({
        type: String,
    })
    slug: string
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory)
SubCategorySchema.pre<SubCategory>('save', function (next) {
    this.slug = generateSlug(this.name)
    next()
})
