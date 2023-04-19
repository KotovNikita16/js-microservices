import {Module} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  imports: [
      ClientsModule.registerAsync([
          {
              name: 'AUTH_SERVICE',
              useFactory: () => ({transport: Transport.RMQ,
              options: {
                  urls: ['amqp://rabbit:5672'],
                  queue: 'auth_queue',
                  queueOptions: {
                      durable: false
                  }
              }
          }
              )}
      ]),
      SequelizeModule.forFeature([Profile]),
  ]
})
export class ProfileModule {}
