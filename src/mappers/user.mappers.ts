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

export function fromDtoToEntity(dto: UserDto): User {
    const user = new User();
    user.name = dto.name;
    user.surname = dto.surname;
    user.email = dto.email;
    return user;
}

export default { fromEntityToDto, fromDtoToEntity };