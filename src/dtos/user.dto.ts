export class UserDto {
  public uuid: string;
  public name: string;
  public surname: string;
  public email: string;

  public constructor(
    uuid: string,
    name: string,
    surname: string,
    email: string
  ) {
    this.uuid = uuid;
    this.name = name;
    this.surname = surname;
    this.email = email;
  }
}

export default UserDto;
