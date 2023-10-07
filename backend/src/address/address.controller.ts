import { Address } from './address.schema'
import { AddressService } from './address.service'
import { IQuery } from '../models'
import { UsersService } from '../users/users.service'
import { CommonQuery } from '../utils'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'

@Controller('addresses')
@ApiTags('Address')
export class AddressController {
    constructor(
        private readonly addressService: AddressService,
        private readonly userService: UsersService
    ) {}

    @Get('/')
    @CommonQuery()
    async getAllAddresses(@Query() query: IQuery) {
        const [addresses, total] = await this.addressService.findAllAndCount(query)

        return {
            addresses,
            total,
        }
    }

    @Post('/')
    async createAddress(@Body() data: Partial<Address>) {
        const address = await this.addressService.create(data)
        const user = await this.userService.updateAddresses(data.user as string, address)

        return {
            message: 'Tạo địa chỉ mới thành công',
            addresses: user.addresses,
        }
    }

    @Put('/user/:userId')
    @ApiBody({
        type: Address,
    })
    async updateAddressByUserId(
        @Param('userId') id: string,
        @Body() data: Partial<Address>
    ) {
        const address = await this.addressService.updateByUserId(id, data)
        // update address for user
        const user = await this.userService.findOne(id)
        if (user) {
            const newAddresses = [...user.addresses]
            const idx = newAddresses.findIndex(
                (a) => a._id.toString() === data._id.toString()
            )
            if (idx > -1) {
                newAddresses[idx] = address
                if (data.isDefault) {
                    const mapAddresses = [...newAddresses].map((a) => {
                        if (a._id.toString() === data._id) return a
                        return {
                            ...a,
                            isDefault: false,
                        }
                    })
                    user.addresses = mapAddresses
                    const addressDefault = mapAddresses.find((a) => a.isDefault)
                    user.address = addressDefault
                } else {
                    const addresses = await this.addressService.checkAllDefault(user._id)
                    user.addresses = addresses
                }
                await this.userService.update(user._id, user)
            }
        }
        return {
            message: 'Cập nhật địa chỉ thành công',
            addresses: user.addresses,
        }
    }

    @Delete('/user/:userId/:addressId')
    async deleteAddressByUserId(@Param() ids: { userId: string; addressId: string }) {
        await this.addressService.deleteByUserId(ids.userId, ids.addressId)
        const user = await this.userService.findOne(ids.userId)
        if (user) {
            const newAddresses = [...user.addresses]
            const idx = newAddresses.findIndex(
                (a) => a._id.toString() === ids.addressId.toString()
            )
            if (idx > -1) {
                newAddresses.splice(idx, 1)
                user.addresses = newAddresses
                await this.userService.update(user._id, user)
            }
        }

        return {
            message: 'Xóa địa chỉ thành công',
            addresses: user.addresses,
        }
    }
}
