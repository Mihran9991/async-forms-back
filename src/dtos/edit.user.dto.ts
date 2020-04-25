export class EditUserDto {
  public uuid: string;
  public name: string;
  public surname: string;
  public file: Express.Multer.File;

  public constructor(
    uuid: string,
    name: string,
    surname: string,
    file: Express.Multer.File
  ) {
    this.uuid = uuid;
    this.name = name;
    this.surname = surname;
    this.file = file;
  }
}

export default EditUserDto;
