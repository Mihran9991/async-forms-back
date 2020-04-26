export type ConfigType = undefined | string;
export type GeneratedTokenType = TokenType & string;
export type Nullable<T> = T | null;

export interface TokenType {
  userId: string;
  timestamp: number;
}

export interface Form {
  name: string;
  fields: FormField[];
  style: Object;
  optional: boolean;
}

export interface FormField {
  name: string;
  type: FormFieldType;
}

export interface FormFieldType {
  name: string;
  values: Nullable<string[]>;
  fields: Nullable<FormField[]>;
}
