import { Controller, Query, Body, Param, Get, Post, Delete } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { IAllQuery } from '../models'
import { Report } from './reports.schema'
import { ApiTags } from '@nestjs/swagger'

@Controller('reports')
@ApiTags('Report')
export class ReportsController {
    constructor(private reportService: ReportsService) {}

    @Get('/')
    async getAllReports(@Query() query: IAllQuery) {
        const [reports, total] = await this.reportService.findAll(query)
        return {
            reports,
            total,
        }
    }

    @Post('/')
    async createReport(@Body() data: Partial<Report>) {
        const report = await this.reportService.create(data)
        return {
            report,
        }
    }

    @Delete('/:reportId')
    async deleteReport(@Param('reportId') id: string) {
        const report = await this.reportService.delete(id)
        return {
            report,
        }
    }
}
