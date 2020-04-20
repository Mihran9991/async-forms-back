import { Request, Response, Router } from "express";
import AuthRest from "../rest/auth.rest";
import AuthService from "../services/auth.service";
import ValidationMid from "../middlewares/validation.middleware";

export class AuthRouter {
  constructor(router: Router, service: AuthService) {
    router.post(
      "/register",
      ValidationMid.registerForm(),
      ValidationMid.validate,
      (req: Request, res: Response) =>
        AuthRest.registerRouter(req, res, service)
    );
    router.post(
      "/login",
      ValidationMid.loginForm(),
      ValidationMid.validate,
      (req: Request, res: Response) => AuthRest.loginRouter(req, res, service)
    );
  }
}

export default AuthRouter;
