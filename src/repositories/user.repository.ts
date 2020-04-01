import { Repository } from 'sequelize-typescript';
import User from "../entities/user";

export class UserRepository {
    private repository: Repository<User>;

    constructor(repository: Repository<User>) { 
        this.repository = repository;
    }

    public async findAll(): Promise<User[]> {
        return this.repository.findAll();
    }

    public async findByUUID(uuid: string): Promise<User|null> {
        return this.repository.findOne({
            where: {
                uuid: uuid
            }
        });
    }

    public async findByEmail(email: string): Promise<User|null> {
        return this.repository.findOne({
            where: {
                email: email
            }
        });
    }

    public async create(user: User): Promise<User> {
        return user.save();
    }
}

export default UserRepository;