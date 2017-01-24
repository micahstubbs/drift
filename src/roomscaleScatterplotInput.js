import { uuid } from './utils/uuid';
import showRoomscaleScatterplot from './showRoomscaleScatterplot';

import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export default function roomscaleScatterplotInput(_, _go) {
  const lodash = window._;
  const Flow = window.Flow;

  const _exception = Flow.Dataflow.signal(null);
  const _destinationKey = Flow.Dataflow.signal(`ppd-${uuid()}`);
  const _frames = Flow.Dataflow.signals([]);
  const _models = Flow.Dataflow.signals([]);
  const _selectedModel = Flow.Dataflow.signals(null);
  _.selectedFrame = Flow.Dataflow.signal(null);
  const _useCustomColumns = Flow.Dataflow.signal(false);
  const _columns = Flow.Dataflow.signal([]);
  const _nbins = Flow.Dataflow.signal(20);

  //  a conditional check that makes sure that
  //  all fields in the form are filled in
  //  before the button is shown as active
  const _canCompute = Flow.Dataflow.lift(_destinationKey, _.selectedFrame, _selectedModel, _nbins, (dk, sf, sm, nb) => dk && sf && sm && nb);
  const _compute = () => {
    if (!_canCompute()) {
      return;
    }

    // parameters are selections from Flow UI
    // form dropdown menus, text boxes, etc
    let col;
    let cols;
    let i;
    let len;

    cols = '';

    const ref = _columns();
    for (i = 0, len = ref.length; i < len; i++) {
      col = ref[i];
      if (col.isSelected()) {
        cols = `${cols}"${col.value}",`;
      }
    }

    if (cols !== '') {
      cols = `[${cols}]`;
    }

    const opts = {
      // destination_key: _destinationKey(),
      frame_id: _.selectedFrame(),
      // cols,
      // nbins: _nbins(),
    };

    // assemble a string
    // this contains the function to call
    // along with the options to pass in
    const cs = `showRoomscaleScatterplot ${flowPrelude.stringify(opts)}`;

    // insert a cell with the expression `cs`
    // into the current Flow notebook
    // and run the cell
    return _.insertAndExecuteCell('cs', cs);
  };

  _.requestFrames(_, (error, frames) => {
    let frame;
    if (error) {
      return _exception(new Flow.Error('Error fetching frame list.', error));
    }
    return _frames((() => {
      let _i;
      let _len;
      const _results = [];
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
    exception: _exception,
    destinationKey: _destinationKey,
    frames: _frames,
    selectedFrame: _.selectedFrame,
    nbins: _nbins,
    compute: _compute,
    canCompute: _canCompute,
    template: 'flow-roomscale-scatterplot-input',
  };
}
