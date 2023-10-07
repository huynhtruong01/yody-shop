import {
    PaymentMethodOrder,
    ReportType,
    StatusCode,
    StatusOrder,
    TypeAction,
} from '../enums'
import { User } from '../users/users.schema'
import { Request } from 'express'

export interface RequestUser extends Request {
    user?: User
}

export interface IAddress {
    street: string
    ward: string
    district: string
    province: string
}

export interface IQuery {
    page?: number
    limit?: number
    sort?: string
    search?: string
    fields?: string
}

export interface IQueryProduct extends IQuery {
    prices?: object[]
    categories?: string[]
    subCategories?: string[]
    colors?: string[]
    sizes?: string[]
    ratings?: number[]
    isFreeShip?: boolean
}

export interface ICommonObj {
    [k: string]: string | object | number | boolean
}

export type IAllQuery = IQueryProduct

export type IStatusOrder =
    | StatusOrder.CANCELLED
    | StatusOrder.COMPLETED
    | StatusOrder.CONFIRMED
    | StatusOrder.PENDING
    | StatusOrder.SHIPPING

export type IPaymentMethodOrder =
    | PaymentMethodOrder.CASH
    | PaymentMethodOrder.COD
    | PaymentMethodOrder.MOMO
    | PaymentMethodOrder.PAYPAL
    | PaymentMethodOrder.VNPAY

export type ITypeAction = TypeAction.CREATE | TypeAction.UPDATE | TypeAction.DELETE

export type IReportType =
    | ReportType.ABUSE_CONTENT
    | ReportType.HARASSMENT_CONTENT
    | ReportType.HATE_SPEECH_CONTENT
    | ReportType.OBSCENE_CONTENT
    | ReportType.OTHER
    | ReportType.THREATENING_CONTENT

export type IStatusCode =
    | StatusCode.CREATED
    | StatusCode.SUCCESS
    | StatusCode.NO_CONTENT
    | StatusCode.BAD_REQUEST
    | StatusCode.UNAUTHORIZED
    | StatusCode.FORBIDDEN
    | StatusCode.NOT_FOUND
