import { Router } from 'express';
import { getAllRouter } from "../rest/user.rest";
import UserService from '../services/user.service';

export class UserRouter {
    constructor(router: Router, userService: UserService) {
        router.get('/user/getAll', [], (req: any, res: any) => getAllRouter(req, res, userService));
    }
}

export default { UserRouter };