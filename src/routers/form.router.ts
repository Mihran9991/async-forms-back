import { Request, Response, Router } from "express";

import FormRest from "../rest/form.rest";
import FormService from "../services/form.service";
import authMiddleware from "../middlewares/auth.middleware";
import { FORM_BASE_URL as BASE_URL } from "../constants/form.constants";

export class FormRouter {
  constructor(router: Router, service: FormService) {
    router.use((req, res, next) => {
      res.locals.formService = service;
      next();
    });
    router.get(
      `${BASE_URL}/getByName`,
      [authMiddleware],
      (req: Request, res: Response) =>
        FormRest.getByNameRouter(req, res, service)
    );
    router.get(
      `${BASE_URL}/getAll`,
      [authMiddleware],
      (req: Request, res: Response) => FormRest.getAllRouter(req, res, service)
    );
    router.post(
      `${BASE_URL}/create`,
      [authMiddleware],
      (req: Request, res: Response) => FormRest.createRouter(req, res, service)
    );
  }
}

export default FormRouter;
