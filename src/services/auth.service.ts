import bcrypt from 'bcrypt';
import { UserService } from "./user.service";
import { UserDto } from "../dtos/user.dto";

export class AuthService {
    private userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;
    }

    // TODO: instead of UserDto, use parameter of type, e.g. RegistrationRequest
    public async register(dto: UserDto): Promise<UserDto> {
        return this.userService.create(dto);
    }

    // TODO: replace these parameters with one parameter of type, e.g. UsernamePassword
    public async login(email: string, password: string): Promise<boolean> {
        return this.userService.findByEmail(email)
            .then(user =>
                this.checkPasswords(password, user.password));
    }
    
    private async checkPasswords(password1: string, password2: string): Promise<boolean> {
        return bcrypt.compare(password1, password2);
    }
}

export default AuthService;