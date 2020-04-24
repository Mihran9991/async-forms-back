import { ConfigType } from "../types/main.types";

export const HOST: ConfigType = process.env.FRONTEND_HOST;
export const PORT: ConfigType = process.env.FRONTEND_PORT;

export const FORGOT_RESET_URL: ConfigType =
  process.env.FRONTEND_FORGOT_RESET_URL;

export default {
  HOST,
  PORT,
  FORGOT_RESET_URL,
};
