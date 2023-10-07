import { BaseEntity } from '../entities'
import { Product } from '../products/products.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import mongoose from 'mongoose'

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
})
export class Size extends BaseEntity {
    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    @ApiProperty({
        type: String,
        required: true,
    })
    name: string

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
    })
    @ApiProperty({
        type: Product,
        isArray: true,
    })
    products: (Product | string)[]
}

export const SizeSchema = SchemaFactory.createForClass(Size)
