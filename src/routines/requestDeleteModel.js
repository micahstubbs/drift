import { extendDeletedKeys } from './extendDeletedKeys';

export function requestDeleteModel(_, modelKey, go) {
  return _.requestDeleteModel(modelKey, (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, extendDeletedKeys(_, [modelKey]));
  });
}
