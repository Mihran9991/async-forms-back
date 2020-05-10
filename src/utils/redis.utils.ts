import { FORM_DATA_TYPES } from "../constants/form.constants";

import { RedisField } from "../types/main.types";

export const constructFormFieldKey = ({
  rowId,
  columnId,
  formName,
  fieldName,
  type,
  instanceName,
}: RedisField) => {
  if (type === FORM_DATA_TYPES.Table) {
    return `${formName}_${instanceName}_${fieldName}_${rowId}_${columnId}`;
  }
  return `${formName}_${instanceName}_${fieldName}`;
};
