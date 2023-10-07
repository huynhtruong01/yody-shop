import { Address } from '../address/address.schema'
import { ICommonObj, IQuery } from '../models'
import { User } from './users.schema'
import { configThrowError, handleQuery } from '../utils'
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { StatusCode } from '../enums'

const populate = [
    {
        path: 'roles',
        model: 'Role',
    },
    {
        path: 'favoriteProducts',
        model: 'Product',
    },
    {
        path: 'orders',
        populate: {
            path: 'items',
            populate: [
                {
                    path: 'product',
                    model: 'Product',
                },
                {
                    path: 'color',
                    model: 'Color',
                },
                {
                    path: 'size',
                    model: 'Size',
                },
            ],
        },
    },
]

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: mongoose.Model<User>) {}

    async findAllAndCount(query: IQuery): Promise<[User[], number]> {
        const { filters, skip, limit, sort } = handleQuery(query)

        const users = await this.userModel
            .find(filters, {
                password: 0,
            })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate(populate)
        const total = await this.userModel.find().count()
        return [users, total]
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).populate(populate)
        if (!user)
            throw new NotFoundException('Không tìm thấy tài khoản của người dùng này')
        return user
    }

    async findOneByEmail(emailAddress: string, noCheckError = false): Promise<User> {
        const user = await this.userModel
            .findOne({
                emailAddress,
            })
            .populate(populate)
        if (!user && !noCheckError)
            throw new NotFoundException(
                'Không tìm thấy tài khoản của người dùng bằng email này'
            )

        return user
    }

    async isExist(emailAddress: string): Promise<boolean> {
        const user = await this.userModel.findOne({
            emailAddress,
        })
        if (!user) return false

        return true
    }

    async create(data: Partial<User>): Promise<User> {
        try {
            if (!data.roles) {
                data.roles = [process.env.ROLE_DEFAULT as string]
            }
            const user = new this.userModel(data)
            await user.save()
            user.password = undefined
            return user
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        try {
            const newUser = await this.userModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })

            if (!newUser) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy user này để cập nhật'
                )
            }

            newUser.password = undefined

            return newUser.populate(populate)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateAny(id: string, data: ICommonObj): Promise<User | null> {
        try {
            const newUser = await this.userModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })
            if (!newUser) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy user này để cập nhật'
                )
            }
            newUser.password = undefined

            return newUser.populate(populate)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateAddresses(id: string, data: Address) {
        try {
            const newUser = await this.userModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        addresses: data,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )

            if (!newUser)
                throw new NotFoundException(
                    'Không tìm thấy tài khoản này để cập nhật địa chỉ'
                )

            if (data.isDefault) {
                const newAddresses = [...newUser.addresses].map((a) => {
                    if (a._id.toString() === data._id.toString()) return a
                    return {
                        ...a,
                        isDefault: false,
                    }
                })
                const addressDefault = newAddresses.find((a) => a.isDefault)
                newUser.address = addressDefault
                newUser.addresses = newAddresses
                await newUser.save()
            }

            return newUser
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(id: string): Promise<User | null> {
        try {
            const user = await this.userModel.findByIdAndDelete(id)
            if (!user) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy user này để xóa')
            }
            return user
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
