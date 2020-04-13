import UserService from "./user.service";
import ForgotSendDto from "../dtos/forgot.send.dto";
import ForgotConfirmDto from "../dtos/forgot.confirm.dto";
import EmailService from "./email.service";
import EmailDto from "../dtos/email.dto";
import { FORGOT_CONFIRM_URL } from "../constants/forgot.password.constants";
import ForgotRequestRepository from "../repositories/forgot.request.repository";
import { Nullable } from "../types/main.types";
import ForgotRequest from "../entities/forgot.request";
import { generateUUID } from "../utils/uuid.utils";

export class ForgotPasswordService {
    private repository: ForgotRequestRepository;
    private userService: UserService;
    private mailService: EmailService;

    public constructor(repository: ForgotRequestRepository,
                       userService: UserService,
                       mailService: EmailService) {
        this.repository = repository;
        this.userService = userService;
        this.mailService = mailService;
    }

    public async send(dto: ForgotSendDto) {
        this.create(dto).then(forgotRequest => {
            if(!forgotRequest) {
                return Promise.reject(`Unable to create forgot password request for user with email: ${dto.email}`);
            }
            this.sendEmail(dto.email, forgotRequest.uuid);
            return Promise.resolve();
        })
    }

    public confirm(dto: ForgotConfirmDto) {
        // todo: implement
    }

    // todo: move to separate forgot.request.service file.ts
    public async create(dto: ForgotSendDto): Promise<Nullable<ForgotRequest>> {
        return await this.userService.findByEmail(dto.email)
            .then(async user => {
                if(!user) {
                    return Promise.reject(`User with email: ${dto.email} not found`)
                }
                const forgotRequest = new ForgotRequest();
                forgotRequest.uuid = generateUUID();
                forgotRequest.user = user;
                return this.repository.create(forgotRequest)
                    .catch(err => Promise.reject(err));
            }).catch(err => Promise.reject(err));
    }

    private sendEmail(email: string, requestId: string): string {
        const dto = new EmailDto();
        const url = `${FORGOT_CONFIRM_URL}?requestId=${requestId}`;
        dto.to = email;
        dto.subject = "Forgot password request";
        dto.text = `Follow this url, to reset your password: ${url}`;
        return this.mailService.send(dto);
    }
}

export default ForgotPasswordService;