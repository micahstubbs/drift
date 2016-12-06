export function h2oPlotInput(_, _go, _frame) {
  var plot;
  var vector;
  var _canPlot;
  var _color;
  var _type;
  var _types;
  var _vectors;
  var _x;
  var _y;
  _types = [
    'point',
    'path',
    'rect'
  ];
  _vectors = function () {
    var _i;
    var _len;
    var _ref;
    var _results;
    _ref = _frame.vectors;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vector = _ref[_i];
      if (vector.type === Flow.TString || vector.type === Flow.TNumber) {
        _results.push(vector.label);
      }
    }
    return _results;
  }();
  _type = Flow.Dataflow.signal(null);
  _x = Flow.Dataflow.signal(null);
  _y = Flow.Dataflow.signal(null);
  _color = Flow.Dataflow.signal(null);
  _canPlot = Flow.Dataflow.lift(_type, _x, _y, function (type, x, y) {
    return type && x && y;
  });
  plot = function () {
    var color;
    var command;
    command = (color = _color()) ? `plot (g) -> g(\n  g.${_type()}(\n    g.position ${Flow.Prelude.stringify(_x())}, ${Flow.Prelude.stringify(_y())}\n    g.color ${Flow.Prelude.stringify(color)}\n  )\n  g.from inspect ${Flow.Prelude.stringify(_frame.label)}, ${_frame.metadata.origin}\n)` : `plot (g) -> g(\n  g.${_type()}(\n    g.position ${Flow.Prelude.stringify(_x())}, ${Flow.Prelude.stringify(_y())}\n  )\n  g.from inspect ${Flow.Prelude.stringify(_frame.label)}, ${_frame.metadata.origin}\n)`;
    return _.insertAndExecuteCell('cs', command);
  };
  lodash.defer(_go);
  return {
    types: _types,
    type: _type,
    vectors: _vectors,
    x: _x,
    y: _y,
    color: _color,
    plot,
    canPlot: _canPlot,
    template: 'flow-plot-input'
  };
};
  