export function h2oBindFramesOutput(_, _go, key, result) {
  var lodash = window._;
  var Flow = window.Flow;
  var viewFrame;
  viewFrame = function () {
    return _.insertAndExecuteCell('cs', `getFrameSummary ${Flow.Prelude.stringify(key)}`);
  };
  lodash.defer(_go);
  return {
    viewFrame,
    template: 'flow-bind-frames-output'
  };
};
  