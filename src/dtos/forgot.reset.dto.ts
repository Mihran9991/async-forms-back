export class ForgotResetDto {
    public requestId: string;
    public newPassword: string;

    public constructor(requestId: string, newPassword: string) {
        this.requestId = requestId;
        this.newPassword = newPassword;
    }
}

export default ForgotResetDto;