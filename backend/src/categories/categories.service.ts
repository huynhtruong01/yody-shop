import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Category } from './categories.schema'
import mongoose from 'mongoose'
import { CommonObject } from '../auth/auth.service'
import { configThrowError, handleQuery } from '../utils'
import { IQuery } from '../models'
import { Gender, StatusCode } from '../enums'

const populate = ['products', 'subCategories']

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: mongoose.Model<Category>
    ) {}

    async findAllAndCount(query: IQuery) {
        const { sort, filters, skip, limit } = handleQuery(query)

        const categories = await this.categoryModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate(populate)
        const total = await this.categoryModel.find(filters).count()

        return [categories, total]
    }

    async findOne(id: string, isRelation?: boolean) {
        const query = this.categoryModel.findById(id)
        if (isRelation) {
            query.populate(populate)
        }
        const category = await query
        if (!category) throw new NotFoundException('Không tìm thấy category này')
        return category
    }

    async create(data: Partial<Category>) {
        try {
            const category = await this.categoryModel.create(data)
            return category
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update(id: string, data: Partial<Category>) {
        try {
            const newCategory = await this.categoryModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })

            return newCategory
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateOne(id: string, data: CommonObject) {
        try {
            const category = await this.findOne(id)
            if (!category)
                throw new NotFoundException('Không tìm thấy category này để cập nhật')
            await category.updateOne(data)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateAny(id: string, data: CommonObject) {
        try {
            const newCategory = await this.categoryModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })
            if (!newCategory) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy category để cập nhật'
                )
            }
            return newCategory
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(id: string) {
        try {
            const category = await this.categoryModel.findByIdAndDelete(id)
            if (!category) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy category để xóa')
            }
            return category
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    // find category gender
    async findCategoryByGender(gender: string) {
        const categories = await this.categoryModel.find()
        const categoryId = categories.find((c) => {
            if (gender === Gender.MALE && c.name === 'Nam') return c._id
            if (gender === Gender.FEMALE && c.name === 'Nữ') return c._id
            return null
        })
        return categoryId._id
    }
}
