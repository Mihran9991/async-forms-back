export class FormFieldDto {
  public rowId: string;
  public columnId: string;
  public formId: string;
  public formName: string;
  public fieldName: string;
  public type: string;
  public instanceName: string;
  public ownerId: string;

  constructor(
    rowId: string,
    columnId: string,
    formId: string,
    formName: string,
    fieldName: string,
    type: string,
    instanceName: string,
    ownerId: string
  ) {
    this.rowId = rowId;
    this.columnId = columnId;
    this.formId = formId;
    this.formName = formName;
    this.fieldName = fieldName;
    this.type = type;
    this.instanceName = instanceName;
    this.ownerId = ownerId;
  }
}

export default FormFieldDto;
