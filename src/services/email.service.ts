import NodeMailer, { Transporter } from "nodemailer";
import EmailDto from "../dtos/email.dto";
import EmailConfig from "../configs/email.config";
import AppConstants from "../constants/app.constants";

export class EmailService {
    private static getTransporter(): Transporter {
        const account = EmailService.getAccount();
        return NodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: account
        });
    }

    private static getAccount(): any {
        return {
            user: EmailConfig.USERNAME,
            pass: EmailConfig.PASSWORD
        };
    }

    public send(dto: EmailDto): Promise<string> {
        const transport: Transporter = EmailService.getTransporter();
        return transport.sendMail({
            from: `${AppConstants.APP_NAME} <${dto.from}>`,
            to: dto.to,
            subject: dto.subject,
            text: dto.text,
            html: dto.html
        });
    }
}

export default EmailService;