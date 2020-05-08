import TokenUtils from "../utils/token.utils";
import UserService from "../services/user.service";
import { GeneratedTokenType } from "../types/main.types";
import { Request, Response } from "express";
import ErrorMessages from "../constants/error.messages";
import UserMappers from "../mappers/user.mappers";

export default (req: Request, res: Response, next: Function) => {
  try {
    const header: string = req.headers.authorization || "";
    const token: string = TokenUtils.extractToken(header);
    const tokenData: GeneratedTokenType = TokenUtils.decryptJWTToken(token);
    const userService: UserService = res.locals.userService as UserService;
    return userService.findByUUID(tokenData.userId).then((user) => {
      if (!user) {
        throw ErrorMessages.INVALID_TOKEN;
      }
      res.locals.userPrincipal = UserMappers.fromEntityToPrincipal(user);
      return next();
    });
  } catch (_) {
    return next(res.status(403).json({ error: ErrorMessages.INVALID_TOKEN }));
  }
};
