export class FormDto {
  public id: number;
  public name: string;
  public owner: string;

  public constructor(id: number, name: string, owner: string) {
    this.id = id;
    this.name = name;
    this.owner = owner;
  }
}

export default FormDto;
