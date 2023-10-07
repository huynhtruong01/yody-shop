import {
    Injectable,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Role } from './roles.schema'
import mongoose from 'mongoose'
import { IQuery } from '../models'
import { configThrowError, handleQuery } from '../utils'
import { StatusCode } from '../enums'

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role.name) private roleModel: mongoose.Model<Role>) {}

    async findAllAndCount(query: IQuery) {
        const { sort, filters, skip, limit } = handleQuery(query)

        const roles = await this.roleModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate(['users'])
        const total = await this.roleModel.find(filters).count()

        return [roles, total]
    }

    async findOne(id: string) {
        const role = await this.roleModel.findById(id)
        if (!role) throw new NotFoundException('Không tìm thấy role này')
        return role
    }

    async create(data: Role) {
        try {
            const role = await this.roleModel.create(data)
            return role
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update(id: string, data: Partial<Role>) {
        const role = await this.findOne(id)
        try {
            role.set(data)
            const newRole = await role.save()
            return newRole
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateUser(id: string, userId: string) {
        try {
            const role = await this.roleModel.findByIdAndUpdate(id, {
                $push: {
                    users: userId,
                },
            })
            if (!role) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy role bằng user id để cập nhật'
                )
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async delete(id: string) {
        try {
            const role = await this.roleModel.findByIdAndDelete(id)
            if (!role) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy role này để xóa')
            }
            return role
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
