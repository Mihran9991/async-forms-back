import { validationResult } from 'express-validator';
import AuthService from "../services/auth.service";
import UserDto from "../dtos/user.dto";

export async function registerRouter(req: any, res: any, authService: AuthService) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const userDto: UserDto = new UserDto(
        req.body.name,
        req.body.surname,
        req.body.email,
        req.body.password
    );
    const user = await authService.register(userDto)
        .catch(err => {
            res.status(400).json({ error: err });
        });
    res.status(200).json({ user: user });
}

export async function loginRouter(req: any, res: any, authService: AuthService) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array()});
    }
    const email = req.body.email;
    const password = req.body.password;
    authService.login(email, password)
        .catch(err => {
            res.status(400).json({ error: err });
        })
        .then(login => {
            if(!login) {
                res.status(400).json({ error: "Incorrect login credentials" });
            } else {
                res.status(200).json({ token: "Example token" });
            }
        })
}

export default { loginRouter };