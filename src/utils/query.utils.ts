export const whereId = (id: number) => {
  return {
    where: {
      id: id,
    },
  };
};

export const whereInstanceId = (instanceId: number) => {
  return {
    where: {
      instanceId: instanceId,
    },
  };
};

export const whereName = (name: string) => {
  return {
    where: {
      name: name,
    },
  };
};

export const whereSysName = (sysName: string) => {
  return {
    where: {
      sysName: sysName,
    },
  };
};

export const insertNameAndOwnerId = (name: string, ownerId: string) => {
  return {
    name: name,
    ownerId: ownerId,
  };
};

export default {
  whereId,
  whereInstanceId,
  whereName,
  whereSysName,
  insertNameAndOwnerId,
};
