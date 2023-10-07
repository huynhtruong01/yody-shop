import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator'

export class LoginDto {
    @IsString()
    @IsEmail(undefined, {
        message: 'Email không hợp lệ',
    })
    @ApiProperty()
    emailAddress: string

    @IsString()
    @MinLength(6, {
        message: 'Mật khẩu ít nhất 6 ký tự',
    })
    @ApiProperty()
    password: string
}

export class LoginSocialDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail(undefined, {
        message: 'Email không hợp lệ',
    })
    @ApiProperty()
    emailAddress: string

    @IsNotEmpty()
    @IsString()
    avatar: string

    @IsNotEmpty()
    @IsString()
    fullName: string

    @IsNotEmpty()
    @IsString()
    username: string
}
