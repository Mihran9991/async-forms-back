import ForgotSendDto from "../dtos/forgot.send.dto";
import { Nullable } from "../types/main.types";
import ForgotRequest from "../entities/forgot.request";
import { generateUUID } from "../utils/uuid.utils";
import UserService from "./user.service";
import ForgotRequestRepository from "../repositories/forgot.request.repository";

export class ForgotRequestService {
    private repository: ForgotRequestRepository;
    private userService: UserService;

    public constructor(repository: ForgotRequestRepository,
                       userService: UserService) {
        this.repository = repository;
        this.userService = userService;
    }

    public findByUUID(uuid: string): Promise<Nullable<ForgotRequest>> {
        return this.repository.findByUUID(uuid);
    }

    public create(dto: ForgotSendDto): Promise<Nullable<ForgotRequest>> {
        return this.userService.findByEmail(dto.email)
            .then(user => {
                if(!user) {
                    return Promise.reject(`User with email: ${dto.email} not found`)
                }
                const forgotRequest = new ForgotRequest();
                forgotRequest.uuid = generateUUID();
                forgotRequest.user = user;
                forgotRequest.userId = user.uuid;
                return this.repository.create(forgotRequest);
            }).catch(err => Promise.reject(err));
    }

    public deleteByUUID(uuid: string): Promise<void> {
        return this.findByUUID(uuid)
            .then(request => {
                if(!request) {
                    return Promise.reject(`Forgot request with uuid: ${uuid} not found`);
                }
                return request.destroy();
            });
    }
}

export default ForgotRequestService;