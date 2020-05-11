import lodash from "lodash";

export function serial(
  instance: any,
  promises: (() => Promise<any>)[]
): Promise<any> {
  if (!promises || lodash.isEmpty(promises)) {
    return Promise.resolve();
  }
  const curr = promises.shift()!;
  return curr.call(instance).then(() => {
    return serial(instance, promises);
  });
}

export function serialWithReturns(
  instance: any,
  result: any,
  promises: ((args: any) => Promise<any>)[]
): Promise<any> {
  if (!promises || lodash.isEmpty(promises)) {
    return result;
  }
  const curr = promises.shift()!;
  return curr.call(instance, result).then((result: any) => {
    return serialWithReturns(instance, result, promises);
  });
}

export default {
  serial,
  serialWithReturns,
};
