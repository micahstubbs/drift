import { importModel } from './importModel';
import { extendImportModel } from './extendImportModel';

export function requestImportModel(_, path, opts, go) {
  return _.requestImportModel(path, opts.overwrite, (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, extendImportModel(_, result));
  });
}
