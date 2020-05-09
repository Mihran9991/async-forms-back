import ForgotSendDto from "../dtos/forgot.send.dto";
import ForgotResetDto from "../dtos/forgot.reset.dto";
import EmailService from "./email.service";
import EmailDto from "../dtos/email.dto";
import ForgotPasswordConstants from "../constants/forgot.password.constants";
import ForgotRequestService from "./forgot.request.service";
import UserService from "./user.service";
import ForgotRequest from "../entities/forgot.request.entity";
import FrontEndConfig from "../configs/frontend.config";

export class ForgotPasswordService {
  private forgotRequestService: ForgotRequestService;
  private userService: UserService;
  private mailService: EmailService;

  public constructor(
    forgotRequestService: ForgotRequestService,
    userService: UserService,
    mailService: EmailService
  ) {
    this.forgotRequestService = forgotRequestService;
    this.userService = userService;
    this.mailService = mailService;
  }

  // TODO: implement some protection of DDoS attacks
  /* TODO: whenever a request for some user exists in database,
   *   use that instead of creating a new one on every send request*/
  public send(dto: ForgotSendDto): Promise<string> {
    return this.forgotRequestService
      .create(dto)
      .then((request) => {
        if (!request) {
          return Promise.reject(
            `Unable to create forgot password request for user with email: ${dto.email}`
          );
        }
        return this.sendEmail(dto.email, request.uuid);
      })
      .then(() => `A confirmation email was sent to: ${dto.email}`)
      .catch(() => Promise.reject("Unable to send email"));
  }

  public reset(dto: ForgotResetDto): Promise<string> {
    return this.forgotRequestService
      .findByUUID(dto.requestId)
      .then((request) => {
        if (!request) {
          return Promise.reject("Request not found");
        }
        if (!ForgotPasswordService.checkRequestExpired(request)) {
          return this.forgotRequestService
            .deleteByUUID(dto.requestId)
            .then(() => Promise.reject("Expired request"));
        }
        return Promise.all([
          request,
          this.forgotRequestService.deleteByUUID(dto.requestId),
        ]);
      })
      .then((values) => {
        const request: ForgotRequest = values[0];
        return this.userService.updatePassword(request.userId, dto.newPassword);
      })
      .then(() => "Password reset successfully");
  }

  private sendEmail(email: string, requestId: string): Promise<string> {
    const dto = new EmailDto();
    const url = ForgotPasswordService.createResetUrl(requestId);
    dto.to = email;
    dto.subject = "Forgot password request";
    dto.html = `<b><a href="${url}">${ForgotPasswordConstants.FORGOT_RESET_TEXT}</a></b>`;
    return this.mailService.send(dto);
  }

  private static createResetUrl(requestId: string): string {
    return `${FrontEndConfig.HOST}:${FrontEndConfig.PORT}${FrontEndConfig.FORGOT_RESET_URL}?requestId=${requestId}`;
  }

  private static checkRequestExpired(request: ForgotRequest): boolean {
    const created = request.createdAt as Date;
    return (
      new Date().valueOf() - created.valueOf() <
      ForgotPasswordConstants.FORGOT_REQUEST_EXPIRE_TIME_MSC
    );
  }
}

export default ForgotPasswordService;
