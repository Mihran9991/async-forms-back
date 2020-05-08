import {
  BOOLEAN as SEQ_BOOL_TYPE,
  DATE as SEQ_DATE_TYPE,
  INTEGER as SEQ_INT_TYPE,
  STRING as SEQ_STRING_TYPE,
} from "sequelize";

import { Nullable } from "../types/main.types";
import { toUnderscoreCase } from "./string.utils";
import { Sequelize } from "sequelize-typescript";

const TABLE_TYPE: string = "table";

export function isTable(type: string): boolean {
  return type === TABLE_TYPE;
}

export function getInstancesTableName(formSysName: string) {
  return `${formSysName}_form_instances`;
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

// TODO: consider applying toUnderscoreCase(...) function
// TODO: to formSysName parameter as well,
// TODO: and rename the parameter to just 'formName'
export function getValuesTableName(
  formSysName: string,
  fieldName: Nullable<string> = null
) {
  if (!fieldName) {
    return `${formSysName}_form_values`;
  }
  return `${formSysName}_form_${toUnderscoreCase(fieldName)}_values`;
}

export const getInstancesAttributes = () => {
  return {
    id: {
      type: SEQ_INT_TYPE,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: SEQ_STRING_TYPE,
      allowNull: false,
      unique: true,
    },
    ownerId: {
      type: SEQ_STRING_TYPE,
      references: {
        model: "users",
        key: "uuid",
      },
    },
  };
};

export const getFieldsAttributes = () => {
  return {
    id: {
      type: SEQ_INT_TYPE,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: SEQ_STRING_TYPE,
      allowNull: false,
      unique: true,
    },
    sysName: {
      type: SEQ_STRING_TYPE,
      allowNull: false,
      unique: true,
    },
    type: {
      type: SEQ_STRING_TYPE,
      allowNull: false,
    },
    style: {
      type: SEQ_STRING_TYPE,
      allowNull: true,
    },
    optional: {
      type: SEQ_BOOL_TYPE,
      allowNull: false,
      defaultValue: false,
    },
  };
};

export const getValuesAttributes = (
  instancesTableName: string,
  fieldsTableName: string,
  includeRowId: boolean = false
) => {
  const json = {
    id: {
      type: SEQ_INT_TYPE,
      primaryKey: true,
      autoIncrement: true,
    },
    instanceId: {
      type: SEQ_INT_TYPE,
      references: {
        model: instancesTableName,
        key: "id",
      },
    },
    fieldId: {
      type: SEQ_INT_TYPE,
      references: {
        model: fieldsTableName,
        key: "id",
      },
    },
    value: {
      type: SEQ_STRING_TYPE,
      allowNull: true,
    },
    ownerId: {
      type: SEQ_STRING_TYPE,
      references: {
        model: "users",
        key: "uuid",
      },
    },
    createdAt: {
      type: SEQ_DATE_TYPE,
      defaultValue: Sequelize.fn("now"),
      allowNull: false,
    },
  };
  if (!includeRowId) {
    return json;
  }
  return {
    ...json,
    rowId: {
      type: SEQ_STRING_TYPE,
      allowNull: false,
    },
  };
};

export const getInsertFieldAttributes = (
  fieldName: string,
  fieldType: string,
  isOptional: boolean
) => {
  return {
    name: fieldName,
    sysName: toUnderscoreCase(fieldName),
    type: fieldType,
    optional: isOptional ?? false,
  };
};

export const getInsertValueAttributes = (
  instanceId: number,
  fieldId: number,
  value: string,
  ownerId: string,
  rowId: Nullable<string> = null
) => {
  const json = {
    instanceId: instanceId,
    fieldId: fieldId,
    value: value,
    ownerId: ownerId,
  };
  if (!rowId) {
    return json;
  }
  return {
    ...json,
    rowId: rowId,
  };
};
