export class CreateFormInstanceDto {
  public name: string;
  public formName: string;

  public constructor(name: string, formName: string) {
    this.name = name;
    this.formName = formName;
  }
}

export default CreateFormInstanceDto;
