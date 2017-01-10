import { createControl } from './createControl';
import { createGridableValues } from './createGridableValues';
import { h2oModelBuilderForm } from './h2oModelBuilderForm/h2oModelBuilderForm';

import { requestModelBuilders } from '../h2oProxy/requestModelBuilders';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function modelInput() {
  const lodash = window._;
  const Flow = window.Flow;
  const H2O = window.H2O;
  H2O.ModelInput = (_, _go, _algo, _opts) => {
    const _exception = Flow.Dataflow.signal(null);
    const _algorithms = Flow.Dataflow.signal([]);
    const _algorithm = Flow.Dataflow.signal(null);
    const _canCreateModel = Flow.Dataflow.lift(_algorithm, algorithm => {
      if (algorithm) {
        return true;
      }
      return false;
    });
    const _modelForm = Flow.Dataflow.signal(null);
    const populateFramesAndColumns = (frameKey, algorithm, parameters, go) => {
      const destinationKeyParameter = lodash.find(parameters, parameter => parameter.name === 'model_id');
      if (destinationKeyParameter && !destinationKeyParameter.actual_value) {
        destinationKeyParameter.actual_value = `${algorithm}-${Flow.Util.uuid()}`;
      }

      //
      // Force classification.
      //
      const classificationParameter = lodash.find(parameters, parameter => parameter.name === 'do_classification');
      if (classificationParameter) {
        classificationParameter.actual_value = true;
      }
      return _.requestFrames(_, (error, frames) => {
        let frame;
        let frameKeys;
        let frameParameters;
        let parameter;
        let _i;
        let _len;
        if (error) {
          // empty
          // TODO handle properly
        } else {
          frameKeys = (() => {
            let _i;
            let _len;
            const _results = [];
            for (_i = 0, _len = frames.length; _i < _len; _i++) {
              frame = frames[_i];
              _results.push(frame.frame_id.name);
            }
            return _results;
          })();
          frameParameters = lodash.filter(parameters, parameter => parameter.type === 'Key<Frame>');
          for (_i = 0, _len = frameParameters.length; _i < _len; _i++) {
            parameter = frameParameters[_i];
            parameter.values = frameKeys;

            // TODO HACK
            if (parameter.name === 'training_frame') {
              if (frameKey) {
                parameter.actual_value = frameKey;
              } else {
                frameKey = parameter.actual_value;
              }
            }
          }
          return go();
        }
      });
    };
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
          return populateFramesAndColumns(frameKey, algorithm, parameters, () => _modelForm(h2oModelBuilderForm(_, algorithm, parameters)));
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
      template: 'flow-model-input',
    };
  };
}
