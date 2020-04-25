import bcrypt from "bcrypt";

import UserRepository from "../repositories/user.repository";
import RegistrationDto from "../dtos/registration.dto";
import User from "../entities/user.entity";
import { Nullable } from "../types/main.types";
import { generateUUID } from "../utils/uuid.utils";
import EditUserDto from "../dtos/edit.user.dto";
import CloudService from "./cloud.service";

export class UserService {
  private userRepository: UserRepository;
  private cloudService: CloudService;

  public constructor(
    userRepository: UserRepository,
    cloudService: CloudService
  ) {
    this.userRepository = userRepository;
    this.cloudService = cloudService;
  }

  public findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  public findByUUID(uuid: string): Promise<Nullable<User>> {
    return this.userRepository.findByUUID(uuid);
  }

  public findByEmail(email: string): Promise<Nullable<User>> {
    return this.userRepository.findByEmail(email);
  }

  public create(dto: RegistrationDto): Promise<Nullable<User>> {
    return UserService.hashPassword(dto.password)
      .then((password) => {
        const user = new User();
        user.uuid = generateUUID();
        user.name = dto.name;
        user.surname = dto.surname;
        user.email = dto.email;
        user.password = password;
        return this.userRepository.create(user);
      })
      .catch((err) => Promise.reject(err));
  }

  public update(dto: EditUserDto) {
    return this.findByUUID(dto.uuid).then(async (user: Nullable<User>) => {
      if (!user) {
        return Promise.reject(`User with uuid: ${dto.uuid} not found`);
      }
      user.name = dto.name;
      user.surname = dto.surname;
      if (dto.file) {
        user.pictureUrl = (await this.cloudService.upload(dto.file)).secure_url;
      }
      return user.save();
    });
  }

  public updatePassword(uuid: string, password: string): Promise<User> {
    return this.findByUUID(uuid)
      .then((user) => {
        if (!user) {
          return Promise.reject(`User with uuid: ${uuid} not found`);
        }
        return Promise.all([user, UserService.hashPassword(password)]);
      })
      .then((values) => {
        const user: User = values[0];
        user.password = values[1];
        return user.save();
      });
  }

  private static hashPassword(password: string): Promise<string> {
    return bcrypt.genSalt().then((salt) => bcrypt.hash(password, salt));
  }
}

export default UserService;
