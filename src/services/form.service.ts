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
        const form: Form = new Form();
        form.name = dto.name;
        form.sysName = toUnderscoreCase(dto.name);
        form.owner = user;
        form.ownerId = user.uuid;
        return form.save();
      })
      .then((form: Form) => {
        this.queryInterface
          .createTable(`${form.sysName}_fields`, {
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
            formId: {
              allowNull: false,
              type: SEQ_INT_TYPE,
              references: {
                model: "forms",
                key: "id",
              },
            },
          })
          .then(() => {
            dto.fields.forEach((field: FormField) => {
              this.queryInterface.bulkInsert(`${form.sysName}_fields`, [
                {
                  formId: form.id,
                  name: field.name,
                  sysName: toUnderscoreCase(field.name),
                  type: field.type.name,
                  optional: field.optional,
                },
              ]);
            });
          });
      });
  }

  public getAllByOwner(uuid: string): Promise<Form[]> {
    return this.repository.getAllByOwner(uuid);
  }
}

export default FormService;
