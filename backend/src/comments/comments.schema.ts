import { Product } from '../products/products.schema'
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
export class Comment {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    @ApiProperty({
        type: User,
    })
    user: User | string

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    })
    @ApiProperty({
        type: Product,
        required: false,
        isArray: true,
        default: [],
    })
    product: Product | string

    @Prop({
        type: String,
        required: true,
        trim: true,
    })
    @ApiProperty({
        type: String,
    })
    comment: string

    @Prop({
        type: Number,
    })
    @ApiProperty({
        type: Number,
        required: false,
        default: 0,
        minimum: 0,
    })
    rating: number

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    })
    @ApiProperty({
        type: Comment,
        required: false,
        default: null,
    })
    commentRoot?: string

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
    reply: Comment[]

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        default: [],
    })
    @ApiProperty({
        required: false,
        default: [],
        type: [User],
    })
    likes?: (User | string)[]
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
