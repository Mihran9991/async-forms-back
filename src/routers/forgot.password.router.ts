import { Request, Response, Router } from "express";
import { check } from "express-validator";
import ForgotRest from "../rest/forgot.password.rest";
import ForgotPasswordService from "../services/forgot.password.service";
import RegexConstants from "../constants/regex.constants";

const BASE_URL: string = "/forgot";

export class ForgotPasswordRouter {
  public constructor(router: Router, service: ForgotPasswordService) {
    router.post(
      `${BASE_URL}/send`,
      [check("email").isEmail()],
      (req: Request, res: Response) => ForgotRest.sendRouter(req, res, service)
    );
    router.post(
      `${BASE_URL}/reset`,
      [
        check("requestId").isLength({ min: 1 }),
        check("newPassword").matches(RegexConstants.PASSWORD_REGEX),
      ],
      (req: Request, res: Response) => ForgotRest.resetRouter(req, res, service)
    );
  }
}

export default ForgotPasswordRouter;
