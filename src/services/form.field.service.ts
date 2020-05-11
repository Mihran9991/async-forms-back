import RedisService from "./redis.service";
import FormFieldDto from "../dtos/form.field.dto";
import TableService from "./table.service";
import {
  DbFormField,
  DbFormValue,
  FormInstance,
  Nullable,
} from "../types/main.types";
import {
  getFieldsTableName,
  getValuesTableName,
  isTable,
} from "../utils/form.utils";
import FormService from "./form.service";
import Form from "../entities/form.entity";
import FormInstanceService from "./form.instance.service";
import InstanceDto from "../dtos/instance.dto";
import {
  whereInstanceIdFieldId,
  whereInstanceIdRowIdFieldId,
  whereSysName,
} from "../utils/query.utils";
import UserService from "./user.service";
import GetFormFieldAuditDto from "../dtos/get.form.field.audit.dto";
import FormFieldAuditDto from "../dtos/form.field.audit.dto";
import { toUnderscoreCase } from "../utils/string.utils";

export class FormFieldService {
  private formService: FormService;
  private formInstanceService: FormInstanceService;
  private tableService: TableService;
  private redisService: RedisService;
  private userService: UserService;

  constructor(
    formService: FormService,
    formInstanceService: FormInstanceService,
    tableService: TableService,
    redisService: RedisService,
    userService: UserService
  ) {
    this.formService = formService;
    this.formInstanceService = formInstanceService;
    this.tableService = tableService;
    this.redisService = redisService;
    this.userService = userService;
  }

  public getFieldAudit(
    formData: FormFieldAuditDto
  ): Promise<GetFormFieldAuditDto[]> {
    return this.formService
      .get(formData.formName)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${formData.formName} not found`;
        }
        return form;
      })
      .then((form: Form) => {
        const dto: InstanceDto = new InstanceDto(
          formData.instanceName,
          formData.formName
        );
        return Promise.all([form, this.formInstanceService.get(dto)]);
      })
      .then((result) => {
        const form: Form = result[0] as Form;
        const instance: Nullable<FormInstance> = result[1];
        if (!instance) {
          throw `Form instance with name: ${formData.instanceName} not found`;
        }
        return Promise.all([
          form,
          instance,
          this.tableService.getAs<DbFormField>(
            getFieldsTableName(form.sysName),
            whereSysName(toUnderscoreCase(formData.fieldName))
          ),
        ]);
      })
      .then((result) => {
        const form: Form = result[0] as Form;
        const instance: FormInstance = result[1] as FormInstance;
        const field: Nullable<DbFormField> = result[2];
        if (!field) {
          throw `Field with name: ${formData.fieldName} not found`;
        }
        if (!isTable(field.type)) {
          const tableName = getValuesTableName(form.sysName);
          const attributes = whereInstanceIdFieldId(instance.id, field.id);
          return this.tableService.getManyAs<DbFormValue>(
            tableName,
            attributes
          );
        }
        return this.tableService
          .getAs<DbFormField>(
            getFieldsTableName(form.sysName, formData.fieldName),
            whereSysName(toUnderscoreCase(formData.columnName))
          )
          .then((nestedField: Nullable<DbFormField>) => {
            if (!nestedField) {
              throw `Field with name: ${formData.columnName} not found`;
            }
            const tableName = getValuesTableName(form.sysName, field.name);
            const attributes = whereInstanceIdRowIdFieldId(
              formData.rowId,
              instance.id,
              nestedField.id
            );
            return this.tableService.getManyAs<DbFormValue>(
              tableName,
              attributes
            );
          });
      })
      .then((values: DbFormValue[]) => {
        return Promise.all(
          values.map((value: DbFormValue) => {
            return this.userService
              .getFullName(value.ownerId)
              .then((fullName: string) => {
                return new GetFormFieldAuditDto(
                  value.value,
                  fullName,
                  value.createdAt
                );
              });
          })
        );
      })
      .then((values: GetFormFieldAuditDto[]) =>
        values.sort(
          (value1: GetFormFieldAuditDto, value2: GetFormFieldAuditDto) =>
            value2.createdAt.valueOf() - value1.createdAt.valueOf()
        )
      );
  }

  public isFieldLocked(formData: FormFieldDto) {
    return this.redisService.isFieldLocked(formData);
  }
}

export default FormFieldService;
