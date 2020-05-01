import { Sequelize } from "sequelize-typescript";

import FormRepository from "../repositories/form.repository";
import CreateFormDto from "../dtos/create.form.dto";
import Form from "../entities/form.entity";
import { toUnderscoreCase } from "../utils/string.utils";
import User from "../entities/user.entity";
import UserService from "./user.service";
import { FormField, Nullable } from "../types/main.types";
import {
  getFieldsAttributes,
  getFieldsTableName,
  getInstancesAttributes,
  getInstancesTableName,
  getValuesAttributes,
  getValuesTableName,
  isTable,
} from "../utils/form.utils";
import CreateFormInstanceDto from "../dtos/create.form.instance.dto";

export class FormService {
  private repository: FormRepository;
  private userService: UserService;
  private sequelize: Sequelize;

  public constructor(
    repository: FormRepository,
    userService: UserService,
    sequelize: Sequelize
  ) {
    this.repository = repository;
    this.userService = userService;
    this.sequelize = sequelize;
  }

  public get(id: number): Promise<Nullable<Form>> {
    return this.repository.get(id);
  }

  public getAllByOwner(uuid: string): Promise<Form[]> {
    return this.repository.getAllByOwner(uuid);
  }

  public getInstanceByName(
    name: string,
    formId: number
  ): Promise<Nullable<object>> {
    return this.get(formId).then((form: Nullable<Form>) => {
      if (!form) {
        throw `Form with id: ${formId} not found`;
      }
      return this.sequelize
        .getQueryInterface()
        .select(null, getInstancesTableName(form.sysName), {
          where: {
            name: name,
          },
        })
        .then((result: object[]) => (result.length ? result[0] : null));
    });
  }

  public getInstance(id: number, formId: number): Promise<Nullable<object>> {
    return this.get(formId).then((form: Nullable<Form>) => {
      if (!form) {
        throw `Form with id: ${formId} not found`;
      }
      return this.sequelize
        .getQueryInterface()
        .select(null, getInstancesTableName(form.sysName), {
          where: {
            id: id,
          },
        })
        .then((result: object[]) => (result.length ? result[0] : null));
    });
  }

  public create(dto: CreateFormDto, ownerUUID: string): Promise<void> {
    return this.userService
      .findByUUID(ownerUUID)
      .then((user: Nullable<User>) => {
        if (!user) {
          throw `User with uuid: ${ownerUUID} not found`;
        }
        return this.createForm(dto, user);
      })
      .then((form: Form) => this.createTables(form, dto).then(() => form))
      .then((form: Form) => this.insertIntoTables(form, dto));
  }

  public createInstance(
    dto: CreateFormInstanceDto,
    ownerUUID: string
  ): Promise<object> {
    return this.get(dto.formId)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with id: ${dto.formId} not found`;
        }
        const tableName = getInstancesTableName(form.sysName);
        return this.sequelize.getQueryInterface().bulkInsert(tableName, [
          {
            name: dto.name,
            ownerId: ownerUUID,
          },
        ]);
      })
      .then(() => this.getInstanceByName(dto.name, dto.formId) as object);
  }

  private createForm(dto: CreateFormDto, user: User): Promise<Form> {
    const form: Form = new Form();
    form.name = dto.name;
    form.sysName = toUnderscoreCase(dto.name);
    form.owner = user;
    form.ownerId = user.uuid;
    form.json = dto.json;
    return this.repository.create(form);
  }

  private createTables(form: Form, dto: CreateFormDto): Promise<void> {
    return this.createInstancesTable(form).then(() => {
      return this.createFieldsTables(form, dto.fields).then(() => {
        return this.createValuesTables(form, dto.fields);
      });
    });
  }

  private createInstancesTable = (form: Form): Promise<void> => {
    const tableName: string = getInstancesTableName(form.sysName);
    const attributes = getInstancesAttributes();
    return this.sequelize
      .getQueryInterface()
      .createTable(tableName, attributes);
  };

  private createFieldsTables = (
    form: Form,
    fields: FormField[]
  ): Promise<void> => {
    const tableName: string = getFieldsTableName(form.sysName);
    return this.createFieldsTable(tableName).then(() => {
      return fields.forEach((field: FormField) => {
        if (isTable(field)) {
          const tableName: string = getFieldsTableName(
            form.sysName,
            field.name
          );
          return this.createFieldsTable(tableName);
        }
      });
    });
  };

  private createValuesTables(form: Form, fields: FormField[]): Promise<void> {
    return this.createValuesTable(form).then(() => {
      return fields.forEach((field: FormField) => {
        if (isTable(field)) {
          return this.createValuesTable(form, field, true);
        }
      });
    });
  }

  private createFieldsTable(tableName: string): Promise<void> {
    const attributes = getFieldsAttributes();
    return this.sequelize
      .getQueryInterface()
      .createTable(tableName, attributes);
  }

  private createValuesTable(
    form: Form,
    field: Nullable<FormField> = null,
    includeRowId: boolean = false
  ): Promise<void> {
    const tableName: string = getValuesTableName(form.sysName, field?.name);
    const fieldsTableName: string = getFieldsTableName(
      form.sysName,
      field?.name
    );
    const instancesTableName: string = getInstancesTableName(form.sysName);
    const attributes = getValuesAttributes(
      instancesTableName,
      fieldsTableName,
      includeRowId
    );
    return this.sequelize
      .getQueryInterface()
      .createTable(tableName, attributes);
  }

  private insertIntoTables(form: Form, dto: CreateFormDto): Promise<void> {
    return this.insertFieldsIntoTable(form, dto.fields);
  }

  private insertFieldsIntoTable(
    form: Form,
    fields: FormField[]
  ): Promise<void> {
    return Promise.resolve(
      fields.forEach((field: FormField) => {
        const tableName: string = getFieldsTableName(form.sysName);
        return this.insertFieldIntoTable(tableName, field).then(() => {
          if (isTable(field)) {
            return field.type.fields?.forEach((subField: FormField) => {
              const tableName: string = getFieldsTableName(
                form.sysName,
                field.name
              );
              return this.insertFieldIntoTable(tableName, subField);
            });
          }
        });
      })
    );
  }

  private insertFieldIntoTable(
    tableName: string,
    field: FormField
  ): Promise<object> {
    return this.sequelize.getQueryInterface().bulkInsert(tableName, [
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
