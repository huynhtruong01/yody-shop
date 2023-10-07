import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SubCategory } from './sub-category.schema'
import mongoose from 'mongoose'
import { IAllQuery } from '../models'
import { configThrowError, handleQuery } from '../utils'
import { StatusCode } from '../enums'

const populate = ['categoryParents']

@Injectable()
export class SubCategoryService {
    constructor(
        @InjectModel(SubCategory.name)
        private readonly subCategoryModel: mongoose.Model<SubCategory>
    ) {}

    async findAll(query: IAllQuery) {
        const { filters, limit, skip, select, sort } = handleQuery(query)
        const subCategories = await this.subCategoryModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select(select)
            .populate(populate)

        const total = await this.subCategoryModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .count()

        return [subCategories, total]
    }

    async findOne(id: string) {
        const subCategory = await this.subCategoryModel.findById(id)
        if (!subCategory) throw new NotFoundException('Không tìm thấy sub category')
        return subCategory
    }

    async create(data: Partial<SubCategory>) {
        try {
            const subCategory = new this.subCategoryModel(data)
            await subCategory.save()
            return subCategory
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async delete(id: string) {
        try {
            const subCategory = await this.subCategoryModel.findByIdAndDelete(id)
            if (!subCategory) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy sub category này để xóa'
                )
            }
            return subCategory
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
