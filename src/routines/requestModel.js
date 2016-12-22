import { extendModel } from './extendModel';

export function requestModel(_, modelKey, go) {
  return _.requestModel(modelKey, (error, model) => {
    if (error) {
      return go(error);
    }
    return go(null, extendModel(_, model));
  });
}
