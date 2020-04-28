import {
  BOOLEAN as SEQ_BOOL_TYPE,
  INTEGER as SEQ_INT_TYPE,
  QueryInterface,
  STRING as SEQ_STRING_TYPE,
} from "sequelize";

import FormRepository from "../repositories/form.repository";
import FormDto from "../dtos/form.dto";
import Form from "../entities/form.entity";
import { toUnderscoreCase } from "../utils/string.utils";
import User from "../entities/user.entity";
import UserService from "./user.service";
import { FormField, Nullable } from "../types/main.types";
import {
  getFieldsTableName,
  getInstancesTableName,
  isTable,
} from "../utils/form.utils";

export class FormService {
  private repository: FormRepository;
  private userService: UserService;
  private queryInterface: QueryInterface;

  public constructor(
    repository: FormRepository,
    userService: UserService,
    queryInterface: QueryInterface
  ) {
    this.repository = repository;
    this.userService = userService;
    this.queryInterface = queryInterface;
  }

  public create(dto: FormDto, ownerUUID: string): Promise<void> {
    return this.userService
      .findByUUID(ownerUUID)
      .then((user: Nullable<User>) => {
        if (!user) {
          throw `User with uuid: ${ownerUUID} not found`;
        }
        return this.createFormsTable(dto, user);
      })
      .then((form: Form) => {
        const tableName: string = getInstancesTableName(form.sysName);
        return this.createInstancesTable(tableName).then(() => form);
      })
      .then((form: Form) => {
        const tableName: string = getFieldsTableName(form.sysName);
        return this.createFieldsTable(tableName).then(() => {
          return this.insertFieldsIntoTable(form, dto.fields);
        });
      });
  }

  public getAllByOwner(uuid: string): Promise<Form[]> {
    return this.repository.getAllByOwner(uuid);
  }

  private createFormsTable(dto: FormDto, user: User): Promise<Form> {
    const form: Form = new Form();
    form.name = dto.name;
    form.sysName = toUnderscoreCase(dto.name);
    form.owner = user;
    form.ownerId = user.uuid;
    return this.repository.create(form);
  }

  private createFieldsTable = (tableName: string): Promise<void> => {
    return this.queryInterface.createTable(tableName, {
      id: {
        type: SEQ_INT_TYPE,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: SEQ_STRING_TYPE,
        allowNull: false,
        unique: true,
      },
      sysName: {
        type: SEQ_STRING_TYPE,
        allowNull: false,
        unique: true,
      },
      type: {
        type: SEQ_STRING_TYPE,
        allowNull: false,
      },
      style: {
        type: SEQ_STRING_TYPE,
        allowNull: true,
      },
      optional: {
        type: SEQ_BOOL_TYPE,
        allowNull: false,
        defaultValue: false,
      },
    });
  };

  private createInstancesTable = (tableName: string): Promise<void> => {
    return this.queryInterface.createTable(tableName, {
      id: {
        type: SEQ_INT_TYPE,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: SEQ_STRING_TYPE,
        allowNull: false,
        unique: true,
      },
      ownerId: {
        type: SEQ_STRING_TYPE,
        references: {
          model: "users",
          key: "uuid",
        },
      },
    });
  };

  private insertFieldsIntoTable(form: Form, fields: FormField[]) {
    const tableName: string = getFieldsTableName(form.sysName);
    return fields.forEach((field: FormField) => {
      return this.insertFieldIntoTable(tableName, field).then(() => {
        if (isTable(field)) {
          const tableName: string = getFieldsTableName(
            form.sysName,
            field.name
          );
          return this.createFieldsTable(tableName).then(() => {
            return field.type.fields?.forEach((field: FormField) => {
              return this.insertFieldIntoTable(tableName, field);
            });
          });
        }
      });
    });
  }

  private insertFieldIntoTable(
    tableName: string,
    field: FormField
  ): Promise<object> {
    return this.queryInterface.bulkInsert(tableName, [
      {
        name: field.name,
        sysName: toUnderscoreCase(field.name),
        type: field.type.name,
        optional: field.optional,
      },
    ]);
  }
}

export default FormService;
