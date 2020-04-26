import { Form } from "../types/main.types";

export class FormDto {
  // TODO: instead of using Form interface,
  // TODO: move it's attributes into this class
  public form: Form;

  public constructor(form: Form) {
    this.form = form;
  }
}

export default FormDto;
