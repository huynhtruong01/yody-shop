import { Module, forwardRef } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './users.schema'
import { AddressModule } from '../address/address.module'
import { RolesModule } from '../roles/roles.module'

@Module({
    providers: [UsersService],
    controllers: [UsersController],
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
        forwardRef(() => AddressModule),
        RolesModule,
    ],
    exports: [UsersService],
})
export class UsersModule {}
