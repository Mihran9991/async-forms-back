
file_name_prefix=$1
echo "
export class ${file_name_prefix^}Dto {
  public constructor() {}
}

export default ${file_name_prefix^}Dto;
" >> ../src/dtos/${file_name_prefix,,}.dto.ts
