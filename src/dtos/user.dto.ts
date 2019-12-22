export class UserDto {
    public constructor(name: string, surname: string, email: string, password: string) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }

    name: string;
    surname: string;
    email: string;
    password: string;
}

export default UserDto;