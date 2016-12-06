export function h2oImportModelOutput(_, _go, result) {
  var lodash = window._;
  var Flow = window.Flow;
  var viewModel;
  viewModel = function () {
    return _.insertAndExecuteCell('cs', `getModel ${Flow.Prelude.stringify(result.models[0].model_id.name)}`);
  };
  lodash.defer(_go);
  return {
    viewModel,
    template: 'flow-import-model-output'
  };
};
  