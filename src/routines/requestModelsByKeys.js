import { _fork } from './_fork';
import { extendModels } from './extendModels';

export function requestModelsByKeys(_, modelKeys, go) {
  const lodash = window._;
  const Flow = window.Flow;
  const futures = lodash.map(modelKeys, key => _fork(_.requestModel, key));
  return Flow.Async.join(futures, (error, models) => {
    if (error) {
      return go(error);
    }
    return go(null, extendModels(_, models));
  });
}
