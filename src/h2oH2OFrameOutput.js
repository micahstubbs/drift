export function h2oH2OFrameOutput(_, _go, _result) {
  var lodash = window._;
  var Flow = window.Flow;
  var createH2oFrameView;
  var _h2oframeView;
  _h2oframeView = Flow.Dataflow.signal(null);
  createH2oFrameView = function (result) {
    return { h2oframe_id: result.h2oframe_id };
  };
  _h2oframeView(createH2oFrameView(_result));
  lodash.defer(_go);
  return {
    h2oframeView: _h2oframeView,
    template: 'flow-h2oframe-output'
  };
};
  