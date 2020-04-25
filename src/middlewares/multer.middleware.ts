import multer from "multer";

import FileConstants from "../constants/file.constants";
import { generateFileName } from "../utils/file.utils";

const storage = multer.diskStorage({
  destination: `${FileConstants.BASE_DIR}`,
  filename: function (req: any, file: any, cb: any) {
    cb(null, generateFileName(file));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  switch (file.mimetype) {
    case "image/jpg":
    case "image/jpeg":
    case "image/png":
      return cb(null, true);
    default:
      return cb(new Error("Unsupported file type"), false);
  }
};

export const singleOrNone = (field: string) => {
  try {
    return multer({ storage: storage, fileFilter: fileFilter }).single(field);
  } catch (err) {
    return multer({ storage: storage, fileFilter: fileFilter }).none();
  }
};

export default { singleOrNone };
