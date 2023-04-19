import {Body, Controller, Post, Get, UseGuards, UsePipes, Delete} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {Ctx, EventPattern, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {AdminLoginAuthGuard} from "../auth/admin-login-auth.guard";
import {UpdateUserDto} from "./dto/update-user.dto";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    @ApiOperation({summary: 'Создание пользователя'})
    @EventPattern('create-user')
    create(@Payload() userDto: CreateUserDto, @Ctx() context: RmqContext) {
        return this.userService.createUser(userDto);
    }
    @ApiOperation({summary: 'Получение пользователя'})
    @UseGuards(AdminLoginAuthGuard)
    @MessagePattern('get-user')
    get(@Payload() login: string, @Ctx() context: RmqContext) {
        return this.userService.getUsersByLogin(login);
    }
    @ApiOperation({summary: 'Обновление пользователя'})
    @UseGuards(AdminLoginAuthGuard)
    @MessagePattern('update-user')
    update(@Payload() userDto: any, @Ctx() context: RmqContext) {
        return this.userService.updateUser(userDto);
    }
    @ApiOperation({summary: 'Удаление пользователя'})
    @UseGuards(AdminLoginAuthGuard)
    @MessagePattern('delete-user')
    delete(@Payload() deleteUser: any, @Ctx() context: RmqContext) {
        return this.userService.deleteUserByLogin(deleteUser.login);
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
    @MessagePattern('get-all-users')
    getAll(@Payload() data: any, @Ctx() context: RmqContext) {
        return this.userService.getAllUsers();
    }
    @ApiOperation({summary: 'Выдать роль'})
    @ApiResponse({status: 200, type: [User]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @MessagePattern('role-user')
    addRole(@Payload() addData: any, @Ctx() context: RmqContext) {
        const dto = JSON.parse(addData.addRoleDto);
        return this.userService.addRole(dto);
    }
    @ApiOperation({summary: 'Убрать роль'})
    @ApiResponse({status: 200, type: [User]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @MessagePattern('remove-role-user')
    removeRole(@Payload() remData: any, @Ctx() context: RmqContext) {
        const dto = JSON.parse(remData.remRoleDto);
        return this.userService.removeRole(dto);
    }
}
