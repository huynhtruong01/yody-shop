import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class VerifyEmailDto {
    @IsString()
    @ApiProperty()
    emailAddress: string
}
