import { TokenType } from "../types/main.types";

export class JWTTokenData implements TokenType {
  public constructor(userId: string, timestamp: number = new Date().getTime()) {
    this.userId = userId;
    this.timestamp = timestamp;
  }

  public toJson(): object {
    return { userId: this.userId, timestamp: this.timestamp };
  }

  userId: string;
  timestamp: number;
}

export default JWTTokenData;
