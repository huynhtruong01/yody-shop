import { BaseEntity } from '../entities'
import { User } from '../users/users.schema'
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
export class Role extends BaseEntity {
    @ApiProperty()
    @Prop({
        required: true,
        unique: true,
    })
    name: string

    @ApiProperty()
    @Prop({
        required: true,
    })
    description: string

    @ApiProperty()
    @Prop({
        type: String,
    })
    slug: string

    @Prop({
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    })
    @ApiProperty({
        type: User,
        isArray: true,
    })
    users: User[] | string[]
}

export const RoleSchema = SchemaFactory.createForClass(Role)
RoleSchema.pre<Role>('save', async function (next) {
    this.slug = generateSlug(this.name)
    next()
})
