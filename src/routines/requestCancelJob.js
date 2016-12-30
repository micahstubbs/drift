
import { extendCancelJob } from './extendCancelJob';

export function requestCancelJob(_, key, go) {
  return _.requestCancelJob(key, error => {
    if (error) {
      return go(error);
    }
    return go(null, extendCancelJob(_, {}));
  });
}
