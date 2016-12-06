export function h2oTimelineOutput(_, _go, _timeline) {
  var lodash = window._;
  var Flow = window.Flow;
  var createEvent;
  var refresh;
  var toggleRefresh;
  var updateTimeline;
  var _data;
  var _headers;
  var _isBusy;
  var _isLive;
  var _timestamp;
  _isLive = Flow.Dataflow.signal(false);
  _isBusy = Flow.Dataflow.signal(false);
  _headers = [
    'HH:MM:SS:MS',
    'nanosec',
    'Who',
    'I/O Type',
    'Event',
    'Type',
    'Bytes'
  ];
  _data = Flow.Dataflow.signal(null);
  _timestamp = Flow.Dataflow.signal(Date.now());
  createEvent = function (event) {
    switch (event.type) {
      case 'io':
        return [
          event.date,
          event.nanos,
          event.node,
          event.io_flavor || '-',
          'I/O',
          '-',
          event.data
        ];
      case 'heartbeat':
        return [
          event.date,
          event.nanos,
          'many &#8594;  many',
          'UDP',
          event.type,
          '-',
          `${event.sends} sent ${event.recvs} received'`
        ];
      case 'network_msg':
        return [
          event.date,
          event.nanos,
          `${event.from} &#8594; ${event.to}`,
          event.protocol,
          event.msg_type,
          event.is_send ? 'send' : 'receive',
          event.data
        ];
      default:
    }
  };
  updateTimeline = function (timeline) {
    var cell;
    var event;
    var grid;
    var header;
    var table;
    var tbody;
    var td;
    var th;
    var thead;
    var ths;
    var tr;
    var trs;
    var _ref;
    _ref = Flow.HTML.template('.grid', 'table', 'thead', 'tbody', 'tr', 'th', 'td');
    grid = _ref[0];
    table = _ref[1];
    thead = _ref[2];
    tbody = _ref[3];
    tr = _ref[4];
    th = _ref[5];
    td = _ref[6];
    ths = (function () {
      var _i;
      var _len;
      var _results;
      _results = [];
      for (_i = 0, _len = _headers.length; _i < _len; _i++) {
        header = _headers[_i];
        _results.push(th(header));
      }
      return _results;
    }());
    trs = (function () {
      let _i;
      let _len;
      const _ref1 = timeline.events;
      const _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        event = _ref1[_i];
        _results.push(tr(function () {
          let _j;
          let _len1;
          const _ref2 = createEvent(event);
          const _results1 = [];
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            cell = _ref2[_j];
            _results1.push(td(cell));
          }
          return _results1;
        }()));
      }
      return _results;
    }());
    return _data(Flow.HTML.render('div', grid([table([
      thead(tr(ths)),
      tbody(trs)
    ])])));
  };
  toggleRefresh = function () {
    return _isLive(!_isLive());
  };
  refresh = function () {
    _isBusy(true);
    return _.requestTimeline((error, timeline) => {
      _isBusy(false);
      if (error) {
        _exception(Flow.Failure(_, new Flow.Error('Error fetching timeline', error)));
        return _isLive(false);
      }
      updateTimeline(timeline);
      if (_isLive()) {
        return lodash.delay(refresh, 2000);
      }
    });
  };
  Flow.Dataflow.act(_isLive, (isLive) => {
    if (isLive) {
      return refresh();
    }
  });
  updateTimeline(_timeline);
  lodash.defer(_go);
  return {
    data: _data,
    isLive: _isLive,
    isBusy: _isBusy,
    toggleRefresh,
    refresh,
    template: 'flow-timeline-output'
  };
};
  