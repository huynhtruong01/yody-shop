import { IAddressValue } from './addresses.model'
import { BaseEntity } from '../entities'
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
export class Address extends BaseEntity {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    @ApiProperty()
    user: User | string

    @Prop({
        type: String,
        required: true,
    })
    fullName: string

    @Prop({
        type: String,
        required: true,
        match: /^([+]\d{2})?\d{10}$/,
    })
    phoneNumber: string

    @Prop({
        type: String,
        default: '',
    })
    @ApiProperty({
        default: '',
        required: false,
    })
    street: string

    @Prop({
        type: Object,
        required: true,
    })
    @ApiProperty()
    ward: IAddressValue

    @Prop({
        type: Object,
        required: true,
    })
    @ApiProperty()
    district: IAddressValue

    @Prop({
        type: Object,
        required: true,
    })
    @ApiProperty()
    province: IAddressValue

    @Prop({
        type: Boolean,
    })
    isDefault?: boolean
}

export const AddressSchema = SchemaFactory.createForClass(Address)
