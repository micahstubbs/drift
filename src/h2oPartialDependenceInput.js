import { getModelsRequest } from './h2oProxy/getModelsRequest';
import { uuid } from './coreUtils/uuid';

import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oPartialDependenceInput(_, _go) {
  const lodash = window._;
  const Flow = window.Flow;

  // TODO display in .jade
  const _exception = Flow.Dataflow.signal(null);
  const _destinationKey = Flow.Dataflow.signal(`ppd-${uuid()}`);
  const _frames = Flow.Dataflow.signals([]);
  const _models = Flow.Dataflow.signals([]);
  const _selectedModel = Flow.Dataflow.signals(null);
  const _selectedFrame = Flow.Dataflow.signal(null);
  const _nbins = Flow.Dataflow.signal(20);

  //  a conditional check that makes sure that
  //  all fields in the form are filled in
  //  before the button is shown as active
  const _canCompute = Flow.Dataflow.lift(_destinationKey, _selectedFrame, _selectedModel, _nbins, (dk, sf, sm, nb) => dk && sf && sm && nb);
  const _compute = () => {
    if (!_canCompute()) {
      return;
    }

    // parameters are selections from Flow UI
    // form dropdown menus, text boxes, etc
    const opts = {
      destination_key: _destinationKey(),
      model_id: _selectedModel(),
      frame_id: _selectedFrame(),
      nbins: _nbins(),
    };

    // assemble a string for the h2o Rapids AST
    // this contains the function to call
    // along with the options to pass in
    const cs = `buildPartialDependence ${flowPrelude.stringify(opts)}`;

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
  getModelsRequest(_, (error, models) => {
    let model;
    if (error) {
      return _exception(new Flow.Error('Error fetching model list.', error));
    }
    return _models((() => {
      let _i;
      let _len;
      const _results = [];
      // TODO use models directly
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        _results.push(model.model_id.name);
      }
      return _results;
    })());
  });
  lodash.defer(_go);
  return {
    destinationKey: _destinationKey,
    frames: _frames,
    models: _models,
    selectedModel: _selectedModel,
    selectedFrame: _selectedFrame,
    nbins: _nbins,
    compute: _compute,
    canCompute: _canCompute,
    template: 'flow-partial-dependence-input',
  };
}

