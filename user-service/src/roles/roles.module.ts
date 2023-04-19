import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import {RolesController} from "./roles.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {UserRole} from "./user-role.model";

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    //обязательно добавлять все используемые в контроллерах, Role моделях и сервисах используемые модели
    SequelizeModule.forFeature([Role, User, UserRole])
  ],
  exports: [
    RolesService
  ]
})
export class RolesModule {}
