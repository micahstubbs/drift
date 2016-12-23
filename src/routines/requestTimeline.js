import { extendTimeline } from './extendTimeline';

export function requestTimeline(_, go) {
  return _.requestTimeline((error, timeline) => {
    if (error) {
      return go(error);
    }
    return go(null, extendTimeline(_, timeline));
  });
}
