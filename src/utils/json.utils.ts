import { DbFormField, DbNestedFormValue } from "../types/main.types";

export const getFieldJson = (
  fieldName: string,
  value: string,
  owner: string,
  createdAt: Date
): string => {
  return `"${fieldName}": { "value": "${value}", "owner": "${owner}", "createdAt": "${createdAt}" }`;
};

export const getNestedFieldJson = (
  fieldName: string,
  nestedFields: DbFormField[],
  nestedValues: DbNestedFormValue[]
): string => {
  return `"${fieldName}": { "fields": { ${nestedFields.map(
    (field: DbFormField) => {
      const value = nestedValues
        .filter((value: DbNestedFormValue) => value.fieldId === field.id)
        .sort((value1: DbNestedFormValue, value2: DbNestedFormValue) => {
          return value2.createdAt.valueOf() - value1.createdAt.valueOf();
        })[0] as DbNestedFormValue;
      return `"${field.name}": { "value": "${value.value}", "owner": "${value.ownerId}", "rowId": "${value.rowId}", "createdAt": "${value.createdAt}" }`;
    }
  )} } }`;
};

export default {
  getFieldJson,
  getNestedFieldJson,
};
