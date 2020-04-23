
import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  modelName: 'Form',
  tableName: 'form',
  timestamps: true,
})
export class Form extends Model { }

export default Form;

