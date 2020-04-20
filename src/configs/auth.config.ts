export const JWT_SECRET: string = process.env.AUTH_JWT_SECRET as string;
export const TOKEN_EXPIRE_TIME: string = process.env.AUTH_TOKEN_EXPIRE_TIME as string;

export default {
    JWT_SECRET,
    TOKEN_EXPIRE_TIME
};