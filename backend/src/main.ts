import { configSwagger } from './config'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api/v1')

    // config swagger
    configSwagger(app)

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        })
    )
    app.enableCors({
        origin: ['https://yody-store.onrender.com', 'http://localhost:3000'],
        credentials: true,
    })
    await app.listen(5000)
}
bootstrap()
