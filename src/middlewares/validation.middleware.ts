import { NextFunction, Request, Response } from "express";
import { check, query, validationResult } from "express-validator";

import RegexConstants from "../constants/regex.constants";
import multerMiddleware from "./multer.middleware";

export const registerForm = () => {
  return [
    check("name").notEmpty({ ignore_whitespace: true }),
    check("surname").notEmpty({ ignore_whitespace: true }),
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
    check("requestId").notEmpty({ ignore_whitespace: true }),
    check("newPassword").matches(RegexConstants.PASSWORD_REGEX),
  ];
};

export const editProfileForm = () => {
  return [
    multerMiddleware.singleOrNone("picture"),
    check("name").notEmpty({ ignore_whitespace: true }),
    check("surname").notEmpty({ ignore_whitespace: true }),
  ];
};

export const getFormParams = () => {
  return [query("name").notEmpty({ ignore_whitespace: true })];
};

export const getInstanceParams = () => {
  return [
    query("formName").notEmpty({ ignore_whitespace: true }),
    query("instanceName").notEmpty({ ignore_whitespace: true }),
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
  getFormParams,
  getInstanceParams,
};
