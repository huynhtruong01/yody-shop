import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class PasswordChangeDto {
    @IsString({
        message: 'New password is missing',
    })
    @MinLength(6, {
        message: 'New password is at least 6 character',
    })
    @ApiProperty()
    newPassword: string

    @IsString({
        message: 'Password is missing',
    })
    @MinLength(6, {
        message: 'Password is at least 6 character',
    })
    @ApiProperty()
    password: string
}

export class PasswordResetDto {
    @IsString({
        message: 'Password is missing',
    })
    @MinLength(6, {
        message: 'Password is at least 6 character',
    })
    @ApiProperty()
    password: string
}

export class PasswordResetForAdminDto extends PasswordResetDto {
    @IsString({
        message: 'Email address is missing',
    })
    emailAddress: string
}
