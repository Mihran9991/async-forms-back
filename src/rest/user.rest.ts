import { Request, Response } from "express";
import UserService from "../services/user.service";
import { fromEntityToDto } from "../mappers/user.mappers";
import UserDto from "../dtos/user.dto";

export function getAllRouter(
  req: Request,
  res: Response,
  service: UserService
) {
  return service
    .findAll()
    .then((users) => {
      const userDtos: UserDto[] = users.map(fromEntityToDto);
      res.status(200).json({ users: userDtos });
    })
    .catch((err) => res.status(400).json({ error: err }));
}

export default {
  getAllRouter,
};
