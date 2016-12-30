import { extendParseSetupResults } from './extendParseSetupResults';

export function requestParseSetup(_, sourceKeys, go) {
  return requestParseSetup(sourceKeys, (error, parseSetupResults) => {
    if (error) {
      return go(error);
    }
    return go(null, extendParseSetupResults(_, { source_frames: sourceKeys }, parseSetupResults));
  });
}
