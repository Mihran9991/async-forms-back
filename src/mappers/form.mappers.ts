import Form from "../entities/form.entity";
import FormDto from "../dtos/form.dto";
import GetFormInstanceDto from "../dtos/get.form.instance.dto";

export function fromEntityToDto(form: Form): FormDto {
  return new FormDto(form.id, form.name);
}

export function fromInstanceEntityToDto(instance: {
  name: string;
  ownerId: string;
}): GetFormInstanceDto {
  return new GetFormInstanceDto(instance.name, instance.ownerId);
}

export default {
  fromEntityToDto,
  fromInstanceEntityToDto,
};
