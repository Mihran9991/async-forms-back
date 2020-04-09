import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import { registerRouter, loginRouter } from "../rest/auth.rest";
import AuthService from '../services/auth.service';

export class AuthRouter {
    constructor(router: Router, authService: AuthService) {
        router.post('/register', [
            check("name").isLength({ min: 1 }),
            check("surname").isLength({ min: 1 }),
            check("email").isEmail(),
            check("password").isLength({ min: 8 }).isAlphanumeric()
        ], (req: Request, res: Response) => registerRouter(req, res, authService));
        router.post('/login', [
            check("email").isEmail(),
            check("password").isLength({ min: 8 }).isAlphanumeric()
        ], (req: Request, res: Response) => loginRouter(req, res, authService));
    }
}

export default { AuthRouter };