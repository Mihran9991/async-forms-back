export class InstanceDto {
  public instanceName: string;
  public formName: string;

  public constructor(instanceName: string, formName: string) {
    this.instanceName = instanceName;
    this.formName = formName;
  }
}

export default InstanceDto;
