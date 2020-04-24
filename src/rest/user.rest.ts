import { Request, Response } from "express";
import UserService from "../services/user.service";
import UserMappers from "../mappers/user.mappers";
import UserDto from "../dtos/user.dto";
import UserPrincipal from "../principals/user.principal";

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

export default {
  getAllRouter,
  getRouter,
};
