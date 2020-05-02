import { Request, Response, Router } from "express";

import FormRest from "../rest/form.rest";
import FormService from "../services/form.service";
import authMiddleware from "../middlewares/auth.middleware";
import FormConstants from "../constants/form.constants";

export class FormRouter {
  constructor(router: Router, service: FormService) {
    router.use((req, res, next) => {
      res.locals.formService = service;
      next();
    });
    router.get(
      `${FormConstants.FORM_BASE_URL}/getByName`,
      [authMiddleware],
      (req: Request, res: Response) =>
        FormRest.getByNameRouter(req, res, service)
    );
    router.get(
      `${FormConstants.FORM_INSTANCE_BASE_URL}/getByName`,
      [authMiddleware],
      (req: Request, res: Response) =>
        FormRest.getInstanceByNameRouter(req, res, service)
    );
    router.get(
      `${FormConstants.FORM_BASE_URL}/getAll`,
      [authMiddleware],
      (req: Request, res: Response) => FormRest.getAllRouter(req, res, service)
    );
    router.post(
      `${FormConstants.FORM_BASE_URL}/create`,
      [authMiddleware],
      (req: Request, res: Response) => FormRest.createRouter(req, res, service)
    );
    router.post(
      `${FormConstants.FORM_INSTANCE_BASE_URL}/create`,
      [authMiddleware],
      (req: Request, res: Response) =>
        FormRest.createInstanceRouter(req, res, service)
    );
    router.post(
      `${FormConstants.FORM_VALUE_BASE_URL}/insert`,
      [authMiddleware],
      (req: Request, res: Response) => FormRest.insertValue(req, res, service)
    );
  }
}

export default FormRouter;
