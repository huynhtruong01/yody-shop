import {
    Injectable,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Contact } from './contact.schema'
import mongoose from 'mongoose'
import { ICommonObj, IQuery } from '../models'
import { configThrowError, handleQuery } from '../utils'
import { StatusCode } from '../enums'

const populate = ['user']

@Injectable()
export class ContactsService {
    constructor(
        @InjectModel(Contact.name) private readonly contactModel: mongoose.Model<Contact>
    ) {}

    async findAll(query: IQuery) {
        const { filters, skip, limit, sort, select } = handleQuery(query)

        const contacts = await this.contactModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select(select)
            .populate(populate)

        const total = await this.contactModel.find(filters).count()

        return [contacts, total]
    }

    async findOne(id: string) {
        const contact = await this.contactModel.findById(id)
        if (!contact) throw new NotFoundException('Không tìm thấy mục liên hệ này qua id')
        return contact
    }

    async create(data: Partial<Contact>) {
        try {
            const contact = new this.contactModel(data)
            await contact.save()

            return contact
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async updateAny(id: string, data: ICommonObj) {
        try {
            const newContact = await this.contactModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })
            if (!newContact) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy contact để cập nhật'
                )
            }
            return newContact
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async delete(id: string) {
        try {
            const contact = await this.contactModel.findByIdAndDelete(id)
            if (!contact) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy contact để xóa')
            }
            return contact
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
