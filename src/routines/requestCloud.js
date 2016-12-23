import { extendCloud } from './extendCloud';

export function requestCloud(_, go) {
  return _.requestCloud((error, cloud) => {
    if (error) {
      return go(error);
    }
    return go(null, extendCloud(_, cloud));
  });
}
