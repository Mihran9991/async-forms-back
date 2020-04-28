import { Repository } from "sequelize-typescript";

import Form from "../entities/form.entity";

export class FormRepository {
  private repository: Repository<Form>;

  constructor(repository: Repository<Form>) {
    this.repository = repository;
  }

  public create(form: Form): Promise<Form> {
    return form.save();
  }

  public getAllByOwner(uuid: string): Promise<Form[]> {
    return this.repository.findAll({
      where: {
        ownerId: uuid,
      },
    });
  }
}

export default FormRepository;
