import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oMergeFramesInput(_, _go) {
  const lodash = window._;
  const Flow = window.Flow;
  let _canMerge;
  let _destinationKey;
  let _exception;
  let _frames;
  let _includeAllLeftRows;
  let _includeAllRightRows;
  let _leftColumns;
  let _merge;
  let _rightColumns;
  let _selectedLeftColumn;
  let _selectedLeftFrame;
  let _selectedRightColumn;
  let _selectedRightFrame;
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
  _canMerge = Flow.Dataflow.lift(_selectedLeftFrame, _selectedLeftColumn, _selectedRightFrame, _selectedRightColumn, (lf, lc, rf, rc) => lf && lc && rf && rc);
  Flow.Dataflow.react(_selectedLeftFrame, frameKey => {
    if (frameKey) {
      return _.requestFrameSummaryWithoutData(frameKey, (error, frame) => _leftColumns(lodash.map(frame.columns, (column, i) => ({
        label: column.label,
        index: i
      }))));
    }
    _selectedLeftColumn(null);
    return _leftColumns([]);
  });
  Flow.Dataflow.react(_selectedRightFrame, frameKey => {
    if (frameKey) {
      return _.requestFrameSummaryWithoutData(frameKey, (error, frame) => _rightColumns(lodash.map(frame.columns, (column, i) => ({
        label: column.label,
        index: i
      }))));
    }
    _selectedRightColumn(null);
    return _rightColumns([]);
  });
  _merge = () => {
    let cs;
    if (!_canMerge()) {
      return;
    }
    cs = `mergeFrames ${flowPrelude.stringify(_destinationKey())}, ${flowPrelude.stringify(_selectedLeftFrame())}, ${_selectedLeftColumn().index}, ${_includeAllLeftRows()}, ${flowPrelude.stringify(_selectedRightFrame())}, ${_selectedRightColumn().index}, ${_includeAllRightRows()}`;
    return _.insertAndExecuteCell('cs', cs);
  };
  _.requestFrames((error, frames) => {
    let frame;
    if (error) {
      return _exception(new Flow.Error('Error fetching frame list.', error));
    }
    return _frames((() => {
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
}

