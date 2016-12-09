export function h2oCancelJobOutput(_, _go, _cancellation) {
  var lodash = window._;
  lodash.defer(_go);
  return { template: 'flow-cancel-job-output' };
}
