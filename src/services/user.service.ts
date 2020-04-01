import bcrypt from 'bcrypt';
import UserRepository from "../repositories/user.repository";
import { generateUUID } from "../utils/uuid.utils";
import RegistrationDto from '../dtos/registration.dto';
import User from '../entities/user';

export class UserService {
    private userRepository: UserRepository;

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    public async findByUUID(uuid: string): Promise<User|null> {
        return this.userRepository.findByUUID(uuid);
    }

    public async findByEmail(email: string): Promise<User|null> {
        return this.userRepository.findByEmail(email);
    }

    public async create(dto: RegistrationDto): Promise<User> {
        const user = new User();
        user.uuid = generateUUID();
        user.name = dto.name;
        user.surname = dto.surname;
        user.email = dto.email;
        user.password = await bcrypt.genSalt()
            .then(async salt =>
                bcrypt.hash(dto.password, salt));
        return this.userRepository.create(user)
            .catch(err => Promise.reject(err));
    }
}

export default UserService;