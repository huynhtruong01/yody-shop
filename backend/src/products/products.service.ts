import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { Comment } from '../comments/comments.schema'
import { ICommonObj, IQueryProduct } from '../models'
import { configThrowError, handleQuery, handleQueryProducts } from '../utils'
import { Product } from './products.schema'
import { StatusCode } from '../enums'

export type ObjectIdConstructor = {
    (str: string): mongoose.Types.ObjectId
    new (str: string): mongoose.Types.ObjectId
}

const populate = ['colors', 'category', 'sizes', 'comments', 'subCategory']

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: mongoose.Model<Product>
    ) {}

    async search(q: string) {
        const products = await this.productModel
            .find({
                name: {
                    $regex: q,
                    $options: 'i',
                },
            })
            .sort('-createdAt')

        return products
    }

    async findAllAndCount(query: IQueryProduct) {
        const { skip, limit, sort, select } = handleQuery(query)
        const filters = handleQueryProducts(query)
        let newSort = sort
        if (query.ratings) {
            newSort = `-ratingAverage ${sort}`
        }
        const products = await this.productModel
            .find(filters)
            .skip(skip)
            .limit(limit)
            .sort(newSort)
            .select(select)
            .populate(populate)
        const total = await this.productModel.find(filters).sort(sort).count()

        return [products, total]
    }

    async findOne(id: string, isRelation = false) {
        const query = this.productModel.findById(id)
        if (isRelation) {
            query.populate(populate)
        }
        const product = await query
        if (!product) throw new NotFoundException('Không tìm thấy sản phẩm bằng id')
        return product
    }

    async findBySlug(slug: string, isRelation = false) {
        const query = this.productModel.findOne({
            slug,
        })
        if (isRelation) {
            query.populate(populate)
        }
        const product = await query
        if (!product) throw new NotFoundException('Không tìm thấy sản phẩm này')
        return product
    }

    async create(data: Partial<Product>) {
        try {
            const product = new this.productModel(data)
            await product.save()

            return product
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async update(id: string, data: Partial<Product>) {
        const product = await this.findOne(id)

        try {
            for (const key in data) {
                product[key] = data[key]
            }
            await product.save()
            return product
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async delete(id: string) {
        try {
            const product = await this.productModel.findByIdAndDelete(id)
            if (!product) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy product này để xóa'
                )
            }
            return product
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async like(id: string, userId: string) {
        try {
            const newProduct = await this.productModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        likes: userId,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            if (!newProduct) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy product này để thích'
                )
            }

            return newProduct
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async unlike(id: string, userId: string) {
        try {
            const newProduct = await this.productModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        likes: userId,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            if (!newProduct) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy product này để bỏ thích'
                )
            }

            return newProduct
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async updateAny(productId: string, data: ICommonObj, isRelation?: boolean) {
        try {
            const product = await this.productModel.findByIdAndUpdate(productId, data, {
                new: true,
                runValidators: true,
            })
            if (!product) {
                configThrowError(
                    StatusCode.NOT_FOUND,
                    'Không tìm thấy product này để cập nhật'
                )
            }
            if (isRelation) {
                await product.populate(populate)
            }
            return product
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    // calc average rating
    async calcAverageRating(productId: string, comments: Comment[]) {
        const product = await this.findOne(productId, true)
        const totalRating = comments.reduce((total: number, c: Comment) => {
            return total + c.rating
        }, 0)
        product.ratingAverage =
            totalRating === 0 ? 0 : Math.floor(totalRating / comments.length)
        await product.save()
    }

    // recommend product
    async recommendation(id: string, userId: string) {
        const product = await this.findOne(id)
        const recommendProducts = await this.productModel
            .find({
                _id: {
                    $ne: product._id,
                },
                category: product.category,
                subCategory: product.subCategory,
                ratingAverage: { $gte: product.ratingAverage },
            })
            .sort({
                ratingAverage: -1,
            })
            .limit(10)

        return recommendProducts
    }

    // related
    async related(id: string) {
        const product = await this.findOne(id)
        const recommendProducts = await this.productModel
            .find({
                _id: {
                    $ne: product._id,
                },
                category: product.category,
            })
            .sort('-createdAt')
            .limit(10)

        return recommendProducts
    }

    // top products by price
    async top() {
        const products = await this.productModel
            .find()
            .sort('-unitsSold -price')
            .skip(0)
            .limit(12)
        return products
    }

    // new products
    async new() {
        const products = await this.productModel
            .find()
            .sort('-createdAt')
            .skip(0)
            .limit(12)
        return products
    }

    // recommend for user
    async recommendForUser(categoryId: string) {
        const products = await this.productModel
            .find({
                category: categoryId,
            })
            .sort('-price -unitsSold')
            .skip(0)
            .limit(12)
        return products
    }
}
