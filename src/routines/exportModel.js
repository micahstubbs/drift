import { _fork } from './_fork';
import { assist } from './assist';
import { requestExportModel } from './requestExportModel';

export function exportModel(_, modelKey, path, opts) {
  console.log('exportModel was called');
  if (modelKey && path) {
    return _fork(requestExportModel, _, modelKey, path, opts);
  }
  return assist(_, exportModel, modelKey, path, opts);
}
