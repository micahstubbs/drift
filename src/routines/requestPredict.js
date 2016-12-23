import { unwrapPrediction } from './unwrapPrediction';

export function requestPredict(_, destinationKey, modelKey, frameKey, options, go) {
  return _.requestPredict(destinationKey, modelKey, frameKey, options, unwrapPrediction(_, go));
}
