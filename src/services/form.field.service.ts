import RedisService from "./redis.service";
import FormFieldDto from "../dtos/form.fied.dto";

export class FormFieldService {
  private redisService: RedisService;

  public constructor(redisService: RedisService) {
    this.redisService = redisService;
  }

  public isFieldLocked(formData: FormFieldDto) {
    return this.redisService.isFieldLocked(formData);
  }
}

export default FormFieldService;
