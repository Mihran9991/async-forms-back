export class UserDto {
    public constructor(uuid: string, name: string, surname: string, email: string) {
        this.uuid = uuid;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }

    uuid: string;
    name: string;
    surname: string;
    email: string;
}

export default UserDto;