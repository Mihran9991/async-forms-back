import bcrypt from 'bcrypt';
import UserRepository from "../repositories/user.repository";
import { generateUUID } from "../utils/uuid.utils";
import RegistrationDto from '../dtos/registration.dto';
import User from '../entities/user';
import { Nullable } from '../types/main.types';

export class UserService {
    private userRepository: UserRepository;

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    public async findByUUID(uuid: string): Promise<Nullable<User>> {
        return this.userRepository.findByUUID(uuid);
    }

    public async findByEmail(email: string): Promise<Nullable<User>> {
        return this.userRepository.findByEmail(email);
    }

    private static async hashPassword(password: string): Promise<string> {
        return bcrypt.genSalt()
            .then(async salt =>
                bcrypt.hash(password, salt)
            );
    }

    public async create(dto: RegistrationDto): Promise<Nullable<User>> {
        const user = new User();
        user.uuid = generateUUID();
        user.name = dto.name;
        user.surname = dto.surname;
        user.email = dto.email;
        user.password = await UserService.hashPassword(dto.password);
        return this.userRepository.create(user)
            .catch(err => Promise.reject(err));
    }

    public async updatePassword(uuid: string, password: string): Promise<void> {
        this.findByUUID(uuid)
            .then(async user => {
                if(!user) {
                    return Promise.reject(`User with uuid: ${uuid} not found`);
                }
                user.password = await UserService.hashPassword(password);
                user.save();
            });
    }
}

export default UserService;