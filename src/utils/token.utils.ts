import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_EXPIRE_TIME_MSECS } from '../constants/auth.constants';

export const generateJWTToken = (jwtToken: JWTToken): String => {
    return sign(jwtToken, JWT_SECRET, { expiresIn: TOKEN_EXPIRE_TIME_MSECS })
};

export const extractJWTToken = (token: string): String => {
    // decoded is string || object
    const decoded = verify(token, JWT_SECRET, { maxAge: TOKEN_EXPIRE_TIME_MSECS })
    return "es hech, heto kanem";
}