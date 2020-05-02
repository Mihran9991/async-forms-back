import { Request, Response } from "express";
import FormService from "../services/form.service";
import CreateFormDto from "../dtos/create.form.dto";
import UserPrincipal from "../principals/user.principal";
import Form from "../entities/form.entity";
import FormMapper from "../mappers/form.mappers";
import FormDto from "../dtos/form.dto";
import { FormInstance, Nullable } from "../types/main.types";
import CreateFormInstanceDto from "../dtos/create.form.instance.dto";
import { InsertFormValueDto } from "../dtos/insert.form.value.dto";

export function getByNameRouter(
  req: Request,
  res: Response,
  service: FormService
) {
  const name: string = req.body.name;
  return service
    .getByName(name)
    .then((form: Nullable<Form>) => {
      if (!form) {
        throw `Form with name: ${name} not found`;
      }
      res.status(200).json(JSON.parse(form.json));
    })
    .catch((err) => res.status(400).json({ error: err }));
}

export function getInstanceByNameRouter(
  req: Request,
  res: Response,
  service: FormService
) {
  const name: string = req.body.name;
  const formName: string = req.body.formName;
  return service
    .getInstanceByName(name, formName)
    .then((instance: Nullable<FormInstance>) => {
      if (!instance) {
        throw `Form instance with name: ${name} not found`;
      }
      res.status(200).json(FormMapper.fromInstanceEntityToDto(instance));
    })
    .catch((err) => res.status(400).json({ error: err }));
}

export function getAllRouter(
  req: Request,
  res: Response,
  service: FormService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  return service
    .getAllByOwner(principal.uuid)
    .then((forms: Form[]) =>
      forms.map((form: Form) => FormMapper.fromEntityToDto(form))
    )
    .then((dtos: FormDto[]) => res.status(200).json(dtos))
    .catch((err) => res.status(400).json({ error: err }));
}

export function createRouter(
  req: Request,
  res: Response,
  service: FormService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  const formDto: CreateFormDto = new CreateFormDto(
    req.body.name,
    req.body.fields,
    req.body.style,
    req.body.optional,
    JSON.stringify(req.body)
  );
  return service
    .create(formDto, principal.uuid)
    .then(() => {
      res.status(200).json({ message: "Form created successfully" });
    })
    .catch((err) => {
      console.log("ERROR CREATING FORM", err);
      res
        .status(400)
        .json({ error: `Error creating form, maybe it already exists?` });
    });
}

export function createInstanceRouter(
  req: Request,
  res: Response,
  service: FormService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  const formDto: CreateFormInstanceDto = new CreateFormInstanceDto(
    req.body.name,
    req.body.formName
  );
  return service
    .createInstance(formDto, principal.uuid)
    .then((instance) => {
      res
        .status(200)
        .json(FormMapper.fromInstanceEntityToDto(instance as FormInstance));
    })
    .catch(() => {
      res
        .status(400)
        .json({ error: `Error creating form, maybe it already exists?` });
    });
}

export function insertValue(req: Request, res: Response, service: FormService) {
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
  getInstanceByNameRouter,
  getAllRouter,
  createRouter,
  createInstanceRouter,
  insertValue,
};
