export class LoginDto {
    public constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    email: string;
    password: string;
}

export default LoginDto;