export function imputeInput() {
  const lodash = window._;
  const Flow = window.Flow;
  let createOptions;
  let _allCombineMethods;
  let _allMethods;
  createOptions = options => {
    let option;
    let _i;
    let _len;
    let _results;
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
  H2O.ImputeInput = (_, _go, opts) => {
    let impute;
    let _canGroupByColumns;
    let _canImpute;
    let _canUseCombineMethod;
    let _column;
    let _columns;
    let _combineMethod;
    let _combineMethods;
    let _frame;
    let _frames;
    let _groupByColumns;
    let _hasFrame;
    let _method;
    let _methods;
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
    _methods = _allMethods;
    _method = Flow.Dataflow.signal(_allMethods[0]);
    _canUseCombineMethod = Flow.Dataflow.lift(_method, method => method.value === 'median');
    _combineMethods = _allCombineMethods;
    _combineMethod = Flow.Dataflow.signal(_allCombineMethods[0]);
    _canGroupByColumns = Flow.Dataflow.lift(_method, method => method.value !== 'median');
    _groupByColumns = Flow.Dataflow.signals([]);
    _canImpute = Flow.Dataflow.lift(_frame, _column, (frame, column) => frame && column);
    impute = () => {
      let arg;
      let combineMethod;
      let groupByColumns;
      let method;
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
