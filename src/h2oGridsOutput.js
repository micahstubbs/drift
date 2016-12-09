import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oGridsOutput(_, _go, _grids) {
  const lodash = window._;
  const Flow = window.Flow;
  let buildModel;
  let createGridView;
  let initialize;
  let _gridViews;
  _gridViews = Flow.Dataflow.signal([]);
  createGridView = grid => {
    let view;
    view = () => _.insertAndExecuteCell('cs', `getGrid ${flowPrelude.stringify(grid.grid_id.name)}`);
    return {
      key: grid.grid_id.name,
      size: grid.model_ids.length,
      view
    };
  };
  buildModel = () => _.insertAndExecuteCell('cs', 'buildModel');
  initialize = grids => {
    _gridViews(lodash.map(grids, createGridView));
    return lodash.defer(_go);
  };
  initialize(_grids);
  return {
    gridViews: _gridViews,
    hasGrids: _grids.length > 0,
    buildModel,
    template: 'flow-grids-output'
  };
}

