import { Sequelize } from "sequelize-typescript";
import { ModelAttributes, QueryOptionsWithWhere } from "sequelize";

import { Nullable } from "../types/main.types";

export class TableService {
  private sequelize: Sequelize;

  public constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  public getAs<T>(
    tableName: string,
    attributes: QueryOptionsWithWhere
  ): Promise<Nullable<T>> {
    return this.getMany<T>(tableName, attributes).then((list: T[]) =>
      list.length ? list[0] : null
    );
  }

  public getMany<T>(
    tableName: string,
    attributes: QueryOptionsWithWhere
  ): Promise<T[]> {
    return this.sequelize
      .getQueryInterface()
      .select(null, tableName, attributes)
      .then((obj: object) => obj as T[]);
  }

  public create(tableName: string, attributes: ModelAttributes): Promise<void> {
    return this.sequelize
      .getQueryInterface()
      .createTable(tableName, attributes);
  }

  public insert<T>(tableName: string, attributes: object): Promise<T> {
    return this.sequelize
      .getQueryInterface()
      .bulkInsert(tableName, [attributes])
      .then((res: unknown) => res as T);
  }
}

export default TableService;
