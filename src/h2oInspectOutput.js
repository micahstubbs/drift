import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oInspectOutput(_, _go, _frame) {
  var lodash = window._;
  var Flow = window.Flow;
  var plot;
  var view;
  view = function () {
    return _.insertAndExecuteCell('cs', `grid inspect ${flowPrelude.stringify(_frame.label)}, ${_frame.metadata.origin}`);
  };
  plot = function () {
    return _.insertAndExecuteCell('cs', _frame.metadata.plot);
  };
  lodash.defer(_go);
  return {
    label: _frame.label,
    vectors: _frame.vectors,
    view,
    canPlot: _frame.metadata.plot,
    plot,
    template: 'flow-inspect-output'
  };
}
