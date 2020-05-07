import {
  DbFormField,
  DbFormValue,
  DbNestedFormValue,
} from "../types/main.types";

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
  console.log(groupByRowId(nestedValues));
  return `"${fieldName}": {
    "fields": [
      ${groupByRowId(nestedValues).map((result) => {
        const rowId = result[0] as number;
        const values = result[1] as DbNestedFormValue[];
        const strings = nestedFields.map((field: DbFormField) => {
          const sorted: DbFormValue[] = values
            .filter((value: DbNestedFormValue) => value.fieldId === field.id)
            .sort(
              (value1: DbFormValue, value2: DbFormValue) =>
                value2.createdAt.valueOf() - value1.createdAt.valueOf()
            );
          const value: DbFormValue = sorted[0];
          return getFieldJson(
            field.name,
            value.value,
            value.ownerId,
            value.createdAt
          );
        });
        return `{
            "rowId": ${rowId},
            ${strings}
          }`;
      })}
    ]
  }`;
};

const groupByRowId = (values: DbNestedFormValue[]) => {
  const rowIds: number[] = Array.from(
    new Set(values.map((value) => value.rowId)).values()
  );
  return rowIds.map((rowId: number) => {
    return [
      rowId,
      values.filter((value: DbNestedFormValue) => value.rowId === rowId),
    ];
  });
};

export default {
  getFieldJson,
  getNestedFieldJson,
};
