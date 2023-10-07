import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator'

export class ItemCartDto {
    @IsNotEmpty({
        message: 'Missing product',
    })
    @IsString({
        message: 'Product must be string',
    })
    @ApiProperty()
    product: string

    @IsNotEmpty({
        message: 'Missing quantities',
    })
    @IsInt({
        message: 'Quantities must be a number',
    })
    @Min(1, {
        message: 'At least 1 quantities',
    })
    @ApiProperty()
    quantities: number

    @IsNotEmpty({
        message: 'Missing color',
    })
    @IsString({
        message: 'Color must be a string',
    })
    @ApiProperty()
    color: string

    @IsNotEmpty({
        message: 'Missing size',
    })
    @IsString({
        message: 'Size must be a string',
    })
    @ApiProperty()
    size: string
}

export class CreateItemCartDto {
    @IsString({
        message: 'User id must be string',
    })
    @ApiProperty()
    user: string

    @IsNotEmpty({
        message: 'Missing item',
    })
    item: ItemCartDto
}
