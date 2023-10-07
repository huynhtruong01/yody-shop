import { AddressService } from '../address/address.service'
import { IQuery, RequestUser } from '../models'
import { RolesService } from '../roles/roles.service'
import { User } from './users.schema'
import { UsersService } from './users.service'
import { CommonQuery } from '../utils'
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common'
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { IUserAddress } from './users.model'

@ApiSecurity('JWT-auth')
@Controller('users')
@ApiTags('User')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly addressService: AddressService,
        private readonly roleService: RolesService
    ) {}

    @Get('/')
    @CommonQuery()
    async getAllUsers(@Query() query: IQuery) {
        const [users, total] = await this.userService.findAllAndCount(query)
        return {
            users,
            total,
        }
    }

    @Get('/profile')
    async getProfile(@Req() req: RequestUser) {
        if (req.user) {
            return {
                user: req.user,
            }
        }

        throw new Error('Server error')
    }

    @Get('/:userId')
    async getUser(@Param('userId') id: string) {
        const user = await this.userService.findOne(id)
        return {
            user,
        }
    }

    @Post('/')
    async createUser(@Body() data: IUserAddress) {
        try {
            const user = await this.userService.create(data)

            if (data.address) {
                await this.addressService.create({ ...data.address, user: user._id })
            }
            if (data.roles || data.roles.length > 0) {
                for (const role of data.roles) {
                    await this.roleService.updateUser(role as string, user._id)
                }
            } else {
                await this.roleService.updateUser(process.env.ROLE_DEFAULT, user._id)
            }
            return {
                message: 'Create user successfully',
                user,
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Put('/:userId')
    @ApiBody({
        type: User,
    })
    async updateUser(@Param('userId') id: string, @Body() data: IUserAddress) {
        if (data.address) {
            const address = await this.addressService.updateByUserId(id, data.address)
            data.addresses.push(address)
        }
        const user = await this.userService.update(id, data)
        return {
            message: 'Update user successfully',
            user,
        }
    }

    @Delete('/:userId')
    async deleteUser(@Param('userId') id: string) {
        const user = await this.userService.delete(id)
        await this.addressService.deleteAllByUserId(id)
        return {
            message: 'Delete user successfully',
            user,
        }
    }

    @Delete('/me')
    async deleteAccount(@Req() req: RequestUser) {
        if (req.user) {
            const user = await this.userService.delete(req.user._id)
            return {
                message: 'Delete your account successfully',
                user,
            }
        }
        throw new InternalServerErrorException("Can't delete your account")
    }
}
