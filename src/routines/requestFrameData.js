import { extendFrameData } from './extendFrameData';
import { requestFrameSlice } from '../h2oProxy/requestFrameSlice';

export function requestFrameData(_, frameKey, searchTerm, offset, count, go) {
  console.log('_ from requestFrameData', _);
  return requestFrameSlice(_, frameKey, searchTerm, offset, count, (error, frame) => {
    if (error) {
      return go(error);
    }
    return go(null, extendFrameData(_, frameKey, frame));
  });
}
