import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {DeleteProfileDto} from "./dto/delete-profile.dto";
import {BanUserDto} from "./dto/ban-user.dto"
import {UpdateProfileDto} from "./dto/update-profile.dto";
import {ClientProxy, ClientProxyFactory, RmqRecordBuilder} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {LoginDto} from "./dto/create-user.dto";
import {CreateRoleDto} from "./dto/create-role.dto";
import {AddRoleDto} from "./dto/add-role.dto";

@Injectable()
export class ProfileService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
                @Inject('AUTH_SERVICE') private client: ClientProxy) {}
    async getAllUsers() {
        const users = await firstValueFrom(
            this.client.send('get-all-users', 'get-all-users')
        );
        const profiles = await this.profileRepository.findAll({include: {all: true}});

        const userData = [];
        for (let user of users) {
            userData.push({
                ...profiles.find(({ userId }) => userId === user.id),
                login: user.login,
                password: user.password
            }
            );
        }

        return userData;
    }
    async loginUser(dto: LoginDto) {
        const userDto = {login: dto.login, password: dto.password};
        const token = await firstValueFrom(
            this.client.send('login', JSON.stringify(userDto)),
        );
        return token;
    }
    async createUser(dto: CreateProfileDto) {
        const userDto = {login: dto.login, password: dto.password};
        const user = await firstValueFrom(
            this.client.send('register-user', JSON.stringify(userDto)),
        );
        const profile = this.profileRepository.create({...dto, userId: user.id});
        return {user, ...profile};
    }

    async updateUser(dto: UpdateProfileDto, auth: string) {
        const user = await firstValueFrom(
            this.client.send('update-user',
                {login: dto.login, newLogin: dto.newLogin, password: dto.password, authorization: auth})
        );
        await this.profileRepository.update(
            {phone: dto.phone, name: dto.name},
            {where: {userId: user.id}}
        );
        return dto;
    }

    async deleteUser(dto: DeleteProfileDto, auth: string) {
        const user = await firstValueFrom(
            this.client.send('delete-user', {login: dto.login, authorization: auth}),
        );
        await this.profileRepository.destroy({where: {userId: user.id}});
        return `Пользователь ${user.login} успешно удален`;
    }

    async banUser(dto: BanUserDto) {
        const user = await this.profileRepository.findOne({where: {userId: dto.userId}});
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return {user};
    }

    async createRole(dto: CreateRoleDto) {
        const role = await firstValueFrom(
            this.client.send('create-role', JSON.stringify(dto)),
        );
        return role;
    }

    async addRole(addRoleDto: AddRoleDto, auth: string) {
        const user = await firstValueFrom(
            this.client.send('role-user', {addRoleDto: JSON.stringify(addRoleDto), authorization: auth}),
        );
        return user;
    }

    async removeRole(addRoleDto: AddRoleDto, auth: string) {
        const user = await firstValueFrom(
            this.client.send('remove-role-user', {remRoleDto: JSON.stringify(addRoleDto), authorization: auth}),
        );
        return user;
    }
}
