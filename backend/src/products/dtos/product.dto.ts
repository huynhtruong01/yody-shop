import { IsString, IsNotEmpty } from 'class-validator'

export class SearchDto {
    @IsString({
        message: 'Must be string',
    })
    @IsNotEmpty({
        message: 'Not empty',
    })
    search: string
}
