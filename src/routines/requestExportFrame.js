import { extendJob } from './extendJob';
import { postExportFrameRequest } from '../h2oProxy/postExportFrameRequest';

export function requestExportFrame(_, frameKey, path, opts, go) {
  return postExportFrameRequest(_, frameKey, path, opts.overwrite, (error, result) => {
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
