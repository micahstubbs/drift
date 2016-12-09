import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oImportModelOutput(_, _go, result) {
  var lodash = window._;
  var Flow = window.Flow;
  var viewModel;
  viewModel = function () {
    return _.insertAndExecuteCell('cs', `getModel ${flowPrelude.stringify(result.models[0].model_id.name)}`);
  };
  lodash.defer(_go);
  return {
    viewModel,
    template: 'flow-import-model-output'
  };
};
  