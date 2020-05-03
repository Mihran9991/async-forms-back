import { FormInsertValueField } from "../types/main.types";
import InstanceDto from "./instance.dto";

export class InsertInstanceValueDto extends InstanceDto {
  public instanceName: string;
  public formName: string;
  public field: FormInsertValueField;

  public constructor(
    formName: string,
    instanceName: string,
    field: FormInsertValueField
  ) {
    super(instanceName, formName);
    this.field = field;
  }
}
