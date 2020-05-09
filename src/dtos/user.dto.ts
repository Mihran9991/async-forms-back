import { Nullable } from "../types/main.types";

export class UserDto {
  public name: string;
  public surname: string;
  public email: string;
  public pictureUrl: Nullable<string>;

  public constructor(
    name: string,
    surname: string,
    email: string,
    pictureUrl: Nullable<string> = null
  ) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.pictureUrl = pictureUrl;
  }
}

export default UserDto;
