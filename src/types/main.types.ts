export type ConfigType = undefined | string;
export type GeneratedTokenType = TokenType & string;
export type Nullable<T> = T | null;

export interface ISocketIO {
  init(): Promise<void>;
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

export interface FormColumn {
  [key: string]: { type: string; uid: string };
}

export interface FormRow {
  [key: string]: {
    value: string | [{ key: string; value: string }];
    type: string;
  };
}

export interface FormColumns {
  [key: string]: FormColumn;
}

export type FormRows = FormRow[];
