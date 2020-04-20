export type ConfigType = undefined | string;
export type GeneratedTokenType = TokenType & string;
export type Nullable<T> = T | null;

export interface TokenType {
  userId: string;
  timestamp: number;
}
