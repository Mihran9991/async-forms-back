import { Request, Response, Router } from "express";

import FormRest from "../rest/form.rest";
import FormService from "../services/form.service";

export class FormRouter {
  constructor(router: Router, service: FormService) {
    router.use((req, res, next) => {
      res.locals.FormService = service;
      next();
    });
    router.post("/form/create", [], (req: Request, res: Response) =>
      FormRest.createRouter(req, res, service)
    );
  }
}

export default FormRouter;
