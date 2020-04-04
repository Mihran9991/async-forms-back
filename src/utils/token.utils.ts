import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRE_TIME } from '../constants/auth.constants';
import TokenData from '../daos/jwt.token';
import { GeneratedTokenType } from '../types/main.types';
import { BEARER_STR } from "../constants/auth.constants";
import { INVALID_TOKEN } from "../constants/error.messages";

export const extractToken = (header: string): string => {
    if(!header || header.length === 0) {
        throw INVALID_TOKEN;
    }
    const headerSplit: string[] = header.split(' ');
    if(!headerSplit) {
        throw INVALID_TOKEN;
    }
    const bearerStr = headerSplit[0].trim();
    if(bearerStr !== BEARER_STR) {
        throw INVALID_TOKEN;
    }
    return headerSplit[1].trim();
}

export const generateJWTToken = (tokenData: TokenData): string =>
    sign(tokenData.toJson(), JWT_SECRET, { expiresIn: TOKEN_EXPIRE_TIME });

export const decryptJWTToken = (token: string): GeneratedTokenType =>
    verify(token, JWT_SECRET, { maxAge: TOKEN_EXPIRE_TIME }) as GeneratedTokenType;