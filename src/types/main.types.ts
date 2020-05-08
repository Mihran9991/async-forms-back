export type ConfigType = undefined | string;
export type GeneratedTokenType = TokenType & string;
export type Nullable<T> = T | null;

export interface ISocketIO {
  init(): void;
}

export interface InitialSocketData {
  rowId: Nullable<string>;
  columnId: Nullable<string>;
  formId: Nullable<string>;
  instanceId: Nullable<string>;
}

export interface TokenType {
  userId: string;
  timestamp: number;
}

export interface FormField {
  name: string;
  type: FormFieldType;
  style: string;
  optional: boolean;
}

export interface FormFieldType {
  name: string;
  values: Nullable<string[]>;
  fields: Nullable<FormField[]>;
}

export interface FormInstance {
  id: number;
  name: string;
  ownerId: string;
}

export interface FormInsertValueField {
  name: string;
  field: Nullable<FormInsertValueNestedField>;
  value: Nullable<string>;
}

export interface FormInsertValueNestedField {
  rowId: string;
  name: string;
  value: string;
}

export interface IdType {
  id: number;
  type: string;
}

export interface DbFormValue {
  id: number;
  instanceId: number;
  fieldId: number;
  value: string;
  ownerId: string;
  createdAt: Date;
}

export interface DbNestedFormValue extends DbFormValue {
  rowId: string;
}

export interface DbFormField {
  id: number;
  name: string;
  sysName: string;
  type: string;
  style: string;
  optional: string;
}
