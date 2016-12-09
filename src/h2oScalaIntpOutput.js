export function h2oScalaIntpOutput(_, _go, _result) {
  const lodash = window._;
  const Flow = window.Flow;
  let createScalaIntpView;
  let _scalaIntpView;
  _scalaIntpView = Flow.Dataflow.signal(null);
  createScalaIntpView = result => ({
    session_id: result.session_id
  });
  _scalaIntpView(createScalaIntpView(_result));
  lodash.defer(_go);
  return {
    scalaIntpView: _scalaIntpView,
    template: 'flow-scala-intp-output'
  };
}

