export class TokenData {
    public constructor(userId: string, timestamp: number = new Date().getTime()) {
        this.userId = userId;
        this.timestamp = timestamp;
    }

    public toJson(): object {
        return { userId: this.userId, timestamp: this.timestamp };
    }

    timestamp: number
    userId: string;
}

export default TokenData;