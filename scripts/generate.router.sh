file_name_prefix=$1
echo "
import { Request, Response, Router } from 'express';
import ${file_name_prefix^}Rest from '../rest/${file_name_prefix,,}.rest';
import ${file_name_prefix^}Service from '../services/${file_name_prefix,,}.service';
import authMiddleware from '../middlewares/auth.middleware';


export class ${file_name_prefix^}Router { 
  constructor(router: Router, service: ${file_name_prefix^}Service) {
    router.use((req, res, next) => {
      res.locals.${file_name_prefix^}Service = service;
      next();
    });
  }
}
" >> ../src/routes/${file_name_prefix,,}.router.ts
