import { Request, Response, Router } from "express";

import UserRest from "../rest/user.rest";
import UserService from "../services/user.service";
import authMiddleware from "../middlewares/auth.middleware";
import ValidationMid from "../middlewares/validation.middleware";
import RedisService from "../services/redis.service";

export class UserRouter {
  private redisService: RedisService = new RedisService();

  constructor(router: Router, service: UserService) {
    router.use((req: Request, res: Response, next: Function) => {
      res.locals.userService = service;
      next();
    });
    router.get(
      "/user/getAll",
      [authMiddleware],
      (req: Request, res: Response) => UserRest.getAllRouter(req, res, service)
    );
    router.get("/user/get", [authMiddleware], (req: Request, res: Response) =>
      UserRest.getRouter(req, res)
    );
    router.post(
      "/user/edit",
      [authMiddleware],
      ValidationMid.editProfileForm(),
      ValidationMid.validate,
      (req: Request, res: Response) => UserRest.editRouter(req, res, service)
    );
    router.get(
      "/user/getActiveUsersList",
      [authMiddleware],
      (req: Request, res: Response) =>
        UserRest.getActiveUsersList(req, res, this.redisService)
    );
  }
}

export default UserRouter;
