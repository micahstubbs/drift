import { extendParseResult } from './extendParseResult';

export function requestImportAndParseFiles(
  _,
  paths,
  destinationKey,
  parseType,
  separator,
  columnCount,
  useSingleQuotes,
  columnNames,
  columnTypes,
  deleteOnDone,
  checkHeader,
  chunkSize,
  go
) {
  return _.requestImportFiles(paths, (error, importResults) => {
    const lodash = window._;
    if (error) {
      return go(error);
    }
    const sourceKeys = lodash.flatten(lodash.compact(lodash.map(importResults, result => result.destination_frames)));
    return _.requestParseFiles(sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, (error, parseResult) => {
      if (error) {
        return go(error);
      }
      return go(null, extendParseResult(_, parseResult));
    });
  });
}
