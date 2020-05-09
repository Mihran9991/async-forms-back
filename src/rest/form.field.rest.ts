import { Request, Response } from "express";

import FormFieldService from "../services/form.field.service";
import FormFieldDto from "../dtos/form.fied.dto";

export function formFieldRouter(
  req: Request,
  res: Response,
  service: FormFieldService
) {
  const formFieldDto: FormFieldDto = new FormFieldDto(
    req.body.rowId,
    req.body.columnId,
    req.body.formId,
    req.body.fieldName,
    req.body.type,
    req.body.instanceName,
    req.body.value,
    req.body.formName,
    req.body.ownerId
  );

  return service
    .isFieldLocked(formFieldDto)
    .then((isLocked) => {
      res.status(200).json({ isLocked });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
}

export default {
  formFieldRouter,
};
