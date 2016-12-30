import { extendBindFrames } from './extendBindFrames';

export function requestBindFrames(_, key, sourceKeys, go) {
  return _.requestExec(`(assign ${key} (cbind ${sourceKeys.join(' ')}))`, (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, extendBindFrames(_, key, result));
  });
}
