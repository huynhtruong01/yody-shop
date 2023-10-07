import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Order } from './orders.schema'
import mongoose from 'mongoose'
import { configThrowError } from '../utils'
import { StatusCode } from '../enums'

const populate = ['user', 'items.product']

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: mongoose.Model<Order>
    ) {}

    async findAllAndCount() {
        const orders = await this.orderModel
            .find()
            .sort({
                createdAt: -1,
            })
            .populate(populate)
        const total = await this.orderModel.find().count()

        return [orders, total]
    }

    async findAllByUserIdAndCount(userId: string) {
        const orders = await this.orderModel
            .find({ user: userId })
            .sort({
                createdAt: -1,
            })
            .populate(populate)
        const total = await this.orderModel.find({ user: userId }).count()

        return [orders, total]
    }

    async create(data: Partial<Order>) {
        try {
            const order = new this.orderModel(data)
            await order.save()
            return order
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async findOne(id: string) {
        const order = await this.orderModel.findById(id)
        if (!order) throw new NotFoundException('Không tìm thấy order này')
        return order
    }

    async delete(id: string) {
        try {
            const order = await this.orderModel.findByIdAndDelete(id)
            if (!order) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy order để xóa')
            }
            return order
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async deleteAll() {
        try {
            const orders = await this.orderModel.deleteMany(
                {},
                { validateBeforeSave: false }
            )
            return orders
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
