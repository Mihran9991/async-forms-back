

file_name_prefix=$1
echo "
import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  modelName: '${file_name_prefix^}',
  tableName: '${file_name_prefix,,}',
  timestamps: true,
})
export class ${file_name_prefix^} extends Model { }

export default ${file_name_prefix^};
" >> ../src/entities/${file_name_prefix,,}.entity.ts

