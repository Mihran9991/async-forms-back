import { Repository } from "sequelize-typescript";

import Form from "../entities/form.entity";
import { Nullable } from "../types/main.types";

export class FormRepository {
  private repository: Repository<Form>;

  constructor(repository: Repository<Form>) {
    this.repository = repository;
  }

  public getByName(name: string): Promise<Nullable<Form>> {
    return this.repository.findOne({
      where: {
        sysName: name,
      },
    });
  }

  public getAllByOwner(uuid: string): Promise<Form[]> {
    return this.repository.findAll({
      where: {
        ownerId: uuid,
      },
    });
  }

  public create(form: Form): Promise<Form> {
    return form.save();
  }
}

export default FormRepository;
