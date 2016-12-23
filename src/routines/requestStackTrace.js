import { extendStackTrace } from './extendStackTrace';

export function requestStackTrace(_, go) {
  return _.requestStackTrace((error, stackTrace) => {
    if (error) {
      return go(error);
    }
    return go(null, extendStackTrace(_, stackTrace));
  });
}
