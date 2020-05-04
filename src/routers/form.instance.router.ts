import { Request, Response, Router } from "express";

import FormInstanceRest from "../rest/form.instance.rest";
import FormInstanceService from "../services/form.instance.service";
import authMiddleware from "../middlewares/auth.middleware";
import { FORM_INSTANCE_BASE_URL as BASE_URL } from "../constants/form.constants";
import ValidationMid from "../middlewares/validation.middleware";

export class FormInstanceRouter {
  constructor(router: Router, service: FormInstanceService) {
    router.use((req, res, next) => {
      res.locals.formService = service;
      next();
    });
    router.get(
      `${BASE_URL}/get`,
      [authMiddleware],
      ValidationMid.getInstanceParams(),
      ValidationMid.validate,
      (req: Request, res: Response) =>
        FormInstanceRest.getByNameRouter(req, res, service)
    );
    router.post(
      `${BASE_URL}/create`,
      [authMiddleware],
      (req: Request, res: Response) =>
        FormInstanceRest.createRouter(req, res, service)
    );
    router.post(
      `${BASE_URL}/insert`,
      [authMiddleware],
      (req: Request, res: Response) =>
        FormInstanceRest.insertValue(req, res, service)
    );
  }
}

export default FormInstanceRouter;
