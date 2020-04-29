import { Request, Response, Router } from "express";

import FormRest from "../rest/form.rest";
import FormService from "../services/form.service";
import authMiddleware from "../middlewares/auth.middleware";

const BASE_URL: string = "/form";

export class FormRouter {
  constructor(router: Router, service: FormService) {
    router.use((req, res, next) => {
      res.locals.formService = service;
      next();
    });
    router.get(
      `${BASE_URL}/get`,
      [authMiddleware],
      (req: Request, res: Response) => FormRest.getRouter(req, res, service)
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
