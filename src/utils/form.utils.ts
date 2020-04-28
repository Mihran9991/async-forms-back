import {
  AbstractDataTypeConstructor,
  ENUM as SEQ_ENUM_TYPE,
  STRING as SEQ_STRING_TYPE,
} from "sequelize";

import { FormField, Nullable } from "../types/main.types";
import { toUnderscoreCase } from "./string.utils";

const TABLE_TYPE: string = "table";
const INPUT_TYPE: string = "input";
const DROPDOWN_TYPE: string = "dropdown";

// TODO: use this for creating table "..._values"
const toSequelizeTypeMap: Map<string, AbstractDataTypeConstructor> = new Map([
  [INPUT_TYPE, SEQ_STRING_TYPE as AbstractDataTypeConstructor],
  [DROPDOWN_TYPE, SEQ_ENUM_TYPE as AbstractDataTypeConstructor],
]);

export function isTable(field: FormField): boolean {
  return field.type.name == TABLE_TYPE;
}

export function getFieldsTableName(
  formSysName: string,
  fieldName: Nullable<string> = null
) {
  if (!fieldName) {
    return `${formSysName}_form_fields`;
  }
  return `${formSysName}_form_${toUnderscoreCase(fieldName)}_fields`;
}

export function getInstancesTableName(formSysName: string) {
  return `${formSysName}_form_instances`;
}
