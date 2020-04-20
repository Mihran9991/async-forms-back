import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table, } from "sequelize-typescript";
import User from "./user";

@Table({
  modelName: "ForgotRequest",
  tableName: "forgot_requests",
  timestamps: true,
})
export class ForgotRequest extends Model {
  @PrimaryKey
  @Column({ allowNull: false, unique: true })
  uuid: string;
  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: string;
  @BelongsTo(() => User)
  user: User;
}

export default ForgotRequest;
