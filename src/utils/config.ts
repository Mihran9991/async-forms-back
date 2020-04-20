import * as dotenv from "dotenv";

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case "local":
    path = `${__dirname}/../../.env.local`;
    break;
  default:
    path = `${__dirname}/../../.env.dev`;
    break;
}
dotenv.config({ path: path });
