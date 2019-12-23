class JWTToken {
    public constructor(token: string, userId: string, expDate: Date) {
        this.token = token;
        this.userId = userId;
        this.expDate = expDate;
    }

    token: string;
    userId: string;
    expDate: Date;
}