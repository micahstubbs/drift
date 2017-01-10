import { createControl } from './createControl';

import { createGridableValues } from './createGridableValues';
import { createControlFromParameter } from './createControlFromParameter';

import { requestModelBuilders } from '../h2oProxy/requestModelBuilders';
import { postModelInputValidationRequest } from '../h2oProxy/postModelInputValidationRequest';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function modelInput() {
  const lodash = window._;
  const Flow = window.Flow;
  const H2O = window.H2O;
  H2O.modelBuilderForm = (_, _algorithm, _parameters) => {
    let control;
    let _i;
    let _j;
    let _k;
    let _len;
    let _len1;
    let _len2;
    const _exception = Flow.Dataflow.signal(null);
    const _validationFailureMessage = Flow.Dataflow.signal('');
    const _hasValidationFailures = Flow.Dataflow.lift(_validationFailureMessage, flowPrelude.isTruthy);
    const _gridStrategies = [
      'Cartesian',
      'RandomDiscrete',
    ];
    const _isGrided = Flow.Dataflow.signal(false);
    const _gridId = Flow.Dataflow.signal(`grid-${Flow.Util.uuid()}`);
    const _gridStrategy = Flow.Dataflow.signal('Cartesian');
    const _isGridRandomDiscrete = Flow.Dataflow.lift(_gridStrategy, strategy => strategy !== _gridStrategies[0]);
    const _gridMaxModels = Flow.Dataflow.signal(1000);
    const _gridMaxRuntime = Flow.Dataflow.signal(28800);
    const _gridStoppingRounds = Flow.Dataflow.signal(0);
    const _gridStoppingMetrics = [
      'AUTO',
      'deviance',
      'logloss',
      'MSE',
      'AUC',
      'lift_top_group',
      'r2',
      'misclassification',
    ];
    const _gridStoppingMetric = Flow.Dataflow.signal(_gridStoppingMetrics[0]);
    const _gridStoppingTolerance = Flow.Dataflow.signal(0.001);
    const _parametersByLevel = lodash.groupBy(_parameters, parameter => parameter.level);
    const _controlGroups = lodash.map([
      'critical',
      'secondary',
      'expert',
    ], type => {
      const controls = lodash.filter(lodash.map(_parametersByLevel[type], createControlFromParameter), a => {
        if (a) {
          return true;
        }
        return false;
      });
      // Show/hide grid settings if any controls are grid-ified.
      lodash.forEach(controls, control => Flow.Dataflow.react(control.isGrided, () => {
        let isGrided;
        let _i;
        let _len;
        isGrided = false;
        for (_i = 0, _len = controls.length; _i < _len; _i++) {
          control = controls[_i];
          if (control.isGrided()) {
            _isGrided(isGrided = true);
            break;
          }
        }
        if (!isGrided) {
          return _isGrided(false);
        }
      }));
      return controls;
    });
    const criticalControls = _controlGroups[0];
    const secondaryControls = _controlGroups[1];
    const expertControls = _controlGroups[2];
    const _form = [];
    if (criticalControls.length) {
      _form.push({
        kind: 'group',
        title: 'Parameters',
      });
      for (_i = 0, _len = criticalControls.length; _i < _len; _i++) {
        control = criticalControls[_i];
        _form.push(control);
      }
    }
    if (secondaryControls.length) {
      _form.push({
        kind: 'group',
        title: 'Advanced',
      });
      for (_j = 0, _len1 = secondaryControls.length; _j < _len1; _j++) {
        control = secondaryControls[_j];
        _form.push(control);
      }
    }
    if (expertControls.length) {
      _form.push({
        kind: 'group',
        title: 'Expert',
      });
      for (_k = 0, _len2 = expertControls.length; _k < _len2; _k++) {
        control = expertControls[_k];
        _form.push(control);
      }
    }
    const findControl = name => {
      let controls;
      let _l;
      let _len3;
      let _len4;
      let _m;
      for (_l = 0, _len3 = _controlGroups.length; _l < _len3; _l++) {
        controls = _controlGroups[_l];
        for (_m = 0, _len4 = controls.length; _m < _len4; _m++) {
          control = controls[_m];
          if (control.name === name) {
            return control;
          }
        }
      }
    };
    const parameterTemplateOf = control => `flow-${control.kind}-model-parameter`;
    const findFormField = name => lodash.find(_form, field => field.name === name);
    ((() => {
      const _ref = lodash.map([
        'training_frame',
        'validation_frame',
        'response_column',
        'ignored_columns',
        'offset_column',
        'weights_column',
        'fold_column',
      ], findFormField);
      const trainingFrameParameter = _ref[0];
      const validationFrameParameter = _ref[1];
      const responseColumnParameter = _ref[2];
      const ignoredColumnsParameter = _ref[3];
      const offsetColumnsParameter = _ref[4];
      const weightsColumnParameter = _ref[5];
      const foldColumnParameter = _ref[6];
      if (trainingFrameParameter) {
        if (responseColumnParameter || ignoredColumnsParameter) {
          return Flow.Dataflow.act(trainingFrameParameter.value, frameKey => {
            if (frameKey) {
              _.requestFrameSummaryWithoutData(_, frameKey, (error, frame) => {
                let columnLabels;
                let columnValues;
                if (!error) {
                  columnValues = lodash.map(frame.columns, column => column.label);
                  columnLabels = lodash.map(frame.columns, column => {
                    const missingPercent = 100 * column.missing_count / frame.rows;
                    return {
                      type: column.type === 'enum' ? `enum(${column.domain_cardinality})` : column.type,
                      value: column.label,
                      missingPercent,
                      missingLabel: missingPercent === 0 ? '' : `${Math.round(missingPercent)}% NA`,
                    };
                  });
                  if (responseColumnParameter) {
                    responseColumnParameter.values(columnValues);
                  }
                  if (ignoredColumnsParameter) {
                    ignoredColumnsParameter.values(columnLabels);
                  }
                  if (weightsColumnParameter) {
                    weightsColumnParameter.values(columnValues);
                  }
                  if (foldColumnParameter) {
                    foldColumnParameter.values(columnValues);
                  }
                  if (offsetColumnsParameter) {
                    offsetColumnsParameter.values(columnValues);
                  }
                  if (responseColumnParameter && ignoredColumnsParameter) {
                    // Mark response column as 'unavailable' in ignored column list.
                    return Flow.Dataflow.lift(responseColumnParameter.value, responseVariableName => {
                      // FIXME
                      // ignoredColumnsParameter.unavailableValues [ responseVariableName ]
                    });
                  }
                }
              });
            }
          });
        }
      }
    })());
    const collectParameters = includeUnchangedParameters => {
      let controls;
      let entry;
      let gridStoppingRounds;
      let isGrided;
      let item;
      let maxModels;
      let maxRuntime;
      let searchCriteria;
      let selectedValues;
      let stoppingTolerance;
      let value;
      let _l;
      let _len3;
      let _len4;
      let _len5;
      let _m;
      let _n;
      let _ref;
      if (includeUnchangedParameters == null) {
        includeUnchangedParameters = false;
      }
      isGrided = false;
      const parameters = {};
      const hyperParameters = {};
      for (_l = 0, _len3 = _controlGroups.length; _l < _len3; _l++) {
        controls = _controlGroups[_l];
        for (_m = 0, _len4 = controls.length; _m < _len4; _m++) {
          control = controls[_m];
          if (control.isGrided()) {
            isGrided = true;
            switch (control.kind) {
              case 'textbox':
                hyperParameters[control.name] = control.valueGrided();
                break;
              case 'dropdown':
                hyperParameters[control.name] = selectedValues = [];
                _ref = control.gridedValues();
                for (_n = 0, _len5 = _ref.length; _n < _len5; _n++) {
                  item = _ref[_n];
                  if (item.value()) {
                    selectedValues.push(item.label);
                  }
                }
                break;
              default:
                // checkbox
                hyperParameters[control.name] = [
                  true,
                  false,
                ];
            }
          } else {
            value = control.value();
            if (control.isVisible() && (includeUnchangedParameters || control.isRequired || control.defaultValue !== value)) {
              switch (control.kind) {
                case 'dropdown':
                  if (value) {
                    parameters[control.name] = value;
                  }
                  break;
                case 'list':
                  if (value.length) {
                    selectedValues = (() => {
                      let _len6;
                      let _o;
                      const _results = [];
                      for (_o = 0, _len6 = value.length; _o < _len6; _o++) {
                        entry = value[_o];
                        if (entry.isSelected()) {
                          _results.push(entry.value);
                        }
                      }
                      return _results;
                    })();
                    parameters[control.name] = selectedValues;
                  }
                  break;
                default:
                  parameters[control.name] = value;
              }
            }
          }
        }
      }
      if (isGrided) {
        parameters.grid_id = _gridId();
        parameters.hyper_parameters = hyperParameters;
        // { 'strategy': "RandomDiscrete/Cartesian", 'max_models': 3, 'max_runtime_secs': 20 }
        searchCriteria = { strategy: _gridStrategy() };
        switch (searchCriteria.strategy) {
          case 'RandomDiscrete':
            maxModels = parseInt(_gridMaxModels(), 10);
            if (!lodash.isNaN(maxModels)) {
              searchCriteria.max_models = maxModels;
            }
            maxRuntime = parseInt(_gridMaxRuntime(), 10);
            if (!lodash.isNaN(maxRuntime)) {
              searchCriteria.max_runtime_secs = maxRuntime;
            }
            gridStoppingRounds = parseInt(_gridStoppingRounds(), 10);
            if (!lodash.isNaN(gridStoppingRounds)) {
              searchCriteria.stopping_rounds = gridStoppingRounds;
            }
            stoppingTolerance = parseFloat(_gridStoppingTolerance());
            if (!lodash.isNaN(stoppingTolerance)) {
              searchCriteria.stopping_tolerance = stoppingTolerance;
            }
            searchCriteria.stopping_metric = _gridStoppingMetric();
            break;
          default:
            // do nothing
        }
        parameters.search_criteria = searchCriteria;
      }
      return parameters;
    };
    //
    // The 'checkForErrors' parameter exists so that we can conditionally choose
    // to ignore validation errors. This is because we need the show/hide states
    // for each field the first time around, but not the errors/warnings/info
    // messages.
    //
    // Thus, when this function is called during form init, checkForErrors is
    //  passed in as 'false', and during form submission, checkForErrors is
    //  passsed in as 'true'.
    //
    const performValidations = (checkForErrors, go) => {
      _exception(null);
      const parameters = collectParameters(true);
      if (parameters.hyper_parameters) {
        // parameter validation fails with hyper_parameters, so skip.
        return go();
      }
      _validationFailureMessage('');
      return postModelInputValidationRequest(_, _algorithm, parameters, (error, modelBuilder) => {
        let controls;
        let hasErrors;
        let validation;
        let validations;
        let validationsByControlName;
        let _l;
        let _len3;
        let _len4;
        let _len5;
        let _m;
        let _n;
        if (error) {
          return _exception(Flow.failure(_, new Flow.Error('Error fetching initial model builder state', error)));
        }
        hasErrors = false;
        if (modelBuilder.messages.length) {
          validationsByControlName = lodash.groupBy(modelBuilder.messages, validation => validation.field_name);
          for (_l = 0, _len3 = _controlGroups.length; _l < _len3; _l++) {
            controls = _controlGroups[_l];
            for (_m = 0, _len4 = controls.length; _m < _len4; _m++) {
              control = controls[_m];
              validations = validationsByControlName[control.name];
              if (validations) {
                for (_n = 0, _len5 = validations.length; _n < _len5; _n++) {
                  validation = validations[_n];
                  if (validation.message_type === 'TRACE') {
                    control.isVisible(false);
                  } else {
                    control.isVisible(true);
                    if (checkForErrors) {
                      switch (validation.message_type) {
                        case 'INFO':
                          control.hasInfo(true);
                          control.message(validation.message);
                          break;
                        case 'WARN':
                          control.hasWarning(true);
                          control.message(validation.message);
                          break;
                        case 'ERRR':
                          control.hasError(true);
                          control.message(validation.message);
                          hasErrors = true;
                          break;
                        default:
                          // do nothing
                      }
                    }
                  }
                }
              } else {
                control.isVisible(true);
                control.hasInfo(false);
                control.hasWarning(false);
                control.hasError(false);
                control.message('');
              }
            }
          }
        }
        if (hasErrors) {
          // Do not pass go(). Do not collect $200.
          return _validationFailureMessage('Your model parameters have one or more errors. Please fix them and try again.');
        }
        // Proceed with form submission
        _validationFailureMessage('');
        return go();
      });
    };
    const createModel = () => {
      _exception(null);
      return performValidations(true, () => {
        const parameters = collectParameters(false);
        return _.insertAndExecuteCell('cs', `buildModel \'${_algorithm}\', ${flowPrelude.stringify(parameters)}`);
      });
    };
    const _revalidate = value => {
      // HACK: ko seems to be raising change notifications when dropdown boxes are initialized.
      if (value !== void 0) {
        return performValidations(false, () => {
        });
      }
    };
    const revalidate = lodash.throttle(_revalidate, 100, { leading: false });

    // Kick off validations (minus error checking) to get hidden parameters
    performValidations(false, () => {
      let controls;
      let _l;
      let _len3;
      let _len4;
      let _m;
      for (_l = 0, _len3 = _controlGroups.length; _l < _len3; _l++) {
        controls = _controlGroups[_l];
        for (_m = 0, _len4 = controls.length; _m < _len4; _m++) {
          control = controls[_m];
          Flow.Dataflow.react(control.value, revalidate);
        }
      }
    });
    return {
      form: _form,
      isGrided: _isGrided,
      gridId: _gridId,
      gridStrategy: _gridStrategy,
      gridStrategies: _gridStrategies,
      isGridRandomDiscrete: _isGridRandomDiscrete,
      gridMaxModels: _gridMaxModels,
      gridMaxRuntime: _gridMaxRuntime,
      gridStoppingRounds: _gridStoppingRounds,
      gridStoppingMetrics: _gridStoppingMetrics,
      gridStoppingMetric: _gridStoppingMetric,
      gridStoppingTolerance: _gridStoppingTolerance,
      exception: _exception,
      parameterTemplateOf,
      createModel,
      hasValidationFailures: _hasValidationFailures,
      validationFailureMessage: _validationFailureMessage,
    };
  };
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
          return populateFramesAndColumns(frameKey, algorithm, parameters, () => _modelForm(H2O.modelBuilderForm(_, algorithm, parameters)));
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
