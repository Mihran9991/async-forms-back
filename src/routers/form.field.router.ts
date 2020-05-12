import { Request, Response, Router } from "express";
import FormFieldRest from "../rest/form.field.rest";
import FormFieldService from "../services/form.field.service";
import authMiddleware from "../middlewares/auth.middleware";
import ValidationMid from "../middlewares/validation.middleware";

const BASE_URL: string = "/form/field";

export class FormFieldRouter {
  constructor(router: Router, service: FormFieldService) {
    router.get(
      `${BASE_URL}/audit`,
      [authMiddleware],
      ValidationMid.getFormFieldAuditParams(),
      ValidationMid.validate,
      (req: Request, res: Response) =>
        FormFieldRest.getFieldAuditRouter(req, res, service)
    );
    router.post(
      `${BASE_URL}/isLocked`,
      [authMiddleware],
      ValidationMid.isFormFieldLockedForm(),
      ValidationMid.validate,
      (req: Request, res: Response) =>
        FormFieldRest.isFieldLockedRouter(req, res, service)
    );
  }
}

export default FormFieldRouter;
