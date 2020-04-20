import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import LoginDto from "../dtos/login.dto";
import RegistrationDto from "../dtos/registration.dto";

export function registerRouter(
  req: Request,
  res: Response,
  service: AuthService
) {
  const dto = new RegistrationDto(
    req.body.name,
    req.body.surname,
    req.body.email,
    req.body.password
  );
  return service
    .register(dto)
    .then((message) => res.status(200).json({ message: message }))
    .catch((err) => res.status(400).json({ error: err?.errors[0].message }));
}

export function loginRouter(req: Request, res: Response, service: AuthService) {
  const dto = new LoginDto(req.body.email, req.body.password);
  return service
    .login(dto)
    .then((token) => res.status(200).json({ token: token }))
    .catch((err) => res.status(400).json({ error: err }));
}

export default {
  registerRouter,
  loginRouter,
};
