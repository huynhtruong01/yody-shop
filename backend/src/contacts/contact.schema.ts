import { BaseEntity } from '../entities'
import { User } from '../users/users.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
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
export class Contact extends BaseEntity {
    @Prop({
        type: mongoose.Types.ObjectId,
        ref: 'User',
    })
    user: string | User

    @Prop({
        type: String,
        required: true,
    })
    fullName: string

    @Prop({
        type: String,
        required: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    })
    emailAddress: string

    @Prop({
        type: String,
        required: true,
    })
    content: string

    @Prop({
        type: Boolean,
        default: false,
    })
    isConfirm: boolean
}

export const ContactSchema = SchemaFactory.createForClass(Contact)
