export class GetFormInstanceDto {
  public name: string;
  public owner: string;

  public constructor(name: string, owner: string) {
    this.name = name;
    this.owner = owner;
  }
}

export default GetFormInstanceDto;
