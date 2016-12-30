import { extendJob } from './extendJob';

export function requestJob(_, key, go) {
  return _.requestJob(key, (error, job) => {
    if (error) {
      return go(error);
    }
    return go(null, extendJob(_, job));
  });
}
