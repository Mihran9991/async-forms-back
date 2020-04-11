import { Dialect } from "sequelize/types";
import { ConfigType } from "../types/main.types";

export const HOST: ConfigType = process.env.SEQ_HOST;
export const DIALECT: Dialect = process.env.SEQ_DIALECT as Dialect;
export const DATABASE: ConfigType = process.env.SEQ_DATABASE;
export const USERNAME: ConfigType = process.env.SEQ_USERNAME;
export const PASSWORD: ConfigType = process.env.SEQ_PASSWORD;