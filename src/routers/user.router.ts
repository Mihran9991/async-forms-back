import { Router } from 'express';
import { getAllRouter } from "../rest/user.rest";
import UserService from '../services/user.service';
import authMiddleware from '../middlewares/auth.middleware';

export class UserRouter {
    constructor(router: Router, userService: UserService) {
        router.use((req, res, next) => {
            res.locals.userService = userService;
            next();
        });
        router.get('/user/getAll', [authMiddleware], (req: any, res: any) => getAllRouter(req, res, userService));
    }
}

export default { UserRouter };