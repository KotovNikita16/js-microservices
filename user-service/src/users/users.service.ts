import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from "./users.model";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue("ADMIN");
        await user.$set('role', [Number(role.id)]);
        user.role = [role];
        return user;
    }

    async updateUser(dto: UpdateUserDto) {
        const password = await bcrypt.hash(dto.password, 5);
        await this.userRepository.update(
            {login: dto.newLogin, password: password},
            {where: {login: dto.login}}
        )
        return await this.getUsersByLogin(dto.newLogin);
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUsersByLogin(login: string) {
        const user = await this.userRepository.findOne({where: {login}, include: {all: true}});
        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (user && role) {
            await user.$add('role', [Number(role.id)]);
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    async removeRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (user && role) {
            await user.$remove('role', [Number(role.id)]);
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    async deleteUserByLogin(login: string) {
        const user = await this.getUsersByLogin(login);
        await this.userRepository.destroy({where: {login}});
        return user;
    }
}
