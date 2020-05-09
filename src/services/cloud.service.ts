import cloudinary, { UploadApiResponse } from "cloudinary";

import { generateFilePath } from "../utils/file.utils";

export default class CloudService {
  public upload(file: Express.Multer.File): Promise<UploadApiResponse> {
    const fileName = generateFilePath(file);
    return cloudinary.v2.uploader.upload(fileName);
  }
}
