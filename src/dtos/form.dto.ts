import { FormField } from "../types/main.types";

export class FormDto {
  public name: string;
  public fields: FormField[];
  public style: Object;
  public optional: boolean;

  public constructor(
    name: string,
    fields: FormField[],
    style: Object,
    optional: boolean
  ) {
    this.name = name;
    this.fields = fields;
    this.style = style;
    this.optional = optional;
  }
}

export default FormDto;
