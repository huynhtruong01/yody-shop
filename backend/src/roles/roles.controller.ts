import { IQuery } from '../models'
import { Role } from './roles.schema'
import { RolesService } from './roles.service'
import { CommonQuery } from '../utils'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger'

@ApiSecurity('JWT-auth')
@Controller('roles')
@ApiTags('Role')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @Get('/')
    @CommonQuery()
    async getAllRoles(@Query() query: IQuery) {
        const [roles, total] = await this.roleService.findAllAndCount(query)
        return {
            roles,
            total,
        }
    }

    @Post('/')
    async createRole(@Body() data: Role) {
        const role = await this.roleService.create(data)
        return {
            message: 'Create role successfully',
            role,
        }
    }

    @Put('/:roleId')
    @ApiBody({
        type: Role,
    })
    async updateRole(@Param('roleId') id: string, @Body() data: Partial<Role>) {
        const role = await this.roleService.update(id, data)
        return {
            message: 'Update role successfully',
            role,
        }
    }

    @Delete('/:roleId')
    async deleteRole(@Param('roleId') id: string) {
        const role = await this.roleService.delete(id)
        return {
            message: 'Delete role successfully',
            role,
        }
    }
}
