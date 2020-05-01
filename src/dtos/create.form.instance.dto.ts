export class CreateFormInstanceDto {
  public name: string;
  public formId: number;

  public constructor(name: string, formId: number) {
    this.name = name;
    this.formId = formId;
  }
}

export default CreateFormInstanceDto;
