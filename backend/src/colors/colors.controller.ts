import { Controller, Body, Get, Post, Put, Delete, Param, Query } from '@nestjs/common'
import { ColorsService } from './colors.service'
import { Color } from './colors.schema'
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { CommonQuery } from '../utils'
import { IQuery } from '../models'

@ApiSecurity('JWT-auth')
@Controller('colors')
@ApiTags('Color')
export class ColorsController {
    constructor(private readonly colorService: ColorsService) {}

    @Get('/')
    @CommonQuery()
    async findAllColor(@Query() query: IQuery) {
        const [colors, total] = await this.colorService.findAllAndCount(query)

        return {
            colors,
            total,
        }
    }

    @Post('/')
    async create(@Body() data: Partial<Color>) {
        const color = await this.colorService.create(data)

        return {
            message: 'Tạo màu sắc mới thành công',
            color,
        }
    }

    @Put('/:colorId')
    @ApiBody({
        type: Color,
    })
    async update(@Param('colorId') id: string, @Body() data: Partial<Color>) {
        const color = await this.colorService.update(id, data)

        return {
            message: 'Cập nhật màu sắc thành công',
            color,
        }
    }

    @Delete('/:colorId')
    async delete(@Param('colorId') id: string) {
        const color = await this.colorService.delete(id)

        return {
            message: 'Xóa màu sắc thành công',
            color,
        }
    }
}
