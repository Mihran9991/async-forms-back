import { Request, Response, Router } from "express";
import { check } from "express-validator";
import AuthRest from "../rest/auth.rest";
import AuthService from "../services/auth.service";
import RegexConstants from "../constants/regex.constants";

export class AuthRouter {
  constructor(router: Router, service: AuthService) {
    router.post(
      "/register",
      [
        check("name").isLength({ min: 1 }),
        check("surname").isLength({ min: 1 }),
        check("email").isEmail(),
        check("password").matches(RegexConstants.PASSWORD_REGEX),
      ],
      (req: Request, res: Response) =>
        AuthRest.registerRouter(req, res, service)
    );
    router.post(
      "/login",
      [
        check("email").isEmail(),
        check("password").matches(RegexConstants.PASSWORD_REGEX),
      ],
      (req: Request, res: Response) => AuthRest.loginRouter(req, res, service)
    );
  }
}

export default AuthRouter;
