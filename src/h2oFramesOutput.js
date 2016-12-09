import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oFramesOutput(_, _go, _frames) {
  const lodash = window._;
  const Flow = window.Flow;
  let collectSelectedKeys;
  let createFrameView;
  let deleteFrames;
  let importFiles;
  let predictOnFrames;
  let _checkAllFrames;
  let _frameViews;
  let _hasSelectedFrames;
  let _isCheckingAll;
  _frameViews = Flow.Dataflow.signal([]);
  _checkAllFrames = Flow.Dataflow.signal(false);
  _hasSelectedFrames = Flow.Dataflow.signal(false);
  _isCheckingAll = false;
  Flow.Dataflow.react(_checkAllFrames, checkAll => {
    let view;
    let _i;
    let _len;
    let _ref;
    _isCheckingAll = true;
    _ref = _frameViews();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      view.isChecked(checkAll);
    }
    _hasSelectedFrames(checkAll);
    _isCheckingAll = false;
  });
  createFrameView = frame => {
    let columnLabels;
    let createModel;
    let inspect;
    let predict;
    let view;
    let _isChecked;
    _isChecked = Flow.Dataflow.signal(false);
    Flow.Dataflow.react(_isChecked, () => {
      let checkedViews;
      let view;
      if (_isCheckingAll) {
        return;
      }
      checkedViews = (() => {
        let _i;
        let _len;
        let _ref;
        let _results;
        _ref = _frameViews();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if (view.isChecked()) {
            _results.push(view);
          }
        }
        return _results;
      })();
      return _hasSelectedFrames(checkedViews.length > 0);
    });
    columnLabels = lodash.head(lodash.map(frame.columns, column => column.label), 15);
    view = () => {
      if (frame.is_text) {
        return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${flowPrelude.stringify(frame.frame_id.name)} ]`);
      }
      return _.insertAndExecuteCell('cs', `getFrameSummary ${flowPrelude.stringify(frame.frame_id.name)}`);
    };
    predict = () => _.insertAndExecuteCell('cs', `predict frame: ${flowPrelude.stringify(frame.frame_id.name)}`);
    inspect = () => _.insertAndExecuteCell('cs', `inspect getFrameSummary ${flowPrelude.stringify(frame.frame_id.name)}`);
    createModel = () => _.insertAndExecuteCell('cs', `assist buildModel, null, training_frame: ${flowPrelude.stringify(frame.frame_id.name)}`);
    return {
      key: frame.frame_id.name,
      isChecked: _isChecked,
      size: Flow.Util.formatBytes(frame.byte_size),
      rowCount: frame.rows,
      columnCount: frame.columns,
      isText: frame.is_text,
      view,
      predict,
      inspect,
      createModel
    };
  };
  importFiles = () => _.insertAndExecuteCell('cs', 'importFiles');
  collectSelectedKeys = () => {
    let view;
    let _i;
    let _len;
    let _ref;
    let _results;
    _ref = _frameViews();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      if (view.isChecked()) {
        _results.push(view.key);
      }
    }
    return _results;
  };
  predictOnFrames = () => _.insertAndExecuteCell('cs', `predict frames: ${flowPrelude.stringify(collectSelectedKeys())}`);
  deleteFrames = () => _.confirm('Are you sure you want to delete these frames?', {
    acceptCaption: 'Delete Frames',
    declineCaption: 'Cancel'
  }, accept => {
    if (accept) {
      return _.insertAndExecuteCell('cs', `deleteFrames ${flowPrelude.stringify(collectSelectedKeys())}`);
    }
  });
  _frameViews(lodash.map(_frames, createFrameView));
  lodash.defer(_go);
  return {
    frameViews: _frameViews,
    hasFrames: _frames.length > 0,
    importFiles,
    predictOnFrames,
    deleteFrames,
    hasSelectedFrames: _hasSelectedFrames,
    checkAllFrames: _checkAllFrames,
    template: 'flow-frames-output'
  };
}

