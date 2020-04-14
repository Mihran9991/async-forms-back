import { Request, Response } from "express";
import ForgotPasswordService from "../services/forgot.password.service";
import { validationResult } from "express-validator";
import ForgotSendDto from "../dtos/forgot.send.dto";
import ForgotResetDto from "../dtos/forgot.reset.dto";

export async function sendRouter(req: Request, res: Response, service: ForgotPasswordService) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const dto = new ForgotSendDto(
        req.body.email
    );
    return service.send(dto)
        .then(message =>
            res.status(200).json({ message: message })
        ).catch(err => {
            console.log(err);
            res.status(400).json({ error: err })
        });
}

export async function resetRouter(req: Request, res: Response, service: ForgotPasswordService) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const dto = new ForgotResetDto(
        req.body.requestId,
        req.body.newPassword
    );
    return service.reset(dto)
        .then(message =>
            res.status(200).json({ message: message })
        ).catch(err =>
            res.status(400).json({ error: err })
        );
}