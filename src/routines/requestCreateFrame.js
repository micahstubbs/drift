import { extendJob } from './extendJob';
import { postCreateFrameRequest } from '../h2oProxy/postCreateFrameRequest';

export function requestCreateFrame(_, opts, go) {
  return postCreateFrameRequest(_, opts, (error, result) => {
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
