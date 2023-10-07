import { AddressController } from './address.controller'
import { Address, AddressSchema } from './address.schema'
import { AddressService } from './address.service'
import { UsersModule } from '../users/users.module'
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Address.name,
                schema: AddressSchema,
            },
        ]),
        forwardRef(() => UsersModule),
    ],
    providers: [AddressService],
    controllers: [AddressController],
    exports: [AddressService],
})
export class AddressModule {}
