import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oMergeFramesOutput(_, _go, _mergeFramesResult) {
  var lodash = window._;
  var Flow = window.Flow;
  var _frameKey;
  var _viewFrame;
  _frameKey = _mergeFramesResult.key;
  _viewFrame = function () {
    return _.insertAndExecuteCell('cs', `getFrameSummary ${flowPrelude.stringify(_frameKey)}`);
  };
  lodash.defer(_go);
  return {
    frameKey: _frameKey,
    viewFrame: _viewFrame,
    template: 'flow-merge-frames-output'
  };
};
  