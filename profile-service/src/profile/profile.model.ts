import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

//значения, которые по умолчанию будут заданы при создании нового User
interface ProfileCreationAttrs {
    name: string;
    phone: string;
    userId: bigint;
}

@Table({tableName: "profile"})
export  class Profile extends Model<Profile, ProfileCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true})
    id: bigint;

    @ApiProperty({example: 'Иван', description: 'Имя пользователя'})
    @Column({type: DataType.STRING})
    name: string;

    @ApiProperty({example: '24-35-44', description: 'Телефон пользователя'})
    @Column({type: DataType.STRING})
    phone: string;

    @ApiProperty({example: 'true', description: 'Забанен пользователь или нет'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'Нарушение правил', description: 'Причина бана'})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @Column({type: DataType.BIGINT, allowNull: false})
    userId: bigint;
}