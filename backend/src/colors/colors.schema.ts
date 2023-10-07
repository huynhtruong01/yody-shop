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
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})
export class Color extends BaseEntity {
    @Prop({
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    })
    @ApiProperty()
    name: string

    @Prop({
        type: String,
        required: true,
        unique: true,
        match: /^#([0-9a-fA-F]{6})$/,
    })
    @ApiProperty()
    value: string

    // relation product
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
        type: [Product],
        required: false,
        default: [],
    })
    products?: Product[]
}

export const ColorSchema = SchemaFactory.createForClass(Color)
