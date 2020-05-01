import { Request, Response } from "express";
import FormService from "../services/form.service";
import CreateFormDto from "../dtos/create.form.dto";
import UserPrincipal from "../principals/user.principal";
import Form from "../entities/form.entity";
import FormMapper from "../mappers/form.mappers";
import FormDto from "../dtos/form.dto";
import { Nullable } from "../types/main.types";
import CreateFormInstanceDto from "../dtos/create.form.instance.dto";

export function getRouter(req: Request, res: Response, service: FormService) {
  const id: number = req.body.id;
  return service
    .get(id)
    .then((form: Nullable<Form>) => {
      if (!form) {
        throw `Form with id: ${id} not found`;
      }
      res.status(200).json(JSON.parse(form.json));
    })
    .catch((err) => res.status(400).json({ error: err }));
}

export function getInstanceRouter(
  req: Request,
  res: Response,
  service: FormService
) {
  const id: number = req.body.id;
  const formId: number = req.body.formId;
  return service
    .getInstance(id, formId)
    .then((instance: Nullable<object>) => {
      if (!instance) {
        throw `Form instance with id: ${id} not found`;
      }
      res.status(200).json(instance);
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
    req.body.formId
  );
  return service
    .createInstance(formDto, principal.uuid)
    .then((instance) => {
      res.status(200).json(instance);
    })
    .catch(() => {
      res
        .status(400)
        .json({ error: `Error creating form, maybe it already exists?` });
    });
}

export default {
  getRouter,
  getAllRouter,
  getInstanceRouter,
  createRouter,
  createInstanceRouter,
};
