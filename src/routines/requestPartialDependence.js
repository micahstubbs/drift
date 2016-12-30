import { extendJob } from './extendJob';

export function requestPartialDependence(_, opts, go) {
  return _.requestPartialDependence(opts, (error, result) => {
    if (error) {
      return go(error);
    }
    return _.requestJob(result.key.name, (error, job) => {
      if (error) {
        return go(error);
      }
      return go(null, extendJob(_, job));
    });
  });
}
