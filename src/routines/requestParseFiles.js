import { extendParseResult } from './extendParseResult';

export function requestParseFiles(
  _,
  sourceKeys,
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
  return _.requestParseFiles(sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, (error, parseResult) => {
    if (error) {
      return go(error);
    }
    return go(null, extendParseResult(_, parseResult));
  });
}
