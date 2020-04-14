import { decryptJWTToken, extractToken } from "../utils/token.utils"
import UserService from "../services/user.service";
import { GeneratedTokenType, Nullable } from "../types/main.types";
import { Request, Response } from "express";
import User from "../entities/user";
import { INVALID_TOKEN } from "../constants/error.messages";

export default async(req: Request, res: Response, next: Function) => {
    try {
        const header: string = req.headers.authorization || "";
        const token: string = extractToken(header);
        const tokenData: GeneratedTokenType = decryptJWTToken(token);
        const userService: UserService = res.locals.userService as UserService;
        const user: Nullable<User> = await userService.findByUUID(tokenData.userId);
        if(!user) {
            next(new Error(INVALID_TOKEN));
        }
        next();
    } catch(err) {
        next(INVALID_TOKEN);
    }
}