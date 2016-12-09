export function h2oStackTraceOutput(_, _go, _stackTrace) {
  var lodash = window._;
  var Flow = window.Flow;
  var createNode;
  var createThread;
  var node;
  var _activeNode;
  var _nodes;
  _activeNode = Flow.Dataflow.signal(null);
  createThread = function (thread) {
    var lines;
    lines = thread.split('\n');
    return {
      title: lodash.head(lines),
      stackTrace: lodash.tail(lines).join('\n')
    };
  };
  createNode = function (node) {
    var display;
    var self;
    var thread;
    display = function () {
      return _activeNode(self);
    };
    return self = {
      name: node.node,
      timestamp: new Date(node.time),
      threads: (function () {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = node.thread_traces;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thread = _ref[_i];
          _results.push(createThread(thread));
        }
        return _results;
      }()),
      display
    };
  };
  _nodes = (function () {
    var _i;
    var _len;
    var _ref;
    var _results;
    _ref = _stackTrace.traces;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      _results.push(createNode(node));
    }
    return _results;
  }());
  _activeNode(lodash.head(_nodes));
  lodash.defer(_go);
  return {
    nodes: _nodes,
    activeNode: _activeNode,
    template: 'flow-stacktrace-output'
  };
}

