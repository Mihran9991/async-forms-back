import { Request, Response } from "express";
import FormService from "../services/form.service";
import CreateFormDto from "../dtos/create.form.dto";
import UserPrincipal from "../principals/user.principal";
import Form from "../entities/form.entity";
import FormMapper from "../mappers/form.mappers";
import FormDto from "../dtos/form.dto";
import { Nullable } from "../types/main.types";

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
  console.log(formDto.json);
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

export default {
  getRouter,
  getAllRouter,
  createRouter,
};
