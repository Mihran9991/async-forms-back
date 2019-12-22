import bcrypt from 'bcrypt';
import UserDto from "../dtos/user.dto";
import UserRepository from "../reposiroties/user.repository";
import { fromEntityToDto, fromDtoToEntity } from "../mappers/user.mappers";
import { generateUUID } from "../utils/uuid.utils";
import { BCRYPT_HASH_ROUNDS } from "../constants/auth.constants";

export class UserService {
    private userRepository: UserRepository;

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async findAll(): Promise<UserDto[]> {
        return this.userRepository.findAll()
            .then((users) =>
                users.map(user => 
                    fromEntityToDto(user)))
    }

    public async findByEmail(email: string): Promise<UserDto> {
        return this.userRepository.findByEmail(email)
            .then(fromEntityToDto);
    }

    public async create(dto: UserDto): Promise<UserDto> {
        const user = fromDtoToEntity(dto);
        user.uuid = generateUUID();
        user.password = await bcrypt.genSalt()
            .then(async salt =>
                bcrypt.hash(user.password, BCRYPT_HASH_ROUNDS))
        return this.userRepository.create(user)
            .then(fromEntityToDto);
    }
}

export default UserService;