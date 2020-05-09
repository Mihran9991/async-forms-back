export class RegistrationDto {
  public name: string;
  public surname: string;
  public email: string;
  public password: string;

  public constructor(
    name: string,
    surname: string,
    email: string,
    password: string
  ) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }
}

export default RegistrationDto;
