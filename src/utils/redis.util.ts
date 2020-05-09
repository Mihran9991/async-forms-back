import { FORM_DATA_TYPES } from "../constants/form.constants";

import FormFieldDto from "../dtos/form.fied.dto";

export const consturctFormFieldKey = ({
  rowId,
  columnId,
  formName,
  fieldName,
  type,
  instanceName,
}: FormFieldDto) => {
  if (type === FORM_DATA_TYPES.Table) {
    return `${formName}_${instanceName}_${fieldName}_${rowId}_${columnId}`;
  }

  return `${formName}_${instanceName}_${fieldName}`;
};
