import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { SubCategoryService } from './sub-category.service'
import { ApiTags } from '@nestjs/swagger'
import { IAllQuery } from '../models'
import { SubCategory } from './sub-category.schema'
import { CategoriesService } from '../categories/categories.service'

@Controller('sub-categories')
@ApiTags('Sub Category')
export class SubCategoryController {
    constructor(
        private readonly subCategoryService: SubCategoryService,
        private readonly categoryService: CategoriesService
    ) {}

    @Get('/')
    async getAllSubCategory(@Query() query: IAllQuery) {
        const [subCategories, total] = await this.subCategoryService.findAll(query)

        return {
            subCategories,
            total,
        }
    }

    @Post('/')
    async createSubCategory(@Body() data: Partial<SubCategory>) {
        const subCategory = await this.subCategoryService.create(data)

        for (const categoryId of data.categoryParents) {
            await this.categoryService.updateAny(categoryId as string, {
                $push: {
                    subCategories: subCategory._id,
                },
            })
        }

        return {
            message: 'Tạo sub category mới thành công',
            subCategory,
        }
    }

    @Delete('/:subCategoryId')
    async deleteSubCategory(@Param('subCategoryId') id: string) {
        const subCategory = await this.subCategoryService.delete(id)

        return {
            message: 'Xóa sub category thành công',
            subCategory,
        }
    }
}
