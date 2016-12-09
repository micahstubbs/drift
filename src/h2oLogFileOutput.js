export function h2oLogFileOutput(_, _go, _cloud, _nodeIndex, _fileType, _logFile) {
  const lodash = window._;
  const Flow = window.Flow;
  let createNode;
  let initialize;
  let refresh;
  let refreshActiveView;
  let _activeFileType;
  let _activeNode;
  let _contents;
  let _exception;
  let _fileTypes;
  let _nodes;
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
  createNode = (node, index) => ({
    name: node.ip_port,
    index
  });
  refreshActiveView = (node, fileType) => {
    if (node) {
      return _.requestLogFile(node.index, fileType, (error, logFile) => {
        if (error) {
          return _contents(`Error fetching log file: ${error.message}`);
        }
        return _contents(logFile.log);
      });
    }
    return _contents('');
  };
  refresh = () => refreshActiveView(_activeNode(), _activeFileType());
  initialize = (cloud, nodeIndex, fileType, logFile) => {
    let NODE_INDEX_SELF;
    let clientNode;
    let i;
    let n;
    let nodes;
    let _i;
    let _len;
    let _ref;
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

