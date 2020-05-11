import { Request, Response, Router } from "express";
import FormFieldRest from "../rest/form.field.rest";
import FormFieldService from "../services/form.field.service";
import authMiddleware from "../middlewares/auth.middleware";

const BASE_URL: string = "/form/field";

export class FormFieldRouter {
  constructor(router: Router, service: FormFieldService) {
    router.get(
      `${BASE_URL}/audit`,
      [authMiddleware],
      (req: Request, res: Response) =>
        FormFieldRest.getFieldAuditRouter(req, res, service)
    );
    router.post(
      `${BASE_URL}/isLocked`,
      [authMiddleware],
      (req: Request, res: Response) =>
        FormFieldRest.isFieldLockedRouter(req, res, service)
    );
  }
}

export default FormFieldRouter;
