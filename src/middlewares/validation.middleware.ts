import { NextFunction, Request, Response } from "express";
import { body, query, validationResult } from "express-validator";

import RegexConstants from "../constants/regex.constants";
import multerMiddleware from "./multer.middleware";

export const registerForm = () => {
  return [
    body("name").notEmpty({ ignore_whitespace: true }),
    body("surname").notEmpty({ ignore_whitespace: true }),
    body("email").isEmail(),
    body("password").matches(RegexConstants.PASSWORD_REGEX),
  ];
};

export const loginForm = () => {
  return [
    body("email").isEmail(),
    body("password").matches(RegexConstants.PASSWORD_REGEX),
  ];
};

export const forgotSendForm = () => {
  return [body("email").isEmail()];
};

export const forgotResetForm = () => {
  return [
    body("requestId").notEmpty({ ignore_whitespace: true }),
    body("newPassword").matches(RegexConstants.PASSWORD_REGEX),
  ];
};

export const editProfileForm = () => {
  return [
    multerMiddleware.singleOrNone("picture"),
    body("name").notEmpty({ ignore_whitespace: true }),
    body("surname").notEmpty({ ignore_whitespace: true }),
  ];
};

export const getFormParams = () => {
  return [query("formName").notEmpty({ ignore_whitespace: true })];
};

export const createFormParams = () => {
  return [body("formName").notEmpty({ ignore_whitespace: true })];
};

export const getFormInstanceParams = () => {
  return [
    query("formName").notEmpty({ ignore_whitespace: true }),
    query("instanceName").notEmpty({ ignore_whitespace: true }),
  ];
};

export const getFormInstancesParams = () => {
  return [query("formName").notEmpty({ ignore_whitespace: true })];
};

export const createFormInstanceParams = () => {
  return [
    body("formName").notEmpty({ ignore_whitespace: true }),
    body("instanceName").notEmpty({ ignore_whitespace: true }),
  ];
};

export const insertIntoFormInstanceParams = () => {
  return [
    body("formName").notEmpty({ ignore_whitespace: true }),
    body("instanceName").notEmpty({ ignore_whitespace: true }),
    body("field").notEmpty({ ignore_whitespace: true }),
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
  createFormParams,
  getFormInstanceParams,
  getFormInstancesParams,
  createFormInstanceParams,
  insertIntoFormInstanceParams,
};
