export function h2oMergeFramesInput(_, _go) {
  var lodash = window._;
  var Flow = window.Flow;
  var _canMerge;
  var _destinationKey;
  var _exception;
  var _frames;
  var _includeAllLeftRows;
  var _includeAllRightRows;
  var _leftColumns;
  var _merge;
  var _rightColumns;
  var _selectedLeftColumn;
  var _selectedLeftFrame;
  var _selectedRightColumn;
  var _selectedRightFrame;
  _exception = Flow.Dataflow.signal(null);
  _destinationKey = Flow.Dataflow.signal(`merged-${Flow.Util.uuid()}`);
  _frames = Flow.Dataflow.signals([]);
  _selectedLeftFrame = Flow.Dataflow.signal(null);
  _leftColumns = Flow.Dataflow.signals([]);
  _selectedLeftColumn = Flow.Dataflow.signal(null);
  _includeAllLeftRows = Flow.Dataflow.signal(false);
  _selectedRightFrame = Flow.Dataflow.signal(null);
  _rightColumns = Flow.Dataflow.signals([]);
  _selectedRightColumn = Flow.Dataflow.signal(null);
  _includeAllRightRows = Flow.Dataflow.signal(false);
  _canMerge = Flow.Dataflow.lift(_selectedLeftFrame, _selectedLeftColumn, _selectedRightFrame, _selectedRightColumn, function (lf, lc, rf, rc) {
    return lf && lc && rf && rc;
  });
  Flow.Dataflow.react(_selectedLeftFrame, function (frameKey) {
    if (frameKey) {
      return _.requestFrameSummaryWithoutData(frameKey, function (error, frame) {
        return _leftColumns(lodash.map(frame.columns, function (column, i) {
          return {
            label: column.label,
            index: i
          };
        }));
      });
    }
    _selectedLeftColumn(null);
    return _leftColumns([]);
  });
  Flow.Dataflow.react(_selectedRightFrame, function (frameKey) {
    if (frameKey) {
      return _.requestFrameSummaryWithoutData(frameKey, function (error, frame) {
        return _rightColumns(lodash.map(frame.columns, function (column, i) {
          return {
            label: column.label,
            index: i
          };
        }));
      });
    }
    _selectedRightColumn(null);
    return _rightColumns([]);
  });
  _merge = function () {
    var cs;
    if (!_canMerge()) {
      return;
    }
    cs = `mergeFrames ${Flow.Prelude.stringify(_destinationKey())}, ${Flow.Prelude.stringify(_selectedLeftFrame())}, ${_selectedLeftColumn().index}, ${_includeAllLeftRows()}, ${Flow.Prelude.stringify(_selectedRightFrame())}, ${_selectedRightColumn().index}, ${_includeAllRightRows()}`;
    return _.insertAndExecuteCell('cs', cs);
  };
  _.requestFrames(function (error, frames) {
    var frame;
    if (error) {
      return _exception(new Flow.Error('Error fetching frame list.', error));
    }
    return _frames(function () {
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
  });
  lodash.defer(_go);
  return {
    destinationKey: _destinationKey,
    frames: _frames,
    selectedLeftFrame: _selectedLeftFrame,
    leftColumns: _leftColumns,
    selectedLeftColumn: _selectedLeftColumn,
    includeAllLeftRows: _includeAllLeftRows,
    selectedRightFrame: _selectedRightFrame,
    rightColumns: _rightColumns,
    selectedRightColumn: _selectedRightColumn,
    includeAllRightRows: _includeAllRightRows,
    merge: _merge,
    canMerge: _canMerge,
    template: 'flow-merge-frames-input'
  };
};
  