import ForgotSendDto from "../dtos/forgot.send.dto";
import ForgotResetDto from "../dtos/forgot.reset.dto";
import EmailService from "./email.service";
import EmailDto from "../dtos/email.dto";
import {
    FORGOT_REQUEST_EXPIRE_TIME_MSC,
    FORGOT_RESET_TEXT,
    FORGOT_RESET_URL
} from "../constants/forgot.password.constants";
import ForgotRequestService from "./forgot.request.service";
import UserService from "./user.service";
import ForgotRequest from "../entities/forgot.request";


export class ForgotPasswordService {
    private forgotRequestService: ForgotRequestService;
    private userService: UserService;
    private mailService: EmailService;

    public constructor(forgotRequestService: ForgotRequestService,
                       userService: UserService,
                       mailService: EmailService) {
        this.forgotRequestService = forgotRequestService;
        this.userService = userService;
        this.mailService = mailService;
    }

    // TODO: implement some protection of DDoS attacks

    // TODO: should be the host and port of front-end
    private static createResetUrl(requestId: string): string {
        return `${FORGOT_RESET_URL}?requestId=${requestId}`;
    }

    private static checkRequestExpired(request: ForgotRequest): boolean {
        const created = (request.createdAt as Date);
        return new Date().valueOf() - created.valueOf() < FORGOT_REQUEST_EXPIRE_TIME_MSC;
    }

    /* TODO: whenever a request for some user exists in database,
    *   instead of creating a new one on every send request */
    public async send(dto: ForgotSendDto): Promise<string> {
        return this.forgotRequestService.create(dto)
            .then(async request => {
                if(!request) {
                    return Promise.reject(`Unable to create forgot password request for user with email: ${dto.email}`);
                }
                await this.sendEmail(dto.email, request.uuid)
                    .catch(_ => Promise.reject("Unable to send email"));
            }).then(() => `A confirmation email was sent to: ${dto.email}`);
    }

    public async reset(dto: ForgotResetDto): Promise<string> {
        return this.forgotRequestService.findByUUID(dto.requestId)
            .then(async request => {
                if(!request) {
                    return Promise.reject("Request not found");
                }
                if(!ForgotPasswordService.checkRequestExpired(request)) {
                    await this.forgotRequestService.deleteByUUID(dto.requestId);
                    return Promise.reject("Expired request");
                }
                await this.userService.updatePassword(request.userId, dto.newPassword)
                    .then(() => this.forgotRequestService.deleteByUUID(dto.requestId))
                    .catch(err => Promise.reject(err));
                return "Password reset successfully";
            });
    }

    private async sendEmail(email: string, requestId: string): Promise<any> {
        const dto = new EmailDto();
        const url = ForgotPasswordService.createResetUrl(requestId);
        dto.to = email;
        dto.subject = "Forgot password request";
        dto.html = `<b><a href="${url}">${FORGOT_RESET_TEXT}</a></b>`;
        return this.mailService.send(dto);
    }
}

export default ForgotPasswordService;