export function h2oProfileOutput(_, _go, _profile) {
  var lodash = window._;
  var Flow = window.Flow;
  var createNode;
  var i;
  var node;
  var _activeNode;
  var _nodes;
  _activeNode = Flow.Dataflow.signal(null);
  createNode = function (node) {
    var display;
    var entries;
    var entry;
    var self;
    display = function () {
      return _activeNode(self);
    };
    entries = function () {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = node.entries;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        _results.push({
          stacktrace: entry.stacktrace,
          caption: `Count: ${entry.count}`
        });
      }
      return _results;
    }();
    return self = {
      name: node.node_name,
      caption: `${node.node_name} at ${new Date(node.timestamp)}`,
      entries,
      display
    };
  };
  _nodes = (function () {
    var _i;
    var _len;
    var _ref;
    var _results;
    _ref = _profile.nodes;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      node = _ref[i];
      _results.push(createNode(node));
    }
    return _results;
  }());
  _activeNode(lodash.head(_nodes));
  lodash.defer(_go);
  return {
    nodes: _nodes,
    activeNode: _activeNode,
    template: 'flow-profile-output'
  };
};
  