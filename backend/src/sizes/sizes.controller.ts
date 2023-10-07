import { Controller, Get, Query, Post, Body, Put, Delete, Param } from '@nestjs/common'
import { SizesService } from './sizes.service'
import { CommonQuery } from '../utils'
import { IQuery } from '../models'
import { Size } from './sizes.schema'
import { ApiBody, ApiTags } from '@nestjs/swagger'

@Controller('sizes')
@ApiTags('Size')
export class SizesController {
    constructor(private sizeService: SizesService) {}

    @Get('/')
    @CommonQuery()
    async getAllSizes(@Query() query: IQuery) {
        const [sizes, total] = await this.sizeService.findAllAndCount(query)
        return {
            sizes,
            total,
        }
    }

    @Post('/')
    async createSize(@Body() data: Partial<Size>) {
        const size = await this.sizeService.create(data)
        return {
            message: 'Create size successfully',
            size,
        }
    }

    @Put('/:sizeId')
    @ApiBody({
        type: Size,
    })
    async updateSize(@Param('sizeId') id: string, @Body() data: Partial<Size>) {
        const size = await this.sizeService.update(id, data)
        return {
            message: 'Update size successfully',
            size,
        }
    }

    @Delete('/:sizeId')
    async deleteSize(@Param('sizeId') id: string) {
        const size = await this.sizeService.delete(id)
        return {
            message: 'Delete size successfully',
            size,
        }
    }
}
