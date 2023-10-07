import {
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common'
import { IStatusCode } from '../models'
import { StatusCode } from '../enums'

export const configThrowError = (
    statusCode: IStatusCode,
    message = 'Có lỗi gì đó đã xảy ra'
) => {
    switch (statusCode) {
        case StatusCode.BAD_REQUEST: {
            throw new BadRequestException(message)
        }
        case StatusCode.UNAUTHORIZED: {
            throw new UnauthorizedException(message)
        }
        case StatusCode.FORBIDDEN: {
            throw new ForbiddenException(message)
        }
        case StatusCode.NOT_FOUND: {
            throw new NotFoundException(message)
        }
    }
}
