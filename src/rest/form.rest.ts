import { Request, Response } from "express";
import FormService from "../services/form.service";
import FormDto from "../dtos/form.dto";

export function createRouter(
  req: Request,
  res: Response,
  service: FormService
) {
  const formDto = new FormDto(req.body.title, req.body.columns, req.body.rows);
  return service
    .create(formDto)
    .then(() => {
      res.status(200).json({});
    })
    .catch((err) => res.status(400).json({ error: err }));
}

export default {
  createRouter,
};
