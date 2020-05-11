import Form from "../entities/form.entity";
import FormDto from "../dtos/form.dto";
import GetFormInstanceDto from "../dtos/get.form.instance.dto";
import { FormInstance } from "../types/main.types";
import UserService from "../services/user.service";

export function toDto(form: Form, userService: UserService): Promise<FormDto> {
  return userService
    .getFullName(form.ownerId)
    .then((fullName: string) => new FormDto(form.id, form.name, fullName));
}

export function toInstanceDto(
  instance: FormInstance,
  userService: UserService
): Promise<GetFormInstanceDto> {
  return userService
    .getFullName(instance.ownerId)
    .then(
      (fullName: string) => new GetFormInstanceDto(instance.name, fullName)
    );
}

export default {
  toDto,
  toInstanceDto,
};
