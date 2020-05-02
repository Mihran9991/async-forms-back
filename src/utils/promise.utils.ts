import lodash from "lodash";

import FormService from "../services/form.service";

export function serial(
  instance: FormService,
  promises: (() => Promise<any>)[]
): Promise<any> {
  if (!promises || lodash.isEmpty(promises)) {
    return Promise.resolve();
  }
  const curr = promises.shift() as () => Promise<any>;
  return curr.call(instance).then(() => {
    return serial(instance, promises);
  });
}

export default {
  serial,
};
