import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Color } from './colors.schema'
import mongoose from 'mongoose'
import { CommonObject } from '../auth/auth.service'
import { IQuery } from '../models'
import { configThrowError, handleQuery } from '../utils'
import { StatusCode } from '../enums'

@Injectable()
export class ColorsService {
    constructor(@InjectModel(Color.name) private colorModel: mongoose.Model<Color>) {}

    async findAllAndCount(query: IQuery) {
        const { sort, filters, skip, limit } = handleQuery(query)
        const colors = await this.colorModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate(['products'])
        const total = await this.colorModel.find().count()

        return [colors, total]
    }

    async findOne(id: string) {
        const color = await this.colorModel.findById(id)
        if (!color) throw new NotFoundException('Không tìm thấy color này')
        return color
    }

    async create(data: Partial<Color>) {
        try {
            const color = new this.colorModel(data)
            await color.save()

            return color
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update(id: string, data: Partial<Color>) {
        try {
            const newColor = await this.colorModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })
            if (!newColor) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy color này để cập nhật'
                )
            }

            return newColor
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateOne(id: string, data: CommonObject) {
        const color = await this.findOne(id)
        try {
            await color.updateOne(data)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(id: string) {
        try {
            const color = await this.colorModel.findByIdAndDelete(id)
            if (!color) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy color này để xóa')
            }
            return color
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
