import { Request, Response } from "express";

import FormInstanceService from "../services/form.instance.service";
import UserPrincipal from "../principals/user.principal";
import InstanceDto from "../dtos/instance.dto";
import { InsertInstanceValueDto } from "../dtos/insert.instance.value.dto";
import GetFormInstanceDto from "../dtos/get.form.instance.dto";

export function getRouter(
  req: Request,
  res: Response,
  service: FormInstanceService
) {
  const instanceDto: InstanceDto = new InstanceDto(
    req.query.instanceName.toString(),
    req.query.formName.toString()
  );
  return service
    .getValues(instanceDto)
    .then((json: object) => res.status(200).json(json))
    .catch((err) => res.status(400).json({ error: err }));
}

export function getInstancesRouter(
  req: Request,
  res: Response,
  service: FormInstanceService
) {
  const name: string = req.query.formName.toString();
  return service
    .getInstances(name)
    .then((dtos: GetFormInstanceDto[]) => res.status(200).json(dtos))
    .catch((err) => res.status(400).json({ error: err }));
}

export function createRouter(
  req: Request,
  res: Response,
  service: FormInstanceService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  const instanceDto: InstanceDto = new InstanceDto(
    req.body.instanceName,
    req.body.formName
  );
  return service
    .create(instanceDto, principal.uuid)
    .then((instance) => {
      res.status(200).json(instance);
    })
    .catch(() =>
      res.status(400).json({
        error: `Error creating form instance, maybe it already exists?`,
      })
    );
}

export function insertValue(
  req: Request,
  res: Response,
  service: FormInstanceService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  const valueDto: InsertInstanceValueDto = new InsertInstanceValueDto(
    req.body.formName,
    req.body.instanceName,
    req.body.field
  );
  return service
    .insertValue(valueDto, principal.uuid)
    .then(() => {
      res.status(200).json("Value inserted successfully");
    })
    .catch((err) => res.status(400).json({ error: err }));
}

export default {
  getRouter,
  getInstancesRouter,
  createRouter,
  insertValue,
};
