import { Request, Response } from "express";
import FormService from "../services/form.service";
import FormDto from "../dtos/form.dto";
import UserPrincipal from "../principals/user.principal";
import Form from "../entities/form.entity";

export function getAllRouter(
  req: Request,
  res: Response,
  service: FormService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  return service
    .getAllByOwner(principal.uuid)
    .then((forms: Form[]) => res.status(200).json({ forms: forms }))
    .catch((err) => res.status(400).json({ error: err }));
}

export function createRouter(
  req: Request,
  res: Response,
  service: FormService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  const formDto: FormDto = new FormDto(
    req.body.name,
    req.body.values,
    req.body.style,
    req.body.optional
  );
  return service
    .create(formDto, principal.uuid)
    .then(() => {
      res.status(200).json({ message: "Form created successfully" });
    })
    .catch((err) => res.status(400).json({ error: err }));
}

export default {
  createRouter,
  getAllRouter,
};
