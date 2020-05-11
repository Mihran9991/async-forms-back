import redis from "redis";
import util from "util";
import isObject from "lodash/isObject";

import FormFieldDto from "../dtos/form.field.dto";
import { constructFormFieldKey } from "../utils/redis.utils";
import { RedisActiveUser, RedisField } from "../types/main.types";
import RedisConstants from "../constants/redis.constants";

class RedisService {
  private readonly client: redis.RedisClient;
  private readonly getAsync: (...args: any) => Promise<any>;
  private readonly hGetAllAsync: (...args: any) => Promise<any>;
  private readonly hDelAsync: (...args: any) => Promise<any>;

  public constructor() {
    this.client = redis.createClient();
    this.getAsync = util.promisify(this.client.get).bind(this.client);
    this.hGetAllAsync = util.promisify(this.client.hgetall).bind(this.client);
    this.hDelAsync = util.promisify(this.client.hdel).bind(this.client);
    this.clearActiveUserList();
  }

  public init(): void {
    this.client.on("connect", () => {
      console.log("Redis initiated successfully!");
    });
  }

  public lockField(fieldData: FormFieldDto) {
    const redisKey = constructFormFieldKey(fieldData);
    this.client.set(redisKey, fieldData.ownerId);
  }

  public unLockField(fieldData: FormFieldDto) {
    const redisKey = constructFormFieldKey(fieldData);
    this.client.del(redisKey);
  }

  public isFieldLocked(
    fieldData: RedisField
  ): Promise<{ isLocked: boolean; ownerId: string }> {
    const redisKey: string = constructFormFieldKey(fieldData);
    return this.getAsync(redisKey).then((ownerId) => {
      return {
        isLocked: Boolean(ownerId),
        ownerId: ownerId || "",
      };
    });
  }

  public addActiveUser(userData: RedisActiveUser): void {
    this.client.hset(
      RedisConstants.ACTIVE_USERS_KEY,
      userData.uuid,
      JSON.stringify(userData)
    );
  }

  public getActiveUsers(currentUserUUid: string): Promise<any> {
    return this.hGetAllAsync(RedisConstants.ACTIVE_USERS_KEY)
      .then((activeUsers) =>
        this.parseActiveUsersList(activeUsers, currentUserUUid)
      )
      .catch((err) => {
        throw `Error during getting active users list: ${err.message}`;
      });
  }

  public removeActiveUser(currentUserUUid: string): Promise<any> {
    return this.hDelAsync(RedisConstants.ACTIVE_USERS_KEY, currentUserUUid);
  }

  // noinspection JSUnusedGlobalSymbols
  public clearActiveUserList() {
    this.hGetAllAsync(RedisConstants.ACTIVE_USERS_KEY)
      .then(async (activeUsers) => {
        const socketIds = Object.keys(activeUsers);

        for await (const key of socketIds) {
          // noinspection ES6MissingAwait
          this.hDelAsync(RedisConstants.ACTIVE_USERS_KEY, key);
        }
      })
      .catch((err) => {
        throw `Error during clearing active users list: ${err.message}`;
      });
  }

  private parseActiveUsersList(
    activeUsers: {
      [key: string]: string;
    },
    currentUserUUid: string
  ): RedisActiveUser[] {
    if (isObject(activeUsers)) {
      const transformedData: string[] = Object.values(activeUsers);
      const reduceMapper = (acc: RedisActiveUser[], value: string) => {
        const user = JSON.parse(value);
        if (user.uuid !== currentUserUUid) {
          return [...acc, user];
        }

        return [...acc];
      };

      return transformedData.reduce(reduceMapper, []);
    }

    return [];
  }
}

export default RedisService;
