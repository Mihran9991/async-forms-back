import Form from "../entities/form.entity";
import FormDto from "../dtos/form.dto";

export function fromEntityToDto(form: Form): FormDto {
  return new FormDto(form.id, form.name);
}

export default {
  fromEntityToDto,
};
