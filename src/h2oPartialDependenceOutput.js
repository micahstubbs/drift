import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oPartialDependenceOutput(_, _go, _result) {
  let data;
  let i;
  let renderPlot;
  let section;
  let table;
  let x;
  let y;
  let _destinationKey;
  let _frameId;
  let _i;
  let _len;
  let _modelId;
  let _plots;
  let _ref;
  let _viewFrame;
  _destinationKey = _result.destination_key;
  _modelId = _result.model_id.name;
  _frameId = _result.frame_id.name;
  renderPlot = (target, render) => render((error, vis) => {
    if (error) {
      return console.debug(error);
    }
    return target(vis.element);
  });
  _plots = [];
  _ref = _result.partial_dependence_data;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    data = _ref[i];
    if (table = _.inspect(`plot${(i + 1)}`, _result)) {
      x = data.columns[0].name;
      y = data.columns[1].name;
      _plots.push(section = {
        title: `${x} vs ${y}`,
        plot: Flow.Dataflow.signal(null),
        frame: Flow.Dataflow.signal(null)
      });
      renderPlot(section.plot, _.plot(g => g(g.path(g.position(x, y), g.strokeColor(g.value('#1f77b4'))), g.point(g.position(x, y), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
      renderPlot(section.frame, _.plot(g => g(g.select(), g.from(table))));
    }
  }
  _viewFrame = () => _.insertAndExecuteCell('cs', `requestPartialDependenceData ${flowPrelude.stringify(_destinationKey)}`);
  lodash.defer(_go);
  return {
    destinationKey: _destinationKey,
    modelId: _modelId,
    frameId: _frameId,
    plots: _plots,
    viewFrame: _viewFrame,
    template: 'flow-partial-dependence-output'
  };
}

