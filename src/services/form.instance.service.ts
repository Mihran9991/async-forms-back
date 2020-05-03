import { InsertInstanceValueDto } from "../dtos/insert.instance.value.dto";
import { FormInstance, IdType, Nullable } from "../types/main.types";
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

export class FormInstanceService {
  private formService: FormService;
  private tableService: TableService;

  public constructor(formService: FormService, tableService: TableService) {
    this.formService = formService;
    this.tableService = tableService;
  }

  public getByName(dto: InstanceDto): Promise<Nullable<FormInstance>> {
    return this.formService
      .getByName(dto.formName)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${dto.formName} not found`;
        }
        return this.tableService.getAs<FormInstance>(
          getInstancesTableName(form.sysName),
          QueryUtils.whereName(dto.instanceName)
        );
      });
  }

  public create(
    dto: InstanceDto,
    ownerUUID: string
  ): Promise<Nullable<FormInstance>> {
    return this.formService
      .getByName(dto.formName)
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
      .then(() => this.getByName(dto));
  }

  public insertValue(
    dto: InsertInstanceValueDto,
    ownerUUID: string
  ): Promise<object> {
    return this.formService
      .getByName(dto.formName)
      .then((form: Nullable<Form>) => {
        if (!form) {
          throw `Form with name: ${dto.formName} not found`;
        }
        return Promise.all([form, this.getByName(dto)]);
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
