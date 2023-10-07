import { CategoriesService } from '../categories/categories.service'
import { ColorsService } from '../colors/colors.service'
import { IQueryProduct, LimitDto, PageDto, RequestUser } from '../models'
import { Product } from './products.schema'
import { ProductsService } from './products.service'
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request,
    InternalServerErrorException,
} from '@nestjs/common'
import { ApiBody, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { SearchDto } from './dtos'
import { UsersService } from '../users/users.service'
import { Gender } from '../enums'

@Controller('products')
@ApiTags('Product')
export class ProductsController {
    constructor(
        private readonly productService: ProductsService,
        private readonly colorService: ColorsService,
        private readonly categoryService: CategoriesService,
        private readonly userService: UsersService
    ) {}

    @Get('/top')
    async topProducts() {
        const products = await this.productService.top()

        return {
            products,
        }
    }

    @Get('/new')
    async newProducts() {
        const products = await this.productService.new()

        return {
            products,
        }
    }

    @Get('/recommend-user')
    async recommendUser(@Request() req: RequestUser) {
        if (req.user.gender !== Gender.OTHER) {
            const categoryId = await this.categoryService.findCategoryByGender(
                req.user.gender
            )
            if (!categoryId)
                return {
                    products: [],
                }
            const products = await this.productService.recommendForUser(categoryId)
            return {
                products,
            }
        }
        return {
            products: [],
        }
    }

    @Get('/')
    @ApiQuery({
        name: 'page',
        required: false,
        type: PageDto,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: LimitDto,
    })
    @ApiQuery({
        name: 'category',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'price[gte]',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'price[lte]',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'color',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'size',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'ratingAverage',
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: 'isFreeShip',
        required: false,
        type: Boolean,
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        type: String,
    })
    async getAllProducts(@Query() query: IQueryProduct) {
        const [products, total] = await this.productService.findAllAndCount(query)

        const page = Math.ceil(Number(total) / query.limit)
        const nextPage = +query.page >= +page ? null : +query.page + 1
        const prevPage = +query.page === 1 ? null : +query.page - 1

        return {
            products,
            prevPage,
            nextPage,
            total,
        }
    }

    @Post('/search')
    async getProductsBySearch(@Body() data: SearchDto) {
        const products = await this.productService.search(data.search)
        return {
            products,
        }
    }

    @Get('/:slug')
    async getProductBySlug(@Param('slug') slug: string) {
        const product = await this.productService.findBySlug(slug, true)
        return {
            product,
        }
    }

    @ApiSecurity('JWT-auth')
    @Post('/')
    async createProduct(@Body() data: Partial<Product>) {
        const product = await this.productService.create(data)
        for (const color of data.colors) {
            await this.colorService.updateOne(color as any, {
                $push: {
                    products: product._id,
                },
            })
        }

        await this.categoryService.updateOne(data.category as any, {
            $push: {
                products: product._id,
            },
        })

        return {
            message: 'Tạo sản phẩm mới thành công',
            product,
        }
    }

    @ApiSecurity('JWT-auth')
    @Put('/:productId')
    @ApiBody({
        type: Product,
    })
    async updateProduct(@Param('productId') id: string, @Body() data: Partial<Product>) {
        const product = await this.productService.update(id, data)
        return {
            message: 'Cập nhật sản phẩm thành công',
            product,
        }
    }

    @ApiSecurity('JWT-auth')
    @Delete('/:productId')
    async deleteProduct(@Param('productId') id: string) {
        const product = await this.productService.delete(id)
        return {
            message: 'Xóa sản phẩm thành công',
            product,
        }
    }

    @ApiSecurity('JWT-auth')
    @Get('/like/:productId')
    async likeProduct(@Param('productId') id: string, @Request() req: RequestUser) {
        const product = await this.productService.like(id, req.user._id)
        await this.userService.updateAny(req.user._id, {
            $push: { favoriteProducts: { $each: [product._id], $position: 0 } },
        })
        return {
            message: 'Thích sản phẩm này thành công',
            product,
        }
    }

    @ApiSecurity('JWT-auth')
    @Get('/unlike/:productId')
    async unlikeProduct(@Param('productId') id: string, @Request() req: RequestUser) {
        const product = await this.productService.unlike(id, req.user._id)
        await this.userService.updateAny(req.user._id, {
            $pull: {
                favoriteProducts: product._id,
            },
        })
        return {
            message: 'Bỏ thích sản phẩm này thành công',
            product,
        }
    }

    @Get('/calculator-rating/:productId')
    async calculatorRating(@Param('productId') id: string) {
        const product = await this.productService.findOne(id, true)

        try {
            const newProduct = await this.productService.calcAverageRating(
                id,
                product.comments
            )
            return { product: newProduct }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    @Get('/recommender/:productId')
    async recommenderProducts(
        @Param('productId') id: string,
        @Request() req: RequestUser
    ) {
        const recommendProducts = await this.productService.recommendation(
            id,
            req.user._id
        )

        return {
            products: recommendProducts,
        }
    }

    @Get('/related/:productId')
    async relatedProducts(@Param('productId') id: string) {
        const products = await this.productService.related(id)

        return {
            products,
        }
    }
}
