export function h2oNetworkTestOutput(_, _go, _testResult) {
  var lodash = window._;
  var Flow = window.Flow;
  var render;
  var _result;
  _result = Flow.Dataflow.signal(null);
  render = _.plot(function (g) {
    return g(g.select(), g.from(_.inspect('result', _testResult)));
  });
  render(function (error, vis) {
    if (error) {
      return console.debug(error);
    }
    return _result(vis.element);
  });
  lodash.defer(_go);
  return {
    result: _result,
    template: 'flow-network-test-output'
  };
}

