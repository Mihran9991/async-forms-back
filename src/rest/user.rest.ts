import { Request, Response } from "express";

import UserService from "../services/user.service";
import UserMappers from "../mappers/user.mappers";
import UserDto from "../dtos/user.dto";
import UserPrincipal from "../principals/user.principal";
import EditUserDto from "../dtos/edit.user.dto";

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

export function editRouter(
  req: Request,
  res: Response,
  service: UserService
): Promise<Response> {
  const principal: UserPrincipal = res.locals.userPrincipal;
  const file: Express.Multer.File = req.file;
  const dto: EditUserDto = new EditUserDto(
    principal.uuid,
    req.body.name,
    req.body.surname,
    file
  );
  return service
    .update(dto)
    .then(() =>
      res.status(200).json({ message: "Profile updated successfully" })
    )
    .catch((err) => res.status(400).json({ error: err }));
}

export default {
  getAllRouter,
  getRouter,
  editRouter,
};
