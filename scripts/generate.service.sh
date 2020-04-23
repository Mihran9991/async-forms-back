file_name_prefix=$1
echo "
import ${file_name_prefix^}Repository from  '../repositories/${file_name_prefix,,}.repository';
import ${file_name_prefix^}Dto from '../dtos/${file_name_prefix,,}.dto';
import ${file_name_prefix^} from '../entities/${file_name_prefix,,}.entity';

export class ${file_name_prefix^}Service {
  private ${file_name_prefix,,}Repository: ${file_name_prefix^}Repository;

  public constructor() {}
}

export default ${file_name_prefix^}Service;
" >> ../src/services/${file_name_prefix,,}.service.ts
