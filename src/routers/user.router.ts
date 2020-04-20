import { Request, Response, Router } from 'express';
import UserRest from '../rest/user.rest';
import UserService from '../services/user.service';
import authMiddleware from '../middlewares/auth.middleware';

export class UserRouter {
    constructor(router: Router, service: UserService) {
        router.use((req, res, next) => {
            res.locals.userService = service;
            next();
        });
        router.get('/user/getAll', [authMiddleware], (req: Request, res: Response) =>
            UserRest.getAllRouter(req, res, service));
    }
}

export default UserRouter;