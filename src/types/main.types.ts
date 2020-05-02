export type ConfigType = undefined | string;
export type GeneratedTokenType = TokenType & string;
export type Nullable<T> = T | null;

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
  field: Nullable<{
    rowId: number;
    name: string;
    value: string;
  }>;
  value: Nullable<string>;
}
