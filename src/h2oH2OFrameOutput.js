export function h2oH2OFrameOutput(_, _go, _result) {
  const lodash = window._;
  const Flow = window.Flow;
  let createH2oFrameView;
  let _h2oframeView;
  _h2oframeView = Flow.Dataflow.signal(null);
  createH2oFrameView = result => ({
    h2oframe_id: result.h2oframe_id
  });
  _h2oframeView(createH2oFrameView(_result));
  lodash.defer(_go);
  return {
    h2oframeView: _h2oframeView,
    template: 'flow-h2oframe-output'
  };
}

