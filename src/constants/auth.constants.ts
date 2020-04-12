import { ConfigType } from "../types/main.types";

export const BEARER_STR: string = "Bearer";
export const JWT_SECRET: ConfigType = process.env.AUTH_JWT_SECRET;
export const TOKEN_EXPIRE_TIME: ConfigType = process.env.AUTH_TOKEN_EXPIRE_TIME;