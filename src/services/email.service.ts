import EmailDto from "../dtos/email.dto";

export class EmailService {
    public send(dto: EmailDto): string {
        return "message-id";
    }
}

export default EmailService;