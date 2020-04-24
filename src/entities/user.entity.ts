import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import ForgotRequest from "./forgot.request.entity";

@Table({
  modelName: "User",
  tableName: "users",
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Column({ allowNull: false, unique: true })
  uuid: string;
  @Column({ allowNull: false })
  name: string;
  @Column({ allowNull: false })
  surname: string;
  @Column({ allowNull: false, unique: true })
  email: string;
  @Column({ allowNull: false })
  password: string;
  @Column
  pictureUrl: string;
  @HasMany(() => ForgotRequest)
  forgotRequests: ForgotRequest[];
}

export default User;
