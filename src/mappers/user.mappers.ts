import User from "../entities/user.entity";
import UserDto from "../dtos/user.dto";
import UserPrincipal from "../principals/user.principal";

export function fromEntityToDto(user: User): UserDto {
  return new UserDto(user.name, user.surname, user.email, user.pictureUrl);
}

export function fromEntityToPrincipal(user: User): UserPrincipal {
  return new UserPrincipal(
    user.uuid,
    user.name,
    user.surname,
    user.email,
    user.pictureUrl
  );
}

export function fromPrincipalToDto(principal: UserPrincipal): UserDto {
  return new UserDto(
    principal.name,
    principal.surname,
    principal.email,
    principal.pictureUrl
  );
}

export default {
  fromEntityToDto,
  fromEntityToPrincipal,
  fromPrincipalToDto,
};
