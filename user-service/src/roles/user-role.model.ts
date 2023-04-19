import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {Role} from "./roles.model";

@Table({tableName: "user_role", createdAt: false, updatedAt: false})
export  class UserRole extends Model<UserRole> {
    @Column({type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true})
    id: bigint;

    @ForeignKey(() => User)
    @Column({type: DataType.BIGINT, allowNull: false})
    user_id: bigint;

    @ForeignKey(() => Role)
    @Column({type: DataType.BIGINT, allowNull: false})
    role_id: bigint;
}