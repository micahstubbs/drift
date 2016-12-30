import { extendGrids } from './extendGrids';

export function requestGrids(_, go) {
  return _.requestGrids((error, grids) => {
    if (error) {
      return go(error);
    }
    return go(null, extendGrids(_, grids));
  });
}
