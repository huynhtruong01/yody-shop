import { Module } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { CommentsController } from './comments.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Comment, CommentSchema } from './comments.schema'
import { UsersModule } from '../users/users.module'
import { ProductsModule } from '../products/products.module'

@Module({
    providers: [CommentsService],
    controllers: [CommentsController],
    imports: [
        MongooseModule.forFeature([
            {
                name: Comment.name,
                schema: CommentSchema,
            },
        ]),
        UsersModule,
        ProductsModule,
    ],
})
export class CommentsModule {}
