export function h2oAutoModelInput(_, _go, opts) {
  const lodash = window._;
  const Flow = window.Flow;
  let buildModel;
  let defaultMaxRunTime;
  let _canBuildModel;
  let _column;
  let _columns;
  let _frame;
  let _frames;
  let _hasFrame;
  let _maxRunTime;
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
    let arg;
    let maxRunTime;
    let parsed;
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
    let frame;
    if (error) {
      // empty
    } else {
      _frames((() => {
        let _i;
        let _len;
        let _results;
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
        let column;
        if (error) {
          // empty
        } else {
          _columns((() => {
            let _i;
            let _len;
            let _ref;
            let _results;
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

