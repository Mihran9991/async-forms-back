import { getExtension } from "mime";

import FileConstants from "../constants/file.constants";
import { Nullable } from "../types/main.types";

export const generateFileName = (file: Express.Multer.File) => {
  const ext: Nullable<string> = getExtension(file?.mimetype);
  if (!ext) {
    throw "Unknown extension";
  }
  return `${FileConstants.FILE_NAME}.${ext}`;
};

export const generateFilePath = (file: Express.Multer.File) =>
  `${FileConstants.BASE_DIR}/${generateFileName(file)}`;
