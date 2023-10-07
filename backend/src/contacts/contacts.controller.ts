import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IQuery } from '../models'
import { Contact } from './contact.schema'
import { ContactsService } from './contacts.service'

@Controller('contacts')
@ApiTags('Contact')
export class ContactsController {
    constructor(private readonly contactService: ContactsService) {}

    @Get('/')
    async getAllContacts(@Query() query: IQuery) {
        const [contacts, total] = await this.contactService.findAll(query)
        return { contacts, total }
    }

    @Post('/')
    async createContact(@Body() data: Partial<Contact>) {
        const contact = await this.contactService.create(data)
        return { contact }
    }

    @Get('/confirm/:contactId')
    async confirmContact(@Param('contactId') id: string) {
        const contact = await this.contactService.updateAny(id, {
            isConfirm: true,
        })
        return {
            message: 'Xác nhận mục liên hệ này thành công',
            contact,
        }
    }

    @Delete('/:contactId')
    async deleteContact(@Param('contactId') id: string) {
        const contact = await this.contactService.delete(id)
        return {
            message: 'Đã xóa contact này thành công',
            contact,
        }
    }
}
