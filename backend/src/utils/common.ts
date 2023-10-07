import slugify from 'slugify'
import * as bcrypt from 'bcrypt'
import { ApiQuery } from '@nestjs/swagger'
import { LimitDto, PageDto } from '../models'
import { applyDecorators } from '@nestjs/common'

export const generateSlug = (title: string) => {
    return slugify(title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        locale: 'vi',
        trim: true,
    })
}

export const hashPassword = async (password: string) => {
    const newPassword = await bcrypt.hash(password, Number(process.env.GEN_SALT))
    return newPassword
}

export const CommonQuery = () => {
    return applyDecorators(
        ApiQuery({
            name: 'page',
            required: false,
            type: PageDto,
        }),
        ApiQuery({
            name: 'limit',
            required: false,
            type: LimitDto,
        })
    )
}

export const calcPrice = (originPrice: number, discount: number): number => {
    return (
        Number(((originPrice - (originPrice * discount) / 100) / 1000).toFixed(1)) * 1000
    )
}
