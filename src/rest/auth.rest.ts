import { validationResult } from 'express-validator';
import AuthService from "../services/auth.service";
import LoginDto from '../dtos/login.dto';
import RegistrationDto from '../dtos/registration.dto';

export async function registerRouter(req: any, res: any, authService: AuthService) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const dto = new RegistrationDto(
        req.body.name,
        req.body.surname,
        req.body.email,
        req.body.password
    );
    authService.register(dto)
        .then(message =>
            res.status(200).json({ message: message })
        )
        .catch(err => 
            res.status(400).json({ error: err.errors[0].message })
        );
}

export async function loginRouter(req: any, res: any, authService: AuthService) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const dto = new LoginDto(req.body.email, req.body.password);
    return authService.login(dto)
        .then(token => {
            res.status(200).json({ token: token })
        })
        .catch(err => {
            res.status(400).json({ error: err })
        });
}

export default { loginRouter };