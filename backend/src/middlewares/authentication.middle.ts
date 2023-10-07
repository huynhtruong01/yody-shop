import { AuthService } from '../auth/auth.service'
import { RequestUser } from '../models'
import { UsersService } from '../users/users.service'
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { NextFunction, Response } from 'express'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) {}

    async use(req: RequestUser, res: Response, next: NextFunction) {
        const authorization = req.headers['authorization']
        if (!authorization) {
            throw new UnauthorizedException('Token chưa có. Vui lòng đăng nhập tài khoản')
        }
        const token = authorization.split(' ')[1]
        try {
            const decode = this.authService.verifyToken(
                token,
                process.env.SECRET_ACCESS_TOKEN
            )
            const user = await this.userService.findOne(decode.id)
            req.user = user
        } catch (error) {
            throw new UnauthorizedException(error)
        }

        next()
    }
}
