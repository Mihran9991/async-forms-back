import { InsertFormValueDto } from "../dtos/insert.form.value.dto";
import { FormInstance, Nullable } from "../types/main.types";
import Form from "../entities/form.entity";
import {
  getFieldsTableName,
  getInstancesTableName,
  getValuesTableName,
  isTable,
} from "../utils/form.utils";
import { toUnderscoreCase } from "../utils/string.utils";
import { Sequelize } from "sequelize-typescript";
import FormService from "./form.service";
import CreateFormInstanceDto from "../dtos/create.form.instance.dto";

export class FormInstanceService {
  private formService: FormService;
  private sequelize: Sequelize;

  public constructor(formService: FormService, sequelize: Sequelize) {
    this.formService = formService;
    this.sequelize = sequelize;
  }

  public getByName(
    name: string,
    formName: string
  ): Promise<Nullable<FormInstance>> {
    return this.formService.getByName(formName).then((form: Nullable<Form>) => {
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

  public create(
    dto: CreateFormInstanceDto,
    ownerUUID: string
  ): Promise<Nullable<FormInstance>> {
    return this.formService
      .getByName(dto.formName)
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
      .then(() => this.getByName(dto.name, dto.formName));
  }

  public insertValue(
    dto: InsertFormValueDto,
    ownerUUID: string
  ): Promise<object> {
    return this.formService
      .getByName(dto.formName)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${dto.formName} not found`;
        }
        return this.getByName(dto.instanceName, dto.formName).then(
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
                      const nestedField = res[0] as {
                        id: number;
                        type: string;
                      };
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
}

export default FormInstanceService;
