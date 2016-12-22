import { extendDeletedKeys } from './extendDeletedKeys';

export function requestDeleteFrame(_, frameKey, go) {
  return _.requestDeleteFrame(frameKey, (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, extendDeletedKeys(_, [frameKey]));
  });
}
