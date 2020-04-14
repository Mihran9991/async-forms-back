import { Request, Response, Router } from 'express';
import { check } from 'express-validator';
import { loginRouter, registerRouter } from "../rest/auth.rest";
import AuthService from '../services/auth.service';

export class AuthRouter {
    constructor(router: Router, service: AuthService) {
        router.post('/register', [
            check("name").isLength({ min: 1 }),
            check("surname").isLength({ min: 1 }),
            check("email").isEmail(),
            check("password").isLength({ min: 8 }).isAlphanumeric()
        ], (req: Request, res: Response) => registerRouter(req, res, service));
        router.post('/login', [
            check("email").isEmail(),
            check("password").isLength({ min: 8 }).isAlphanumeric()
        ], (req: Request, res: Response) => loginRouter(req, res, service));
    }
}

export default AuthRouter;