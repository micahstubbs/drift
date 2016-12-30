import { extendFrame } from './extendFrame';

export function requestFrame(_, frameKey, go) {
  return _.requestFrameSlice(frameKey, void 0, 0, 20, (error, frame) => {
    if (error) {
      return go(error);
    }
    return go(null, extendFrame(_, frameKey, frame));
  });
}
