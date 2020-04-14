import NodeMailer, { Transporter } from "nodemailer";
import EmailDto from "../dtos/email.dto";
import { PASSWORD, USERNAME } from "../constants/email.constants";
import { APP_NAME } from "../constants/app.constants";

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
            user: USERNAME,
            pass: PASSWORD
        };
    }

    public async send(dto: EmailDto): Promise<string> {
        const transport: Transporter = EmailService.getTransporter();
        return await transport.sendMail({
            from: `${APP_NAME} <${dto.from}>`,
            to: dto.to,
            subject: dto.subject,
            text: dto.text,
            html: dto.html
        });
    }
}

export default EmailService;