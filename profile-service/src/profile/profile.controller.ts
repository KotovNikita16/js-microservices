import {Body, Controller, Delete, Get, Inject, Post, Put, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ProfileService} from "./profile.service";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {DeleteProfileDto} from "./dto/delete-profile.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {UpdateProfileDto} from "./dto/update-profile.dto";
import {ClientProxy, RmqRecordBuilder} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {LoginDto} from "./dto/create-user.dto";
import {CreateRoleDto} from "./dto/create-role.dto";
import {AddRoleDto} from "./dto/add-role.dto";
@ApiTags('Пользователи')
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService,
                @Inject('AUTH_SERVICE') private client: ClientProxy) {
        this.client.connect();
    }
    @ApiOperation({summary: 'Получить всех пользователей'})
    @Get()
    async getUsers() {
        return this.profileService.getAllUsers();
    }
    @ApiOperation({summary: 'Авторизация пользователя'})
    @Post('/login')
    async login(@Body() userDto: LoginDto) {
        return this.profileService.loginUser(userDto);
    }
    @ApiOperation({summary: 'Создание пользователя'})
    @Post('/registration')
    async create(@Body() userDto: CreateProfileDto) {
        return this.profileService.createUser(userDto);
    }

    @ApiOperation({summary: 'Обновление пользователя'})
    @Put()
    update(@Body() updateProfileDto: UpdateProfileDto, @Req() req: any) {
        return this.profileService.updateUser(updateProfileDto, req.headers.authorization);
    }

    @ApiOperation({summary: 'Удаление пользователя'})
    @Delete()
    delete(@Body() deleteProfileDto: DeleteProfileDto, @Req() req: any) {
        return this.profileService.deleteUser(deleteProfileDto, req.headers.authorization);
    }

    @ApiOperation({summary: 'Забанить пользователя'})
    //@ApiResponse({status: 200, type: [User]})
    @Post('/ban')
    banUser(@Body() banUserDto: BanUserDto) {
        return this.profileService.banUser(banUserDto);
    }

    @ApiOperation({summary: 'Забанить пользователя'})
    //@ApiResponse({status: 200, type: [User]})
    @Post('/role/create')
    createRole(@Body() roleDto: CreateRoleDto) {
        return this.profileService.createRole(roleDto);
    }

    @Post('/role')
    addRole(@Body() addRoleDto: AddRoleDto, @Req() req: any) {
        return this.profileService.addRole(addRoleDto, req.headers.authorization);
    }

    @Delete('/role/remove')
    remRole(@Body() addRoleDto: AddRoleDto, @Req() req: any) {
        return this.profileService.removeRole(addRoleDto, req.headers.authorization);
    }
}
