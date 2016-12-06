export function h2oScalaCodeOutput(_, _go, _result) {
  var lodash = window._;
  var Flow = window.Flow;
  var createScalaCodeView;
  var _scalaCodeView;
  var _scalaLinkText;
  var _scalaResponseVisible;
  _scalaCodeView = Flow.Dataflow.signal(null);
  _scalaResponseVisible = Flow.Dataflow.signal(false);
  _scalaLinkText = Flow.Dataflow.signal('Show Scala Response');
  createScalaCodeView = function (result) {
    return {
      output: result.output,
      response: result.response,
      status: result.status,
      scalaResponseVisible: _scalaResponseVisible,
      scalaLinkText: _scalaLinkText,
      toggleVisibility() {
        _scalaResponseVisible(!_scalaResponseVisible());
        if (_scalaResponseVisible()) {
          return _scalaLinkText('Hide Scala Response');
        }
        return _scalaLinkText('Show Scala Response');
      }
    };
  };
  _scalaCodeView(createScalaCodeView(_result));
  lodash.defer(_go);
  return {
    scalaCodeView: _scalaCodeView,
    template: 'flow-scala-code-output'
  };
};
  