import bcrypt from "bcrypt";
import UserService from "./user.service";
import { generateJWTToken } from "../utils/token.utils";
import RegistrationDto from "../dtos/registration.dto";
import LoginDto from "../dtos/login.dto";
import TokenData from "../daos/jwt.token";

export class AuthService {
  private readonly userService: UserService;

  public constructor(userService: UserService) {
    this.userService = userService;
  }

  public register(dto: RegistrationDto): Promise<string> {
    return this.userService
      .create(dto)
      .then(() => "User registered successfully");
  }

  private static matchPasswords(password1: string, password2: string): boolean {
    return bcrypt.compareSync(password1, password2);
  }

  public login(dto: LoginDto): Promise<string> {
    return this.userService
      .findByEmail(dto.email)
      .then((user) => {
        if (!user) {
          return Promise.reject("User with email: " + dto.email + " not found");
        }
        return user;
      })
      .then((user) => {
        if (!AuthService.matchPasswords(dto.password, user.password)) {
          return Promise.reject("Passwords don't match");
        }
        return generateJWTToken(new TokenData(user.uuid));
      });
  }
}

export default AuthService;
