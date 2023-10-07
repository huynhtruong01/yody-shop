import { Comment } from './comments.schema'
import { CommentsService } from './comments.service'
import { TypeAction } from '../enums'
import { ITypeAction, RequestUser } from '../models'
import { ProductsService } from '../products/products.service'
import { UsersService } from '../users/users.service'
import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Request,
} from '@nestjs/common'
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger'

export interface IReplyLikeParams {
    id: string
    commentRootId: string
}

@ApiSecurity('JWT-auth')
@Controller('comments')
@ApiTags('Comment')
export class CommentsController {
    constructor(
        private readonly commentService: CommentsService,
        private readonly userService: UsersService,
        private readonly productService: ProductsService
    ) {}

    async updateUserAndProductForComment(
        type: ITypeAction,
        userId: string,
        productId: string,
        id: string
    ) {
        const updateUser =
            type === TypeAction.DELETE
                ? {
                      $pull: {
                          comments: id,
                      },
                  }
                : {
                      $push: {
                          comments: {
                              $each: [id],
                              $position: 0,
                          },
                      },
                  }
        const updateProduct =
            type === TypeAction.DELETE
                ? {
                      $pull: {
                          comments: id,
                      },
                  }
                : {
                      $push: {
                          comments: {
                              $each: [id],
                              $position: 0,
                          },
                      },
                  }

        await this.userService.updateAny(userId as string, updateUser)
        await this.productService.updateAny(productId as string, updateProduct, true)
    }

    @Get('/:productId')
    async getAllCommentsByProductId(@Param('productId') id: string) {
        const [comments, total] = await this.commentService.findAllAndCountByProductId(id)

        return {
            comments,
            total,
        }
    }

    @Post('/')
    async createComment(@Body() data: Partial<Comment>) {
        const comment = await this.commentService.create(data)
        await this.updateUserAndProductForComment(
            TypeAction.CREATE,
            data.user as string,
            data.product as string,
            comment._id.toString()
        )
        return {
            message: 'Tạo bình luận mới thành công',
            comment,
        }
    }

    @Put('/:commentId')
    @ApiBody({
        type: Comment,
    })
    async updateComment(@Param('commentId') id: string, @Body() data: Partial<Comment>) {
        const comment = await this.commentService.update(id, data)
        return {
            message: 'Cập nhật bình luận thành công',
            comment,
        }
    }

    @Delete('/:commentId')
    async deleteComment(@Param('commentId') id: string, @Request() req: RequestUser) {
        const comment = await this.commentService.delete(id)
        await this.updateUserAndProductForComment(
            TypeAction.DELETE,
            req.user._id,
            comment.product as string,
            id
        )
        return {
            message: 'Xóa bình luận thành công',
            comment,
        }
    }

    @Get('/like/:commentId')
    async likeComment(@Param('commentId') id: string, @Request() req: RequestUser) {
        // push id user
        const comment = await this.commentService.like(id, req.user)
        return {
            message: 'Đã thích bình luận thành công',
            comment,
        }
    }

    @Get('/unlike/:commentId')
    async unlikeComment(@Param('commentId') id: string, @Request() req: RequestUser) {
        // pop id user
        const comment = await this.commentService.unlike(id, req.user)
        return {
            message: 'Bỏ thích bình luận thành công',
            comment,
        }
    }

    @Post('/reply/:id')
    async replyComment(@Param('id') id: string, @Body() data: Partial<Comment>) {
        const comment = await this.commentService.reply(id, data)
        return {
            comment,
        }
    }

    @Get('/reply/like/:commentRootId/:id')
    async likeReplyComment(
        @Param() params: IReplyLikeParams,
        @Request() req: RequestUser
    ) {
        const comment = await this.commentService.likeReply(
            params.commentRootId,
            params.id,
            req.user._id
        )
        return {
            message: 'Đã thích bình luận thành công',
            comment,
        }
    }

    @Get('/reply/unlike/:commentRootId/:id')
    async unlikeReplyComment(
        @Param() params: IReplyLikeParams,
        @Request() req: RequestUser
    ) {
        const comment = await this.commentService.unlikeReply(
            params.commentRootId,
            params.id,
            req.user._id
        )
        return {
            message: 'Bỏ thích bình luận thành công',
            comment,
        }
    }

    @Put('/reply/:commentRootId/:id')
    async updateReplyComment(
        @Param() params: IReplyLikeParams,
        @Body() data: Partial<Comment>
    ) {
        const comment = await this.commentService.updateReplyComment(
            params.commentRootId,
            params.id,
            data
        )
        return {
            message: 'Cập nhập phản hồi bình luận thành công',
            comment,
        }
    }

    @Delete('/reply/:commentRootId/:id')
    async deleteReplyComment(@Param() params: IReplyLikeParams) {
        const comment = await this.commentService.deleteReply(
            params.commentRootId,
            params.id
        )
        return {
            message: 'Xóa bình luận phản hồi thành công',
            comment,
        }
    }
}
