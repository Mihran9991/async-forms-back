import { Request, Response, Router } from "express";
import { check } from "express-validator";
import { resetRouter, sendRouter } from "../rest/forgot.password.rest";
import ForgotPasswordService from "../services/forgot.password.service";

const BASE_URL: string = '/forgot';

export class ForgotPasswordRouter {
    public constructor(router: Router,
                       service: ForgotPasswordService) {
        router.post(`${BASE_URL}/send`, [
            check("email").isEmail()
        ], (req: Request, res: Response) => sendRouter(req, res, service));
        router.post(`${BASE_URL}/reset`, [
            check("requestId").isLength({ min: 1 }),
            check("newPassword").isLength({ min: 8 }).isAlphanumeric()
        ], (req: Request, res: Response) => resetRouter(req, res, service));
    }
}

export default ForgotPasswordRouter;