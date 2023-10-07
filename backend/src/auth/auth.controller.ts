import { AuthService, CommonObject } from './auth.service'
import {
    LoginDto,
    LoginSocialDto,
    PasswordChangeDto,
    PasswordResetDto,
    PasswordResetForAdminDto,
    SignUpDto,
    VerifyEmailDto,
} from './dtos'
import { sendEmail } from '../config'
import { TypeRegister } from '../users/users.model'
import { User } from '../users/users.schema'
import { UsersService } from '../users/users.service'
import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    InternalServerErrorException,
    NotFoundException,
    Post,
    UnauthorizedException,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Gender } from '../enums'

@Controller('auth')
@ApiTags('OAuth')
export class AuthController {
    constructor(
        private usersService: UsersService,
        private readonly authService: AuthService
    ) {}

    async signUpSocials(data: SignUpDto) {
        try {
            const user = await this.usersService.create(data as Partial<User>)
            return user
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async loginSocials(data: LoginDto) {
        const user = await this.usersService.findOneByEmail(data.emailAddress)
        if (!user) throw new NotFoundException('Không tìm thấy tài khoản này bằng email')

        const isEqualPassword = await this.authService.comparePassword(
            `${data.emailAddress}${process.env.GOOGLE_SECRET}`,
            user.password
        )
        if (!isEqualPassword) throw new BadRequestException('Mật khẩu không đúng')

        return user
    }

    @Post('/login/google')
    async googleLogin(@Body() data: LoginSocialDto) {
        try {
            const isExistUser = await this.usersService.findOneByEmail(
                data.emailAddress,
                true
            )

            const password = `${data.emailAddress}${process.env.GOOGLE_SECRET}`
            const user = isExistUser
                ? await this.loginSocials({
                      emailAddress: data.emailAddress,
                      password,
                  })
                : await this.signUpSocials({
                      ...data,
                      dateOfBirth: new Date(),
                      gender: Gender.OTHER,
                      password,
                      type: TypeRegister.GOOGLE,
                  })

            // generate token
            const accessToken = this.authService.generateAccessToken(user._id)
            const refreshToken = this.authService.generateRefreshToken(user._id)

            return {
                message: 'Đăng nhập google thành công',
                user,
                accessToken,
                refreshToken,
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Post('/login')
    async login(@Body() data: LoginDto) {
        if (!data.emailAddress || !data.password) {
            throw new BadRequestException('Email hoặc password của bạn chưa nhập')
        }

        const user = await this.usersService.findOneByEmail(data.emailAddress)

        // compare password
        const comparePass = await this.authService.comparePassword(
            data.password,
            user.password
        )
        if (!comparePass) {
            throw new BadRequestException('Mật khẩu bạn nhập không đúng')
        }

        user.password = undefined

        // generate token
        const accessToken = this.authService.generateAccessToken(user._id)
        const refreshToken = this.authService.generateRefreshToken(user._id)

        return {
            user,
            accessToken,
            refreshToken,
        }
    }

    @Post('/signup')
    async signup(@Body() data: SignUpDto) {
        const user = await this.usersService.isExist(data.emailAddress)
        if (user) {
            throw new BadRequestException('This user existed')
        }

        // hash password
        const password = await this.authService.hashPassword(data.password)
        data.password = password
        data.type = TypeRegister.EMAIL

        const newData: CommonObject = { ...data }
        const token = this.authService.generateToken(
            { user: newData },
            process.env.EXPIRE_TEN_MINUTES
        )
        const url = `${process.env.HOST_FRONT_END}/verify-account/${token}`
        await sendEmail('tztruong7@gmail.com', 'Verify account', url)

        return {
            message: 'Signup account successfully. Please check your email',
        }
    }

    @ApiSecurity('JWT-auth')
    @Get('/verify-account')
    async verifyAccount(@Headers() headers: Record<string, string>) {
        const authorization = headers['authorization']
        if (!authorization) {
            throw new UnauthorizedException("You don't signup. Please signup")
        }

        const token = authorization.split(' ')[1]
        const decode = this.authService.verifyToken(token, process.env.SECRET_TOKEN)

        if (!decode.user) {
            throw new ForbiddenException('Not found information of user')
        }

        const isExistUser = await this.usersService.isExist(decode.user.emailAddress)
        if (isExistUser) {
            throw new BadRequestException('This user is exist')
        }

        const user = await this.usersService.create(decode.user)

        return {
            user,
            message: 'Verify account successfully',
        }
    }

    @ApiSecurity('JWT-auth')
    @Get('/refresh-token')
    async refreshToken(@Headers() headers: Record<string, string>) {
        const authorization = headers['authorization']
        if (!authorization) {
            throw new UnauthorizedException(
                'Bạn chưa đăng nhập. Vui lòng đăng nhập tài khoản của bạn'
            )
        }

        const token = authorization.split(' ')[1]
        const decode = this.authService.verifyToken(
            token,
            process.env.SECRET_REFRESH_TOKEN
        )
        if (!decode) {
            throw new ForbiddenException('Token không hợp lệ')
        }

        const user = await this.usersService.findOne(decode.id)

        const accessToken = this.authService.generateAccessToken(decode.id)
        const refreshToken = this.authService.generateRefreshToken(decode.id)

        return {
            message: 'Refresh token successfully',
            user,
            accessToken,
            refreshToken,
        }
    }

    @Post('/verify-email')
    async verifyEmail(@Body() data: VerifyEmailDto) {
        await this.usersService.findOneByEmail(data.emailAddress)
        try {
            const token = this.authService.generateToken(
                data,
                process.env.EXPIRE_TEN_MINUTES
            )

            const url = `${process.env.HOST_FRONT_END}/reset-password/${token}`
            await sendEmail(data.emailAddress, 'Verify email', url)

            return {
                message: 'Check your email',
                token,
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Post('/reset-password')
    async resetPassword(
        @Body() data: PasswordResetDto,
        @Headers() headers: Record<string, string>
    ) {
        try {
            const authorization = headers['authorization']
            if (!authorization) {
                throw new NotFoundException('Not found token')
            }

            const token = authorization.split(' ')[1]
            const decode = this.authService.verifyToken(token, process.env.SECRET_TOKEN)
            if (!decode) {
                throw new NotFoundException('Not found token')
            }

            const user = await this.usersService.findOneByEmail(decode?.emailAddress)
            if (!user) {
                throw new BadRequestException(
                    'This user is not exist. Please signup to login'
                )
            }

            const password = await this.authService.hashPassword(data.password)
            const newUser = await this.usersService.update(user._id, {
                password,
            })

            return {
                message: 'Reset password successfully',
                user: newUser,
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Post('/admin/reset-password')
    async resetPasswordForAdmin(@Body() data: PasswordResetForAdminDto) {
        try {
            const user = await this.usersService.findOneByEmail(data.emailAddress)
            if (!user) {
                throw new BadRequestException(
                    'This user is not exist. Please signup to login'
                )
            }

            const password = await this.authService.hashPassword(data.password)
            const newUser = await this.usersService.update(user._id, {
                password,
            })

            return {
                message: 'Reset password successfully',
                user: newUser,
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @ApiSecurity('JWT-auth')
    @Post('/change-password')
    async changePassword(
        @Body() data: PasswordChangeDto,
        @Headers() headers: Record<string, string>
    ) {
        try {
            const authorization = headers['authorization']
            if (!authorization) {
                throw new NotFoundException('Not found token')
            }

            const token = authorization.split(' ')[1]
            const decode = this.authService.verifyToken(
                token,
                process.env.SECRET_ACCESS_TOKEN
            )
            if (!decode) {
                throw new NotFoundException('Not found token')
            }

            const user = await this.usersService.findOne(decode.id)
            if (!user) {
                throw new BadRequestException(
                    'This user is not exist. Please signup to login'
                )
            }

            // check password
            const isCorrectPassword = await this.authService.comparePassword(
                data.password,
                user.password
            )
            if (!isCorrectPassword) {
                throw new BadRequestException('Password is incorrect')
            }

            const password = await this.authService.hashPassword(data.newPassword)
            const newUser = await this.usersService.update(user._id, {
                password,
            })

            return {
                message: 'Change password successfully',
                user: newUser,
            }
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
