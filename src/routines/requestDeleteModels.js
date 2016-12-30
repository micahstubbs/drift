import { _fork } from './_fork';
import { extendDeletedKeys } from './extendDeletedKeys';

export function requestDeleteModels(_, modelKeys, go) {
  const lodash = window._;
  const Flow = window.Flow;
  const futures = lodash.map(modelKeys, modelKey => _fork(_.requestDeleteModel, _, modelKey));
  return Flow.Async.join(futures, (error, results) => {
    if (error) {
      return go(error);
    }
    return go(null, extendDeletedKeys(_, modelKeys));
  });
}
