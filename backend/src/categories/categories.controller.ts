import { Controller, Body, Param, Get, Post, Put, Delete, Query } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { Category } from './categories.schema'
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { CommonQuery, handleQuery } from '../utils'
import { IQuery } from '../models'

@ApiSecurity('JWT-auth')
@Controller('categories')
@ApiTags('Category')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) {}

    @Get('/')
    @CommonQuery()
    async findAllCategories(@Query() query: IQuery) {
        const [categories, total] = await this.categoryService.findAllAndCount(query)

        return {
            categories,
            total,
        }
    }

    @Post('/')
    async createCategory(@Body() data: Partial<Category>) {
        const category = await this.categoryService.create(data)

        return {
            message: 'Create category successfully',
            category,
        }
    }

    @Put('/:categoryId')
    @ApiBody({
        type: Category,
    })
    async updateCategory(
        @Param('categoryId') id: string,
        @Body() data: Partial<Category>
    ) {
        const category = await this.categoryService.update(id, data)

        return {
            message: 'Update category successfully',
            category,
        }
    }

    @Delete('/:categoryId')
    async deleteCategory(@Param('categoryId') id: string) {
        const category = await this.categoryService.delete(id)

        return {
            message: 'Delete category successfully',
            category,
        }
    }
}
