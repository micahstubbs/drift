import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oPredictOutput(_, _go, prediction) {
  var lodash = window._;
  var Flow = window.Flow;
  var frame;
  var inspect;
  var model;
  var renderPlot;
  var table;
  var tableName;
  var _canInspect;
  var _i;
  var _len;
  var _plots;
  var _ref;
  var _ref1;
  if (prediction) {
    frame = prediction.frame, model = prediction.model;
  }
  _plots = Flow.Dataflow.signals([]);
  _canInspect = prediction.__meta;
  renderPlot = function (title, prediction, render) {
    var combineWithFrame;
    var container;
    container = Flow.Dataflow.signal(null);
    combineWithFrame = function () {
      var predictionsFrameName;
      var targetFrameName;
      predictionsFrameName = prediction.predictions.frame_id.name;
      targetFrameName = `combined-${predictionsFrameName}`;
      return _.insertAndExecuteCell('cs', `bindFrames ${flowPrelude.stringify(targetFrameName)}, [ ${flowPrelude.stringify(predictionsFrameName)}, ${flowPrelude.stringify(frame.name)} ]`);
    };
    render(function (error, vis) {
      if (error) {
        return console.debug(error);
      }
      $('a', vis.element).on('click', function (e) {
        var $a;
        $a = $(e.target);
        switch ($a.attr('data-type')) {
          case 'frame':
            return _.insertAndExecuteCell('cs', `getFrameSummary ${flowPrelude.stringify($a.attr('data-key'))}`);
          case 'model':
            return _.insertAndExecuteCell('cs', `getModel ${flowPrelude.stringify($a.attr('data-key'))}`);
        }
      });
      return container(vis.element);
    });
    return _plots.push({
      title,
      plot: container,
      combineWithFrame,
      canCombineWithFrame: title === 'Prediction'
    });
  };
  if (prediction) {
    switch ((_ref = prediction.__meta) != null ? _ref.schema_type : void 0) {
      case 'ModelMetricsBinomial':
        if (table = _.inspect('Prediction - Metrics for Thresholds', prediction)) {
          renderPlot('ROC Curve', prediction, _.plot(function (g) {
            return g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1));
          }));
        }
    }
    _ref1 = _.ls(prediction);
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      tableName = _ref1[_i];
      if (table = _.inspect(tableName, prediction)) {
        if (table.indices.length > 1) {
          renderPlot(tableName, prediction, _.plot(function (g) {
            return g(g.select(), g.from(table));
          }));
        } else {
          renderPlot(tableName, prediction, _.plot(function (g) {
            return g(g.select(0), g.from(table));
          }));
        }
      }
    }
  }
  inspect = function () {
    return _.insertAndExecuteCell('cs', `inspect getPrediction model: ${flowPrelude.stringify(model.name)}, frame: ${flowPrelude.stringify(frame.name)}`);
  };
  lodash.defer(_go);
  return {
    plots: _plots,
    inspect,
    canInspect: _canInspect,
    template: 'flow-predict-output'
  };
}

