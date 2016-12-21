import { _fork } from './_fork';
import { requestImportModel } from './requestImportModel';

export function importModel(_, path, opts) {
  if (path && path.length) {
    return _fork(requestImportModel, _, path, opts);
  }
  return assist(_, importModel, path, opts);
}
