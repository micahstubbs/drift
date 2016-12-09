export function h2oAutoModelInput(_, _go, opts) {
  var lodash = window._;
  var Flow = window.Flow;
  var buildModel;
  var defaultMaxRunTime;
  var _canBuildModel;
  var _column;
  var _columns;
  var _frame;
  var _frames;
  var _hasFrame;
  var _maxRunTime;
  if (opts == null) {
    opts = {};
  }
  _frames = Flow.Dataflow.signal([]);
  _frame = Flow.Dataflow.signal(null);
  _hasFrame = Flow.Dataflow.lift(_frame, frame => {
    if (frame) {
      return true;
    }
    return false;
  });
  _columns = Flow.Dataflow.signal([]);
  _column = Flow.Dataflow.signal(null);
  _canBuildModel = Flow.Dataflow.lift(_frame, _column, (frame, column) => frame && column);
  defaultMaxRunTime = 3600;
  _maxRunTime = Flow.Dataflow.signal(defaultMaxRunTime);
  buildModel = () => {
    var arg;
    var maxRunTime;
    var parsed;
    maxRunTime = defaultMaxRunTime;
    if (!lodash.isNaN(parsed = parseInt(_maxRunTime(), 10))) {
      maxRunTime = parsed;
    }
    arg = {
      frame: _frame(),
      column: _column(),
      maxRunTime
    };
    return _.insertAndExecuteCell('cs', `buildAutoModel ${JSON.stringify(arg)}`);
  };
  _.requestFrames((error, frames) => {
    var frame;
    if (error) {
      // empty
    } else {
      _frames((() => {
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
      })());
      if (opts.frame) {
        _frame(opts.frame);
      }
    }
  });
  Flow.Dataflow.react(_frame, frame => {
    if (frame) {
      return _.requestFrameSummaryWithoutData(frame, (error, frame) => {
        var column;
        if (error) {
          // empty
        } else {
          _columns((() => {
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
          })());
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
    maxRunTime: _maxRunTime,
    canBuildModel: _canBuildModel,
    buildModel,
    template: 'flow-automodel-input'
  };
}

