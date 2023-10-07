import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { AddressController } from './address/address.controller'
import { AddressModule } from './address/address.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CartsModule } from './carts/carts.module'
import { CategoriesModule } from './categories/categories.module'
import { ColorsModule } from './colors/colors.module'
import { CommentsModule } from './comments/comments.module'
import { ContactsModule } from './contacts/contacts.module'
import { SerializeInterceptor } from './interceptors'
import { AuthenticationMiddleware, RestrictMiddleware } from './middlewares'
import { OrdersController } from './orders/orders.controller'
import { OrdersModule } from './orders/orders.module'
import { ProductsModule } from './products/products.module'
import { RolesController } from './roles/roles.controller'
import { RolesModule } from './roles/roles.module'
import { SizesModule } from './sizes/sizes.module'
import { SubCategoryModule } from './sub-category/sub-category.module'
import { UsersController } from './users/users.controller'
import { UsersModule } from './users/users.module'
import { ReportsModule } from './reports/reports.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.DB_URL),
        UsersModule,
        ProductsModule,
        ColorsModule,
        CategoriesModule,
        OrdersModule,
        AddressModule,
        CartsModule,
        CommentsModule,
        RolesModule,
        AuthModule,
        SizesModule,
        ReportsModule,
        ContactsModule,
        SubCategoryModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: SerializeInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .exclude({
                path: 'orders/all',
                method: RequestMethod.DELETE,
            })
            .forRoutes(
                {
                    path: 'users/profile',
                    method: RequestMethod.GET,
                },
                {
                    path: 'users/me',
                    method: RequestMethod.DELETE,
                },
                {
                    path: 'users/:userId',
                    method: RequestMethod.PUT,
                },
                {
                    path: 'orders/:userId',
                    method: RequestMethod.GET,
                },
                {
                    path: 'orders',
                    method: RequestMethod.POST,
                },
                {
                    path: 'orders/:orderId',
                    method: RequestMethod.DELETE,
                },
                {
                    path: 'carts/:userId',
                    method: RequestMethod.DELETE,
                },
                {
                    path: 'carts',
                    method: RequestMethod.POST,
                },
                {
                    path: 'carts/items-list/:cartId',
                    method: RequestMethod.PUT,
                },
                {
                    path: 'products/like/:productId',
                    method: RequestMethod.GET,
                },
                {
                    path: 'products/unlike/:productId',
                    method: RequestMethod.GET,
                },
                {
                    path: 'products/recommender/:productId',
                    method: RequestMethod.GET,
                },
                {
                    path: 'comments',
                    method: RequestMethod.POST,
                },
                {
                    path: 'comments/:commentId',
                    method: RequestMethod.DELETE,
                },
                {
                    path: 'comments/like/:commentId',
                    method: RequestMethod.GET,
                },
                {
                    path: 'comments/unlike/:commentId',
                    method: RequestMethod.GET,
                },
                {
                    path: 'products/recommend-user',
                    method: RequestMethod.GET,
                },
                // {
                //     path: 'carts',
                //     method: RequestMethod.POST,
                // },
                // {
                //     path: 'carts/items/:cartId',
                //     method: RequestMethod.PUT,
                // },
                // {
                //     path: 'carts/items/:cartId/:productId',
                //     method: RequestMethod.DELETE,
                // },
                // {
                //     path: 'carts/:cartId',
                //     method: RequestMethod.DELETE,
                // },
                AddressController
                // CommentsController
            )

        consumer
            .apply(AuthenticationMiddleware, RestrictMiddleware.forRoles(['admin']))
            .exclude(
                'users/profile',
                {
                    path: 'users/:userId',
                    method: RequestMethod.PUT,
                },
                {
                    path: 'orders/:userId',
                    method: RequestMethod.GET,
                },
                {
                    path: 'orders',
                    method: RequestMethod.POST,
                },
                {
                    path: 'orders/:orderId',
                    method: RequestMethod.DELETE,
                },
                {
                    path: 'carts/:userId',
                    method: RequestMethod.DELETE,
                },
                {
                    path: 'carts',
                    method: RequestMethod.POST,
                },
                {
                    path: 'carts/items/:cartId',
                    method: RequestMethod.PUT,
                },
                {
                    path: 'carts/items/:cartId/:productId',
                    method: RequestMethod.DELETE,
                },
                {
                    path: 'carts/:cartId',
                    method: RequestMethod.DELETE,
                },
                {
                    path: 'categories',
                    method: RequestMethod.GET,
                },
                {
                    path: 'colors',
                    method: RequestMethod.GET,
                }
            )
            .forRoutes(
                UsersController,
                OrdersController,
                RolesController
                // CategoriesController,
                // ColorsController
            )
    }
}
