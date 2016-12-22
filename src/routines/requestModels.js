import { extendModels } from './extendModels';

export function requestModels(_, go) {
  return _.requestModels((error, models) => {
    if (error) {
      return go(error);
    }
    return go(null, extendModels(_, models));
  });
}
