import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { VerifyEmailDto } from '../auth/dtos'

export type CommonObject =
    | {
          [k: string]: string | number | boolean | Date | Object
      }
    | VerifyEmailDto

@Injectable()
export class AuthService {
    async comparePassword(password: string, passwordGen: string) {
        return await bcrypt.compare(password, passwordGen)
    }

    async hashPassword(password: string) {
        const newPassword = await bcrypt.hash(password, Number(process.env.GEN_SALT))
        return newPassword
    }

    generateAccessToken(id: string) {
        return jwt.sign({ id }, process.env.SECRET_ACCESS_TOKEN, {
            expiresIn: process.env.EXPIRE_ONE_DAY,
        })
    }

    generateRefreshToken(id: string) {
        return jwt.sign({ id }, process.env.SECRET_REFRESH_TOKEN, {
            expiresIn: process.env.EXPIRE_ONE_MONTH,
        })
    }

    generateToken(data: CommonObject, expiresIn: string) {
        return jwt.sign(data, process.env.SECRET_TOKEN, {
            expiresIn,
        })
    }

    verifyToken(token: string, secret: string) {
        return jwt.verify(token, secret) as jwt.JwtPayload
    }
}
