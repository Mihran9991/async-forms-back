import { ConfigType } from "../types/main.types";

export const USERNAME: ConfigType = process.env.MAIL_USERNAME;
export const PASSWORD: ConfigType = process.env.MAIL_PASSWORD;

export default {
  USERNAME,
  PASSWORD,
};
