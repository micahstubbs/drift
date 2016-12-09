import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oPredictsOutput(_, _go, opts, _predictions) {
  var lodash = window._;
  var Flow = window.Flow;
  var arePredictionsComparable;
  var comparePredictions;
  var createPredictionView;
  var initialize;
  var inspectAll;
  var plotMetrics;
  var plotPredictions;
  var plotScores;
  var predict;
  var _canComparePredictions;
  var _checkAllPredictions;
  var _isCheckingAll;
  var _metricsTable;
  var _predictionViews;
  var _predictionsTable;
  var _rocCurve;
  var _scoresTable;
  _predictionViews = Flow.Dataflow.signal([]);
  _checkAllPredictions = Flow.Dataflow.signal(false);
  _canComparePredictions = Flow.Dataflow.signal(false);
  _rocCurve = Flow.Dataflow.signal(null);
  arePredictionsComparable = function (views) {
    if (views.length === 0) {
      return false;
    }
    return lodash.every(views, function (view) {
      return view.modelCategory === 'Binomial';
    });
  };
  _isCheckingAll = false;
  Flow.Dataflow.react(_checkAllPredictions, function (checkAll) {
    var view;
    var _i;
    var _len;
    var _ref;
    _isCheckingAll = true;
    _ref = _predictionViews();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      view.isChecked(checkAll);
    }
    _canComparePredictions(checkAll && arePredictionsComparable(_predictionViews()));
    _isCheckingAll = false;
  });
  createPredictionView = function (prediction) {
    var inspect;
    var view;
    var _frameKey;
    var _hasFrame;
    var _isChecked;
    var _modelKey;
    var _ref;
    _modelKey = prediction.model.name;
    _frameKey = (_ref = prediction.frame) != null ? _ref.name : void 0;
    _hasFrame = _frameKey;
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
        var _ref1;
        var _results;
        _ref1 = _predictionViews();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          view = _ref1[_i];
          if (view.isChecked()) {
            _results.push(view);
          }
        }
        return _results;
      }();
      return _canComparePredictions(arePredictionsComparable(checkedViews));
    });
    view = function () {
      if (_hasFrame) {
        return _.insertAndExecuteCell('cs', `getPrediction model: ${flowPrelude.stringify(_modelKey)}, frame: ${flowPrelude.stringify(_frameKey)}`);
      }
    };
    inspect = function () {
      if (_hasFrame) {
        return _.insertAndExecuteCell('cs', `inspect getPrediction model: ${flowPrelude.stringify(_modelKey)}, frame: ${flowPrelude.stringify(_frameKey)}`);
      }
    };
    return {
      modelKey: _modelKey,
      frameKey: _frameKey,
      modelCategory: prediction.model_category,
      isChecked: _isChecked,
      hasFrame: _hasFrame,
      view,
      inspect
    };
  };
  _predictionsTable = _.inspect('predictions', _predictions);
  _metricsTable = _.inspect('metrics', _predictions);
  _scoresTable = _.inspect('scores', _predictions);
  comparePredictions = function () {
    var selectedKeys;
    var view;
    selectedKeys = function () {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _predictionViews();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        if (view.isChecked()) {
          _results.push({
            model: view.modelKey,
            frame: view.frameKey
          });
        }
      }
      return _results;
    }();
    return _.insertAndExecuteCell('cs', `getPredictions ${flowPrelude.stringify(selectedKeys)}`);
  };
  plotPredictions = function () {
    return _.insertAndExecuteCell('cs', _predictionsTable.metadata.plot);
  };
  plotScores = function () {
    return _.insertAndExecuteCell('cs', _scoresTable.metadata.plot);
  };
  plotMetrics = function () {
    return _.insertAndExecuteCell('cs', _metricsTable.metadata.plot);
  };
  inspectAll = function () {
    return _.insertAndExecuteCell('cs', `inspect ${_predictionsTable.metadata.origin}`);
  };
  predict = function () {
    return _.insertAndExecuteCell('cs', 'predict');
  };
  initialize = function (predictions) {
    _predictionViews(lodash.map(predictions, createPredictionView));
    return lodash.defer(_go);
  };
  initialize(_predictions);
  return {
    predictionViews: _predictionViews,
    hasPredictions: _predictions.length > 0,
    comparePredictions,
    canComparePredictions: _canComparePredictions,
    checkAllPredictions: _checkAllPredictions,
    plotPredictions,
    plotScores,
    plotMetrics,
    inspect: inspectAll,
    predict,
    rocCurve: _rocCurve,
    template: 'flow-predicts-output'
  };
};
  