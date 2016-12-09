import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oModelsOutput(_, _go, _models) {
  var lodash = window._;
  var Flow = window.Flow;
  var buildModel;
  var collectSelectedKeys;
  var compareModels;
  var createModelView;
  var deleteModels;
  var initialize;
  var inspectAll;
  var predictUsingModels;
  var _canCompareModels;
  var _checkAllModels;
  var _checkedModelCount;
  var _hasSelectedModels;
  var _isCheckingAll;
  var _modelViews;
  _modelViews = Flow.Dataflow.signal([]);
  _checkAllModels = Flow.Dataflow.signal(false);
  _checkedModelCount = Flow.Dataflow.signal(0);
  _canCompareModels = Flow.Dataflow.lift(_checkedModelCount, function (count) {
    return count > 1;
  });
  _hasSelectedModels = Flow.Dataflow.lift(_checkedModelCount, function (count) {
    return count > 0;
  });
  _isCheckingAll = false;
  Flow.Dataflow.react(_checkAllModels, function (checkAll) {
    var view;
    var views;
    var _i;
    var _len;
    _isCheckingAll = true;
    views = _modelViews();
    for (_i = 0, _len = views.length; _i < _len; _i++) {
      view = views[_i];
      view.isChecked(checkAll);
    }
    _checkedModelCount(checkAll ? views.length : 0);
    _isCheckingAll = false;
  });
  createModelView = function (model) {
    var cloneModel;
    var inspect;
    var predict;
    var view;
    var _isChecked;
    _isChecked = Flow.Dataflow.signal(false);
    Flow.Dataflow.react(_isChecked, function () {
      var checkedViews;
      var view;
      if (_isCheckingAll) {
        return;
      }
      checkedViews = function () {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = _modelViews();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if (view.isChecked()) {
            _results.push(view);
          }
        }
        return _results;
      }();
      return _checkedModelCount(checkedViews.length);
    });
    predict = function () {
      return _.insertAndExecuteCell('cs', `predict model: ${flowPrelude.stringify(model.model_id.name)}`);
    };
    cloneModel = function () {
      return alert('Not implemented');
      // return _.insertAndExecuteCell('cs', `cloneModel ${flowPrelude.stringify(model.model_id.name)}`);
    };
    view = function () {
      return _.insertAndExecuteCell('cs', `getModel ${flowPrelude.stringify(model.model_id.name)}`);
    };
    inspect = function () {
      return _.insertAndExecuteCell('cs', `inspect getModel ${flowPrelude.stringify(model.model_id.name)}`);
    };
    return {
      key: model.model_id.name,
      algo: model.algo_full_name,
      isChecked: _isChecked,
      predict,
      clone: cloneModel,
      inspect,
      view
    };
  };
  buildModel = function () {
    return _.insertAndExecuteCell('cs', 'buildModel');
  };
  collectSelectedKeys = function () {
    var view;
    var _i;
    var _len;
    var _ref;
    var _results;
    _ref = _modelViews();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      if (view.isChecked()) {
        _results.push(view.key);
      }
    }
    return _results;
  };
  compareModels = function () {
    return _.insertAndExecuteCell('cs', `inspect getModels ${flowPrelude.stringify(collectSelectedKeys())}`);
  };
  predictUsingModels = function () {
    return _.insertAndExecuteCell('cs', `predict models: ${flowPrelude.stringify(collectSelectedKeys())}`);
  };
  deleteModels = function () {
    return _.confirm('Are you sure you want to delete these models?', {
      acceptCaption: 'Delete Models',
      declineCaption: 'Cancel'
    }, function (accept) {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteModels ${flowPrelude.stringify(collectSelectedKeys())}`);
      }
    });
  };
  inspectAll = function () {
    var allKeys;
    var view;
    allKeys = function () {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _modelViews();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        _results.push(view.key);
      }
      return _results;
    }();
    return _.insertAndExecuteCell('cs', `inspect getModels ${flowPrelude.stringify(allKeys)}`);
  };
  initialize = function (models) {
    _modelViews(lodash.map(models, createModelView));
    return lodash.defer(_go);
  };
  initialize(_models);
  return {
    modelViews: _modelViews,
    hasModels: _models.length > 0,
    buildModel,
    compareModels,
    predictUsingModels,
    deleteModels,
    checkedModelCount: _checkedModelCount,
    canCompareModels: _canCompareModels,
    hasSelectedModels: _hasSelectedModels,
    checkAllModels: _checkAllModels,
    inspect: inspectAll,
    template: 'flow-models-output'
  };
};
  