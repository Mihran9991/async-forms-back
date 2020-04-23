file_name_prefix=$1
echo "
import { Request, Response } from 'express';
import ${file_name_prefix^}Service from '../services/${file_name_prefix,,}.service';
import ${file_name_prefix^}Dto from '../dtos/${file_name_prefix,,}.dto';

export function exampleRouter(
  req: Request,
  res: Response,
  service: ${file_name_prefix^}Service
) { }

export default {
  exampleRouter
};

" >> ../src/rest/${file_name_prefix,,}.rest.ts
