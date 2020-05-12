import {
  DbFormField,
  DbFormValue,
  DbNestedFormValue,
  Nullable,
} from "../types/main.types";
import RedisService from "../services/redis.service";

export const getFieldJson = (
  fieldName: string,
  value: string = "",
  owner: string = "",
  createdAt: Nullable<Date> = null,
  isLocked: boolean = false,
  lockedBy: string = ""
): string => {
  return `"${fieldName}": { "value": "${value}", "owner": "${owner}", "createdAt": "${
    createdAt ?? ""
  }", "isLocked": ${isLocked}, "lockedBy": "${lockedBy}" }`;
};

export const getNestedFieldJson = (
  formName: string,
  instanceName: string,
  fieldName: string,
  fieldType: string,
  nestedFields: DbFormField[],
  nestedValues: DbNestedFormValue[],
  redisService: RedisService
): Promise<string> => {
  return Promise.all(
    groupByRowId(nestedValues).map((result) => {
      const rowId = result[0] as string;
      const values = result[1] as DbNestedFormValue[];
      return Promise.all(
        nestedFields.map((field: DbFormField) => {
          const sorted: DbFormValue[] = values
            .filter((value: DbNestedFormValue) => value.fieldId === field.id)
            .sort(
              (value1: DbFormValue, value2: DbFormValue) =>
                value2.createdAt.valueOf() - value1.createdAt.valueOf()
            );
          const value: Nullable<DbFormValue> = sorted?.[0] ?? null;
          return redisService
            .isFieldLocked({
              formName: formName,
              instanceName: instanceName,
              fieldName: fieldName,
              type: fieldType,
              columnId: field.name,
              rowId: rowId,
            })
            .then(({ isLocked, ownerId: lockedBy }) => {
              return getFieldJson(
                field.name,
                value?.value,
                value?.ownerId,
                value?.createdAt,
                isLocked,
                lockedBy
              );
            });
        })
      ).then((strings: string[]) => {
        return `{
            "rowId": "${rowId}",
            ${strings}
          }`;
      });
    })
  ).then((result: string[]) => {
    return `"${fieldName}": {
        "fields": [
            ${result}
          ]
        }`;
  });
};

export const groupByRowId = (values: DbNestedFormValue[]) => {
  const rowIds: string[] = Array.from(
    new Set(values.map((value: DbNestedFormValue) => value.rowId)).values()
  );
  return rowIds.map((rowId: string) => {
    return [
      rowId,
      values.filter((value: DbNestedFormValue) => value.rowId === rowId),
    ];
  });
};

export default {
  getFieldJson,
  getNestedFieldJson,
  groupByRowId,
};
