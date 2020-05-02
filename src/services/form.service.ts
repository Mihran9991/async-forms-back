import { Sequelize } from "sequelize-typescript";

import FormRepository from "../repositories/form.repository";
import CreateFormDto from "../dtos/create.form.dto";
import Form from "../entities/form.entity";
import { toUnderscoreCase } from "../utils/string.utils";
import User from "../entities/user.entity";
import UserService from "./user.service";
import { FormField, FormInstance, Nullable } from "../types/main.types";
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
import { InsertFormValueDto } from "../dtos/insert.form.value.dto";

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

  public getByName(name: string): Promise<Nullable<Form>> {
    return this.repository.getByName(toUnderscoreCase(name));
  }

  public getAllByOwner(uuid: string): Promise<Form[]> {
    return this.repository.getAllByOwner(uuid);
  }

  public getInstanceByName(
    name: string,
    formName: string
  ): Promise<Nullable<FormInstance>> {
    return this.getByName(formName).then((form: Nullable<Form>) => {
      if (!form) {
        throw `Form with name: ${formName} not found`;
      }
      return this.sequelize
        .getQueryInterface()
        .select(null, getInstancesTableName(form.sysName), {
          where: {
            name: name,
          },
        })
        .then((result: object[]) =>
          result.length ? (result[0] as FormInstance) : null
        );
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
  ): Promise<Nullable<FormInstance>> {
    return this.getByName(dto.formName)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${dto.formName} not found`;
        }
        const tableName = getInstancesTableName(form.sysName);
        return this.sequelize
          .getQueryInterface()
          .bulkInsert(tableName, [
            {
              name: dto.name,
              ownerId: ownerUUID,
            },
          ])
          .then((res) => {
            return res;
          });
      })
      .then(() => this.getInstanceByName(dto.name, dto.formName));
  }

  public insertValue(
    dto: InsertFormValueDto,
    ownerUUID: string
  ): Promise<object> {
    return this.getByName(dto.formName).then((form: Nullable<Form>) => {
      if (!form) {
        throw `Form with name: ${dto.formName} not found`;
      }
      return this.getInstanceByName(dto.instanceName, dto.formName).then(
        (instance: Nullable<FormInstance>) => {
          if (!instance) {
            throw `Form instance with name: ${dto.instanceName} not found`;
          }
          const fieldsTable: string = getFieldsTableName(form.sysName);
          return this.sequelize
            .getQueryInterface()
            .select(null, fieldsTable, {
              where: {
                sysName: toUnderscoreCase(dto.field.name),
              },
            })
            .then((res: object[]) => {
              const field = res[0] as { id: number; type: string };
              if (isTable(field.type)) {
                const nestedFieldsTable: string = getFieldsTableName(
                  form.sysName,
                  dto.field.name
                );
                return this.sequelize
                  .getQueryInterface()
                  .select(null, nestedFieldsTable, {
                    where: {
                      sysName: toUnderscoreCase(
                        dto.field.field?.name as string
                      ),
                    },
                  })
                  .then((res) => {
                    const nestedField = res[0] as { id: number; type: string };
                    const nestedValuesTable: string = getValuesTableName(
                      form.sysName,
                      dto.field.name
                    );
                    return this.sequelize
                      .getQueryInterface()
                      .bulkInsert(nestedValuesTable, [
                        {
                          instanceId: instance.id,
                          fieldId: nestedField.id,
                          rowId: dto.field.field?.rowId,
                          value: dto.field.field?.value,
                          ownerId: ownerUUID,
                        },
                      ]);
                  });
              }
              const valuesTable: string = getValuesTableName(form.sysName);
              return this.sequelize
                .getQueryInterface()
                .bulkInsert(valuesTable, [
                  {
                    instanceId: instance.id,
                    fieldId: field.id,
                    value: dto.field.value,
                    ownerId: ownerUUID,
                  },
                ]);
            });
        }
      );
    });
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
        if (isTable(field.type.name)) {
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
        if (isTable(field.type.name)) {
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
          if (isTable(field.type.name)) {
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
