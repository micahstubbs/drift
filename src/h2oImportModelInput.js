import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oImportModelInput(_, _go, path, opt) {
  var lodash = window._;
  var Flow = window.Flow;
  var importModel;
  var _canImportModel;
  var _overwrite;
  var _path;
  if (opt == null) {
    opt = {};
  }
  _path = Flow.Dataflow.signal(path);
  _overwrite = Flow.Dataflow.signal(opt.overwrite);
  _canImportModel = Flow.Dataflow.lift(_path, function (path) {
    return path && path.length;
  });
  importModel = function () {
    return _.insertAndExecuteCell('cs', `importModel ${flowPrelude.stringify(_path())}, overwrite: ${(_overwrite() ? 'true' : 'false')}`);
  };
  lodash.defer(_go);
  return {
    path: _path,
    overwrite: _overwrite,
    canImportModel: _canImportModel,
    importModel,
    template: 'flow-import-model-input'
  };
};
