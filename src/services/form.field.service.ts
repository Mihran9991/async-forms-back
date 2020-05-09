import RedisServce from "./redis.service";
import FormFieldDto from "../dtos/form.fied.dto";

export class FormFieldService {
  private redisService: RedisServce;

  public constructor(redisService: RedisServce) {
    this.redisService = redisService;
  }

  public isFieldLocked(formData: FormFieldDto) {
    return this.redisService.isFieldLocked(formData);
  }
}

export default FormFieldService;
