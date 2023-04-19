import {Body, Controller, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";

@ApiTags("Авторизация")
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @MessagePattern('login')
    login(@Payload() userDto: any, @Ctx() context: RmqContext) {
        const dto = JSON.parse(userDto) as CreateUserDto;
        return this.authService.login(dto);
    }
    @MessagePattern('register-user')
    registration(@Payload() userDto: any, @Ctx() context: RmqContext) {
        const dto = JSON.parse(userDto) as CreateUserDto;
        return this.authService.registration(dto);
    }
}
