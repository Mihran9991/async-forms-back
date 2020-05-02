import { FormInsertValueField } from "../types/main.types";

export class InsertFormValueDto {
  public formName: string;
  public instanceName: string;
  public field: FormInsertValueField;

  public constructor(
    formName: string,
    instanceName: string,
    field: FormInsertValueField
  ) {
    this.formName = formName;
    this.instanceName = instanceName;
    this.field = field;
  }
}
