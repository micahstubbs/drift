import { extendColumnSummary } from './extendColumnSummary';

export function requestColumnSummary(_, frameKey, columnName, go) {
  return _.requestColumnSummary(frameKey, columnName, (error, frame) => {
    if (error) {
      return go(error);
    }
    return go(null, extendColumnSummary(_, frameKey, frame, columnName));
  });
}
