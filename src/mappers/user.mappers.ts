import User from "../entities/user";
import UserDto from "../dtos/user.dto";

export function fromEntityToDto(user: User): UserDto {
    return new UserDto(
        user.uuid,
        user.name,
        user.surname,
        user.email
    );
}