import FormRepository from "../repositories/form.repository";
import FormDto from "../dtos/form.dto";

export class FormService {
  private formRepository: FormRepository;

  public constructor(formRepository: FormRepository) {
    this.formRepository = formRepository;
  }

  public create(dto: FormDto) {
    return Promise.resolve();
  }
}

export default FormService;
