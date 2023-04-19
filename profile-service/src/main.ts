//Запуск сервера

import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "./pipes/validation.pipe";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {INestApplication} from "@nestjs/common";

async function start() {
    const PORT = process.env.PORT || 5000;
    //создаем сервер на основе AppModule
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: 'amqp://rabbit:5672',
            queue: 'auth_queue',
            queueOptions: {
                durable: false
            },
        },
    });

    const config = new DocumentBuilder()
        .setTitle('NestJS TypeScript server')
        .setDescription('Работа с профилями')
        .setVersion('1.0.0')
        .addTag('Kotov Nikita')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    app.useGlobalPipes(new ValidationPipe());

    await app.startAllMicroservices();
    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start()