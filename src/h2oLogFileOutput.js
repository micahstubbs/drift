export function h2oLogFileOutput(_, _go, _cloud, _nodeIndex, _fileType, _logFile) {
  var lodash = window._;
  var Flow = window.Flow;
  var createNode;
  var initialize;
  var refresh;
  var refreshActiveView;
  var _activeFileType;
  var _activeNode;
  var _contents;
  var _exception;
  var _fileTypes;
  var _nodes;
  _exception = Flow.Dataflow.signal(null);
  _contents = Flow.Dataflow.signal('');
  _nodes = Flow.Dataflow.signal([]);
  _activeNode = Flow.Dataflow.signal(null);
  _fileTypes = Flow.Dataflow.signal([
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
    'httpd',
    'stdout',
    'stderr'
  ]);
  _activeFileType = Flow.Dataflow.signal(null);
  createNode = function (node, index) {
    return {
      name: node.ip_port,
      index
    };
  };
  refreshActiveView = function (node, fileType) {
    if (node) {
      return _.requestLogFile(node.index, fileType, function (error, logFile) {
        if (error) {
          return _contents(`Error fetching log file: ${error.message}`);
        }
        return _contents(logFile.log);
      });
    }
    return _contents('');
  };
  refresh = function () {
    return refreshActiveView(_activeNode(), _activeFileType());
  };
  initialize = function (cloud, nodeIndex, fileType, logFile) {
    var NODE_INDEX_SELF;
    var clientNode;
    var i;
    var n;
    var nodes;
    var _i;
    var _len;
    var _ref;
    _activeFileType(fileType);
    _contents(logFile.log);
    nodes = [];
    if (cloud.is_client) {
      clientNode = { ip_port: 'driver' };
      NODE_INDEX_SELF = -1;
      nodes.push(createNode(clientNode, NODE_INDEX_SELF));
    }
    _ref = cloud.nodes;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      n = _ref[i];
      nodes.push(createNode(n, i));
    }
    _nodes(nodes);
    if (nodeIndex < nodes.length) {
      _activeNode(nodes[nodeIndex]);
    }
    Flow.Dataflow.react(_activeNode, _activeFileType, refreshActiveView);
    return lodash.defer(_go);
  };
  initialize(_cloud, _nodeIndex, _fileType, _logFile);
  return {
    nodes: _nodes,
    activeNode: _activeNode,
    fileTypes: _fileTypes,
    activeFileType: _activeFileType,
    contents: _contents,
    refresh,
    template: 'flow-log-file-output'
  };
}

