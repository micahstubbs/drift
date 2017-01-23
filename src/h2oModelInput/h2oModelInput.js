import { populateFramesAndColumns } from './populateFramesAndColumns';
import { h2oModelBuilderForm } from './h2oModelBuilderForm/h2oModelBuilderForm';

import { requestModelBuilders } from '../h2oProxy/requestModelBuilders';
import { requestFrames } from '../h2oProxy/requestFrames';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oModelInput(_, _go, _algo, _opts) {
  const lodash = window._;
  const Flow = window.Flow;
  const H2O = window.H2O;
  const _exception = Flow.Dataflow.signal(null);
  const _algorithms = Flow.Dataflow.signal([]);
  const _algorithm = Flow.Dataflow.signal(null);
  _.createModelDeviancesPlot = Flow.Dataflow.signal(false);
  const _frames = Flow.Dataflow.signals([]);
  _.selectedFrame = Flow.Dataflow.signal(null);

  const _canCreateModel = Flow.Dataflow.lift(_algorithm, algorithm => {
    if (algorithm) {
      return true;
    }
    return false;
  });
  // request frames for the comparison frame select box
  requestFrames(_, (error, frames) => {
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

  const _modelForm = Flow.Dataflow.signal(null);
  ((() => requestModelBuilders(_, (error, modelBuilders) => {
    _algorithms(modelBuilders);
    _algorithm(_algo ? lodash.find(modelBuilders, builder => builder.algo === _algo) : void 0);
    const frameKey = _opts != null ? _opts.training_frame : void 0;
    return Flow.Dataflow.act(_algorithm, builder => {
      let algorithm;
      let parameters;
      if (builder) {
        algorithm = builder.algo;
        parameters = flowPrelude.deepClone(builder.parameters);
        return populateFramesAndColumns(_, frameKey, algorithm, parameters, () => _modelForm(h2oModelBuilderForm(_, algorithm, parameters)));
      }
      return _modelForm(null);
    });
  }))());
  const createModel = () => _modelForm().createModel();

  lodash.defer(_go);
  return {
    parentException: _exception, // XXX hacky
    algorithms: _algorithms,
    algorithm: _algorithm,
    modelForm: _modelForm,
    canCreateModel: _canCreateModel,
    createModel,
    createModelDeviancesPlot: _.createModelDeviancesPlot,
    frames: _frames,
    selectedFrame: _.selectedFrame,
    template: 'flow-model-input',
  };
}
