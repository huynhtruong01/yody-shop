import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Comment } from './comments.schema'
import mongoose from 'mongoose'
import { User } from '../users/users.schema'
import { configThrowError } from '../utils'
import { StatusCode } from '../enums'

const populate = ['user', 'product', 'likes']
const populateReplyComment = [
    {
        path: 'user',
        model: 'User',
    },
    {
        path: 'likes',
        model: 'User',
    },
    {
        path: 'reply',
        populate: {
            path: 'user',
            model: 'User',
        },
    },
]

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private readonly commentModel: mongoose.Model<Comment>
    ) {}

    async findAllAndCountByProductId(productId: string) {
        const comments = await this.commentModel
            .find({ product: productId, commentRoot: null })
            .sort({
                createdAt: -1,
            })
            .populate(populateReplyComment)
        const total = await this.commentModel.find({ product: productId }).count()

        return [comments, total]
    }

    async findOne(id: string) {
        const comment = await this.commentModel.findById(id)
        if (!comment) throw new NotFoundException('Không tìm thấy comment này')

        return comment
    }

    async create(data: Partial<Comment>) {
        try {
            const comment = new this.commentModel(data)
            await comment.save()

            return comment.populate(populate)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update(id: string, data: Partial<Comment>): Promise<Comment | null> {
        try {
            const newComment = await this.commentModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })
            if (!newComment) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy comment để cập nhật'
                )
            }
            return newComment.populate(populate)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(id: string) {
        try {
            const comment = await this.commentModel.findByIdAndDelete(id)
            if (!comment) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy comment để xóa')
            }
            return comment
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async like(id: string, user: User) {
        try {
            const newComment = await this.commentModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        likes: user._id.toString(),
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            if (!newComment) {
                configThrowError(StatusCode.NOT_FOUND, 'Không tìm thấy comment để thích')
            }

            return newComment.populate(populate)
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    async unlike(id: string, user: User) {
        try {
            const newComment = await this.commentModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        likes: user._id,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            if (!newComment) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy comment để bỏ thích'
                )
            }

            return newComment.populate(populate)
        } catch (error) {
            throw new NotFoundException(error)
        }
    }

    async reply(id: string, data: Partial<Comment>) {
        const comment = await this.findOne(id)
        const commentReply = new this.commentModel(data)
        try {
            if (comment) {
                const newComment = await this.commentModel.findByIdAndUpdate(
                    id,
                    {
                        $push: {
                            reply: {
                                $each: [commentReply._id],
                                $position: 0,
                            },
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                )
                await commentReply.save()
                return newComment.populate(populateReplyComment)
            }

            throw new InternalServerErrorException('Lỗi server')
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async likeReply(commentRootId: string, id: string, userId: string) {
        // get comment root

        try {
            const comment = await this.findOne(id)
            // get reply from comment root
            if (comment) {
                comment.likes.push(userId)
                await comment.save()
                const commentRoot = await this.findOne(commentRootId)
                if (commentRoot) {
                    return commentRoot.populate(populateReplyComment)
                }
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async unlikeReply(commentRootId: string, id: string, userId: string) {
        // get comment root
        try {
            const comment = await this.findOne(id)
            if (comment) {
                const likes = comment.likes.filter(
                    (x: any) => x.toString() !== userId.toString()
                )
                comment.likes = likes
                await comment.save()
                const commentRoot = await this.findOne(commentRootId)
                if (commentRoot) {
                    return commentRoot.populate(populateReplyComment)
                }
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async updateReplyComment(commentRootId: string, id: string, data: Partial<Comment>) {
        try {
            // update reply comment
            const comment = await this.findOne(id)
            comment.comment = data.comment
            await comment.save()

            // return comment root
            const commentRoot = await this.findOne(commentRootId)
            return commentRoot.populate(populateReplyComment)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async deleteReply(commentRootId: string, id: string) {
        try {
            const newComment = await this.commentModel
                .findByIdAndUpdate(
                    commentRootId,
                    {
                        $pull: {
                            reply: id,
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                )
                .populate(populateReplyComment)
            if (!newComment) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy phản hồi comment để xóa'
                )
            }

            return newComment
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
