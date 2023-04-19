import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {UserRole} from "../roles/user-role.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      //обязательно добавлять все используемые в контроллерах, User моделях и сервисах используемые модели
      SequelizeModule.forFeature([User, Role, UserRole]),
      RolesModule,
      forwardRef(() => AuthModule)
  ],
    exports: [
        UsersService
    ]
})
export class UsersModule {}
