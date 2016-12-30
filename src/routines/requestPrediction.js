import { unwrapPrediction } from './unwrapPrediction';

export function requestPrediction(_, modelKey, frameKey, go) {
  return _.requestPrediction(_, modelKey, frameKey, unwrapPrediction(_, go));
}
