import { Repository } from "sequelize-typescript";
import Form from "../entities/form.entity";

export class FormRepository {
  private repository: Repository<Form>;

  constructor(repository: Repository<Form>) {
    this.repository = repository;
  }

  public create(form: Form): Promise<Form> {
    return Promise.resolve(form);
    //return form.save();
  }
}

export default FormRepository;
