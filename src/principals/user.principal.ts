import { Nullable } from "../types/main.types";

export default class UserPrincipal {
  public uuid: string;
  public name: string;
  public surname: string;
  public email: string;
  public pictureUrl: Nullable<string>;

  constructor(
    uuid: string,
    name: string,
    surname: string,
    email: string,
    pictureUrl: Nullable<string> = null
  ) {
    this.uuid = uuid;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.pictureUrl = pictureUrl;
  }
}
