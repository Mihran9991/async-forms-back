import { Request, Response } from "express";
import get from "lodash/get";

import FormFieldService from "../services/form.field.service";
import FormFieldDto from "../dtos/form.field.dto";
import GetFormFieldAuditDto from "../dtos/get.form.field.audit.dto";
import FormFieldAuditDto from "../dtos/form.field.audit.dto";

export function getFieldAuditRouter(
  req: Request,
  res: Response,
  service: FormFieldService
) {
  const query = get(req, "query", {});
  const formFieldDto: FormFieldAuditDto = new FormFieldAuditDto(
    get(query, "formName", "").toString(),
    get(query, "instanceName", "").toString(),
    get(query, "fieldName", "").toString(),
    get(query, "rowId", "").toString(),
    get(query, "columnName", "").toString()
  );
  return service
    .getFieldAudit(formFieldDto)
    .then((data: GetFormFieldAuditDto[]) => res.status(200).json(data))
    .catch((error) => res.status(400).json({ error }));
}

export function isFieldLockedRouter(
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
    .then(({ isLocked }) => {
      res.status(200).json({ isLocked });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
}

export default {
  getFieldAuditRouter,
  isFieldLockedRouter,
};
