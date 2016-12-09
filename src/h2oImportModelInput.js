import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oImportModelInput(_, _go, path, opt) {
  const lodash = window._;
  const Flow = window.Flow;
  let importModel;
  let _canImportModel;
  let _overwrite;
  let _path;
  if (opt == null) {
    opt = {};
  }
  _path = Flow.Dataflow.signal(path);
  _overwrite = Flow.Dataflow.signal(opt.overwrite);
  _canImportModel = Flow.Dataflow.lift(_path, path => path && path.length);
  importModel = () => _.insertAndExecuteCell('cs', `importModel ${flowPrelude.stringify(_path())}, overwrite: ${(_overwrite() ? 'true' : 'false')}`);
  lodash.defer(_go);
  return {
    path: _path,
    overwrite: _overwrite,
    canImportModel: _canImportModel,
    importModel,
    template: 'flow-import-model-input'
  };
}
