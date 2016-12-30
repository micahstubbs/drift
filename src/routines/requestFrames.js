import { extendFrames } from './extendFrames';

export function requestFrames(_, go) {
  return _.requestFrames((error, frames) => {
    if (error) {
      return go(error);
    }
    return go(null, extendFrames(_, frames));
  });
}
