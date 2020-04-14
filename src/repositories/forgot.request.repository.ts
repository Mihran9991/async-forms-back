import { Repository } from "sequelize-typescript";
import ForgotRequest from "../entities/forgot.request";
import { Nullable } from "../types/main.types";

export class ForgotRequestRepository {
    private repository: Repository<ForgotRequest>;

    constructor(repository: Repository<ForgotRequest>) {
        this.repository = repository;
    }

    public async findByUUID(uuid: string): Promise<Nullable<ForgotRequest>> {
        return this.repository.findOne({
            where: {
                uuid: uuid
            }
        });
    }

    public async create(forgotRequest: ForgotRequest): Promise<Nullable<ForgotRequest>> {
        return forgotRequest.save();
    }
}

export default ForgotRequestRepository;