import { extendExportModel } from './extendExportModel';

export function requestExportModel(_, modelKey, path, opts, go) {
  return _.requestExportModel(modelKey, path, opts.overwrite, (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, extendExportModel(_, result));
  });
}
