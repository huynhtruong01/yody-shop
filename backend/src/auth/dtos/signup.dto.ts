import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator'
import { ITypeRegister, TypeRegister } from '../../users/users.model'

export class SignUpDto {
    @IsString({
        message: 'Full name is missing',
    })
    @ApiProperty()
    fullName: string

    @IsString({
        message: 'Username is missing',
    })
    @ApiProperty()
    username: string

    @IsString({
        message: 'Email is missing',
    })
    @IsEmail(undefined, {
        message: 'Email is not valid',
    })
    @ApiProperty()
    emailAddress: string

    @IsString({
        message: 'Password is missing',
    })
    @MinLength(6, {
        message: 'Password is at least 6 characters',
    })
    @ApiProperty()
    password: string

    @IsString({
        message: 'Gender is missing',
    })
    @ApiProperty()
    gender: string

    @IsString({
        message: 'Date of birth is missing',
    })
    @ApiProperty()
    dateOfBirth: Date

    @IsOptional()
    @ApiProperty({
        required: false,
        default: TypeRegister.EMAIL,
        enum: TypeRegister,
    })
    type?: ITypeRegister

    @IsOptional()
    @IsString({
        message: 'Phone number is missing',
    })
    @IsPhoneNumber('VN', {
        message: 'Invalid phone number',
    })
    @ApiProperty()
    phoneNumber?: string

    @IsOptional()
    @ApiProperty()
    address?: object
}
