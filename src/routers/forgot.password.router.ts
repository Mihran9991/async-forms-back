import { Request, Response, Router } from "express";
import ForgotRest from "../rest/forgot.password.rest";
import ForgotPasswordService from "../services/forgot.password.service";
import ValidationMid from "../middlewares/validation.middleware";

const BASE_URL: string = "/forgot";

export class ForgotPasswordRouter {
  public constructor(router: Router, service: ForgotPasswordService) {
    router.post(
      `${BASE_URL}/send`,
      ValidationMid.forgotSendForm(),
      ValidationMid.validate,
      (req: Request, res: Response) => ForgotRest.sendRouter(req, res, service)
    );
    router.post(
      `${BASE_URL}/reset`,
      ValidationMid.forgotResetForm(),
      ValidationMid.validate,
      (req: Request, res: Response) => ForgotRest.resetRouter(req, res, service)
    );
  }
}

export default ForgotPasswordRouter;
