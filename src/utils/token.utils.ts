import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRE_TIME } from '../constants/auth.constants';
import TokenData from '../daos/jwt.token';

export const generateJWTToken = (tokenData: TokenData): string =>
    sign(tokenData.toJson(), JWT_SECRET, { expiresIn: TOKEN_EXPIRE_TIME });

export const extractJWTToken = (token: string): object | string =>
    verify(token, JWT_SECRET, { maxAge: TOKEN_EXPIRE_TIME });