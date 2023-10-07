import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags } from '@nestjs/swagger'

@Controller()
@ApiTags('Root')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/')
    welcome() {
        const message = this.appService.getWelcome()
        return {
            message,
        }
    }
}
