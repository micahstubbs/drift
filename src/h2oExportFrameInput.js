import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oExportFrameInput(_, _go, frameKey, path, opt) {
  var lodash = window._;
  var Flow = window.Flow;
  var exportFrame;
  var _canExportFrame;
  var _frames;
  var _overwrite;
  var _path;
  var _selectedFrame;
  _frames = Flow.Dataflow.signal([]);
  _selectedFrame = Flow.Dataflow.signal(frameKey);
  _path = Flow.Dataflow.signal(null);
  _overwrite = Flow.Dataflow.signal(true);
  _canExportFrame = Flow.Dataflow.lift(_selectedFrame, _path, function (frame, path) {
    return frame && path;
  });
  exportFrame = function () {
    return _.insertAndExecuteCell('cs', `exportFrame ${flowPrelude.stringify(_selectedFrame())}, ${flowPrelude.stringify(_path())}, overwrite: ${(_overwrite() ? 'true' : 'false')}`);
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
          _results.push(frame.frame_id.name);
        }
        return _results;
      }());
      return _selectedFrame(frameKey);
    }
  });
  lodash.defer(_go);
  return {
    frames: _frames,
    selectedFrame: _selectedFrame,
    path: _path,
    overwrite: _overwrite,
    canExportFrame: _canExportFrame,
    exportFrame,
    template: 'flow-export-frame-input'
  };
};
  