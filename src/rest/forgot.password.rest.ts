import { Request, Response } from "express";
import ForgotPasswordService from "../services/forgot.password.service";
import ForgotSendDto from "../dtos/forgot.send.dto";
import ForgotResetDto from "../dtos/forgot.reset.dto";

export function sendRouter(
  req: Request,
  res: Response,
  service: ForgotPasswordService
) {
  const dto = new ForgotSendDto(req.body.email);
  return service
    .send(dto)
    .then((message) => res.status(200).json({ message: message }))
    .catch((err) => res.status(400).json({ error: err }));
}

export function resetRouter(
  req: Request,
  res: Response,
  service: ForgotPasswordService
) {
  const dto = new ForgotResetDto(req.body.requestId, req.body.newPassword);
  return service
    .reset(dto)
    .then((message) => res.status(200).json({ message: message }))
    .catch((err) => res.status(400).json({ error: err }));
}

export default {
  sendRouter,
  resetRouter,
};
