import {
    Injectable,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Size } from './sizes.schema'
import mongoose from 'mongoose'
import { IQuery } from '../models'
import { configThrowError, handleQuery } from '../utils'
import { StatusCode } from '../enums'

const populate = ['products']

@Injectable()
export class SizesService {
    constructor(@InjectModel(Size.name) private sizeModel: mongoose.Model<Size>) {}

    async findAllAndCount(query: IQuery) {
        const { sort, filters, skip, limit } = handleQuery(query)

        const sizes = await this.sizeModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate(populate)
        const total = await this.sizeModel.find(filters).count()

        return [sizes, total]
    }

    async findOne(id: string) {
        const size = await this.sizeModel.findById(id)
        if (!size) throw new NotFoundException('Không tìm thấy size này')
        return size
    }

    async create(data: Partial<Size>) {
        try {
            const size = await this.sizeModel.create(data)
            return size
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update(id: string, data: Partial<Size>) {
        const size = await this.findOne(id)
        try {
            size.set(data)
            const newSize = await size.save()
            return newSize
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(id: string) {
        try {
            const size = await this.sizeModel.findByIdAndDelete(id)
            if (!size) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy size này để xóa')
            }
            return size
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
