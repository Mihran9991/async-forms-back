import { FormRows, FormColumns } from "../types/main.types";

export class FormDto {
  public title: string;
  public rows: FormRows;
  public columns: FormColumns;

  public constructor(title: string, rows: FormRows, columns: FormColumns) {
    this.title = title;
    this.rows = rows;
    this.columns = columns;
  }
}

export default FormDto;
