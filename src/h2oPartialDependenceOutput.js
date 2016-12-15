import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oPartialDependenceOutput(_, _go, _result) {
  const lodash = window._;
  const Flow = window.Flow;
  let data;
  let i;
  let section;
  let table;
  let x;
  let y;
  let _i;
  let _len;
  const _destinationKey = _result.destination_key;
  const _modelId = _result.modelId.name;
  const _frameId = _result.frame_id.name;
  const renderPlot = (target, render) => render((error, vis) => {
    if (error) {
      return console.debug(error);
    }
    return target(vis.element);
  });

  // Hold as many plots as are present in the result.
  const _plots = [];

  const _ref = _result.partial_dependence_data;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    data = _ref[i];
    table = _.inspect(`plot${(i + 1)}`, _result);
    if (table) {
      x = data.columns[0].name;
      y = data.columns[1].name;
      _plots.push(section = {
        title: `${x} vs ${y}`,
        plot: Flow.Dataflow.signal(null),
        frame: Flow.Dataflow.signal(null),
      });
      renderPlot(section.plot, _.plot(g => g(g.path(g.position(x, y), g.strokeColor(g.value('#1f77b4'))), g.point(g.position(x, y), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
      renderPlot(section.frame, _.plot(g => g(g.select(), g.from(table))));
    }
  }
  const _viewFrame = () => _.insertAndExecuteCell('cs', `requestPartialDependenceData ${flowPrelude.stringify(_destinationKey)}`);
  lodash.defer(_go);
  return {
    destinationKey: _destinationKey,
    modelId: _modelId,
    frameId: _frameId,
    plots: _plots,
    viewFrame: _viewFrame,
    template: 'flow-partial-dependence-output',
  };
}

