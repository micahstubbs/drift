export function h2oFramesOutput(_, _go, _frames) {
  var lodash = window._;
  var Flow = window.Flow;
  var collectSelectedKeys;
  var createFrameView;
  var deleteFrames;
  var importFiles;
  var predictOnFrames;
  var _checkAllFrames;
  var _frameViews;
  var _hasSelectedFrames;
  var _isCheckingAll;
  _frameViews = Flow.Dataflow.signal([]);
  _checkAllFrames = Flow.Dataflow.signal(false);
  _hasSelectedFrames = Flow.Dataflow.signal(false);
  _isCheckingAll = false;
  Flow.Dataflow.react(_checkAllFrames, function (checkAll) {
    var view;
    var _i;
    var _len;
    var _ref;
    _isCheckingAll = true;
    _ref = _frameViews();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      view.isChecked(checkAll);
    }
    _hasSelectedFrames(checkAll);
    _isCheckingAll = false;
  });
  createFrameView = function (frame) {
    var columnLabels;
    var createModel;
    var inspect;
    var predict;
    var view;
    var _isChecked;
    _isChecked = Flow.Dataflow.signal(false);
    Flow.Dataflow.react(_isChecked, function () {
      var checkedViews;
      var view;
      if (_isCheckingAll) {
        return;
      }
      checkedViews = function () {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = _frameViews();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if (view.isChecked()) {
            _results.push(view);
          }
        }
        return _results;
      }();
      return _hasSelectedFrames(checkedViews.length > 0);
    });
    columnLabels = lodash.head(lodash.map(frame.columns, function (column) {
      return column.label;
    }), 15);
    view = function () {
      if (frame.is_text) {
        return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${Flow.Prelude.stringify(frame.frame_id.name)} ]`);
      }
      return _.insertAndExecuteCell('cs', `getFrameSummary ${Flow.Prelude.stringify(frame.frame_id.name)}`);
    };
    predict = function () {
      return _.insertAndExecuteCell('cs', `predict frame: ${Flow.Prelude.stringify(frame.frame_id.name)}`);
    };
    inspect = function () {
      return _.insertAndExecuteCell('cs', `inspect getFrameSummary ${Flow.Prelude.stringify(frame.frame_id.name)}`);
    };
    createModel = function () {
      return _.insertAndExecuteCell('cs', `assist buildModel, null, training_frame: ${Flow.Prelude.stringify(frame.frame_id.name)}`);
    };
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
  importFiles = function () {
    return _.insertAndExecuteCell('cs', 'importFiles');
  };
  collectSelectedKeys = function () {
    var view;
    var _i;
    var _len;
    var _ref;
    var _results;
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
  predictOnFrames = function () {
    return _.insertAndExecuteCell('cs', `predict frames: ${Flow.Prelude.stringify(collectSelectedKeys())}`);
  };
  deleteFrames = function () {
    return _.confirm('Are you sure you want to delete these frames?', {
      acceptCaption: 'Delete Frames',
      declineCaption: 'Cancel'
    }, function (accept) {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteFrames ${Flow.Prelude.stringify(collectSelectedKeys())}`);
      }
    });
  };
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
};
  