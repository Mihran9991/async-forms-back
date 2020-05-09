import redis from "redis";
import util from "util";

import FormFieldDto from "../dtos/form.fied.dto";
import { consturctFormFieldKey } from "../utils/redis.util";

class RedisService {
  private client: redis.RedisClient;
  private getAsync: (...args: any) => Promise<any>;

  public constructor() {
    this.client = redis.createClient();
    this.getAsync = util.promisify(this.client.get).bind(this.client);
  }

  public init(): void {
    this.client.on("connect", () => {
      console.log("Redis client connected");
    });
  }

  public lockField(fieldData: FormFieldDto) {
    const redisKey = consturctFormFieldKey(fieldData);
    this.client.set(redisKey, fieldData.ownerId);
  }

  public unLockField(fieldData: FormFieldDto) {
    const redisKey = consturctFormFieldKey(fieldData);

    this.client.del(redisKey);
  }

  public isFieldLocked(fieldData: FormFieldDto): Promise<boolean> {
    const redisKey = consturctFormFieldKey(fieldData);

    return this.getAsync(redisKey)
      .then((reply) => {
        return Boolean(reply);
      })
      .catch((err) => {
        return err;
      });
  }
}

export default RedisService;
