import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oGridsOutput(_, _go, _grids) {
  var lodash = window._;
  var Flow = window.Flow;
  var buildModel;
  var createGridView;
  var initialize;
  var _gridViews;
  _gridViews = Flow.Dataflow.signal([]);
  createGridView = function (grid) {
    var view;
    view = function () {
      return _.insertAndExecuteCell('cs', `getGrid ${flowPrelude.stringify(grid.grid_id.name)}`);
    };
    return {
      key: grid.grid_id.name,
      size: grid.model_ids.length,
      view
    };
  };
  buildModel = function () {
    return _.insertAndExecuteCell('cs', 'buildModel');
  };
  initialize = function (grids) {
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
};
  