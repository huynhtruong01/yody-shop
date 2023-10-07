import { Address } from '../address/address.schema'
import { Gender } from '../enums'
import { User } from './users.schema'

export enum TypeRegister {
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    EMAIL = 'email',
}

export type ITypeRegister =
    | TypeRegister.EMAIL
    | TypeRegister.FACEBOOK
    | TypeRegister.GOOGLE

export type IGender = Gender.MALE | Gender.FEMALE | Gender.OTHER
export interface IUserAddress extends User {
    address: Address
}
