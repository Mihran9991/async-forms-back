import { FormField } from "../types/main.types";

export class FormDto {
  public name: string;
  public values: FormField[];
  public style: Object;
  public optional: boolean;

  public constructor(
    name: string,
    values: FormField[],
    style: Object,
    optional: boolean
  ) {
    this.name = name;
    this.values = values;
    this.style = style;
    this.optional = optional;
  }
}

export default FormDto;
