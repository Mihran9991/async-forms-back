export class GetFormFieldAuditDto {
  public value: string;
  public owner: string;
  public createdAt: Date;

  public constructor(value: string, owner: string, createdAt: Date) {
    this.value = value;
    this.owner = owner;
    this.createdAt = createdAt;
  }
}

export default GetFormFieldAuditDto;
