import { extendPartialDependence } from './extendPartialDependence';

export function requestPartialDependenceData(_, key, go) {
  return _.requestPartialDependenceData(key, (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, extendPartialDependence(_, result));
  });
}
