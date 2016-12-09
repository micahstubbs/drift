import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oGridOutput(_, _go, _grid) {
  const lodash = window._;
  const Flow = window.Flow;
  let buildModel;
  let collectSelectedKeys;
  let compareModels;
  let createModelView;
  let deleteModels;
  let initialize;
  let inspect;
  let inspectAll;
  let inspectHistory;
  let predictUsingModels;
  let _canCompareModels;
  let _checkAllModels;
  let _checkedModelCount;
  let _errorViews;
  let _hasErrors;
  let _hasModels;
  let _hasSelectedModels;
  let _isCheckingAll;
  let _modelViews;
  _modelViews = Flow.Dataflow.signal([]);
  _hasModels = _grid.model_ids.length > 0;
  _errorViews = Flow.Dataflow.signal([]);
  _hasErrors = _grid.failure_details.length > 0;
  _checkAllModels = Flow.Dataflow.signal(false);
  _checkedModelCount = Flow.Dataflow.signal(0);
  _canCompareModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 1);
  _hasSelectedModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 0);
  _isCheckingAll = false;
  Flow.Dataflow.react(_checkAllModels, checkAll => {
    let view;
    let views;
    let _i;
    let _len;
    _isCheckingAll = true;
    views = _modelViews();
    for (_i = 0, _len = views.length; _i < _len; _i++) {
      view = views[_i];
      view.isChecked(checkAll);
    }
    _checkedModelCount(checkAll ? views.length : 0);
    _isCheckingAll = false;
  });
  createModelView = model_id => {
    let cloneModel;
    let inspect;
    let predict;
    let view;
    let _isChecked;
    _isChecked = Flow.Dataflow.signal(false);
    Flow.Dataflow.react(_isChecked, () => {
      let checkedViews;
      let view;
      if (_isCheckingAll) {
        return;
      }
      checkedViews = (() => {
        let _i;
        let _len;
        let _ref;
        let _results;
        _ref = _modelViews();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if (view.isChecked()) {
            _results.push(view);
          }
        }
        return _results;
      })();
      return _checkedModelCount(checkedViews.length);
    });
    predict = () => _.insertAndExecuteCell('cs', `predict model: ${flowPrelude.stringify(model_id.name)}`);
    cloneModel = () => // return _.insertAndExecuteCell('cs', `cloneModel ${flowPrelude.stringify(model_id.name)}`);
    alert('Not implemented');
    view = () => _.insertAndExecuteCell('cs', `getModel ${flowPrelude.stringify(model_id.name)}`);
    inspect = () => _.insertAndExecuteCell('cs', `inspect getModel ${flowPrelude.stringify(model_id.name)}`);
    return {
      key: model_id.name,
      isChecked: _isChecked,
      predict,
      clone: cloneModel,
      inspect,
      view
    };
  };
  buildModel = () => _.insertAndExecuteCell('cs', 'buildModel');
  collectSelectedKeys = () => {
    let view;
    let _i;
    let _len;
    let _ref;
    let _results;
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
  compareModels = () => _.insertAndExecuteCell('cs', `'inspect getModels ${flowPrelude.stringify(collectSelectedKeys())}`);
  predictUsingModels = () => _.insertAndExecuteCell('cs', `predict models: ${flowPrelude.stringify(collectSelectedKeys())}`);
  deleteModels = () => _.confirm('Are you sure you want to delete these models?', {
    acceptCaption: 'Delete Models',
    declineCaption: 'Cancel'
  }, accept => {
    if (accept) {
      return _.insertAndExecuteCell('cs', `deleteModels ${flowPrelude.stringify(collectSelectedKeys())}`);
    }
  });
  inspect = () => {
    let summary;
    summary = _.inspect('summary', _grid);
    return _.insertAndExecuteCell('cs', `grid inspect \'summary\', ${summary.metadata.origin}`);
  };
  inspectHistory = () => {
    let history;
    history = _.inspect('scoring_history', _grid);
    return _.insertAndExecuteCell('cs', `grid inspect \'scoring_history\', ${history.metadata.origin}`);
  };
  inspectAll = () => {
    let allKeys;
    let view;
    allKeys = (() => {
      let _i;
      let _len;
      let _ref;
      let _results;
      _ref = _modelViews();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        _results.push(view.key);
      }
      return _results;
    })();
    return _.insertAndExecuteCell('cs', `inspect getModels ${flowPrelude.stringify(allKeys)}`);
  };
  initialize = grid => {
    let errorViews;
    let i;
    _modelViews(lodash.map(grid.model_ids, createModelView));
    errorViews = (() => {
      let _i;
      let _ref;
      let _results;
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
    })();
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
}

