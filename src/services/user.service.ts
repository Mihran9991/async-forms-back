import bcrypt from "bcrypt";

import UserRepository from "../repositories/user.repository";
import RegistrationDto from "../dtos/registration.dto";
import User from "../entities/user.entity";
import { Nullable } from "../types/main.types";
import { generateUUID } from "../utils/uuid.utils";

export class UserService {
  private userRepository: UserRepository;

  public constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
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

  public update(
    uuid: string,
    name: string,
    surname: string,
    pictureUrl: Nullable<string> = null
  ) {
    return this.findByUUID(uuid).then((user: Nullable<User>) => {
      if (!user) {
        return Promise.reject(`User with uuid: ${uuid} not found`);
      }
      user.name = name;
      user.surname = surname;
      if (pictureUrl) {
        user.pictureUrl = pictureUrl;
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
