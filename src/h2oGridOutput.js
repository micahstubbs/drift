export function h2oGridOutput(_, _go, _grid) {
  var lodash = window._;
  var Flow = window.Flow;
  var buildModel;
  var collectSelectedKeys;
  var compareModels;
  var createModelView;
  var deleteModels;
  var initialize;
  var inspect;
  var inspectAll;
  var inspectHistory;
  var predictUsingModels;
  var _canCompareModels;
  var _checkAllModels;
  var _checkedModelCount;
  var _errorViews;
  var _hasErrors;
  var _hasModels;
  var _hasSelectedModels;
  var _isCheckingAll;
  var _modelViews;
  _modelViews = Flow.Dataflow.signal([]);
  _hasModels = _grid.model_ids.length > 0;
  _errorViews = Flow.Dataflow.signal([]);
  _hasErrors = _grid.failure_details.length > 0;
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
  createModelView = function (model_id) {
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
      return _.insertAndExecuteCell('cs', `predict model: ${Flow.Prelude.stringify(model_id.name)}`);
    };
    cloneModel = function () {
      return alert('Not implemented');
      // return _.insertAndExecuteCell('cs', `cloneModel ${Flow.Prelude.stringify(model_id.name)}`);
    };
    view = function () {
      return _.insertAndExecuteCell('cs', `getModel ${Flow.Prelude.stringify(model_id.name)}`);
    };
    inspect = function () {
      return _.insertAndExecuteCell('cs', `inspect getModel ${Flow.Prelude.stringify(model_id.name)}`);
    };
    return {
      key: model_id.name,
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
    return _.insertAndExecuteCell('cs', `'inspect getModels ${Flow.Prelude.stringify(collectSelectedKeys())}`);
  };
  predictUsingModels = function () {
    return _.insertAndExecuteCell('cs', `predict models: ${Flow.Prelude.stringify(collectSelectedKeys())}`);
  };
  deleteModels = function () {
    return _.confirm('Are you sure you want to delete these models?', {
      acceptCaption: 'Delete Models',
      declineCaption: 'Cancel'
    }, function (accept) {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteModels ${Flow.Prelude.stringify(collectSelectedKeys())}`);
      }
    });
  };
  inspect = function () {
    var summary;
    summary = _.inspect('summary', _grid);
    return _.insertAndExecuteCell('cs', `grid inspect \'summary\', ${summary.metadata.origin}`);
  };
  inspectHistory = function () {
    var history;
    history = _.inspect('scoring_history', _grid);
    return _.insertAndExecuteCell('cs', `grid inspect \'scoring_history\', ${history.metadata.origin}`);
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
    return _.insertAndExecuteCell('cs', `inspect getModels ${Flow.Prelude.stringify(allKeys)}`);
  };
  initialize = function (grid) {
    var errorViews;
    var i;
    _modelViews(lodash.map(grid.model_ids, createModelView));
    errorViews = function () {
      var _i;
      var _ref;
      var _results;
      _results = [];
      for (i = _i = 0, _ref = grid.failure_details.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
        _results.push({
          title: `Error ${(i + 1)}`,
          detail: grid.failure_details[i],
          params: `Parameters: [ ${grid.failed_raw_params[i].join(', ')} ]`,
          stacktrace: grid.failure_stack_traces[i]
        });
      }
      return _results;
    }();
    _errorViews(errorViews);
    return lodash.defer(_go);
  };
  initialize(_grid);
  return {
    modelViews: _modelViews,
    hasModels: _hasModels,
    errorViews: _errorViews,
    hasErrors: _hasErrors,
    buildModel,
    compareModels,
    predictUsingModels,
    deleteModels,
    checkedModelCount: _checkedModelCount,
    canCompareModels: _canCompareModels,
    hasSelectedModels: _hasSelectedModels,
    checkAllModels: _checkAllModels,
    inspect,
    inspectHistory,
    inspectAll,
    template: 'flow-grid-output'
  };
};
  