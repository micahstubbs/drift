import { requestModelBuilders } from '../h2oProxy/requestModelBuilders';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function modelInput() {
  const lodash = window._;
  const Flow = window.Flow;
  const H2O = window.H2O;
  const createControl = (kind, parameter) => {
    const _hasError = Flow.Dataflow.signal(false);
    const _hasWarning = Flow.Dataflow.signal(false);
    const _hasInfo = Flow.Dataflow.signal(false);
    const _message = Flow.Dataflow.signal('');
    const _hasMessage = Flow.Dataflow.lift(_message, message => {
      if (message) {
        return true;
      }
      return false;
    });
    const _isVisible = Flow.Dataflow.signal(true);
    const _isGrided = Flow.Dataflow.signal(false);
    const _isNotGrided = Flow.Dataflow.lift(_isGrided, value => !value);
    return {
      kind,
      name: parameter.name,
      label: parameter.label,
      description: parameter.help,
      isRequired: parameter.required,
      hasError: _hasError,
      hasWarning: _hasWarning,
      hasInfo: _hasInfo,
      message: _message,
      hasMessage: _hasMessage,
      isVisible: _isVisible,
      isGridable: parameter.gridable,
      isGrided: _isGrided,
      isNotGrided: _isNotGrided,
    };
  };
  const createTextboxControl = (parameter, type) => {
    let isArrayValued;
    let isInt;
    let isReal;
    isArrayValued = isInt = isReal = false;
    switch (type) {
      case 'byte[]':
      case 'short[]':
      case 'int[]':
      case 'long[]':
        isArrayValued = true;
        isInt = true;
        break;
      case 'float[]':
      case 'double[]':
        isArrayValued = true;
        isReal = true;
        break;
      case 'byte':
      case 'short':
      case 'int':
      case 'long':
        isInt = true;
        break;
      case 'float':
      case 'double':
        isReal = true;
        break;
      default:
        // do nothing
    }
    const _ref = parameter.actual_value;
    const _ref1 = parameter.actual_value;
    const _text = Flow.Dataflow.signal(isArrayValued ? (_ref != null ? _ref : []).join(', ') : _ref1 != null ? _ref1 : '');
    const _textGrided = Flow.Dataflow.signal(`${_text()};`);
    const textToValues = text => {
      let parsed;
      let vals;
      let value;
      let _i;
      let _len;
      let _ref2;
      if (isArrayValued) {
        vals = [];
        _ref2 = text.split(/\s*,\s*/g);
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          value = _ref2[_i];
          if (isInt) {
            parsed = parseInt(value, 10);
            if (!lodash.isNaN(parsed)) {
              vals.push(parsed);
            }
          } else if (isReal) {
            parsed = parseFloat(value);
            if (!lodash.isNaN(parsed)) {
              vals.push(parsed);
            }
          } else {
            vals.push(value);
          }
        }
        return vals;
      }
      return text;
    };
    const _value = Flow.Dataflow.lift(_text, textToValues);
    const _valueGrided = Flow.Dataflow.lift(_textGrided, text => {
      let part;
      let token;
      let _i;
      let _len;
      lodash.values = [];
      const _ref2 = (`${text}`).split(/\s*;\s*/g);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        part = _ref2[_i];
        token = part.trim();
        if (token) {
          lodash.values.push(textToValues(token));
        }
      }
      return lodash.values;
    });
    const control = createControl('textbox', parameter);
    control.text = _text;
    control.textGrided = _textGrided;
    control.value = _value;
    control.valueGrided = _valueGrided;
    control.isArrayValued = isArrayValued;
    return control;
  };
  const createGridableValues = (values, defaultValue) => lodash.map(values, value => ({
    label: value,
    value: Flow.Dataflow.signal(true),
  }));
  const createDropdownControl = parameter => {
    const _value = Flow.Dataflow.signal(parameter.actual_value);
    const control = createControl('dropdown', parameter);
    control.values = Flow.Dataflow.signals(parameter.values);
    control.value = _value;
    control.gridedValues = Flow.Dataflow.lift(control.values, values => createGridableValues(values));
    return control;
  };
  const createListControl = parameter => {
    let _isUpdatingSelectionCount;
    let _lastUsedIgnoreNaTerm;
    let _lastUsedSearchTerm;
    const MaxItemsPerPage = 100;
    const _searchTerm = Flow.Dataflow.signal('');
    const _ignoreNATerm = Flow.Dataflow.signal('');
    const _values = Flow.Dataflow.signal([]);
    const _selectionCount = Flow.Dataflow.signal(0);
    _isUpdatingSelectionCount = false;
    const blockSelectionUpdates = f => {
      _isUpdatingSelectionCount = true;
      f();
      _isUpdatingSelectionCount = false;
      return _isUpdatingSelectionCount;
    };
    const incrementSelectionCount = amount => _selectionCount(_selectionCount() + amount);
    const createEntry = value => {
      const isSelected = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(isSelected, isSelected => {
        if (!_isUpdatingSelectionCount) {
          if (isSelected) {
            incrementSelectionCount(1);
          } else {
            incrementSelectionCount(-1);
          }
        }
      });
      return {
        isSelected,
        value: value.value,
        type: value.type,
        missingLabel: value.missingLabel,
        missingPercent: value.missingPercent,
      };
    };
    const _entries = Flow.Dataflow.lift(_values, values => lodash.map(values, createEntry));
    const _filteredItems = Flow.Dataflow.signal([]);
    const _visibleItems = Flow.Dataflow.signal([]);
    const _hasFilteredItems = Flow.Dataflow.lift(_filteredItems, entries => entries.length > 0);
    const _currentPage = Flow.Dataflow.signal(0);
    const _maxPages = Flow.Dataflow.lift(_filteredItems, entries => Math.ceil(entries.length / MaxItemsPerPage));
    const _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, index => index > 0);
    const _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, (maxPages, index) => index < maxPages - 1);
    const _searchCaption = Flow.Dataflow.lift(_entries, _filteredItems, _selectionCount, _currentPage, _maxPages, (entries, filteredItems, selectionCount, currentPage, maxPages) => {
      let caption;
      caption = maxPages === 0 ? '' : `Showing page ${(currentPage + 1)} of ${maxPages}.`;
      if (filteredItems.length !== entries.length) {
        caption += ` Filtered ${filteredItems.length} of ${entries.length}.`;
      }
      if (selectionCount !== 0) {
        caption += ` ${selectionCount} ignored.`;
      }
      return caption;
    });
    Flow.Dataflow.react(_entries, () => filterItems(true));
    _lastUsedSearchTerm = null;
    _lastUsedIgnoreNaTerm = null;
    const filterItems = force => {
      let entry;
      let filteredItems;
      let hide;
      let i;
      let missingPercent;
      let _i;
      let _len;
      let _ref;
      if (force == null) {
        force = false;
      }
      const searchTerm = _searchTerm().trim();
      const ignoreNATerm = _ignoreNATerm().trim();
      if (force || searchTerm !== _lastUsedSearchTerm || ignoreNATerm !== _lastUsedIgnoreNaTerm) {
        filteredItems = [];
        _ref = _entries();
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          entry = _ref[i];
          missingPercent = parseFloat(ignoreNATerm);
          hide = false;
          if (searchTerm !== '' && entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1) {
            hide = true;
          } else if (!lodash.isNaN(missingPercent) && missingPercent !== 0 && entry.missingPercent <= missingPercent) {
            hide = true;
          }
          if (!hide) {
            filteredItems.push(entry);
          }
        }
        _lastUsedSearchTerm = searchTerm;
        _lastUsedIgnoreNaTerm = ignoreNATerm;
        _currentPage(0);
        _filteredItems(filteredItems);
      }
      const start = _currentPage() * MaxItemsPerPage;
      _visibleItems(_filteredItems().slice(start, start + MaxItemsPerPage));
    };
    const changeSelection = (source, value) => {
      let entry;
      let _i;
      let _len;
      for (_i = 0, _len = source.length; _i < _len; _i++) {
        entry = source[_i];
        entry.isSelected(value);
      }
    };
    const selectFiltered = () => {
      const entries = _filteredItems();
      blockSelectionUpdates(() => changeSelection(entries, true));
      return _selectionCount(entries.length);
    };
    const deselectFiltered = () => {
      blockSelectionUpdates(() => changeSelection(_filteredItems(), false));
      return _selectionCount(0);
    };
    const goToPreviousPage = () => {
      if (_canGoToPreviousPage()) {
        _currentPage(_currentPage() - 1);
        filterItems();
      }
    };
    const goToNextPage = () => {
      if (_canGoToNextPage()) {
        _currentPage(_currentPage() + 1);
        filterItems();
      }
    };
    Flow.Dataflow.react(_searchTerm, lodash.throttle(filterItems, 500));
    Flow.Dataflow.react(_ignoreNATerm, lodash.throttle(filterItems, 500));
    const control = createControl('list', parameter);
    control.values = _values;
    control.entries = _visibleItems;
    control.hasFilteredItems = _hasFilteredItems;
    control.searchCaption = _searchCaption;
    control.searchTerm = _searchTerm;
    control.ignoreNATerm = _ignoreNATerm;
    control.value = _entries;
    control.selectFiltered = selectFiltered;
    control.deselectFiltered = deselectFiltered;
    control.goToPreviousPage = goToPreviousPage;
    control.goToNextPage = goToNextPage;
    control.canGoToPreviousPage = _canGoToPreviousPage;
    control.canGoToNextPage = _canGoToNextPage;
    return control;
  };
  const createCheckboxControl = parameter => {
    const _value = Flow.Dataflow.signal(parameter.actual_value);
    const control = createControl('checkbox', parameter);
    control.clientId = lodash.uniqueId();
    control.value = _value;
    return control;
  };
  const createControlFromParameter = parameter => {
    switch (parameter.type) {
      case 'enum':
      case 'Key<Frame>':
      case 'VecSpecifier':
        return createDropdownControl(parameter);
      case 'string[]':
      case 'Key<Frame>[]':
      case 'Key<Model>[]':
        return createListControl(parameter);
      case 'boolean':
        return createCheckboxControl(parameter);
      case 'Key<Model>':
      case 'string':
      case 'byte':
      case 'short':
      case 'int':
      case 'long':
      case 'float':
      case 'double':
      case 'byte[]':
      case 'short[]':
      case 'int[]':
      case 'long[]':
      case 'float[]':
      case 'double[]':
        return createTextboxControl(parameter, parameter.type);
      default:
        console.error('Invalid field', JSON.stringify(parameter, null, 2));
        return null;
    }
  };
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
      return _.requestModelInputValidation(_algorithm, parameters, (error, modelBuilder) => {
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
