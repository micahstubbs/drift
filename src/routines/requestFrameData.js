import { extendFrameData } from './extendFrameData';

export function requestFrameData(_, frameKey, searchTerm, offset, count, go) {
  return _.requestFrameSlice(frameKey, searchTerm, offset, count, (error, frame) => {
    if (error) {
      return go(error);
    }
    return go(null, extendFrameData(_, frameKey, frame));
  });
}
