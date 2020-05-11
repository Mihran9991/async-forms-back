import User from "../entities/user.entity";

export const getFullName = (user: User): string => {
  return `${user.name} ${user.surname}`;
};

export default {
  getFullName,
};
