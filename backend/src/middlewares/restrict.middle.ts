import { RequestUser } from '../models'
import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'

@Injectable()
export class RestrictMiddleware implements NestMiddleware {
    constructor(private readonly allowedRoles: string[]) {}

    static forRoles(roles: string[]): any {
        return (req: RequestUser, res: Response, next: NextFunction) => {
            const middleware = new RestrictMiddleware(roles)
            middleware.use(req, res, next)
        }
    }

    async use(req: RequestUser, res: Response, next: NextFunction) {
        const userRoles = req.user.roles // Assuming req.user contains user information with a "role" property

        const isAllowedRoles = userRoles.some((role: any) => {
            return this.allowedRoles.includes(role.name)
        })

        if (!isAllowedRoles) {
            res.status(403).json({
                statusCode: 403,
                message: 'You do not have permission to perform this action',
            })
            return
        }

        next()
    }
}
