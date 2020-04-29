import { FormField } from "../types/main.types";

export class CreateFormDto {
  public name: string;
  public fields: FormField[];
  public style: Object;
  public optional: boolean;
  public json: string;

  public constructor(
    name: string,
    fields: FormField[],
    style: Object,
    optional: boolean,
    json: string
  ) {
    this.name = name;
    this.fields = fields;
    this.style = style;
    this.optional = optional;
    this.json = json;
  }
}

export default CreateFormDto;
