import { ConfigType } from "../types/main.types";

export const CLOUD_NAME: ConfigType = process.env.CLOUDINARY_CLOUD_NAME;
export const API_KEY: ConfigType = process.env.CLOUDINARY_API_KEY;
export const API_SECRET: ConfigType = process.env.CLOUDINARY_API_SECRET;

export default {
  CLOUD_NAME,
  API_KEY,
  API_SECRET,
};
