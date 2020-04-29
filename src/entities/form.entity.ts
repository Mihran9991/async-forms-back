import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { TEXT } from "sequelize";

import User from "./user.entity";

@Table({
  modelName: "Form",
  tableName: "forms",
  timestamps: true,
})
export class Form extends Model {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    allowNull: false,
    unique: true,
  })
  name: string;
  @Column({
    allowNull: false,
    unique: true,
  })
  sysName: string;
  @ForeignKey(() => User)
  @Column({ allowNull: false })
  ownerId: string;
  @BelongsTo(() => User)
  owner: User;
  @Column({
    allowNull: false,
    type: TEXT,
  })
  json: string;
}

export default Form;
