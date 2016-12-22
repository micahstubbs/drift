import { extendFrameSummary } from './extendFrameSummary';

export function requestFrameSummarySlice(_, frameKey, searchTerm, offset, length, go) {
  return _.requestFrameSummarySlice(frameKey, searchTerm, offset, length, (error, frame) => {
    if (error) {
      return go(error);
    }
    return go(null, extendFrameSummary(_, frameKey, frame));
  });
}
