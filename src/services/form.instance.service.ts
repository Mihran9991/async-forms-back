import { InsertInstanceValueDto } from "../dtos/insert.instance.value.dto";
import {
  DbFormField,
  DbFormValue,
  DbNestedFormValue,
  FormInstance,
  IdType,
  Nullable,
} from "../types/main.types";
import Form from "../entities/form.entity";
import {
  getFieldsTableName,
  getInsertValueAttributes,
  getInstancesTableName,
  getValuesTableName,
  isTable,
} from "../utils/form.utils";
import { toUnderscoreCase } from "../utils/string.utils";
import FormService from "./form.service";
import TableService from "./table.service";
import InstanceDto from "../dtos/instance.dto";
import QueryUtils from "../utils/query.utils";
import JsonUtils, { getFieldJson } from "../utils/json.utils";

export class FormInstanceService {
  private formService: FormService;
  private tableService: TableService;

  public constructor(formService: FormService, tableService: TableService) {
    this.formService = formService;
    this.tableService = tableService;
  }

  public get(dto: InstanceDto): Promise<Nullable<FormInstance>> {
    return this.formService.get(dto.formName).then((form: Nullable<Form>) => {
      if (!form) {
        throw `Form with name: ${dto.formName} not found`;
      }
      return this.tableService.getAs<FormInstance>(
        getInstancesTableName(form.sysName),
        QueryUtils.whereName(dto.instanceName)
      );
    });
  }

  public getInstances(name: string): Promise<FormInstance[]> {
    return this.formService.get(name).then((form: Nullable<Form>) => {
      if (!form) {
        throw `Form with name: ${name} not found`;
      }
      return this.tableService.getManyAs<FormInstance>(
        getInstancesTableName(form.sysName)
      );
    });
  }

  public getValues(instanceDto: InstanceDto): Promise<object> {
    return this.formService
      .get(instanceDto.formName)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${name} not found`;
        }
        return Promise.all([
          form,
          this.tableService.getAs<FormInstance>(
            getInstancesTableName(form.sysName),
            QueryUtils.whereName(instanceDto.instanceName)
          ),
        ]);
      })
      .then(async (result) => {
        const form: Form = result[0] as Form;
        const instance: Nullable<FormInstance> = result[1];
        if (!instance) {
          throw `Form instance with name: ${instanceDto.instanceName} not found`;
        }
        return Promise.all([
          form,
          this.tableService.getManyAs<DbFormField>(
            getFieldsTableName(form.sysName)
          ),
          this.tableService.getManyAs<DbFormValue>(
            getValuesTableName(form.sysName),
            QueryUtils.whereInstanceId(instance.id)
          ),
        ]);
      })
      .then((result) => {
        const form: Form = result[0];
        const fields: DbFormField[] = result[1];
        const values: DbFormValue[] = result[2];
        return Promise.all([
          fields
            .filter((field: DbFormField) => !isTable(field.type))
            .map((field: DbFormField) => {
              const value = values
                .filter((value: DbFormValue) => value.fieldId === field.id)
                .sort((value1: DbFormValue, value2: DbFormValue) => {
                  return (
                    value2.createdAt.valueOf() - value1.createdAt.valueOf()
                  );
                })[0] as DbFormValue;
              return getFieldJson(
                field.name,
                value.value,
                value.ownerId,
                value.createdAt
              );
            }),
          Promise.all(
            fields
              .filter((field: DbFormField) => isTable(field.type))
              .map((field: DbFormField) => {
                return this.tableService
                  .getManyAs<DbFormField>(
                    getFieldsTableName(form.sysName, field.name)
                  )
                  .then((nestedFields: DbFormField[]) => {
                    return Promise.all([
                      nestedFields,
                      this.tableService.getManyAs<DbNestedFormValue>(
                        getValuesTableName(form.sysName, field.name)
                      ),
                    ]);
                  })
                  .then((result) => {
                    const nestedFields: DbFormField[] = result[0];
                    const nestedValues: DbNestedFormValue[] = result[1];
                    return JsonUtils.getNestedFieldJson(
                      field.name,
                      nestedFields,
                      nestedValues
                    );
                  });
              })
          ),
        ]);
      })
      .then((result) => {
        return JSON.parse(`{
            ${result[0]},
            ${result[1]}
        }`);
      });
  }

  public create(
    dto: InstanceDto,
    ownerUUID: string
  ): Promise<Nullable<FormInstance>> {
    return this.formService
      .get(dto.formName)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${dto.formName} not found`;
        }
        const tableName = getInstancesTableName(form.sysName);
        return this.tableService.insert(
          tableName,
          QueryUtils.insertNameAndOwnerId(dto.instanceName, ownerUUID)
        );
      })
      .then(() => this.get(dto));
  }

  public insertValue(
    dto: InsertInstanceValueDto,
    ownerUUID: string
  ): Promise<object> {
    return this.formService
      .get(dto.formName)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${dto.formName} not found`;
        }
        return Promise.all([form, this.get(dto)]);
      })
      .then((values) => {
        const form: Form = values[0] as Form;
        const instance: Nullable<FormInstance> = values[1];
        if (!instance) {
          throw `Form instance with name: ${dto.instanceName} not found`;
        }
        return Promise.all([
          form,
          instance,
          this.tableService.getAs<IdType>(
            getFieldsTableName(form.sysName),
            QueryUtils.whereSysName(toUnderscoreCase(dto.field.name))
          ),
        ]);
      })
      .then((values) => {
        const form: Form = values[0] as Form;
        const instance: FormInstance = values[1] as FormInstance;
        const field: Nullable<IdType> = values[2];
        if (!field) {
          throw `Field with name: ${dto.field.name} not found`;
        }
        if (isTable(field.type)) {
          return this.tableService
            .getAs<IdType>(
              getFieldsTableName(form.sysName, dto.field.name),
              QueryUtils.whereSysName(toUnderscoreCase(dto.field.field?.name!))
            )
            .then((res: Nullable<IdType>) => {
              return this.tableService.insert(
                getValuesTableName(form.sysName, dto.field.name),
                getInsertValueAttributes(
                  instance.id,
                  res!.id,
                  dto.field.field!.value,
                  ownerUUID,
                  dto.field.field?.rowId
                )
              );
            });
        }
        return this.tableService.insert(
          getValuesTableName(form.sysName),
          getInsertValueAttributes(
            instance.id,
            field.id,
            dto.field.value!,
            ownerUUID
          )
        );
      });
  }
}

export default FormInstanceService;
