import { extendJob } from './extendJob';

export function requestExportFrame(_, frameKey, path, opts, go) {
  return _.requestExportFrame(frameKey, path, opts.overwrite, (error, result) => {
    if (error) {
      return go(error);
    }
    return _.requestJob(result.job.key.name, (error, job) => {
      if (error) {
        return go(error);
      }
      return go(null, extendJob(_, job));
    });
  });
}
