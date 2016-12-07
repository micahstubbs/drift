export function imputeInput() {
  var lodash = window._;
  var Flow = window.Flow;
  var createOptions;
  var _allCombineMethods;
  var _allMethods;
  createOptions = function (options) {
    var option;
    var _i;
    var _len;
    var _results;
    _results = [];
    for (_i = 0, _len = options.length; _i < _len; _i++) {
      option = options[_i];
      _results.push({
        caption: option,
        value: option.toLowerCase()
      });
    }
    return _results;
  };
  _allMethods = createOptions([
    'Mean',
    'Median',
    'Mode'
  ]);
  _allCombineMethods = createOptions([
    'Interpolate',
    'Average',
    'Low',
    'High'
  ]);
  H2O.ImputeInput = function (_, _go, opts) {
    var impute;
    var _canGroupByColumns;
    var _canImpute;
    var _canUseCombineMethod;
    var _column;
    var _columns;
    var _combineMethod;
    var _combineMethods;
    var _frame;
    var _frames;
    var _groupByColumns;
    var _hasFrame;
    var _method;
    var _methods;
    if (opts == null) {
      opts = {};
    }
    _frames = Flow.Dataflow.signal([]);
    _frame = Flow.Dataflow.signal(null);
    _hasFrame = Flow.Dataflow.lift(_frame, function (frame) {
      if (frame) {
        return true;
      }
      return false;
    });
    _columns = Flow.Dataflow.signal([]);
    _column = Flow.Dataflow.signal(null);
    _methods = _allMethods;
    _method = Flow.Dataflow.signal(_allMethods[0]);
    _canUseCombineMethod = Flow.Dataflow.lift(_method, function (method) {
      return method.value === 'median';
    });
    _combineMethods = _allCombineMethods;
    _combineMethod = Flow.Dataflow.signal(_allCombineMethods[0]);
    _canGroupByColumns = Flow.Dataflow.lift(_method, function (method) {
      return method.value !== 'median';
    });
    _groupByColumns = Flow.Dataflow.signals([]);
    _canImpute = Flow.Dataflow.lift(_frame, _column, function (frame, column) {
      return frame && column;
    });
    impute = function () {
      var arg;
      var combineMethod;
      var groupByColumns;
      var method;
      method = _method();
      arg = {
        frame: _frame(),
        column: _column(),
        method: method.value
      };
      if (method.value === 'median') {
        if (combineMethod = _combineMethod()) {
          arg.combineMethod = combineMethod.value;
        }
      } else {
        groupByColumns = _groupByColumns();
        if (groupByColumns.length) {
          arg.groupByColumns = groupByColumns;
        }
      }
      return _.insertAndExecuteCell('cs', `imputeColumn ${JSON.stringify(arg)}`);
    };
    _.requestFrames(function (error, frames) {
      var frame;
      if (error) {
        // empty
      } else {
        _frames(function () {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = frames.length; _i < _len; _i++) {
            frame = frames[_i];
            if (!frame.is_text) {
              _results.push(frame.frame_id.name);
            }
          }
          return _results;
        }());
        if (opts.frame) {
          _frame(opts.frame);
        }
      }
    });
    Flow.Dataflow.react(_frame, function (frame) {
      if (frame) {
        return _.requestFrameSummaryWithoutData(frame, function (error, frame) {
          var column;
          if (error) {
            // empty
          } else {
            _columns(function () {
              var _i;
              var _len;
              var _ref;
              var _results;
              _ref = frame.columns;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                column = _ref[_i];
                _results.push(column.label);
              }
              return _results;
            }());
            if (opts.column) {
              _column(opts.column);
              return delete opts.column;
            }
          }
        });
      }
      return _columns([]);
    });
    lodash.defer(_go);
    return {
      frames: _frames,
      frame: _frame,
      hasFrame: _hasFrame,
      columns: _columns,
      column: _column,
      methods: _methods,
      method: _method,
      canUseCombineMethod: _canUseCombineMethod,
      combineMethods: _combineMethods,
      combineMethod: _combineMethod,
      canGroupByColumns: _canGroupByColumns,
      groupByColumns: _groupByColumns,
      canImpute: _canImpute,
      impute,
      template: 'flow-impute-input'
    };
  };
}
