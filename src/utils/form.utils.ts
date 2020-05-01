import {
  BOOLEAN as SEQ_BOOL_TYPE,
  DATE as SEQ_DATE_TYPE,
  INTEGER as SEQ_INT_TYPE,
  STRING as SEQ_STRING_TYPE,
} from "sequelize";

import { FormField, Nullable } from "../types/main.types";
import { toUnderscoreCase } from "./string.utils";

const TABLE_TYPE: string = "table";

export function isTable(field: FormField): boolean {
  return field.type.name == TABLE_TYPE;
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
      defaultValue: new Date(),
      allowNull: false,
    },
    updatedAt: {
      type: SEQ_DATE_TYPE,
      defaultValue: new Date(),
      allowNull: false,
    },
  };
  if (!includeRowId) {
    return json;
  }
  return {
    ...json,
    ...{
      rowId: {
        type: SEQ_INT_TYPE,
      },
    },
  };
};
