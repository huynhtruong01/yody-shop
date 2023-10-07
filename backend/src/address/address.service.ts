import {
    Injectable,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Address } from './address.schema'
import mongoose from 'mongoose'
import { IQuery } from '../models'
import { configThrowError, handleQuery } from '../utils'
import { StatusCode } from '../enums'

@Injectable()
export class AddressService {
    constructor(
        @InjectModel(Address.name) private readonly addressModel: mongoose.Model<Address>
    ) {}

    async checkAllDefault(userId: string) {
        try {
            const addresses = await this.addressModel.find({
                user: userId,
            })
            const hasDefaultAddress = addresses.find((a) => a.isDefault)
            if (!hasDefaultAddress) {
                addresses[0].isDefault = true
                await this.addressModel.findByIdAndUpdate(
                    addresses[0]._id,
                    {
                        $set: {
                            ...addresses[0],
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                )
            }
            return addresses
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async findAllAndCount(query: IQuery) {
        const { sort, skip, limit, filters } = handleQuery(query)
        const addresses = await this.addressModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate(['user'])

        const total = await this.addressModel.find().count()

        return [addresses, total]
    }

    async findOneByUserId(userId: string, addressId: string) {
        const address = await this.addressModel.findOne({ user: userId, _id: addressId })
        if (!address) throw new NotFoundException('Không tìm thấy address này bằng id')
        return address
    }

    async setDefaultAddress(userId: string) {
        await this.addressModel.updateMany(
            {
                user: userId,
            },
            {
                isDefault: false,
            },
            {
                new: true,
                runValidators: true,
            }
        )
    }

    async create(data: Partial<Address>) {
        try {
            if (data.isDefault) {
                await this.setDefaultAddress(data.user as string)
            }
            const address = new this.addressModel(data)
            await address.save()
            return address
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateByUserId(userId: string, data: Partial<Address>) {
        try {
            if (data.isDefault) {
                await this.setDefaultAddress(userId)
            }

            const newAddress = await this.addressModel.findOneAndUpdate(
                { user: userId, _id: data._id },
                data,
                {
                    new: true,
                    runValidators: true,
                }
            )

            if (!newAddress) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm address này để cập nhật'
                )
            }

            return newAddress
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async deleteByUserId(userId: string, addressId: string) {
        try {
            const address = await this.addressModel.findOneAndDelete({
                user: userId,
                _id: addressId,
            })
            if (!address) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy address này để xóa'
                )
            }
            return address
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async deleteAllByUserId(userId: string) {
        try {
            const address = await this.addressModel.deleteMany({
                user: userId,
            })
            return address
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
