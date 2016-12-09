export function flowStatus(_) {
  var lodash = window._;
  var Flow = window.Flow;
  var defaultMessage;
  var onStatus;
  var _connections;
  var _isBusy;
  var _message;
  defaultMessage = 'Ready';
  _message = Flow.Dataflow.signal(defaultMessage);
  _connections = Flow.Dataflow.signal(0);
  _isBusy = Flow.Dataflow.lift(_connections, function (connections) {
    return connections > 0;
  });
  onStatus = function (category, type, data) {
    var connections;
    console.debug('Status:', category, type, data);
    switch (category) {
      case 'server':
        switch (type) {
          case 'request':
            _connections(_connections() + 1);
            return lodash.defer(_message, `Requesting ${data}`);
          case 'response':
          case 'error':
            _connections(connections = _connections() - 1);
            if (connections) {
              return lodash.defer(_message, `Waiting for ${connections} responses...`);
            }
            return lodash.defer(_message, defaultMessage);
        }
    }
  };
  Flow.Dataflow.link(_.ready, function () {
    return Flow.Dataflow.link(_.status, onStatus);
  });
  return {
    message: _message,
    connections: _connections,
    isBusy: _isBusy
  };
}

