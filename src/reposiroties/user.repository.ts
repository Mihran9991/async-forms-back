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

    public async findByEmail(email: string): Promise<User> {
        return this.repository.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if(user == null) {
                throw new Error("user with email: " + email + " not found");
            }
            return user;
        })
    }

    public async create(user: User): Promise<User> {
        return user.save();
    }
}

export default UserRepository;