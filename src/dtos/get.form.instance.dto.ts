export class GetFormInstanceDto {
  public name: string;
  public ownerId: string;

  public constructor(name: string, ownerId: string) {
    this.name = name;
    this.ownerId = ownerId;
  }
}

export default GetFormInstanceDto;
