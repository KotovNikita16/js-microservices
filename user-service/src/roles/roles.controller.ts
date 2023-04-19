import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {}

    @MessagePattern('create-role')
    create(@Payload() dto: any, @Ctx() context: RmqContext) {
        const roleDto = JSON.parse(dto);
        return this.roleService.createRole(roleDto);
    }

    @Get('/:value')
    getByValue(@Param('value') value: string) {
        return this.roleService.getRoleByValue(value);
    }
}
