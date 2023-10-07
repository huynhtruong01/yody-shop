import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../users/users.schema'
import mongoose from 'mongoose'
import { Comment } from '../comments/comments.schema'
import { ApiProperty } from '@nestjs/swagger'
import { ReportType } from '../enums'
import { IReportType } from '../models'

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
export class Report {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    @ApiProperty({
        type: User,
    })
    user: string | User

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
    })
    @ApiProperty({
        type: Comment,
    })
    comment: string | Comment

    @Prop({
        enum: ReportType,
        required: true,
    })
    @ApiProperty({
        enum: ReportType,
    })
    type: IReportType

    @Prop({
        type: String,
        required: true,
    })
    @ApiProperty({
        type: String,
    })
    content: string
}

export const ReportSchema = SchemaFactory.createForClass(Report)
