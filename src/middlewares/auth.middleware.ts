import { extractJWTToken } from "../utils/token.utils"
import TokenData from "../daos/jwt.token";

export default (req: any, res: any, next: Function) => {
    const header: String = req.headers.authorization || "";
    if(header.length === 0) {
        throw "Invalid token";
    }
    const token: string = header.split(' ')[1].trim();
    try {
        extractJWTToken(token) as TokenData;
        next();
    } catch(err) {
        throw "Invalid token";
    }
};