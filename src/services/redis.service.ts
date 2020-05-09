import redis from "redis";
import util from "util";
import isObject from "lodash/isObject";

import FormFieldDto from "../dtos/form.fied.dto";
import { consturctFormFieldKey } from "../utils/redis.util";
import { RedisActiveUser } from "../types/main.types";

class RedisService {
  private client: redis.RedisClient;
  private getAsync: (...args: any) => Promise<any>;
  private hGetAllAsync: (...args: any) => Promise<any>;
  private hDelAsync: (...args: any) => Promise<any>;
  private activeUsersKey: string = "active_users";

  private parseActiveUsersList(
    activeUsers: {
      [key: string]: string;
    },
    currenrUserUUid: string
  ): RedisActiveUser[] {
    if (isObject(activeUsers)) {
      const transformedData: string[] = Object.values(activeUsers);
      const reduceMapper = (acc: RedisActiveUser[], value: string) => {
        const user = JSON.parse(value);
        if (user.uuid !== currenrUserUUid) {
          return [...acc, user];
        }

        return [...acc];
      };

      return transformedData.reduce(reduceMapper, []);
    }

    return [];
  }

  public constructor() {
    this.client = redis.createClient();
    this.getAsync = util.promisify(this.client.get).bind(this.client);
    this.hGetAllAsync = util.promisify(this.client.hgetall).bind(this.client);
    this.hDelAsync = util.promisify(this.client.hdel).bind(this.client);
  }

  public init(): void {
    this.client.on("connect", () => {
      console.log("Redis initieted successfully!");
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

  public addActiveUser(userData: RedisActiveUser): void {
    this.client.hset(
      this.activeUsersKey,
      userData.uuid,
      JSON.stringify(userData)
    );
  }

  public getActiveUsers(currenrUserUUid: string): Promise<any> {
    return this.hGetAllAsync(this.activeUsersKey)
      .then((activeUsers) =>
        this.parseActiveUsersList(activeUsers, currenrUserUUid)
      )
      .catch((err) => {
        throw `Error during getting active users list: ${err.message}`;
      });
  }

  public clearActiveUserList() {
    this.hGetAllAsync(this.activeUsersKey)
      .then(async (activeUsers) => {
        const socketIds = Object.keys(activeUsers);

        for await (const key of socketIds) {
          this.hDelAsync(this.activeUsersKey, key);
        }
      })
      .catch((err) => {
        throw `Error during clearing active users list: ${err.message}`;
      });
  }
}

export default RedisService;
