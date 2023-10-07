import { BaseEntity } from '../entities'
import { Product } from '../products/products.schema'
import { SubCategory } from '../sub-category/sub-category.schema'
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
export class Category extends BaseEntity {
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true,
    })
    @ApiProperty()
    name: string

    @Prop({
        type: String,
        default: 'Một sản phẩm đến từ Athetics Store',
    })
    @ApiProperty({
        required: false,
        default: 'Một sản phẩm đến từ Athetics Store',
    })
    description: string

    @Prop({
        type: String,
        required: true,
    })
    @ApiProperty()
    imageUrl: string

    @Prop({
        type: String,
    })
    @ApiProperty()
    slug: string

    // relation subcategory
    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
        },
    ])
    @ApiProperty({
        type: SubCategory,
        isArray: true,
        required: false,
        default: [],
    })
    subCategories: (string | SubCategory)[]

    // relation products
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
}

export const CategorySchema = SchemaFactory.createForClass(Category)
CategorySchema.pre<Category>('save', function (next) {
    this.slug = generateSlug(this.name)
    next()
})
