import { Repository } from 'sequelize-typescript';
import User from "../entities/user";
import { Nullable } from '../types/main.types';

export class UserRepository {
    private repository: Repository<User>;

    constructor(repository: Repository<User>) {
        this.repository = repository;
    }

    public findAll(): Promise<User[]> {
        return this.repository.findAll();
    }

    public findByUUID(uuid: string): Promise<Nullable<User>> {
        return this.repository.findOne({
            where: {
                uuid: uuid
            }
        });
    }

    public findByEmail(email: string): Promise<Nullable<User>> {
        return this.repository.findOne({
            where: {
                email: email
            }
        });
    }

    public create(user: User): Promise<User> {
        return user.save();
    }
}

export default UserRepository;