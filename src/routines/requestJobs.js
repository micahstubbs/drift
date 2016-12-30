import { extendJobs } from './extendJobs';

export function requestJobs(_, go) {
  return _.requestJobs((error, jobs) => {
    if (error) {
      return go(error);
    }
    return go(null, extendJobs(_, jobs));
  });
}
