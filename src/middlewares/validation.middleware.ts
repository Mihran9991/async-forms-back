import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";

import RegexConstants from "../constants/regex.constants";
import multerMiddleware from "./multer.middleware";

export const registerForm = () => {
  return [
    check("name").isLength({ min: 1 }),
    check("surname").isLength({ min: 1 }),
    check("email").isEmail(),
    check("password").matches(RegexConstants.PASSWORD_REGEX),
  ];
};

export const loginForm = () => {
  return [
    check("email").isEmail(),
    check("password").matches(RegexConstants.PASSWORD_REGEX),
  ];
};

export const forgotSendForm = () => {
  return [check("email").isEmail()];
};

export const forgotResetForm = () => {
  return [
    check("requestId").isLength({ min: 1 }),
    check("newPassword").matches(RegexConstants.PASSWORD_REGEX),
  ];
};

export const editProfileForm = () => {
  return [
    check("name").isLength({ min: 1 }),
    check("surname").isLength({ min: 1 }),
    multerMiddleware.singleOrNone("picture"),
  ];
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

export default {
  validate,
  registerForm,
  loginForm,
  forgotSendForm,
  forgotResetForm,
  editProfileForm,
};
