export function h2oStackTraceOutput(_, _go, _stackTrace) {
  const lodash = window._;
  const Flow = window.Flow;
  let createNode;
  let createThread;
  let node;
  let _activeNode;
  let _nodes;
  _activeNode = Flow.Dataflow.signal(null);
  createThread = thread => {
    let lines;
    lines = thread.split('\n');
    return {
      title: lodash.head(lines),
      stackTrace: lodash.tail(lines).join('\n')
    };
  };
  createNode = node => {
    let display;
    let self;
    let thread;
    display = () => _activeNode(self);
    return self = {
      name: node.node,
      timestamp: new Date(node.time),
      threads: ((() => {
        let _i;
        let _len;
        let _ref;
        let _results;
        _ref = node.thread_traces;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thread = _ref[_i];
          _results.push(createThread(thread));
        }
        return _results;
      })()),
      display
    };
  };
  _nodes = ((() => {
    let _i;
    let _len;
    let _ref;
    let _results;
    _ref = _stackTrace.traces;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      _results.push(createNode(node));
    }
    return _results;
  })());
  _activeNode(lodash.head(_nodes));
  lodash.defer(_go);
  return {
    nodes: _nodes,
    activeNode: _activeNode,
    template: 'flow-stacktrace-output'
  };
}

