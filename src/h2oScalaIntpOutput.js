export function h2oScalaIntpOutput(_, _go, _result) {
  var lodash = window._;
  var Flow = window.Flow;
  var createScalaIntpView;
  var _scalaIntpView;
  _scalaIntpView = Flow.Dataflow.signal(null);
  createScalaIntpView = function (result) {
    return { session_id: result.session_id };
  };
  _scalaIntpView(createScalaIntpView(_result));
  lodash.defer(_go);
  return {
    scalaIntpView: _scalaIntpView,
    template: 'flow-scala-intp-output'
  };
}

