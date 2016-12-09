import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oPlotInput(_, _go, _frame) {
  let plot;
  let vector;
  let _canPlot;
  let _color;
  let _type;
  let _types;
  let _vectors;
  let _x;
  let _y;
  _types = [
    'point',
    'path',
    'rect'
  ];
  _vectors = (() => {
    let _i;
    let _len;
    let _ref;
    let _results;
    _ref = _frame.vectors;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vector = _ref[_i];
      if (vector.type === 'String' || vector.type === 'Number') {
        _results.push(vector.label);
      }
    }
    return _results;
  })();
  _type = Flow.Dataflow.signal(null);
  _x = Flow.Dataflow.signal(null);
  _y = Flow.Dataflow.signal(null);
  _color = Flow.Dataflow.signal(null);
  _canPlot = Flow.Dataflow.lift(_type, _x, _y, (type, x, y) => type && x && y);
  plot = () => {
    let color;
    let command;
    command = (color = _color()) ? `plot (g) -> g(\n  g.${_type()}(\n    g.position ${flowPrelude.stringify(_x())}, ${flowPrelude.stringify(_y())}\n    g.color ${flowPrelude.stringify(color)}\n  )\n  g.from inspect ${flowPrelude.stringify(_frame.label)}, ${_frame.metadata.origin}\n)` : `plot (g) -> g(\n  g.${_type()}(\n    g.position ${flowPrelude.stringify(_x())}, ${flowPrelude.stringify(_y())}\n  )\n  g.from inspect ${flowPrelude.stringify(_frame.label)}, ${_frame.metadata.origin}\n)`;
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
}

