import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function modelInput() {
  var lodash = window._;
  var Flow = window.Flow;
  var createCheckboxControl;
  var createControl;
  var createControlFromParameter;
  var createDropdownControl;
  var createGridableValues;
  var createListControl;
  var createTextboxControl;
  createControl = function (kind, parameter) {
    var _hasError;
    var _hasInfo;
    var _hasMessage;
    var _hasWarning;
    var _isGrided;
    var _isNotGrided;
    var _isVisible;
    var _message;
    _hasError = Flow.Dataflow.signal(false);
    _hasWarning = Flow.Dataflow.signal(false);
    _hasInfo = Flow.Dataflow.signal(false);
    _message = Flow.Dataflow.signal('');
    _hasMessage = Flow.Dataflow.lift(_message, function (message) {
      if (message) {
        return true;
      }
      return false;
    });
    _isVisible = Flow.Dataflow.signal(true);
    _isGrided = Flow.Dataflow.signal(false);
    _isNotGrided = Flow.Dataflow.lift(_isGrided, function (value) {
      return !value;
    });
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
      isNotGrided: _isNotGrided
    };
  };
  createTextboxControl = function (parameter, type) {
    var control;
    var isArrayValued;
    var isInt;
    var isReal;
    var textToValues;
    var _ref;
    var _ref1;
    var _text;
    var _textGrided;
    var _value;
    var _valueGrided;
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
    }
    _text = Flow.Dataflow.signal(isArrayValued ? ((_ref = parameter.actual_value) != null ? _ref : []).join(', ') : (_ref1 = parameter.actual_value) != null ? _ref1 : '');
    _textGrided = Flow.Dataflow.signal(`${_text()};`);
    textToValues = function (text) {
      var parsed;
      var vals;
      var value;
      var _i;
      var _len;
      var _ref2;
      if (isArrayValued) {
        vals = [];
        _ref2 = text.split(/\s*,\s*/g);
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          value = _ref2[_i];
          if (isInt) {
            if (!lodash.isNaN(parsed = parseInt(value, 10))) {
              vals.push(parsed);
            }
          } else if (isReal) {
            if (!lodash.isNaN(parsed = parseFloat(value))) {
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
    _value = Flow.Dataflow.lift(_text, textToValues);
    _valueGrided = Flow.Dataflow.lift(_textGrided, function (text) {
      var part;
      var token;
      var _i;
      var _len;
      var _ref2;
      lodash.values = [];
      _ref2 = (`${text}`).split(/\s*;\s*/g);
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        part = _ref2[_i];
        if (token = part.trim()) {
          lodash.values.push(textToValues(token));
        }
      }
      return lodash.values;
    });
    control = createControl('textbox', parameter);
    control.text = _text;
    control.textGrided = _textGrided;
    control.value = _value;
    control.valueGrided = _valueGrided;
    control.isArrayValued = isArrayValued;
    return control;
  };
  createGridableValues = function (values, defaultValue) {
    return lodash.map(values, function (value) {
      return {
        label: value,
        value: Flow.Dataflow.signal(true)
      };
    });
  };
  createDropdownControl = function (parameter) {
    var control;
    var _value;
    _value = Flow.Dataflow.signal(parameter.actual_value);
    control = createControl('dropdown', parameter);
    control.values = Flow.Dataflow.signals(parameter.values);
    control.value = _value;
    control.gridedValues = Flow.Dataflow.lift(control.values, function (values) {
      return createGridableValues(values);
    });
    return control;
  };
  createListControl = function (parameter) {
    var MaxItemsPerPage;
    var blockSelectionUpdates;
    var changeSelection;
    var control;
    var createEntry;
    var deselectFiltered;
    var filterItems;
    var goToNextPage;
    var goToPreviousPage;
    var incrementSelectionCount;
    var selectFiltered;
    var _canGoToNextPage;
    var _canGoToPreviousPage;
    var _currentPage;
    var _entries;
    var _filteredItems;
    var _hasFilteredItems;
    var _ignoreNATerm;
    var _isUpdatingSelectionCount;
    var _lastUsedIgnoreNaTerm;
    var _lastUsedSearchTerm;
    var _maxPages;
    var _searchCaption;
    var _searchTerm;
    var _selectionCount;
    var _values;
    var _visibleItems;
    MaxItemsPerPage = 100;
    _searchTerm = Flow.Dataflow.signal('');
    _ignoreNATerm = Flow.Dataflow.signal('');
    _values = Flow.Dataflow.signal([]);
    _selectionCount = Flow.Dataflow.signal(0);
    _isUpdatingSelectionCount = false;
    blockSelectionUpdates = function (f) {
      _isUpdatingSelectionCount = true;
      f();
      return _isUpdatingSelectionCount = false;
    };
    incrementSelectionCount = function (amount) {
      return _selectionCount(_selectionCount() + amount);
    };
    createEntry = function (value) {
      var isSelected;
      isSelected = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(isSelected, function (isSelected) {
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
        missingPercent: value.missingPercent
      };
    };
    _entries = Flow.Dataflow.lift(_values, function (values) {
      return lodash.map(values, createEntry);
    });
    _filteredItems = Flow.Dataflow.signal([]);
    _visibleItems = Flow.Dataflow.signal([]);
    _hasFilteredItems = Flow.Dataflow.lift(_filteredItems, function (entries) {
      return entries.length > 0;
    });
    _currentPage = Flow.Dataflow.signal(0);
    _maxPages = Flow.Dataflow.lift(_filteredItems, function (entries) {
      return Math.ceil(entries.length / MaxItemsPerPage);
    });
    _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, function (index) {
      return index > 0;
    });
    _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, function (maxPages, index) {
      return index < maxPages - 1;
    });
    _searchCaption = Flow.Dataflow.lift(_entries, _filteredItems, _selectionCount, _currentPage, _maxPages, function (entries, filteredItems, selectionCount, currentPage, maxPages) {
      var caption;
      caption = maxPages === 0 ? '' : `Showing page ${(currentPage + 1)} of ${maxPages}.`;
      if (filteredItems.length !== entries.length) {
        caption += ` Filtered ${filteredItems.length} of ${entries.length}.`;
      }
      if (selectionCount !== 0) {
        caption += ` ${selectionCount} ignored.`;
      }
      return caption;
    });
    Flow.Dataflow.react(_entries, function () {
      return filterItems(true);
    });
    _lastUsedSearchTerm = null;
    _lastUsedIgnoreNaTerm = null;
    filterItems = function (force) {
      var entry;
      var filteredItems;
      var hide;
      var i;
      var ignoreNATerm;
      var missingPercent;
      var searchTerm;
      var start;
      var _i;
      var _len;
      var _ref;
      if (force == null) {
        force = false;
      }
      searchTerm = _searchTerm().trim();
      ignoreNATerm = _ignoreNATerm().trim();
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
      start = _currentPage() * MaxItemsPerPage;
      _visibleItems(_filteredItems().slice(start, start + MaxItemsPerPage));
    };
    changeSelection = function (source, value) {
      var entry;
      var _i;
      var _len;
      for (_i = 0, _len = source.length; _i < _len; _i++) {
        entry = source[_i];
        entry.isSelected(value);
      }
    };
    selectFiltered = function () {
      var entries;
      entries = _filteredItems();
      blockSelectionUpdates(function () {
        return changeSelection(entries, true);
      });
      return _selectionCount(entries.length);
    };
    deselectFiltered = function () {
      blockSelectionUpdates(function () {
        return changeSelection(_filteredItems(), false);
      });
      return _selectionCount(0);
    };
    goToPreviousPage = function () {
      if (_canGoToPreviousPage()) {
        _currentPage(_currentPage() - 1);
        filterItems();
      }
    };
    goToNextPage = function () {
      if (_canGoToNextPage()) {
        _currentPage(_currentPage() + 1);
        filterItems();
      }
    };
    Flow.Dataflow.react(_searchTerm, lodash.throttle(filterItems, 500));
    Flow.Dataflow.react(_ignoreNATerm, lodash.throttle(filterItems, 500));
    control = createControl('list', parameter);
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
  createCheckboxControl = function (parameter) {
    var control;
    var _value;
    _value = Flow.Dataflow.signal(parameter.actual_value);
    control = createControl('checkbox', parameter);
    control.clientId = lodash.uniqueId();
    control.value = _value;
    return control;
  };
  createControlFromParameter = function (parameter) {
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
  H2O.ModelBuilderForm = function (_, _algorithm, _parameters) {
    var collectParameters;
    var control;
    var createModel;
    var criticalControls;
    var expertControls;
    var findControl;
    var findFormField;
    var parameterTemplateOf;
    var performValidations;
    var revalidate;
    var secondaryControls;
    var _controlGroups;
    var _exception;
    var _form;
    var _gridId;
    var _gridMaxModels;
    var _gridMaxRuntime;
    var _gridStoppingMetric;
    var _gridStoppingMetrics;
    var _gridStoppingRounds;
    var _gridStoppingTolerance;
    var _gridStrategies;
    var _gridStrategy;
    var _hasValidationFailures;
    var _i;
    var _isGridRandomDiscrete;
    var _isGrided;
    var _j;
    var _k;
    var _len;
    var _len1;
    var _len2;
    var _parametersByLevel;
    var _revalidate;
    var _validationFailureMessage;
    _exception = Flow.Dataflow.signal(null);
    _validationFailureMessage = Flow.Dataflow.signal('');
    _hasValidationFailures = Flow.Dataflow.lift(_validationFailureMessage, flowPrelude.isTruthy);
    _gridStrategies = [
      'Cartesian',
      'RandomDiscrete'
    ];
    _isGrided = Flow.Dataflow.signal(false);
    _gridId = Flow.Dataflow.signal(`grid-${Flow.Util.uuid()}`);
    _gridStrategy = Flow.Dataflow.signal('Cartesian');
    _isGridRandomDiscrete = Flow.Dataflow.lift(_gridStrategy, function (strategy) {
      return strategy !== _gridStrategies[0];
    });
    _gridMaxModels = Flow.Dataflow.signal(1000);
    _gridMaxRuntime = Flow.Dataflow.signal(28800);
    _gridStoppingRounds = Flow.Dataflow.signal(0);
    _gridStoppingMetrics = [
      'AUTO',
      'deviance',
      'logloss',
      'MSE',
      'AUC',
      'lift_top_group',
      'r2',
      'misclassification'
    ];
    _gridStoppingMetric = Flow.Dataflow.signal(_gridStoppingMetrics[0]);
    _gridStoppingTolerance = Flow.Dataflow.signal(0.001);
    _parametersByLevel = lodash.groupBy(_parameters, function (parameter) {
      return parameter.level;
    });
    _controlGroups = lodash.map([
      'critical',
      'secondary',
      'expert'
    ], function (type) {
      var controls;
      controls = lodash.filter(lodash.map(_parametersByLevel[type], createControlFromParameter), function (a) {
        if (a) {
          return true;
        }
        return false;
      });
      lodash.forEach(controls, function (control) {
        return Flow.Dataflow.react(control.isGrided, function () {
          var isGrided;
          var _i;
          var _len;
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
        });
      });
      return controls;
    });
    criticalControls = _controlGroups[0], secondaryControls = _controlGroups[1], expertControls = _controlGroups[2];
    _form = [];
    if (criticalControls.length) {
      _form.push({
        kind: 'group',
        title: 'Parameters'
      });
      for (_i = 0, _len = criticalControls.length; _i < _len; _i++) {
        control = criticalControls[_i];
        _form.push(control);
      }
    }
    if (secondaryControls.length) {
      _form.push({
        kind: 'group',
        title: 'Advanced'
      });
      for (_j = 0, _len1 = secondaryControls.length; _j < _len1; _j++) {
        control = secondaryControls[_j];
        _form.push(control);
      }
    }
    if (expertControls.length) {
      _form.push({
        kind: 'group',
        title: 'Expert'
      });
      for (_k = 0, _len2 = expertControls.length; _k < _len2; _k++) {
        control = expertControls[_k];
        _form.push(control);
      }
    }
    findControl = function (name) {
      var controls;
      var _l;
      var _len3;
      var _len4;
      var _m;
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
    parameterTemplateOf = function (control) {
      return `flow-${control.kind}-model-parameter`;
    };
    findFormField = function (name) {
      return lodash.find(_form, function (field) {
        return field.name === name;
      });
    };
    (function () {
      var foldColumnParameter;
      var ignoredColumnsParameter;
      var offsetColumnsParameter;
      var responseColumnParameter;
      var trainingFrameParameter;
      var validationFrameParameter;
      var weightsColumnParameter;
      var _ref;
      _ref = lodash.map([
        'training_frame',
        'validation_frame',
        'response_column',
        'ignored_columns',
        'offset_column',
        'weights_column',
        'fold_column'
      ], findFormField), trainingFrameParameter = _ref[0], validationFrameParameter = _ref[1], responseColumnParameter = _ref[2], ignoredColumnsParameter = _ref[3], offsetColumnsParameter = _ref[4], weightsColumnParameter = _ref[5], foldColumnParameter = _ref[6];
      if (trainingFrameParameter) {
        if (responseColumnParameter || ignoredColumnsParameter) {
          return Flow.Dataflow.act(trainingFrameParameter.value, function (frameKey) {
            if (frameKey) {
              _.requestFrameSummaryWithoutData(frameKey, function (error, frame) {
                var columnLabels;
                var columnValues;
                if (!error) {
                  columnValues = lodash.map(frame.columns, function (column) {
                    return column.label;
                  });
                  columnLabels = lodash.map(frame.columns, function (column) {
                    var missingPercent;
                    missingPercent = 100 * column.missing_count / frame.rows;
                    return {
                      type: column.type === 'enum' ? `enum(${column.domain_cardinality})` : column.type,
                      value: column.label,
                      missingPercent,
                      missingLabel: missingPercent === 0 ? '' : `${Math.round(missingPercent)}% NA`
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
                    return Flow.Dataflow.lift(responseColumnParameter.value, function (responseVariableName) {
                    });
                  }
                }
              });
            }
          });
        }
      }
    }());
    collectParameters = function (includeUnchangedParameters) {
      var controls;
      var entry;
      var gridStoppingRounds;
      var hyperParameters;
      var isGrided;
      var item;
      var maxModels;
      var maxRuntime;
      var parameters;
      var searchCriteria;
      var selectedValues;
      var stoppingTolerance;
      var value;
      var _l;
      var _len3;
      var _len4;
      var _len5;
      var _m;
      var _n;
      var _ref;
      if (includeUnchangedParameters == null) {
        includeUnchangedParameters = false;
      }
      isGrided = false;
      parameters = {};
      hyperParameters = {};
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
                hyperParameters[control.name] = [
                  true,
                  false
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
                    selectedValues = function () {
                      var _len6;
                      var _o;
                      var _results;
                      _results = [];
                      for (_o = 0, _len6 = value.length; _o < _len6; _o++) {
                        entry = value[_o];
                        if (entry.isSelected()) {
                          _results.push(entry.value);
                        }
                      }
                      return _results;
                    }();
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
        searchCriteria = { strategy: _gridStrategy() };
        switch (searchCriteria.strategy) {
          case 'RandomDiscrete':
            if (!lodash.isNaN(maxModels = parseInt(_gridMaxModels(), 10))) {
              searchCriteria.max_models = maxModels;
            }
            if (!lodash.isNaN(maxRuntime = parseInt(_gridMaxRuntime(), 10))) {
              searchCriteria.max_runtime_secs = maxRuntime;
            }
            if (!lodash.isNaN(gridStoppingRounds = parseInt(_gridStoppingRounds(), 10))) {
              searchCriteria.stopping_rounds = gridStoppingRounds;
            }
            if (!lodash.isNaN(stoppingTolerance = parseFloat(_gridStoppingTolerance()))) {
              searchCriteria.stopping_tolerance = stoppingTolerance;
            }
            searchCriteria.stopping_metric = _gridStoppingMetric();
        }
        parameters.search_criteria = searchCriteria;
      }
      return parameters;
    };
    performValidations = function (checkForErrors, go) {
      var parameters;
      _exception(null);
      parameters = collectParameters(true);
      if (parameters.hyper_parameters) {
        return go();
      }
      _validationFailureMessage('');
      return _.requestModelInputValidation(_algorithm, parameters, function (error, modelBuilder) {
        var controls;
        var hasErrors;
        var validation;
        var validations;
        var validationsByControlName;
        var _l;
        var _len3;
        var _len4;
        var _len5;
        var _m;
        var _n;
        if (error) {
          return _exception(Flow.Failure(_, new Flow.Error('Error fetching initial model builder state', error)));
        }
        hasErrors = false;
        if (modelBuilder.messages.length) {
          validationsByControlName = lodash.groupBy(modelBuilder.messages, function (validation) {
            return validation.field_name;
          });
          for (_l = 0, _len3 = _controlGroups.length; _l < _len3; _l++) {
            controls = _controlGroups[_l];
            for (_m = 0, _len4 = controls.length; _m < _len4; _m++) {
              control = controls[_m];
              if (validations = validationsByControlName[control.name]) {
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
          return _validationFailureMessage('Your model parameters have one or more errors. Please fix them and try again.');
        }
        _validationFailureMessage('');
        return go();
      });
    };
    createModel = function () {
      _exception(null);
      return performValidations(true, function () {
        var parameters;
        parameters = collectParameters(false);
        return _.insertAndExecuteCell('cs', `buildModel \'${_algorithm}\', ${flowPrelude.stringify(parameters)}`);
      });
    };
    _revalidate = function (value) {
      if (value !== void 0) {
        return performValidations(false, function () {
        });
      }
    };
    revalidate = lodash.throttle(_revalidate, 100, { leading: false });
    performValidations(false, function () {
      var controls;
      var _l;
      var _len3;
      var _len4;
      var _m;
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
      validationFailureMessage: _validationFailureMessage
    };
  };
  H2O.ModelInput = function (_, _go, _algo, _opts) {
    var createModel;
    var populateFramesAndColumns;
    var _algorithm;
    var _algorithms;
    var _canCreateModel;
    var _exception;
    var _modelForm;
    _exception = Flow.Dataflow.signal(null);
    _algorithms = Flow.Dataflow.signal([]);
    _algorithm = Flow.Dataflow.signal(null);
    _canCreateModel = Flow.Dataflow.lift(_algorithm, function (algorithm) {
      if (algorithm) {
        return true;
      }
      return false;
    });
    _modelForm = Flow.Dataflow.signal(null);
    populateFramesAndColumns = function (frameKey, algorithm, parameters, go) {
      var classificationParameter;
      var destinationKeyParameter;
      destinationKeyParameter = lodash.find(parameters, function (parameter) {
        return parameter.name === 'model_id';
      });
      if (destinationKeyParameter && !destinationKeyParameter.actual_value) {
        destinationKeyParameter.actual_value = `${algorithm}-${Flow.Util.uuid()}`;
      }
      classificationParameter = lodash.find(parameters, function (parameter) {
        return parameter.name === 'do_classification';
      });
      if (classificationParameter) {
        classificationParameter.actual_value = true;
      }
      return _.requestFrames(function (error, frames) {
        var frame;
        var frameKeys;
        var frameParameters;
        var parameter;
        var _i;
        var _len;
        if (error) {
          // empty
        } else {
          frameKeys = function () {
            var _i;
            var _len;
            var _results;
            _results = [];
            for (_i = 0, _len = frames.length; _i < _len; _i++) {
              frame = frames[_i];
              _results.push(frame.frame_id.name);
            }
            return _results;
          }();
          frameParameters = lodash.filter(parameters, function (parameter) {
            return parameter.type === 'Key<Frame>';
          });
          for (_i = 0, _len = frameParameters.length; _i < _len; _i++) {
            parameter = frameParameters[_i];
            parameter.values = frameKeys;
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
    (function () {
      return _.requestModelBuilders(function (error, modelBuilders) {
        var frameKey;
        _algorithms(modelBuilders);
        _algorithm(_algo ? lodash.find(modelBuilders, function (builder) {
          return builder.algo === _algo;
        }) : void 0);
        frameKey = _opts != null ? _opts.training_frame : void 0;
        return Flow.Dataflow.act(_algorithm, function (builder) {
          var algorithm;
          var parameters;
          if (builder) {
            algorithm = builder.algo;
            parameters = flowPrelude.deepClone(builder.parameters);
            return populateFramesAndColumns(frameKey, algorithm, parameters, function () {
              return _modelForm(H2O.ModelBuilderForm(_, algorithm, parameters));
            });
          }
          return _modelForm(null);
        });
      });
    }());
    createModel = function () {
      return _modelForm().createModel();
    };
    lodash.defer(_go);
    return {
      parentException: _exception,
      algorithms: _algorithms,
      algorithm: _algorithm,
      modelForm: _modelForm,
      canCreateModel: _canCreateModel,
      createModel,
      template: 'flow-model-input'
    };
  };
}