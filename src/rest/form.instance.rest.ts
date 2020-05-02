import { Request, Response } from "express";

import FormInstanceService from "../services/form.instance.service";
import UserPrincipal from "../principals/user.principal";
import FormMapper from "../mappers/form.mappers";
import { FormInstance, Nullable } from "../types/main.types";
import CreateFormInstanceDto from "../dtos/create.form.instance.dto";
import { InsertFormValueDto } from "../dtos/insert.form.value.dto";

export function getByNameRouter(
  req: Request,
  res: Response,
  service: FormInstanceService
) {
  const name: string = req.body.name;
  const formName: string = req.body.formName;
  return service
    .getByName(name, formName)
    .then((instance: Nullable<FormInstance>) => {
      if (!instance) {
        throw `Form instance with name: ${name} not found`;
      }
      res.status(200).json(FormMapper.fromInstanceEntityToDto(instance));
    })
    .catch((err) => res.status(400).json({ error: err }));
}

export function createRouter(
  req: Request,
  res: Response,
  service: FormInstanceService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  const formDto: CreateFormInstanceDto = new CreateFormInstanceDto(
    req.body.name,
    req.body.formName
  );
  return service
    .create(formDto, principal.uuid)
    .then((instance) => {
      res
        .status(200)
        .json(FormMapper.fromInstanceEntityToDto(instance as FormInstance));
    })
    .catch(() => {
      res.status(400).json({
        error: `Error creating form instance, maybe it already exists?`,
      });
    });
}

export function insertValue(
  req: Request,
  res: Response,
  service: FormInstanceService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  const valueDto: InsertFormValueDto = new InsertFormValueDto(
    req.body.formName,
    req.body.instanceName,
    req.body.field
  );
  return service
    .insertValue(valueDto, principal.uuid)
    .then(() => {
      res.status(200).json("Value inserted successfully");
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

export default {
  getByNameRouter,
  createRouter,
  insertValue,
};
