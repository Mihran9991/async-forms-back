file_name_prefix=$1
echo "
import { Repository } from 'sequelize-typescript';
import ${file_name_prefix^} from '../entities/${file_name_prefix,,}.entity';

export class ${file_name_prefix^}Repository { 
  private repository: Repository<${file_name_prefix^}>;

  constructor(repository: Repository<${file_name_prefix^}>) {
    this.repository = repository;
  }
}
" >> ../src/repositories/${file_name_prefix,,}.repository.ts
