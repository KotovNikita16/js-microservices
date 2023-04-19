//Запуск сервера

import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {JwtAuthGuard} from "./auth/jwt-auth.guard";
import {ValidationPipe} from "./pipes/validation.pipe";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function start() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://rabbit:5672'],
                queue: 'auth_queue',
                queueOptions: { durable: false },
            },
        },
    );
    await app.listen();
    console.log('Token service started');
}

start()