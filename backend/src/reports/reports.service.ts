import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Report } from './reports.schema'
import mongoose from 'mongoose'
import { IAllQuery } from '../models'
import { configThrowError, handleQuery } from '../utils'
import { StatusCode } from '../enums'

const populate = ['user', 'comment']

@Injectable()
export class ReportsService {
    constructor(@InjectModel(Report.name) private reportModel: mongoose.Model<Report>) {}

    async findAll(query: IAllQuery) {
        const { filters, limit, select, skip, sort } = handleQuery(query)

        const reports = await this.reportModel
            .find(filters)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(select)
            .populate(populate)
        const total = await this.reportModel.find(filters).skip(skip).limit(limit).count()
        return [reports, total]
    }

    async findOne(id: string) {
        const report = await this.reportModel.findById(id)
        if (!report) throw new NotFoundException('Không tìm thấy báo cáo với id này')
        return report
    }

    async create(data: Partial<Report>) {
        try {
            const report = new this.reportModel(data)
            await report.save()
            return report
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async delete(id: string) {
        try {
            const report = await this.reportModel.findByIdAndDelete(id)
            if (!report) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy report này này để xóa'
                )
            }
            return report
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
