import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oExportModelInput(_, _go, modelKey, path, opt) {
  var lodash = window._;
  var Flow = window.Flow;
  var exportModel;
  var _canExportModel;
  var _models;
  var _overwrite;
  var _path;
  var _selectedModelKey;
  if (opt == null) {
    opt = {};
  }
  _models = Flow.Dataflow.signal([]);
  _selectedModelKey = Flow.Dataflow.signal(null);
  _path = Flow.Dataflow.signal(null);
  _overwrite = Flow.Dataflow.signal(opt.overwrite);
  _canExportModel = Flow.Dataflow.lift(_selectedModelKey, _path, (modelKey, path) => modelKey && path);
  exportModel = () => _.insertAndExecuteCell('cs', `exportModel ${flowPrelude.stringify(_selectedModelKey())}, ${flowPrelude.stringify(_path())}, overwrite: ${(_overwrite() ? 'true' : 'false')}`);
  _.requestModels((error, models) => {
    var model;
    if (error) {
      // empty
    } else {
      _models((() => {
        var _i;
        var _len;
        var _results;
        _results = [];
        for (_i = 0, _len = models.length; _i < _len; _i++) {
          model = models[_i];
          _results.push(model.model_id.name);
        }
        return _results;
      })());
      return _selectedModelKey(modelKey);
    }
  });
  lodash.defer(_go);
  return {
    models: _models,
    selectedModelKey: _selectedModelKey,
    path: _path,
    overwrite: _overwrite,
    canExportModel: _canExportModel,
    exportModel,
    template: 'flow-export-model-input'
  };
}

