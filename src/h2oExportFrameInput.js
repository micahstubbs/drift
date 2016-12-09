import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oExportFrameInput(_, _go, frameKey, path, opt) {
  const lodash = window._;
  const Flow = window.Flow;
  let exportFrame;
  let _canExportFrame;
  let _frames;
  let _overwrite;
  let _path;
  let _selectedFrame;
  _frames = Flow.Dataflow.signal([]);
  _selectedFrame = Flow.Dataflow.signal(frameKey);
  _path = Flow.Dataflow.signal(null);
  _overwrite = Flow.Dataflow.signal(true);
  _canExportFrame = Flow.Dataflow.lift(_selectedFrame, _path, (frame, path) => frame && path);
  exportFrame = () => _.insertAndExecuteCell('cs', `exportFrame ${flowPrelude.stringify(_selectedFrame())}, ${flowPrelude.stringify(_path())}, overwrite: ${(_overwrite() ? 'true' : 'false')}`);
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
          _results.push(frame.frame_id.name);
        }
        return _results;
      })());
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
}

