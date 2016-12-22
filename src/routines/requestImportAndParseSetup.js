import { extendParseSetupResults } from './extendParseSetupResults';

export function requestImportAndParseSetup(_, paths, go) {
  const lodash = window._;
  return _.requestImportFiles(paths, (error, importResults) => {
    if (error) {
      return go(error);
    }
    const sourceKeys = lodash.flatten(lodash.compact(lodash.map(importResults, result => result.destination_frames)));
    return _.requestParseSetup(sourceKeys, (error, parseSetupResults) => {
      if (error) {
        return go(error);
      }
      return go(null, extendParseSetupResults(_, { paths }, parseSetupResults));
    });
  });
}
