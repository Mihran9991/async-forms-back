import lodash from "lodash";

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
import RedisService from "./redis.service";
import InstanceDto from "../dtos/instance.dto";
import QueryUtils from "../utils/query.utils";
import JsonUtils from "../utils/json.utils";
import PromiseUtils from "../utils/promise.utils";
import UserService from "./user.service";
import GetFormInstanceDto from "../dtos/get.form.instance.dto";
import FormMappers from "../mappers/form.mappers";

export class FormInstanceService {
  private readonly formService: FormService;
  private readonly tableService: TableService;
  private readonly redisService: RedisService;
  private readonly userService: UserService;

  public constructor(
    formService: FormService,
    tableService: TableService,
    redisService: RedisService,
    userService: UserService
  ) {
    this.formService = formService;
    this.tableService = tableService;
    this.redisService = redisService;
    this.userService = userService;
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

  public getInstances(name: string): Promise<GetFormInstanceDto[]> {
    return this.formService
      .get(name)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${name} not found`;
        }
        return form;
      })
      .then((form: Form) => {
        return this.tableService.getManyAs<FormInstance>(
          getInstancesTableName(form.sysName)
        );
      })
      .then((result: FormInstance[]) =>
        Promise.all(
          result.map((instance: FormInstance) =>
            FormMappers.toInstanceDto(instance, this.userService)
          )
        )
      );
  }

  public getValues(instanceDto: InstanceDto): Promise<object> {
    return PromiseUtils.serialWithReturns(this, instanceDto, [
      this.getFormAndInstance,
      this.getFieldsAndValues,
      this.getJson,
    ]).then((result) => FormInstanceService.getParsedJson(result));
  }

  public create(
    dto: InstanceDto,
    ownerUUID: string
  ): Promise<GetFormInstanceDto> {
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
      .then(() => this.get(dto))
      .then((instance: Nullable<FormInstance>) =>
        FormMappers.toInstanceDto(instance!, this.userService)
      );
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

  private static getParsedJson(result: [string[], string[]]): object {
    return JSON.parse(`{
            ${result[0]}
            ${
              !(lodash.isEmpty(result[0]) || lodash.isEmpty(result[1]))
                ? ","
                : ""
            }
            ${result[1]}
        }`);
  }

  private getFormAndInstance(instanceDto: InstanceDto) {
    return this.formService
      .get(instanceDto.formName)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${instanceDto.formName} not found`;
        }
        return Promise.all([
          form,
          instanceDto.instanceName,
          this.tableService.getAs<FormInstance>(
            getInstancesTableName(form.sysName),
            QueryUtils.whereName(instanceDto.instanceName)
          ),
        ]);
      });
  }

  private getFieldsAndValues(
    result: (Form | string | FormInstance | null)[]
  ): Promise<[Form, FormInstance, DbFormField[], DbFormValue[]]> {
    const form = result[0] as Form;
    const instanceName = result[1] as string;
    const instance = result[2] as Nullable<FormInstance>;
    if (!instance) {
      throw `Form instance with name: ${instanceName} not found`;
    }
    return Promise.all([
      form,
      instance,
      this.tableService.getManyAs<DbFormField>(
        getFieldsTableName(form.sysName)
      ),
      this.tableService.getManyAs<DbFormValue>(
        getValuesTableName(form.sysName),
        QueryUtils.whereInstanceId(instance.id)
      ),
    ]);
  }

  private getJson(
    result: (Form | FormInstance | DbFormField[] | DbFormValue[])[]
  ): Promise<[string[], string[]]> {
    const form = result[0] as Form;
    const instance = result[1] as FormInstance;
    const fields = result[2] as DbFormField[];
    const values = result[3] as DbFormValue[];
    return Promise.all([
      this.getFieldsAndValuesJson(form, instance, fields, values),
      this.getNestedFieldsAndValues(form, instance, fields),
    ]);
  }

  private getFieldsAndValuesJson(
    form: Form,
    instance: FormInstance,
    fields: DbFormField[],
    values: DbFormValue[]
  ): Promise<string[]> {
    return Promise.all(
      fields
        .filter((field: DbFormField) => !isTable(field.type))
        .map((field: DbFormField) => {
          const value: Nullable<DbFormValue> =
            (values
              .filter((value: DbFormValue) => value.fieldId === field.id)
              .sort((value1: DbFormValue, value2: DbFormValue) => {
                return value2.createdAt.valueOf() - value1.createdAt.valueOf();
              })?.[0] as DbFormValue) ?? null;
          return this.redisService
            .isFieldLocked({
              formName: form.name,
              instanceName: instance.name,
              fieldName: field.name,
              type: field.type,
              columnId: null,
              rowId: null,
            })
            .then(({ isLocked, ownerId: lockedBy }) => {
              return JsonUtils.getFieldJson(
                field.name,
                value?.value,
                value?.ownerId,
                value?.createdAt,
                isLocked,
                lockedBy
              );
            });
        })
    );
  }

  private getNestedFieldsAndValues(
    form: Form,
    instance: FormInstance,
    fields: DbFormField[]
  ): Promise<string[]> {
    return Promise.all(
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
                  getValuesTableName(form.sysName, field.name),
                  QueryUtils.whereInstanceId(instance.id)
                ),
              ]);
            })
            .then((result) => {
              const nestedFields: DbFormField[] = result[0];
              const nestedValues: DbNestedFormValue[] = result[1];
              return JsonUtils.getNestedFieldJson(
                form.name,
                instance.name,
                field.name,
                field.type,
                nestedFields,
                nestedValues,
                this.redisService
              );
            });
        })
    );
  }
}

export default FormInstanceService;
