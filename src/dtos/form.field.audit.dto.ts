export class FormFieldAuditDto {
  public formName: string;
  public instanceName: string;
  public fieldName: string;
  public rowId: string;
  public columnName: string;

  constructor(
    formName: string,
    instanceName: string,
    fieldName: string,
    rowId: string,
    columnName: string
  ) {
    this.formName = formName;
    this.instanceName = instanceName;
    this.fieldName = fieldName;
    this.rowId = rowId;
    this.columnName = columnName;
  }
}

export default FormFieldAuditDto;
