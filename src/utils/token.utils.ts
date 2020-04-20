import { sign, verify } from 'jsonwebtoken';
import TokenData from '../daos/jwt.token';
import { GeneratedTokenType } from '../types/main.types';
import AuthConstants from "../constants/auth.constants";
import ErrorMessages from "../constants/error.messages";
import AuthConfig from "../configs/auth.config";

export const extractToken = (header: string): string => {
    if(!header || header.length === 0) {
        throw ErrorMessages.INVALID_TOKEN;
    }
    const headerSplit: string[] = header.split(' ');
    if(!headerSplit) {
        throw ErrorMessages.INVALID_TOKEN;
    }
    const bearerStr = headerSplit[0].trim();
    if(bearerStr !== AuthConstants.BEARER_STR) {
        throw ErrorMessages.INVALID_TOKEN;
    }
    return headerSplit[1].trim();
}

export const generateJWTToken = (tokenData: TokenData): string =>
    sign(tokenData.toJson(), AuthConfig.JWT_SECRET, { expiresIn: AuthConfig.TOKEN_EXPIRE_TIME });

export const decryptJWTToken = (token: string): GeneratedTokenType =>
    verify(token, AuthConfig.JWT_SECRET, { maxAge: AuthConfig.TOKEN_EXPIRE_TIME }) as GeneratedTokenType;

export default {
    extractToken,
    generateJWTToken,
    decryptJWTToken
};