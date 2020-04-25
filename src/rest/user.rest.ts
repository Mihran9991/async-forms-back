import { Request, Response } from "express";

import UserService from "../services/user.service";
import CloudService from "../services/cloud.service";
import UserMappers from "../mappers/user.mappers";
import UserDto from "../dtos/user.dto";
import UserPrincipal from "../principals/user.principal";
import { Nullable } from "../types/main.types";

export function getAllRouter(
  req: Request,
  res: Response,
  service: UserService
) {
  return service
    .findAll()
    .then((users) => {
      const dtos: UserDto[] = users.map(UserMappers.fromEntityToDto);
      res.status(200).json({ users: dtos });
    })
    .catch((err) => res.status(400).json({ error: err }));
}

export function getRouter(req: Request, res: Response) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  const dto = UserMappers.fromPrincipalToDto(principal);
  res.status(200).json({ user: dto });
}

export async function editRouter(
  req: Request,
  res: Response,
  service: UserService,
  cloudService: CloudService
) {
  const principal: UserPrincipal = res.locals.userPrincipal;
  let url: Nullable<string> = null;
  const name: string = req.query.name as string;
  const surname: string = req.query.surname as string;
  const file: Express.Multer.File = req.file;
  if (file) {
    url = (await cloudService.upload(file)).secure_url;
  }
  service
    .update(principal.uuid, name, surname, url)
    .then(() => {
      res.status(200).json({ message: "Profile updated successfully" });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
}

export default {
  getAllRouter,
  getRouter,
  editRouter,
};
