(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, function () { 'use strict';

  function flowPreludeFunction() {
    var Flow = window.Flow;
    var _always;
    var _copy;
    var _deepClone;
    var _isDefined;
    var _isFalsy;
    var _isTruthy;
    var _negative;
    var _never;
    var _remove;
    var _repeat;
    var _typeOf;
    var _words;
    _isDefined = value => !lodash.isUndefined(value);
    _isTruthy = value => {
      if (value) {
        return true;
      }
      return false;
    };
    _isFalsy = value => {
      if (value) {
        return false;
      }
      return true;
    };
    _negative = value => !value;
    _always = () => true;
    _never = () => false;
    _copy = array => array.slice(0);
    _remove = (array, element) => {
      var index;
      if ((index = lodash.indexOf(array, element)) > -1) {
        return lodash.head(array.splice(index, 1));
      }
      return void 0;
    };
    _words = text => text.split(/\s+/);
    _repeat = (count, value) => {
      var array;
      var i;
      var _i;
      array = [];
      for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
        array.push(value);
      }
      return array;
    };
    _typeOf = a => {
      var type;
      type = Object.prototype.toString.call(a);
      if (a === null) {
        return 'null';
      } else if (a === void 0) {
        return 'undefined';
      } else if (a === true || a === false || type === '[object Boolean]') {
        return 'Boolean';
      }
      switch (type) {
        case '[object String]':
          return 'String';
        case '[object Number]':
          return 'Number';
        case '[object Function]':
          return 'Function';
        case '[object Object]':
          return 'Object';
        case '[object Array]':
          return 'Array';
        case '[object Arguments]':
          return 'Arguments';
        case '[object Date]':
          return 'Date';
        case '[object RegExp]':
          return 'RegExp';
        case '[object Error]':
          return 'Error';
        default:
          return type;
      }
    };
    _deepClone = obj => JSON.parse(JSON.stringify(obj));
    return {
      isDefined: _isDefined,
      isTruthy: _isTruthy,
      isFalsy: _isFalsy,
      negative: _negative,
      always: _always,
      never: _never,
      copy: _copy,
      remove: _remove,
      words: _words,
      repeat: _repeat,
      typeOf: _typeOf,
      deepClone: _deepClone,
      stringify: JSON.stringify
    };
  }

  const flowPrelude$2 = flowPreludeFunction();

  const flowPrelude$3 = flowPreludeFunction();

  function modelInput() {
    var lodash = window._;
    var Flow = window.Flow;
    var createCheckboxControl;
    var createControl;
    var createControlFromParameter;
    var createDropdownControl;
    var createGridableValues;
    var createListControl;
    var createTextboxControl;
    createControl = (kind, parameter) => {
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
      _hasMessage = Flow.Dataflow.lift(_message, message => {
        if (message) {
          return true;
        }
        return false;
      });
      _isVisible = Flow.Dataflow.signal(true);
      _isGrided = Flow.Dataflow.signal(false);
      _isNotGrided = Flow.Dataflow.lift(_isGrided, value => !value);
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
    createTextboxControl = (parameter, type) => {
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
      _textGrided = Flow.Dataflow.signal(`${ _text() };`);
      textToValues = text => {
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
      _valueGrided = Flow.Dataflow.lift(_textGrided, text => {
        var part;
        var token;
        var _i;
        var _len;
        var _ref2;
        lodash.values = [];
        _ref2 = `${ text }`.split(/\s*;\s*/g);
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
    createGridableValues = (values, defaultValue) => lodash.map(values, value => ({
      label: value,
      value: Flow.Dataflow.signal(true)
    }));
    createDropdownControl = parameter => {
      var control;
      var _value;
      _value = Flow.Dataflow.signal(parameter.actual_value);
      control = createControl('dropdown', parameter);
      control.values = Flow.Dataflow.signals(parameter.values);
      control.value = _value;
      control.gridedValues = Flow.Dataflow.lift(control.values, values => createGridableValues(values));
      return control;
    };
    createListControl = parameter => {
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
      blockSelectionUpdates = f => {
        _isUpdatingSelectionCount = true;
        f();
        return _isUpdatingSelectionCount = false;
      };
      incrementSelectionCount = amount => _selectionCount(_selectionCount() + amount);
      createEntry = value => {
        var isSelected;
        isSelected = Flow.Dataflow.signal(false);
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
          missingPercent: value.missingPercent
        };
      };
      _entries = Flow.Dataflow.lift(_values, values => lodash.map(values, createEntry));
      _filteredItems = Flow.Dataflow.signal([]);
      _visibleItems = Flow.Dataflow.signal([]);
      _hasFilteredItems = Flow.Dataflow.lift(_filteredItems, entries => entries.length > 0);
      _currentPage = Flow.Dataflow.signal(0);
      _maxPages = Flow.Dataflow.lift(_filteredItems, entries => Math.ceil(entries.length / MaxItemsPerPage));
      _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, index => index > 0);
      _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, (maxPages, index) => index < maxPages - 1);
      _searchCaption = Flow.Dataflow.lift(_entries, _filteredItems, _selectionCount, _currentPage, _maxPages, (entries, filteredItems, selectionCount, currentPage, maxPages) => {
        var caption;
        caption = maxPages === 0 ? '' : `Showing page ${ currentPage + 1 } of ${ maxPages }.`;
        if (filteredItems.length !== entries.length) {
          caption += ` Filtered ${ filteredItems.length } of ${ entries.length }.`;
        }
        if (selectionCount !== 0) {
          caption += ` ${ selectionCount } ignored.`;
        }
        return caption;
      });
      Flow.Dataflow.react(_entries, () => filterItems(true));
      _lastUsedSearchTerm = null;
      _lastUsedIgnoreNaTerm = null;
      filterItems = force => {
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
      changeSelection = (source, value) => {
        var entry;
        var _i;
        var _len;
        for (_i = 0, _len = source.length; _i < _len; _i++) {
          entry = source[_i];
          entry.isSelected(value);
        }
      };
      selectFiltered = () => {
        var entries;
        entries = _filteredItems();
        blockSelectionUpdates(() => changeSelection(entries, true));
        return _selectionCount(entries.length);
      };
      deselectFiltered = () => {
        blockSelectionUpdates(() => changeSelection(_filteredItems(), false));
        return _selectionCount(0);
      };
      goToPreviousPage = () => {
        if (_canGoToPreviousPage()) {
          _currentPage(_currentPage() - 1);
          filterItems();
        }
      };
      goToNextPage = () => {
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
    createCheckboxControl = parameter => {
      var control;
      var _value;
      _value = Flow.Dataflow.signal(parameter.actual_value);
      control = createControl('checkbox', parameter);
      control.clientId = lodash.uniqueId();
      control.value = _value;
      return control;
    };
    createControlFromParameter = parameter => {
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
    H2O.ModelBuilderForm = (_, _algorithm, _parameters) => {
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
      _hasValidationFailures = Flow.Dataflow.lift(_validationFailureMessage, flowPrelude$3.isTruthy);
      _gridStrategies = ['Cartesian', 'RandomDiscrete'];
      _isGrided = Flow.Dataflow.signal(false);
      _gridId = Flow.Dataflow.signal(`grid-${ Flow.Util.uuid() }`);
      _gridStrategy = Flow.Dataflow.signal('Cartesian');
      _isGridRandomDiscrete = Flow.Dataflow.lift(_gridStrategy, strategy => strategy !== _gridStrategies[0]);
      _gridMaxModels = Flow.Dataflow.signal(1000);
      _gridMaxRuntime = Flow.Dataflow.signal(28800);
      _gridStoppingRounds = Flow.Dataflow.signal(0);
      _gridStoppingMetrics = ['AUTO', 'deviance', 'logloss', 'MSE', 'AUC', 'lift_top_group', 'r2', 'misclassification'];
      _gridStoppingMetric = Flow.Dataflow.signal(_gridStoppingMetrics[0]);
      _gridStoppingTolerance = Flow.Dataflow.signal(0.001);
      _parametersByLevel = lodash.groupBy(_parameters, parameter => parameter.level);
      _controlGroups = lodash.map(['critical', 'secondary', 'expert'], type => {
        var controls;
        controls = lodash.filter(lodash.map(_parametersByLevel[type], createControlFromParameter), a => {
          if (a) {
            return true;
          }
          return false;
        });
        lodash.forEach(controls, control => Flow.Dataflow.react(control.isGrided, () => {
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
        }));
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
      findControl = name => {
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
      parameterTemplateOf = control => `flow-${ control.kind }-model-parameter`;
      findFormField = name => lodash.find(_form, field => field.name === name);
      (() => {
        var foldColumnParameter;
        var ignoredColumnsParameter;
        var offsetColumnsParameter;
        var responseColumnParameter;
        var trainingFrameParameter;
        var validationFrameParameter;
        var weightsColumnParameter;
        var _ref;
        _ref = lodash.map(['training_frame', 'validation_frame', 'response_column', 'ignored_columns', 'offset_column', 'weights_column', 'fold_column'], findFormField), trainingFrameParameter = _ref[0], validationFrameParameter = _ref[1], responseColumnParameter = _ref[2], ignoredColumnsParameter = _ref[3], offsetColumnsParameter = _ref[4], weightsColumnParameter = _ref[5], foldColumnParameter = _ref[6];
        if (trainingFrameParameter) {
          if (responseColumnParameter || ignoredColumnsParameter) {
            return Flow.Dataflow.act(trainingFrameParameter.value, frameKey => {
              if (frameKey) {
                _.requestFrameSummaryWithoutData(frameKey, (error, frame) => {
                  var columnLabels;
                  var columnValues;
                  if (!error) {
                    columnValues = lodash.map(frame.columns, column => column.label);
                    columnLabels = lodash.map(frame.columns, column => {
                      var missingPercent;
                      missingPercent = 100 * column.missing_count / frame.rows;
                      return {
                        type: column.type === 'enum' ? `enum(${ column.domain_cardinality })` : column.type,
                        value: column.label,
                        missingPercent,
                        missingLabel: missingPercent === 0 ? '' : `${ Math.round(missingPercent) }% NA`
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
                      return Flow.Dataflow.lift(responseColumnParameter.value, responseVariableName => {});
                    }
                  }
                });
              }
            });
          }
        }
      })();
      collectParameters = includeUnchangedParameters => {
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
                  hyperParameters[control.name] = [true, false];
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
      performValidations = (checkForErrors, go) => {
        var parameters;
        _exception(null);
        parameters = collectParameters(true);
        if (parameters.hyper_parameters) {
          return go();
        }
        _validationFailureMessage('');
        return _.requestModelInputValidation(_algorithm, parameters, (error, modelBuilder) => {
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
            validationsByControlName = lodash.groupBy(modelBuilder.messages, validation => validation.field_name);
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
      createModel = () => {
        _exception(null);
        return performValidations(true, () => {
          var parameters;
          parameters = collectParameters(false);
          return _.insertAndExecuteCell('cs', `buildModel \'${ _algorithm }\', ${ flowPrelude$3.stringify(parameters) }`);
        });
      };
      _revalidate = value => {
        if (value !== void 0) {
          return performValidations(false, () => {});
        }
      };
      revalidate = lodash.throttle(_revalidate, 100, { leading: false });
      performValidations(false, () => {
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
    H2O.ModelInput = (_, _go, _algo, _opts) => {
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
      _canCreateModel = Flow.Dataflow.lift(_algorithm, algorithm => {
        if (algorithm) {
          return true;
        }
        return false;
      });
      _modelForm = Flow.Dataflow.signal(null);
      populateFramesAndColumns = (frameKey, algorithm, parameters, go) => {
        var classificationParameter;
        var destinationKeyParameter;
        destinationKeyParameter = lodash.find(parameters, parameter => parameter.name === 'model_id');
        if (destinationKeyParameter && !destinationKeyParameter.actual_value) {
          destinationKeyParameter.actual_value = `${ algorithm }-${ Flow.Util.uuid() }`;
        }
        classificationParameter = lodash.find(parameters, parameter => parameter.name === 'do_classification');
        if (classificationParameter) {
          classificationParameter.actual_value = true;
        }
        return _.requestFrames((error, frames) => {
          var frame;
          var frameKeys;
          var frameParameters;
          var parameter;
          var _i;
          var _len;
          if (error) {
            // empty
          } else {
            frameKeys = (() => {
              var _i;
              var _len;
              var _results;
              _results = [];
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
      (() => _.requestModelBuilders((error, modelBuilders) => {
        var frameKey;
        _algorithms(modelBuilders);
        _algorithm(_algo ? lodash.find(modelBuilders, builder => builder.algo === _algo) : void 0);
        frameKey = _opts != null ? _opts.training_frame : void 0;
        return Flow.Dataflow.act(_algorithm, builder => {
          var algorithm;
          var parameters;
          if (builder) {
            algorithm = builder.algo;
            parameters = flowPrelude$3.deepClone(builder.parameters);
            return populateFramesAndColumns(frameKey, algorithm, parameters, () => _modelForm(H2O.ModelBuilderForm(_, algorithm, parameters)));
          }
          return _modelForm(null);
        });
      }))();
      createModel = () => _modelForm().createModel();
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

  const flowPrelude$4 = flowPreludeFunction();

  function parseInput() {
    var lodash = window._;
    var Flow = window.Flow;
    var MaxItemsPerPage;
    var dataTypes;
    var parseDelimiters;
    var parseTypes;
    MaxItemsPerPage = 15;
    parseTypes = lodash.map(['AUTO', 'ARFF', 'XLS', 'XLSX', 'CSV', 'SVMLight', 'ORC', 'AVRO', 'PARQUET'], type => ({
      type,
      caption: type
    }));
    parseDelimiters = (() => {
      var characterDelimiters;
      var createDelimiter;
      var otherDelimiters;
      var whitespaceDelimiters;
      var whitespaceSeparators;
      whitespaceSeparators = ['NULL', 'SOH (start of heading)', 'STX (start of text)', 'ETX (end of text)', 'EOT (end of transmission)', 'ENQ (enquiry)', 'ACK (acknowledge)', 'BEL \'\\a\' (bell)', 'BS  \'\\b\' (backspace)', 'HT  \'\\t\' (horizontal tab)', 'LF  \'\\n\' (new line)', 'VT  \'\\v\' (vertical tab)', 'FF  \'\\f\' (form feed)', 'CR  \'\\r\' (carriage ret)', 'SO  (shift out)', 'SI  (shift in)', 'DLE (data link escape)', 'DC1 (device control 1) ', 'DC2 (device control 2)', 'DC3 (device control 3)', 'DC4 (device control 4)', 'NAK (negative ack.)', 'SYN (synchronous idle)', 'ETB (end of trans. blk)', 'CAN (cancel)', 'EM  (end of medium)', 'SUB (substitute)', 'ESC (escape)', 'FS  (file separator)', 'GS  (group separator)', 'RS  (record separator)', 'US  (unit separator)', '\' \' SPACE'];
      createDelimiter = (caption, charCode) => ({
        charCode,
        caption: `${ caption }: \'${ `00${ charCode }`.slice(-2) }\'`
      });
      whitespaceDelimiters = lodash.map(whitespaceSeparators, createDelimiter);
      characterDelimiters = lodash.times(126 - whitespaceSeparators.length, i => {
        var charCode;
        charCode = i + whitespaceSeparators.length;
        return createDelimiter(String.fromCharCode(charCode), charCode);
      });
      otherDelimiters = [{
        charCode: -1,
        caption: 'AUTO'
      }];
      return whitespaceDelimiters.concat(characterDelimiters, otherDelimiters);
    })();
    dataTypes = ['Unknown', 'Numeric', 'Enum', 'Time', 'UUID', 'String', 'Invalid'];
    H2O.SetupParseOutput = (_, _go, _inputs, _result) => {
      var filterColumns;
      var goToNextPage;
      var goToPreviousPage;
      var makePage;
      var parseFiles;
      var refreshPreview;
      var _activePage;
      var _canGoToNextPage;
      var _canGoToPreviousPage;
      var _canReconfigure;
      var _chunkSize;
      var _columnCount;
      var _columnNameSearchTerm;
      var _columns;
      var _currentPage;
      var _deleteOnDone;
      var _delimiter;
      var _destinationKey;
      var _filteredColumns;
      var _headerOption;
      var _headerOptions;
      var _inputKey;
      var _parseType;
      var _preview;
      var _sourceKeys;
      var _useSingleQuotes;
      var _visibleColumns;
      _inputKey = _inputs.paths ? 'paths' : 'source_frames';
      _sourceKeys = lodash.map(_result.source_frames, src => src.name);
      _parseType = Flow.Dataflow.signal(lodash.find(parseTypes, parseType => parseType.type === _result.parse_type));
      _canReconfigure = Flow.Dataflow.lift(_parseType, parseType => parseType.type !== 'SVMLight');
      _delimiter = Flow.Dataflow.signal(lodash.find(parseDelimiters, delimiter => delimiter.charCode === _result.separator));
      _useSingleQuotes = Flow.Dataflow.signal(_result.single_quotes);
      _destinationKey = Flow.Dataflow.signal(_result.destination_frame);
      _headerOptions = {
        auto: 0,
        header: 1,
        data: -1
      };
      _headerOption = Flow.Dataflow.signal(_result.check_header === 0 ? 'auto' : _result.check_header === -1 ? 'data' : 'header');
      _deleteOnDone = Flow.Dataflow.signal(true);
      _columnNameSearchTerm = Flow.Dataflow.signal('');
      _preview = Flow.Dataflow.signal(_result);
      _chunkSize = Flow.Dataflow.lift(_preview, preview => preview.chunk_size);
      refreshPreview = () => {
        var column;
        var columnTypes;
        columnTypes = (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = _columns();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            column = _ref[_i];
            _results.push(column.type());
          }
          return _results;
        })();
        return _.requestParseSetupPreview(_sourceKeys, _parseType().type, _delimiter().charCode, _useSingleQuotes(), _headerOptions[_headerOption()], columnTypes, (error, result) => {
          if (!error) {
            return _preview(result);
          }
        });
      };
      _columns = Flow.Dataflow.lift(_preview, preview => {
        var columnCount;
        var columnNames;
        var columnTypes;
        var data;
        var i;
        var j;
        var previewData;
        var row;
        var rowCount;
        var rows;
        var _i;
        var _j;
        columnTypes = preview.column_types;
        columnCount = columnTypes.length;
        previewData = preview.data;
        rowCount = previewData.length;
        columnNames = preview.column_names;
        rows = new Array(columnCount);
        for (j = _i = 0; columnCount >= 0 ? _i < columnCount : _i > columnCount; j = columnCount >= 0 ? ++_i : --_i) {
          data = new Array(rowCount);
          for (i = _j = 0; rowCount >= 0 ? _j < rowCount : _j > rowCount; i = rowCount >= 0 ? ++_j : --_j) {
            data[i] = previewData[i][j];
          }
          rows[j] = row = {
            index: `${ j + 1 }`,
            name: Flow.Dataflow.signal(columnNames ? columnNames[j] : ''),
            type: Flow.Dataflow.signal(columnTypes[j]),
            data
          };
        }
        return rows;
      });
      _columnCount = Flow.Dataflow.lift(_columns, columns => (columns != null ? columns.length : void 0) || 0);
      _currentPage = 0;
      Flow.Dataflow.act(_columns, columns => lodash.forEach(columns, column => Flow.Dataflow.react(column.type, () => {
        _currentPage = _activePage().index;
        return refreshPreview();
      })));
      Flow.Dataflow.react(_parseType, _delimiter, _useSingleQuotes, _headerOption, () => {
        _currentPage = 0;
        return refreshPreview();
      });
      _filteredColumns = Flow.Dataflow.lift(_columns, columns => columns);
      makePage = (index, columns) => ({
        index,
        columns
      });
      _activePage = Flow.Dataflow.lift(_columns, columns => makePage(_currentPage, columns));
      filterColumns = () => _activePage(makePage(0, lodash.filter(_columns(), column => column.name().toLowerCase().indexOf(_columnNameSearchTerm().toLowerCase()) > -1)));
      Flow.Dataflow.react(_columnNameSearchTerm, lodash.throttle(filterColumns, 500));
      _visibleColumns = Flow.Dataflow.lift(_activePage, currentPage => {
        var start;
        start = currentPage.index * MaxItemsPerPage;
        return currentPage.columns.slice(start, start + MaxItemsPerPage);
      });
      parseFiles = () => {
        var column;
        var columnNames;
        var columnTypes;
        var headerOption;
        columnNames = (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = _columns();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            column = _ref[_i];
            _results.push(column.name());
          }
          return _results;
        })();
        headerOption = _headerOptions[_headerOption()];
        if (lodash.every(columnNames, columnName => columnName.trim() === '')) {
          columnNames = null;
          headerOption = -1;
        }
        columnTypes = (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = _columns();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            column = _ref[_i];
            _results.push(column.type());
          }
          return _results;
        })();
        return _.insertAndExecuteCell('cs', 'parseFiles\n  ' + _inputKey + ': ' + flowPrelude$4.stringify(_inputs[_inputKey]) + '\n  destination_frame: ' + flowPrelude$4.stringify(_destinationKey()) + '\n  parse_type: ' + flowPrelude$4.stringify(_parseType().type) + '\n  separator: ' + _delimiter().charCode + '\n  number_columns: ' + _columnCount() + '\n  single_quotes: ' + _useSingleQuotes() + '\n  ' + (_canReconfigure() ? 'column_names: ' + flowPrelude$4.stringify(columnNames) + '\n  ' : '') + (_canReconfigure() ? 'column_types: ' + flowPrelude$4.stringify(columnTypes) + '\n  ' : '') + 'delete_on_done: ' + _deleteOnDone() + '\n  check_header: ' + headerOption + '\n  chunk_size: ' + _chunkSize()); // eslint-disable-line
      };
      _canGoToNextPage = Flow.Dataflow.lift(_activePage, currentPage => (currentPage.index + 1) * MaxItemsPerPage < currentPage.columns.length);
      _canGoToPreviousPage = Flow.Dataflow.lift(_activePage, currentPage => currentPage.index > 0);
      goToNextPage = () => {
        var currentPage;
        currentPage = _activePage();
        return _activePage(makePage(currentPage.index + 1, currentPage.columns));
      };
      goToPreviousPage = () => {
        var currentPage;
        currentPage = _activePage();
        if (currentPage.index > 0) {
          return _activePage(makePage(currentPage.index - 1, currentPage.columns));
        }
      };
      lodash.defer(_go);
      return {
        sourceKeys: _inputs[_inputKey],
        canReconfigure: _canReconfigure,
        parseTypes,
        dataTypes,
        delimiters: parseDelimiters,
        parseType: _parseType,
        delimiter: _delimiter,
        useSingleQuotes: _useSingleQuotes,
        destinationKey: _destinationKey,
        headerOption: _headerOption,
        deleteOnDone: _deleteOnDone,
        columns: _visibleColumns,
        parseFiles,
        columnNameSearchTerm: _columnNameSearchTerm,
        canGoToNextPage: _canGoToNextPage,
        canGoToPreviousPage: _canGoToPreviousPage,
        goToNextPage,
        goToPreviousPage,
        template: 'flow-parse-raw-input'
      };
    };
  }

  const flowPrelude$5 = flowPreludeFunction();

  function jobOutput() {
    var lodash = window._;
    var Flow = window.Flow;
    var getJobOutputStatusColor;
    var getJobProgressPercent;
    var jobOutputStatusColors;
    jobOutputStatusColors = {
      failed: '#d9534f',
      done: '#ccc',
      running: '#f0ad4e'
    };
    getJobOutputStatusColor = status => {
      switch (status) {
        case 'DONE':
          return jobOutputStatusColors.done;
        case 'CREATED':
        case 'RUNNING':
          return jobOutputStatusColors.running;
        default:
          return jobOutputStatusColors.failed;
      }
    };
    getJobProgressPercent = progress => `${ Math.ceil(100 * progress) }%`;
    H2O.JobOutput = (_, _go, _job) => {
      var canView;
      var cancel;
      var initialize;
      var isJobRunning;
      var messageIcons;
      var refresh;
      var updateJob;
      var view;
      var _canCancel;
      var _canView;
      var _description;
      var _destinationKey;
      var _destinationType;
      var _exception;
      var _isBusy;
      var _isLive;
      var _key;
      var _messages;
      var _progress;
      var _progressMessage;
      var _remainingTime;
      var _runTime;
      var _status;
      var _statusColor;
      _isBusy = Flow.Dataflow.signal(false);
      _isLive = Flow.Dataflow.signal(false);
      _key = _job.key.name;
      _description = _job.description;
      _destinationKey = _job.dest.name;
      _destinationType = (() => {
        switch (_job.dest.type) {
          case 'Key<Frame>':
            return 'Frame';
          case 'Key<Model>':
            return 'Model';
          case 'Key<Grid>':
            return 'Grid';
          case 'Key<PartialDependence>':
            return 'PartialDependence';
          case 'Key<AutoML>':
            return 'Auto Model';
          case 'Key<KeyedVoid>':
            return 'Void';
          default:
            return 'Unknown';
        }
      })();
      _runTime = Flow.Dataflow.signal(null);
      _remainingTime = Flow.Dataflow.signal(null);
      _progress = Flow.Dataflow.signal(null);
      _progressMessage = Flow.Dataflow.signal(null);
      _status = Flow.Dataflow.signal(null);
      _statusColor = Flow.Dataflow.signal(null);
      _exception = Flow.Dataflow.signal(null);
      _messages = Flow.Dataflow.signal(null);
      _canView = Flow.Dataflow.signal(false);
      _canCancel = Flow.Dataflow.signal(false);
      isJobRunning = job => job.status === 'CREATED' || job.status === 'RUNNING';
      messageIcons = {
        ERROR: 'fa-times-circle red',
        WARN: 'fa-warning orange',
        INFO: 'fa-info-circle'
      };
      canView = job => {
        switch (_destinationType) {
          case 'Model':
          case 'Grid':
            return job.ready_for_view;
          default:
            return !isJobRunning(job);
        }
      };
      updateJob = job => {
        var cause;
        var message;
        var messages;
        _runTime(Flow.Util.formatMilliseconds(job.msec));
        _progress(getJobProgressPercent(job.progress));
        _remainingTime(job.progress ? Flow.Util.formatMilliseconds(Math.round((1 - job.progress) * job.msec / job.progress)) : 'Estimating...');
        _progressMessage(job.progress_msg);
        _status(job.status);
        _statusColor(getJobOutputStatusColor(job.status));
        if (job.error_count) {
          messages = (() => {
            var _i;
            var _len;
            var _ref;
            var _results;
            _ref = job.messages;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              message = _ref[_i];
              if (message.message_type !== 'HIDE') {
                _results.push({
                  icon: messageIcons[message.message_type],
                  message: `${ message.field_name }: ${ message.message }`
                });
              }
            }
            return _results;
          })();
          _messages(messages);
        } else if (job.exception) {
          cause = new Error(job.exception);
          if (job.stacktrace) {
            cause.stack = job.stacktrace;
          }
          _exception(Flow.Failure(_, new Flow.Error('Job failure.', cause)));
        }
        _canView(canView(job));
        return _canCancel(isJobRunning(job));
      };
      refresh = () => {
        _isBusy(true);
        return _.requestJob(_key, (error, job) => {
          _isBusy(false);
          if (error) {
            _exception(Flow.Failure(_, new Flow.Error('Error fetching jobs', error)));
            return _isLive(false);
          }
          updateJob(job);
          if (isJobRunning(job)) {
            if (_isLive()) {
              return lodash.delay(refresh, 1000);
            }
          } else {
            _isLive(false);
            if (_go) {
              return lodash.defer(_go);
            }
          }
        });
      };
      Flow.Dataflow.act(_isLive, isLive => {
        if (isLive) {
          return refresh();
        }
      });
      view = () => {
        if (!_canView()) {
          return;
        }
        switch (_destinationType) {
          case 'Frame':
            return _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$5.stringify(_destinationKey) }`);
          case 'Model':
            return _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$5.stringify(_destinationKey) }`);
          case 'Grid':
            return _.insertAndExecuteCell('cs', `getGrid ${ flowPrelude$5.stringify(_destinationKey) }`);
          case 'PartialDependence':
            return _.insertAndExecuteCell('cs', `getPartialDependence ${ flowPrelude$5.stringify(_destinationKey) }`);
          case 'Auto Model':
            return _.insertAndExecuteCell('cs', 'getGrids');
          case 'Void':
            return alert(`This frame was exported to\n${ _job.dest.name }`);
        }
      };
      cancel = () => _.requestCancelJob(_key, (error, result) => {
        if (error) {
          return console.debug(error);
        }
        return updateJob(_job);
      });
      initialize = job => {
        updateJob(job);
        if (isJobRunning(job)) {
          return _isLive(true);
        }
        if (_go) {
          return lodash.defer(_go);
        }
      };
      initialize(_job);
      return {
        key: _key,
        description: _description,
        destinationKey: _destinationKey,
        destinationType: _destinationType,
        runTime: _runTime,
        remainingTime: _remainingTime,
        progress: _progress,
        progressMessage: _progressMessage,
        status: _status,
        statusColor: _statusColor,
        messages: _messages,
        exception: _exception,
        isLive: _isLive,
        canView: _canView,
        canCancel: _canCancel,
        cancel,
        view,
        template: 'flow-job-output'
      };
    };
  }

  function imputeInput() {
    var lodash = window._;
    var Flow = window.Flow;
    var createOptions;
    var _allCombineMethods;
    var _allMethods;
    createOptions = options => {
      var option;
      var _i;
      var _len;
      var _results;
      _results = [];
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        option = options[_i];
        _results.push({
          caption: option,
          value: option.toLowerCase()
        });
      }
      return _results;
    };
    _allMethods = createOptions(['Mean', 'Median', 'Mode']);
    _allCombineMethods = createOptions(['Interpolate', 'Average', 'Low', 'High']);
    H2O.ImputeInput = (_, _go, opts) => {
      var impute;
      var _canGroupByColumns;
      var _canImpute;
      var _canUseCombineMethod;
      var _column;
      var _columns;
      var _combineMethod;
      var _combineMethods;
      var _frame;
      var _frames;
      var _groupByColumns;
      var _hasFrame;
      var _method;
      var _methods;
      if (opts == null) {
        opts = {};
      }
      _frames = Flow.Dataflow.signal([]);
      _frame = Flow.Dataflow.signal(null);
      _hasFrame = Flow.Dataflow.lift(_frame, frame => {
        if (frame) {
          return true;
        }
        return false;
      });
      _columns = Flow.Dataflow.signal([]);
      _column = Flow.Dataflow.signal(null);
      _methods = _allMethods;
      _method = Flow.Dataflow.signal(_allMethods[0]);
      _canUseCombineMethod = Flow.Dataflow.lift(_method, method => method.value === 'median');
      _combineMethods = _allCombineMethods;
      _combineMethod = Flow.Dataflow.signal(_allCombineMethods[0]);
      _canGroupByColumns = Flow.Dataflow.lift(_method, method => method.value !== 'median');
      _groupByColumns = Flow.Dataflow.signals([]);
      _canImpute = Flow.Dataflow.lift(_frame, _column, (frame, column) => frame && column);
      impute = () => {
        var arg;
        var combineMethod;
        var groupByColumns;
        var method;
        method = _method();
        arg = {
          frame: _frame(),
          column: _column(),
          method: method.value
        };
        if (method.value === 'median') {
          if (combineMethod = _combineMethod()) {
            arg.combineMethod = combineMethod.value;
          }
        } else {
          groupByColumns = _groupByColumns();
          if (groupByColumns.length) {
            arg.groupByColumns = groupByColumns;
          }
        }
        return _.insertAndExecuteCell('cs', `imputeColumn ${ JSON.stringify(arg) }`);
      };
      _.requestFrames((error, frames) => {
        var frame;
        if (error) {
          // empty
        } else {
          _frames((() => {
            var _i;
            var _len;
            var _results;
            _results = [];
            for (_i = 0, _len = frames.length; _i < _len; _i++) {
              frame = frames[_i];
              if (!frame.is_text) {
                _results.push(frame.frame_id.name);
              }
            }
            return _results;
          })());
          if (opts.frame) {
            _frame(opts.frame);
          }
        }
      });
      Flow.Dataflow.react(_frame, frame => {
        if (frame) {
          return _.requestFrameSummaryWithoutData(frame, (error, frame) => {
            var column;
            if (error) {
              // empty
            } else {
              _columns((() => {
                var _i;
                var _len;
                var _ref;
                var _results;
                _ref = frame.columns;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  column = _ref[_i];
                  _results.push(column.label);
                }
                return _results;
              })());
              if (opts.column) {
                _column(opts.column);
                return delete opts.column;
              }
            }
          });
        }
        return _columns([]);
      });
      lodash.defer(_go);
      return {
        frames: _frames,
        frame: _frame,
        hasFrame: _hasFrame,
        columns: _columns,
        column: _column,
        methods: _methods,
        method: _method,
        canUseCombineMethod: _canUseCombineMethod,
        combineMethods: _combineMethods,
        combineMethod: _combineMethod,
        canGroupByColumns: _canGroupByColumns,
        groupByColumns: _groupByColumns,
        canImpute: _canImpute,
        impute,
        template: 'flow-impute-input'
      };
    };
  }

  function util() {
    var Flow = window.Flow;
    var getFileBaseName;
    var validateFileExtension;
    validateFileExtension = (filename, extension) => filename.indexOf(extension, filename.length - extension.length) !== -1;
    getFileBaseName = (filename, extension) => Flow.Util.sanitizeName(filename.substr(0, filename.length - extension.length));
    H2O.Util = {
      validateFileExtension,
      getFileBaseName
    };
  }

  const flowPrelude$7 = flowPreludeFunction();

  function h2oInspectsOutput(_, _go, _tables) {
    var lodash = window._;
    var Flow = window.Flow;
    var createTableView;
    createTableView = table => {
      var grid;
      var inspect;
      var plot;
      inspect = () => _.insertAndExecuteCell('cs', `inspect ${ flowPrelude$7.stringify(table.label) }, ${ table.metadata.origin }`);
      grid = () => _.insertAndExecuteCell('cs', `grid inspect ${ flowPrelude$7.stringify(table.label) }, ${ table.metadata.origin }`);
      plot = () => _.insertAndExecuteCell('cs', table.metadata.plot);
      return {
        label: table.label,
        description: table.metadata.description,
        inspect,
        grid,
        canPlot: table.metadata.plot,
        plot
      };
    };
    lodash.defer(_go);
    return {
      hasTables: _tables.length > 0,
      tables: lodash.map(_tables, createTableView),
      template: 'flow-inspects-output'
    };
  }

  const flowPrelude$8 = flowPreludeFunction();

  function h2oInspectOutput(_, _go, _frame) {
    var lodash = window._;
    var Flow = window.Flow;
    var plot;
    var view;
    view = () => _.insertAndExecuteCell('cs', `grid inspect ${ flowPrelude$8.stringify(_frame.label) }, ${ _frame.metadata.origin }`);
    plot = () => _.insertAndExecuteCell('cs', _frame.metadata.plot);
    lodash.defer(_go);
    return {
      label: _frame.label,
      vectors: _frame.vectors,
      view,
      canPlot: _frame.metadata.plot,
      plot,
      template: 'flow-inspect-output'
    };
  }

  function h2oPlotOutput(_, _go, _plot) {
    var lodash = window._;
    lodash.defer(_go);
    return {
      plot: _plot,
      template: 'flow-plot-output'
    };
  }

  const flowPrelude$9 = flowPreludeFunction();

  function h2oPlotInput(_, _go, _frame) {
    var plot;
    var vector;
    var _canPlot;
    var _color;
    var _type;
    var _types;
    var _vectors;
    var _x;
    var _y;
    _types = ['point', 'path', 'rect'];
    _vectors = (() => {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _frame.vectors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vector = _ref[_i];
        if (vector.type === 'String' || vector.type === 'Number') {
          _results.push(vector.label);
        }
      }
      return _results;
    })();
    _type = Flow.Dataflow.signal(null);
    _x = Flow.Dataflow.signal(null);
    _y = Flow.Dataflow.signal(null);
    _color = Flow.Dataflow.signal(null);
    _canPlot = Flow.Dataflow.lift(_type, _x, _y, (type, x, y) => type && x && y);
    plot = () => {
      var color;
      var command;
      command = (color = _color()) ? `plot (g) -> g(\n  g.${ _type() }(\n    g.position ${ flowPrelude$9.stringify(_x()) }, ${ flowPrelude$9.stringify(_y()) }\n    g.color ${ flowPrelude$9.stringify(color) }\n  )\n  g.from inspect ${ flowPrelude$9.stringify(_frame.label) }, ${ _frame.metadata.origin }\n)` : `plot (g) -> g(\n  g.${ _type() }(\n    g.position ${ flowPrelude$9.stringify(_x()) }, ${ flowPrelude$9.stringify(_y()) }\n  )\n  g.from inspect ${ flowPrelude$9.stringify(_frame.label) }, ${ _frame.metadata.origin }\n)`;
      return _.insertAndExecuteCell('cs', command);
    };
    lodash.defer(_go);
    return {
      types: _types,
      type: _type,
      vectors: _vectors,
      x: _x,
      y: _y,
      color: _color,
      plot,
      canPlot: _canPlot,
      template: 'flow-plot-input'
    };
  }

  function h2oCloudOutput(_, _go, _cloud) {
    var lodash = window._;
    var Flow = window.Flow;
    var avg;
    var createGrid;
    var createNodeRow;
    var createTotalRow;
    var format3f;
    var formatMilliseconds;
    var formatThreads;
    var prettyPrintBytes;
    var refresh;
    var sum;
    var toggleExpansion;
    var toggleRefresh;
    var updateCloud;
    var _exception;
    var _hasConsensus;
    var _headers;
    var _isBusy;
    var _isExpanded;
    var _isHealthy;
    var _isLive;
    var _isLocked;
    var _name;
    var _nodeCounts;
    var _nodes;
    var _size;
    var _sizes;
    var _uptime;
    var _version;
    _exception = Flow.Dataflow.signal(null);
    _isLive = Flow.Dataflow.signal(false);
    _isBusy = Flow.Dataflow.signal(false);
    _isExpanded = Flow.Dataflow.signal(false);
    _name = Flow.Dataflow.signal();
    _size = Flow.Dataflow.signal();
    _uptime = Flow.Dataflow.signal();
    _version = Flow.Dataflow.signal();
    _nodeCounts = Flow.Dataflow.signal();
    _hasConsensus = Flow.Dataflow.signal();
    _isLocked = Flow.Dataflow.signal();
    _isHealthy = Flow.Dataflow.signal();
    _nodes = Flow.Dataflow.signals();
    formatMilliseconds = ms => Flow.Util.fromNow(new Date(new Date().getTime() - ms));
    format3f = d3.format('.3f');
    _sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    prettyPrintBytes = bytes => {
      var i;
      if (bytes === 0) {
        return '-';
      }
      i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${ (bytes / Math.pow(1024, i)).toFixed(2) } ${ _sizes[i] }`;
    };
    formatThreads = fjs => {
      var i;
      var max_lo;
      var s;
      var _i;
      var _j;
      var _k;
      var _ref;
      for (max_lo = _i = 120; _i > 0; max_lo = --_i) {
        if (fjs[max_lo - 1] !== -1) {
          break;
        }
      }
      s = '[';
      for (i = _j = 0; max_lo >= 0 ? _j < max_lo : _j > max_lo; i = max_lo >= 0 ? ++_j : --_j) {
        s += Math.max(fjs[i], 0);
        s += '/';
      }
      s += '.../';
      for (i = _k = 120, _ref = fjs.length - 1; _ref >= 120 ? _k < _ref : _k > _ref; i = _ref >= 120 ? ++_k : --_k) {
        s += fjs[i];
        s += '/';
      }
      s += fjs[fjs.length - 1];
      s += ']';
      return s;
    };
    sum = (nodes, attrOf) => {
      var node;
      var total;
      var _i;
      var _len;
      total = 0;
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        total += attrOf(node);
      }
      return total;
    };
    avg = (nodes, attrOf) => sum(nodes, attrOf) / nodes.length;
    _headers = [['&nbsp;', true], ['Name', true], ['Ping', true], ['Cores', true], ['Load', true], ['My CPU %', true], ['Sys CPU %', true], ['GFLOPS', true], ['Memory Bandwidth', true], ['Data (Used/Total)', true], ['Data (% Cached)', true], ['GC (Free / Total / Max)', true], ['Disk (Free / Max)', true], ['Disk (% Free)', true], ['PID', false], ['Keys', false], ['TCP', false], ['FD', false], ['RPCs', false], ['Threads', false], ['Tasks', false]];
    createNodeRow = node => [node.healthy, node.ip_port, moment(new Date(node.last_ping)).fromNow(), node.num_cpus, format3f(node.sys_load), node.my_cpu_pct, node.sys_cpu_pct, format3f(node.gflops), `${ prettyPrintBytes(node.mem_bw) } / s`, `${ prettyPrintBytes(node.mem_value_size) } / ${ prettyPrintBytes(node.total_value_size) }`, `${ Math.floor(node.mem_value_size * 100 / node.total_value_size) }%`, `${ prettyPrintBytes(node.free_mem) } / ${ prettyPrintBytes(node.tot_mem) } / ${ prettyPrintBytes(node.max_mem) }`, `${ prettyPrintBytes(node.free_disk) } / ${ prettyPrintBytes(node.max_disk) }`, `${ Math.floor(node.free_disk * 100 / node.max_disk) }%`, node.pid, node.num_keys, node.tcps_active, node.open_fds, node.rpcs_active, formatThreads(node.fjthrds), formatThreads(node.fjqueue)];
    createTotalRow = cloud => {
      var nodes;
      nodes = cloud.nodes;
      return [cloud.cloud_healthy, 'TOTAL', '-', sum(nodes, node => node.num_cpus), format3f(sum(nodes, node => node.sys_load)), '-', '-', `${ format3f(sum(nodes, node => node.gflops)) }`, `${ prettyPrintBytes(sum(nodes, node => node.mem_bw)) } / s`, `${ prettyPrintBytes(sum(nodes, node => node.mem_value_size)) } / ${ prettyPrintBytes(sum(nodes, node => node.total_value_size)) }`, `${ Math.floor(avg(nodes, node => node.mem_value_size * 100 / node.total_value_size)) }%`, `${ prettyPrintBytes(sum(nodes, node => node.free_mem)) } / ${ prettyPrintBytes(sum(nodes, node => node.tot_mem)) } / ${ prettyPrintBytes(sum(nodes, node => node.max_mem)) }`, `${ prettyPrintBytes(sum(nodes, node => node.free_disk)) } / ${ prettyPrintBytes(sum(nodes, node => node.max_disk)) }`, `${ Math.floor(avg(nodes, node => node.free_disk * 100 / node.max_disk)) }%`, '-', sum(nodes, node => node.num_keys), sum(nodes, node => node.tcps_active), sum(nodes, node => node.open_fds), sum(nodes, node => node.rpcs_active), '-', '-'];
    };
    createGrid = (cloud, isExpanded) => {
      var caption;
      var cell;
      var danger;
      var grid;
      var i;
      var nodeRows;
      var row;
      var showAlways;
      var success;
      var table;
      var tbody;
      var td;
      var tds;
      var th;
      var thead;
      var ths;
      var tr;
      var trs;
      var _ref;
      _ref = Flow.HTML.template('.grid', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'i.fa.fa-check-circle.text-success', 'i.fa.fa-exclamation-circle.text-danger'), grid = _ref[0], table = _ref[1], thead = _ref[2], tbody = _ref[3], tr = _ref[4], th = _ref[5], td = _ref[6], success = _ref[7], danger = _ref[8];
      nodeRows = lodash.map(cloud.nodes, createNodeRow);
      nodeRows.push(createTotalRow(cloud));
      ths = (() => {
        var _i;
        var _len;
        var _ref1;
        var _results;
        _results = [];
        for (_i = 0, _len = _headers.length; _i < _len; _i++) {
          _ref1 = _headers[_i], caption = _ref1[0], showAlways = _ref1[1];
          if (showAlways || isExpanded) {
            _results.push(th(caption));
          }
        }
        return _results;
      })();
      trs = (() => {
        var _i;
        var _len;
        var _results;
        _results = [];
        for (_i = 0, _len = nodeRows.length; _i < _len; _i++) {
          row = nodeRows[_i];
          tds = (() => {
            var _j;
            var _len1;
            var _results1;
            _results1 = [];
            for (i = _j = 0, _len1 = row.length; _j < _len1; i = ++_j) {
              cell = row[i];
              if (_headers[i][1] || isExpanded) {
                if (i === 0) {
                  _results1.push(td(cell ? success() : danger()));
                } else {
                  _results1.push(td(cell));
                }
              }
            }
            return _results1;
          })();
          _results.push(tr(tds));
        }
        return _results;
      })();
      return Flow.HTML.render('div', grid([table([thead(tr(ths)), tbody(trs)])]));
    };
    updateCloud = (cloud, isExpanded) => {
      _name(cloud.cloud_name);
      _version(cloud.version);
      _hasConsensus(cloud.consensus);
      _uptime(formatMilliseconds(cloud.cloud_uptime_millis));
      _nodeCounts(`${ cloud.cloud_size - cloud.bad_nodes } / ${ cloud.cloud_size }`);
      _isLocked(cloud.locked);
      _isHealthy(cloud.cloud_healthy);
      return _nodes(createGrid(cloud, isExpanded));
    };
    toggleRefresh = () => _isLive(!_isLive());
    refresh = () => {
      _isBusy(true);
      return _.requestCloud((error, cloud) => {
        _isBusy(false);
        if (error) {
          _exception(Flow.Failure(_, new Flow.Error('Error fetching cloud status', error)));
          return _isLive(false);
        }
        updateCloud(_cloud = cloud, _isExpanded());
        if (_isLive()) {
          return lodash.delay(refresh, 2000);
        }
      });
    };
    Flow.Dataflow.act(_isLive, isLive => {
      if (isLive) {
        return refresh();
      }
    });
    toggleExpansion = () => _isExpanded(!_isExpanded());
    Flow.Dataflow.act(_isExpanded, isExpanded => updateCloud(_cloud, isExpanded));
    updateCloud(_cloud, _isExpanded());
    lodash.defer(_go);
    return {
      name: _name,
      size: _size,
      uptime: _uptime,
      version: _version,
      nodeCounts: _nodeCounts,
      hasConsensus: _hasConsensus,
      isLocked: _isLocked,
      isHealthy: _isHealthy,
      nodes: _nodes,
      isLive: _isLive,
      isBusy: _isBusy,
      toggleRefresh,
      refresh,
      isExpanded: _isExpanded,
      toggleExpansion,
      template: 'flow-cloud-output'
    };
  }

  function h2oTimelineOutput(_, _go, _timeline) {
    var lodash = window._;
    var Flow = window.Flow;
    var createEvent;
    var refresh;
    var toggleRefresh;
    var updateTimeline;
    var _data;
    var _headers;
    var _isBusy;
    var _isLive;
    var _timestamp;
    _isLive = Flow.Dataflow.signal(false);
    _isBusy = Flow.Dataflow.signal(false);
    _headers = ['HH:MM:SS:MS', 'nanosec', 'Who', 'I/O Type', 'Event', 'Type', 'Bytes'];
    _data = Flow.Dataflow.signal(null);
    _timestamp = Flow.Dataflow.signal(Date.now());
    createEvent = event => {
      switch (event.type) {
        case 'io':
          return [event.date, event.nanos, event.node, event.io_flavor || '-', 'I/O', '-', event.data];
        case 'heartbeat':
          return [event.date, event.nanos, 'many &#8594;  many', 'UDP', event.type, '-', `${ event.sends } sent ${ event.recvs } received'`];
        case 'network_msg':
          return [event.date, event.nanos, `${ event.from } &#8594; ${ event.to }`, event.protocol, event.msg_type, event.is_send ? 'send' : 'receive', event.data];
        default:
      }
    };
    updateTimeline = timeline => {
      var cell;
      var event;
      var grid;
      var header;
      var table;
      var tbody;
      var td;
      var th;
      var thead;
      var ths;
      var tr;
      var trs;
      var _ref;
      _ref = Flow.HTML.template('.grid', 'table', 'thead', 'tbody', 'tr', 'th', 'td');
      grid = _ref[0];
      table = _ref[1];
      thead = _ref[2];
      tbody = _ref[3];
      tr = _ref[4];
      th = _ref[5];
      td = _ref[6];
      ths = (() => {
        var _i;
        var _len;
        var _results;
        _results = [];
        for (_i = 0, _len = _headers.length; _i < _len; _i++) {
          header = _headers[_i];
          _results.push(th(header));
        }
        return _results;
      })();
      trs = (() => {
        let _i;
        let _len;
        const _ref1 = timeline.events;
        const _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          event = _ref1[_i];
          _results.push(tr((() => {
            let _j;
            let _len1;
            const _ref2 = createEvent(event);
            const _results1 = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              cell = _ref2[_j];
              _results1.push(td(cell));
            }
            return _results1;
          })()));
        }
        return _results;
      })();
      return _data(Flow.HTML.render('div', grid([table([thead(tr(ths)), tbody(trs)])])));
    };
    toggleRefresh = () => _isLive(!_isLive());
    refresh = () => {
      _isBusy(true);
      return _.requestTimeline((error, timeline) => {
        _isBusy(false);
        if (error) {
          _exception(Flow.Failure(_, new Flow.Error('Error fetching timeline', error)));
          return _isLive(false);
        }
        updateTimeline(timeline);
        if (_isLive()) {
          return lodash.delay(refresh, 2000);
        }
      });
    };
    Flow.Dataflow.act(_isLive, isLive => {
      if (isLive) {
        return refresh();
      }
    });
    updateTimeline(_timeline);
    lodash.defer(_go);
    return {
      data: _data,
      isLive: _isLive,
      isBusy: _isBusy,
      toggleRefresh,
      refresh,
      template: 'flow-timeline-output'
    };
  }

  function h2oStackTraceOutput(_, _go, _stackTrace) {
    var lodash = window._;
    var Flow = window.Flow;
    var createNode;
    var createThread;
    var node;
    var _activeNode;
    var _nodes;
    _activeNode = Flow.Dataflow.signal(null);
    createThread = thread => {
      var lines;
      lines = thread.split('\n');
      return {
        title: lodash.head(lines),
        stackTrace: lodash.tail(lines).join('\n')
      };
    };
    createNode = node => {
      var display;
      var self;
      var thread;
      display = () => _activeNode(self);
      return self = {
        name: node.node,
        timestamp: new Date(node.time),
        threads: (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = node.thread_traces;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thread = _ref[_i];
            _results.push(createThread(thread));
          }
          return _results;
        })(),
        display
      };
    };
    _nodes = (() => {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _stackTrace.traces;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(createNode(node));
      }
      return _results;
    })();
    _activeNode(lodash.head(_nodes));
    lodash.defer(_go);
    return {
      nodes: _nodes,
      activeNode: _activeNode,
      template: 'flow-stacktrace-output'
    };
  }

  function h2oLogFileOutput(_, _go, _cloud, _nodeIndex, _fileType, _logFile) {
    var lodash = window._;
    var Flow = window.Flow;
    var createNode;
    var initialize;
    var refresh;
    var refreshActiveView;
    var _activeFileType;
    var _activeNode;
    var _contents;
    var _exception;
    var _fileTypes;
    var _nodes;
    _exception = Flow.Dataflow.signal(null);
    _contents = Flow.Dataflow.signal('');
    _nodes = Flow.Dataflow.signal([]);
    _activeNode = Flow.Dataflow.signal(null);
    _fileTypes = Flow.Dataflow.signal(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'httpd', 'stdout', 'stderr']);
    _activeFileType = Flow.Dataflow.signal(null);
    createNode = (node, index) => ({
      name: node.ip_port,
      index
    });
    refreshActiveView = (node, fileType) => {
      if (node) {
        return _.requestLogFile(node.index, fileType, (error, logFile) => {
          if (error) {
            return _contents(`Error fetching log file: ${ error.message }`);
          }
          return _contents(logFile.log);
        });
      }
      return _contents('');
    };
    refresh = () => refreshActiveView(_activeNode(), _activeFileType());
    initialize = (cloud, nodeIndex, fileType, logFile) => {
      var NODE_INDEX_SELF;
      var clientNode;
      var i;
      var n;
      var nodes;
      var _i;
      var _len;
      var _ref;
      _activeFileType(fileType);
      _contents(logFile.log);
      nodes = [];
      if (cloud.is_client) {
        clientNode = { ip_port: 'driver' };
        NODE_INDEX_SELF = -1;
        nodes.push(createNode(clientNode, NODE_INDEX_SELF));
      }
      _ref = cloud.nodes;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        n = _ref[i];
        nodes.push(createNode(n, i));
      }
      _nodes(nodes);
      if (nodeIndex < nodes.length) {
        _activeNode(nodes[nodeIndex]);
      }
      Flow.Dataflow.react(_activeNode, _activeFileType, refreshActiveView);
      return lodash.defer(_go);
    };
    initialize(_cloud, _nodeIndex, _fileType, _logFile);
    return {
      nodes: _nodes,
      activeNode: _activeNode,
      fileTypes: _fileTypes,
      activeFileType: _activeFileType,
      contents: _contents,
      refresh,
      template: 'flow-log-file-output'
    };
  }

  function h2oNetworkTestOutput(_, _go, _testResult) {
    var lodash = window._;
    var Flow = window.Flow;
    var render;
    var _result;
    _result = Flow.Dataflow.signal(null);
    render = _.plot(g => g(g.select(), g.from(_.inspect('result', _testResult))));
    render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      return _result(vis.element);
    });
    lodash.defer(_go);
    return {
      result: _result,
      template: 'flow-network-test-output'
    };
  }

  function h2oProfileOutput(_, _go, _profile) {
    var lodash = window._;
    var Flow = window.Flow;
    var createNode;
    var i;
    var node;
    var _activeNode;
    var _nodes;
    _activeNode = Flow.Dataflow.signal(null);
    createNode = node => {
      var display;
      var entries;
      var entry;
      var self;
      display = () => _activeNode(self);
      entries = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = node.entries;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          _results.push({
            stacktrace: entry.stacktrace,
            caption: `Count: ${ entry.count }`
          });
        }
        return _results;
      })();
      return self = {
        name: node.node_name,
        caption: `${ node.node_name } at ${ new Date(node.timestamp) }`,
        entries,
        display
      };
    };
    _nodes = (() => {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _profile.nodes;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        node = _ref[i];
        _results.push(createNode(node));
      }
      return _results;
    })();
    _activeNode(lodash.head(_nodes));
    lodash.defer(_go);
    return {
      nodes: _nodes,
      activeNode: _activeNode,
      template: 'flow-profile-output'
    };
  }

  const flowPrelude$10 = flowPreludeFunction();

  function h2oFramesOutput(_, _go, _frames) {
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
    Flow.Dataflow.react(_checkAllFrames, checkAll => {
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
    createFrameView = frame => {
      var columnLabels;
      var createModel;
      var inspect;
      var predict;
      var view;
      var _isChecked;
      _isChecked = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(_isChecked, () => {
        var checkedViews;
        var view;
        if (_isCheckingAll) {
          return;
        }
        checkedViews = (() => {
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
        })();
        return _hasSelectedFrames(checkedViews.length > 0);
      });
      columnLabels = lodash.head(lodash.map(frame.columns, column => column.label), 15);
      view = () => {
        if (frame.is_text) {
          return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${ flowPrelude$10.stringify(frame.frame_id.name) } ]`);
        }
        return _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$10.stringify(frame.frame_id.name) }`);
      };
      predict = () => _.insertAndExecuteCell('cs', `predict frame: ${ flowPrelude$10.stringify(frame.frame_id.name) }`);
      inspect = () => _.insertAndExecuteCell('cs', `inspect getFrameSummary ${ flowPrelude$10.stringify(frame.frame_id.name) }`);
      createModel = () => _.insertAndExecuteCell('cs', `assist buildModel, null, training_frame: ${ flowPrelude$10.stringify(frame.frame_id.name) }`);
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
    importFiles = () => _.insertAndExecuteCell('cs', 'importFiles');
    collectSelectedKeys = () => {
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
    predictOnFrames = () => _.insertAndExecuteCell('cs', `predict frames: ${ flowPrelude$10.stringify(collectSelectedKeys()) }`);
    deleteFrames = () => _.confirm('Are you sure you want to delete these frames?', {
      acceptCaption: 'Delete Frames',
      declineCaption: 'Cancel'
    }, accept => {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteFrames ${ flowPrelude$10.stringify(collectSelectedKeys()) }`);
      }
    });
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
  }

  const flowPrelude$11 = flowPreludeFunction();

  function h2oSplitFrameOutput(_, _go, _splitFrameResult) {
    var lodash = window._;
    var computeRatios;
    var createFrameView;
    var index;
    var key;
    var _frames;
    var _ratios;
    computeRatios = sourceRatios => {
      var ratio;
      var ratios;
      var total;
      total = 0;
      ratios = (() => {
        var _i;
        var _len;
        var _results;
        _results = [];
        for (_i = 0, _len = sourceRatios.length; _i < _len; _i++) {
          ratio = sourceRatios[_i];
          total += ratio;
          _results.push(ratio);
        }
        return _results;
      })();
      ratios.push(1 - total);
      return ratios;
    };
    createFrameView = (key, ratio) => {
      var self;
      var view;
      view = () => _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$11.stringify(key) }`);
      return self = {
        key,
        ratio,
        view
      };
    };
    _ratios = computeRatios(_splitFrameResult.ratios);
    _frames = (() => {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _splitFrameResult.keys;
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        key = _ref[index];
        _results.push(createFrameView(key, _ratios[index]));
      }
      return _results;
    })();
    lodash.defer(_go);
    return {
      frames: _frames,
      template: 'flow-split-frame-output'
    };
  }

  const flowPrelude$12 = flowPreludeFunction();

  function h2oMergeFramesOutput(_, _go, _mergeFramesResult) {
    var lodash = window._;
    var Flow = window.Flow;
    var _frameKey;
    var _viewFrame;
    _frameKey = _mergeFramesResult.key;
    _viewFrame = () => _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$12.stringify(_frameKey) }`);
    lodash.defer(_go);
    return {
      frameKey: _frameKey,
      viewFrame: _viewFrame,
      template: 'flow-merge-frames-output'
    };
  }

  const flowPrelude$13 = flowPreludeFunction();

  function h2oPartialDependenceOutput(_, _go, _result) {
    var data;
    var i;
    var renderPlot;
    var section;
    var table;
    var x;
    var y;
    var _destinationKey;
    var _frameId;
    var _i;
    var _len;
    var _modelId;
    var _plots;
    var _ref;
    var _viewFrame;
    _destinationKey = _result.destination_key;
    _modelId = _result.model_id.name;
    _frameId = _result.frame_id.name;
    renderPlot = (target, render) => render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      return target(vis.element);
    });
    _plots = [];
    _ref = _result.partial_dependence_data;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      data = _ref[i];
      if (table = _.inspect(`plot${ i + 1 }`, _result)) {
        x = data.columns[0].name;
        y = data.columns[1].name;
        _plots.push(section = {
          title: `${ x } vs ${ y }`,
          plot: Flow.Dataflow.signal(null),
          frame: Flow.Dataflow.signal(null)
        });
        renderPlot(section.plot, _.plot(g => g(g.path(g.position(x, y), g.strokeColor(g.value('#1f77b4'))), g.point(g.position(x, y), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
        renderPlot(section.frame, _.plot(g => g(g.select(), g.from(table))));
      }
    }
    _viewFrame = () => _.insertAndExecuteCell('cs', `requestPartialDependenceData ${ flowPrelude$13.stringify(_destinationKey) }`);
    lodash.defer(_go);
    return {
      destinationKey: _destinationKey,
      modelId: _modelId,
      frameId: _frameId,
      plots: _plots,
      viewFrame: _viewFrame,
      template: 'flow-partial-dependence-output'
    };
  }

  const flowPrelude$14 = flowPreludeFunction();

  function h2oJobsOutput(_, _go, jobs) {
    var lodash = window._;
    var Flow = window.Flow;
    var createJobView;
    var initialize;
    var refresh;
    var toggleRefresh;
    var _exception;
    var _hasJobViews;
    var _isBusy;
    var _isLive;
    var _jobViews;
    _jobViews = Flow.Dataflow.signals([]);
    _hasJobViews = Flow.Dataflow.lift(_jobViews, jobViews => jobViews.length > 0);
    _isLive = Flow.Dataflow.signal(false);
    _isBusy = Flow.Dataflow.signal(false);
    _exception = Flow.Dataflow.signal(null);
    createJobView = job => {
      var type;
      var view;
      view = () => _.insertAndExecuteCell('cs', `getJob ${ flowPrelude$14.stringify(job.key.name) }`);
      type = (() => {
        switch (job.dest.type) {
          case 'Key<Frame>':
            return 'Frame';
          case 'Key<Model>':
            return 'Model';
          case 'Key<Grid>':
            return 'Grid';
          case 'Key<PartialDependence>':
            return 'PartialDependence';
          default:
            return 'Unknown';
        }
      })();
      return {
        destination: job.dest.name,
        type,
        description: job.description,
        startTime: Flow.Format.Time(new Date(job.start_time)),
        endTime: Flow.Format.Time(new Date(job.start_time + job.msec)),
        elapsedTime: Flow.Util.formatMilliseconds(job.msec),
        status: job.status,
        view
      };
    };
    toggleRefresh = () => _isLive(!_isLive());
    refresh = () => {
      _isBusy(true);
      return _.requestJobs((error, jobs) => {
        _isBusy(false);
        if (error) {
          _exception(Flow.Failure(_, new Flow.Error('Error fetching jobs', error)));
          return _isLive(false);
        }
        _jobViews(lodash.map(jobs, createJobView));
        if (_isLive()) {
          return lodash.delay(refresh, 2000);
        }
      });
    };
    Flow.Dataflow.act(_isLive, isLive => {
      if (isLive) {
        return refresh();
      }
    });
    initialize = () => {
      _jobViews(lodash.map(jobs, createJobView));
      return lodash.defer(_go);
    };
    initialize();
    return {
      jobViews: _jobViews,
      hasJobViews: _hasJobViews,
      isLive: _isLive,
      isBusy: _isBusy,
      toggleRefresh,
      refresh,
      exception: _exception,
      template: 'flow-jobs-output'
    };
  }

  function h2oCancelJobOutput(_, _go, _cancellation) {
    var lodash = window._;
    lodash.defer(_go);
    return { template: 'flow-cancel-job-output' };
  }

  function h2oDeleteObjectsOutput(_, _go, _keys) {
    var lodash = window._;
    lodash.defer(_go);
    return {
      hasKeys: _keys.length > 0,
      keys: _keys,
      template: 'flow-delete-objects-output'
    };
  }

  const flowPrelude$15 = flowPreludeFunction();

  function h2oModelOutput(_, _go, _model, refresh) {
    var lodash = window._;
    var Flow = window.Flow;
    var createOutput;
    var _isLive;
    var _output;
    var _refresh;
    var _toggleRefresh;
    _output = Flow.Dataflow.signal(null);
    createOutput = _model => {
      var cloneModel;
      var confusionMatrix;
      var deleteModel;
      var downloadMojo;
      var downloadPojo;
      var exportModel;
      var format4f;
      var getAucAsLabel;
      var getThresholdsAndCriteria;
      var inspect;
      var lambdaSearchParameter;
      var output;
      var plotter;
      var predict;
      var previewPojo;
      var renderMultinomialConfusionMatrix;
      var renderPlot;
      var table;
      var tableName;
      var toggle;
      var _i;
      var _inputParameters;
      var _isExpanded;
      var _isPojoLoaded;
      var _len;
      var _plots;
      var _pojoPreview;
      var _ref;
      var _ref1;
      var _ref10;
      var _ref11;
      var _ref12;
      var _ref13;
      var _ref14;
      var _ref15;
      var _ref16;
      var _ref17;
      var _ref18;
      var _ref19;
      var _ref2;
      var _ref20;
      var _ref21;
      var _ref22;
      var _ref23;
      var _ref24;
      var _ref25;
      var _ref3;
      var _ref4;
      var _ref5;
      var _ref6;
      var _ref7;
      var _ref8;
      var _ref9;
      _isExpanded = Flow.Dataflow.signal(false);
      _plots = Flow.Dataflow.signals([]);
      _pojoPreview = Flow.Dataflow.signal(null);
      _isPojoLoaded = Flow.Dataflow.lift(_pojoPreview, preview => {
        if (preview) {
          return true;
        }
        return false;
      });
      _inputParameters = lodash.map(_model.parameters, parameter => {
        var actual_value;
        var default_value;
        var help;
        var label;
        var type;
        var value;
        type = parameter.type, default_value = parameter.default_value, actual_value = parameter.actual_value, label = parameter.label, help = parameter.help;
        value = (() => {
          switch (type) {
            case 'Key<Frame>':
            case 'Key<Model>':
              if (actual_value) {
                return actual_value.name;
              }
              return null;
            // break; // no-unreachable
            case 'VecSpecifier':
              if (actual_value) {
                return actual_value.column_name;
              }
              return null;
            // break; // no-unreachable
            case 'string[]':
            case 'byte[]':
            case 'short[]':
            case 'int[]':
            case 'long[]':
            case 'float[]':
            case 'double[]':
              if (actual_value) {
                return actual_value.join(', ');
              }
              return null;
            // break; // no-unreachable
            default:
              return actual_value;
          }
        })();
        return {
          label,
          value,
          help,
          isModified: default_value === actual_value
        };
      });
      format4f = number => {
        if (number) {
          if (number === 'NaN') {
            return void 0;
          }
          return number.toFixed(4).replace(/\.0+$/, '.0');
        }
        return number;
      };
      getAucAsLabel = (model, tableName) => {
        var metrics;
        if (metrics = _.inspect(tableName, model)) {
          return ` , AUC = ${ metrics.schema.AUC.at(0) }`;
        }
        return '';
      };
      getThresholdsAndCriteria = (model, tableName) => {
        var criteria;
        var criterionTable;
        var i;
        var idxVector;
        var metricVector;
        var thresholdVector;
        var thresholds;
        if (criterionTable = _.inspect(tableName, _model)) {
          thresholdVector = table.schema.threshold;
          thresholds = (() => {
            var _i;
            var _ref;
            var _results;
            _results = [];
            for (i = _i = 0, _ref = thresholdVector.count(); _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
              _results.push({
                index: i,
                value: thresholdVector.at(i)
              });
            }
            return _results;
          })();
          metricVector = criterionTable.schema.metric;
          idxVector = criterionTable.schema.idx;
          criteria = (() => {
            var _i;
            var _ref;
            var _results;
            _results = [];
            for (i = _i = 0, _ref = metricVector.count(); _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
              _results.push({
                index: idxVector.at(i),
                value: metricVector.valueAt(i)
              });
            }
            return _results;
          })();
          return {
            thresholds,
            criteria
          };
        }
        return void 0;
      };
      renderPlot = (title, isCollapsed, render, thresholdsAndCriteria) => {
        var container;
        var linkedFrame;
        var rocPanel;
        container = Flow.Dataflow.signal(null);
        linkedFrame = Flow.Dataflow.signal(null);
        if (thresholdsAndCriteria) {
          rocPanel = {
            thresholds: Flow.Dataflow.signals(thresholdsAndCriteria.thresholds),
            threshold: Flow.Dataflow.signal(null),
            criteria: Flow.Dataflow.signals(thresholdsAndCriteria.criteria),
            criterion: Flow.Dataflow.signal(null)
          };
        }
        render((error, vis) => {
          var _autoHighlight;
          if (error) {
            return console.debug(error);
          }
          $('a', vis.element).on('click', e => {
            var $a;
            $a = $(e.target);
            switch ($a.attr('data-type')) {
              case 'frame':
                return _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$15.stringify($a.attr('data-key')) }`);
              case 'model':
                return _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$15.stringify($a.attr('data-key')) }`);
            }
          });
          container(vis.element);
          _autoHighlight = true;
          if (vis.subscribe) {
            vis.subscribe('markselect', _arg => {
              var currentCriterion;
              var frame;
              var indices;
              var renderTable;
              var selectedIndex;
              var subframe;
              frame = _arg.frame, indices = _arg.indices;
              subframe = window.plot.createFrame(frame.label, frame.vectors, indices);
              renderTable = g => g(indices.length > 1 ? g.select() : g.select(lodash.head(indices)), g.from(subframe));
              _.plot(renderTable)((error, table) => {
                if (!error) {
                  return linkedFrame(table.element);
                }
              });
              if (rocPanel) {
                if (indices.length === 1) {
                  selectedIndex = lodash.head(indices);
                  _autoHighlight = false;
                  rocPanel.threshold(lodash.find(rocPanel.thresholds(), threshold => threshold.index === selectedIndex));
                  currentCriterion = rocPanel.criterion();
                  if (!currentCriterion || currentCriterion && currentCriterion.index !== selectedIndex) {
                    rocPanel.criterion(lodash.find(rocPanel.criteria(), criterion => criterion.index === selectedIndex));
                  }
                  _autoHighlight = true;
                } else {
                  rocPanel.criterion(null);
                  rocPanel.threshold(null);
                }
              }
            });
            vis.subscribe('markdeselect', () => {
              linkedFrame(null);
              if (rocPanel) {
                rocPanel.criterion(null);
                return rocPanel.threshold(null);
              }
            });
            if (rocPanel) {
              Flow.Dataflow.react(rocPanel.threshold, threshold => {
                if (threshold && _autoHighlight) {
                  return vis.highlight([threshold.index]);
                }
              });
              return Flow.Dataflow.react(rocPanel.criterion, criterion => {
                if (criterion && _autoHighlight) {
                  return vis.highlight([criterion.index]);
                }
              });
            }
          }
        });
        return _plots.push({
          title,
          plot: container,
          frame: linkedFrame,
          controls: Flow.Dataflow.signal(rocPanel),
          isCollapsed
        });
      };
      renderMultinomialConfusionMatrix = (title, cm) => {
        var bold;
        var cell;
        var cells;
        var column;
        var columnCount;
        var errorColumnIndex;
        var headers;
        var i;
        var normal;
        var rowCount;
        var rowIndex;
        var rows;
        var table;
        var tbody;
        var totalRowIndex;
        var tr;
        var yellow;
        var _i;
        var _ref;
        _ref = Flow.HTML.template('table.flow-confusion-matrix', 'tbody', 'tr', 'td', 'td.strong', 'td.bg-yellow'), table = _ref[0], tbody = _ref[1], tr = _ref[2], normal = _ref[3], bold = _ref[4], yellow = _ref[5];
        columnCount = cm.columns.length;
        rowCount = cm.rowcount;
        headers = lodash.map(cm.columns, (column, i) => bold(column.description));
        headers.unshift(normal(' '));
        rows = [tr(headers)];
        errorColumnIndex = columnCount - 2;
        totalRowIndex = rowCount - 1;
        for (rowIndex = _i = 0; rowCount >= 0 ? _i < rowCount : _i > rowCount; rowIndex = rowCount >= 0 ? ++_i : --_i) {
          cells = (() => {
            var _j;
            var _len;
            var _ref1;
            var _results;
            _ref1 = cm.data;
            _results = [];
            for (i = _j = 0, _len = _ref1.length; _j < _len; i = ++_j) {
              column = _ref1[i];
              cell = i < errorColumnIndex ? i === rowIndex ? yellow : rowIndex < totalRowIndex ? normal : bold : bold;
              _results.push(cell(i === errorColumnIndex ? format4f(column[rowIndex]) : column[rowIndex]));
            }
            return _results;
          })();
          cells.unshift(bold(rowIndex === rowCount - 1 ? 'Total' : cm.columns[rowIndex].description));
          rows.push(tr(cells));
        }
        return _plots.push({
          title: title + (cm.description ? ` ${ cm.description }` : ''),
          plot: Flow.Dataflow.signal(Flow.HTML.render('div', table(tbody(rows)))),
          frame: Flow.Dataflow.signal(null),
          controls: Flow.Dataflow.signal(null),
          isCollapsed: false
        });
      };
      switch (_model.algo) {
        case 'kmeans':
          if (table = _.inspect('output - Scoring History', _model)) {
            renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('iteration', 'within_cluster_sum_of_squares'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'within_cluster_sum_of_squares'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
          }
          break;
        case 'glm':
          if (table = _.inspect('output - Scoring History', _model)) {
            lambdaSearchParameter = lodash.find(_model.parameters, parameter => parameter.name === 'lambda_search');
            if (lambdaSearchParameter != null ? lambdaSearchParameter.actual_value : void 0) {
              renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
            } else {
              renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
            }
          }
          if (table = _.inspect('output - training_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Training Metrics${ getAucAsLabel(_model, 'output - training_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Validation Metrics${ getAucAsLabel(_model, 'output - validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Cross Validation Metrics' + ${ getAucAsLabel(_model, 'output - cross_validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - Standardized Coefficient Magnitudes', _model)) {
            renderPlot('Standardized Coefficient Magnitudes', false, _.plot(g => g(g.rect(g.position('coefficients', 'names'), g.fillColor('sign')), g.from(table), g.limit(25))));
          }
          if (output = _model.output) {
            if (output.model_category === 'Multinomial') {
              if (confusionMatrix = (_ref = output.training_metrics) != null ? (_ref1 = _ref.cm) != null ? _ref1.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
              }
              if (confusionMatrix = (_ref2 = output.validation_metrics) != null ? (_ref3 = _ref2.cm) != null ? _ref3.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
              }
              if (confusionMatrix = (_ref4 = output.cross_validation_metrics) != null ? (_ref5 = _ref4.cm) != null ? _ref5.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
              }
            }
          }
          break;
        case 'deeplearning':
        case 'deepwater':
          if (table = _.inspect('output - Scoring History', _model)) {
            if (table.schema.validation_logloss && table.schema.training_logloss) {
              renderPlot('Scoring History - logloss', false, _.plot(g => g(g.path(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('epochs', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
            } else if (table.schema.training_logloss) {
              renderPlot('Scoring History - logloss', false, _.plot(g => g(g.path(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
            }
            if (table.schema.training_deviance) {
              if (table.schema.validation_deviance) {
                renderPlot('Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('epochs', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
              } else {
                renderPlot('Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
              }
            } else if (table.schema.training_mse) {
              if (table.schema.validation_mse) {
                renderPlot('Scoring History - MSE', false, _.plot(g => g(g.path(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('epochs', 'validation_mse'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'validation_mse'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
              } else {
                renderPlot('Scoring History - MSE', false, _.plot(g => g(g.path(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
              }
            }
          }
          if (table = _.inspect('output - training_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Training Metrics${ getAucAsLabel(_model, 'output - training_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`'ROC Curve - Validation Metrics' + ${ getAucAsLabel(_model, 'output - validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`'ROC Curve - Cross Validation Metrics' + ${ getAucAsLabel(_model, 'output - cross_validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - Variable Importances', _model)) {
            renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
          }
          if (output = _model.output) {
            if (output.model_category === 'Multinomial') {
              if (confusionMatrix = (_ref6 = output.training_metrics) != null ? (_ref7 = _ref6.cm) != null ? _ref7.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
              }
              if (confusionMatrix = (_ref8 = output.validation_metrics) != null ? (_ref9 = _ref8.cm) != null ? _ref9.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
              }
              if (confusionMatrix = (_ref10 = output.cross_validation_metrics) != null ? (_ref11 = _ref10.cm) != null ? _ref11.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
              }
            }
          }
          break;
        case 'gbm':
        case 'drf':
        case 'svm':
          if (table = _.inspect('output - Scoring History', _model)) {
            if (table.schema.validation_logloss && table.schema.training_logloss) {
              renderPlot('Scoring History - logloss', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('number_of_trees', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
            } else if (table.schema.training_logloss) {
              renderPlot('Scoring History - logloss', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
            }
            if (table.schema.training_deviance) {
              if (table.schema.validation_deviance) {
                renderPlot('Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('number_of_trees', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
              } else {
                renderPlot('Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
              }
            }
          }
          if (table = _.inspect('output - training_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Training Metrics${ getAucAsLabel(_model, 'output - training_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Validation Metrics${ getAucAsLabel(_model, 'output - validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Cross Validation Metrics${ getAucAsLabel(_model, 'output - cross_validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - Variable Importances', _model)) {
            renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
          }
          if (output = _model.output) {
            if (output.model_category === 'Multinomial') {
              if (confusionMatrix = (_ref12 = output.training_metrics) != null ? (_ref13 = _ref12.cm) != null ? _ref13.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
              }
              if (confusionMatrix = (_ref14 = output.validation_metrics) != null ? (_ref15 = _ref14.cm) != null ? _ref15.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
              }
              if (confusionMatrix = (_ref16 = output.cross_validation_metrics) != null ? (_ref17 = _ref16.cm) != null ? _ref17.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
              }
            }
          }
          break;
        case 'stackedensemble':
          if (table = _.inspect('output - training_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Training Metrics${ getAucAsLabel(_model, 'output - training_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`'ROC Curve - Validation Metrics${ getAucAsLabel(_model, 'output - validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model)) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Cross Validation Metrics${ getAucAsLabel(_model, 'output - cross_validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
          }
          if (table = _.inspect('output - Variable Importances', _model)) {
            renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
          }
          if (output = _model.output) {
            if (output.model_category === 'Multinomial') {
              if (confusionMatrix = (_ref18 = output.training_metrics) != null ? (_ref19 = _ref18.cm) != null ? _ref19.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
              }
              if (confusionMatrix = (_ref20 = output.validation_metrics) != null ? (_ref21 = _ref20.cm) != null ? _ref21.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
              }
              if (confusionMatrix = (_ref22 = output.cross_validation_metrics) != null ? (_ref23 = _ref22.cm) != null ? _ref23.table : void 0 : void 0) {
                renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
              }
            }
          }
      }
      if (table = _.inspect('output - training_metrics - Gains/Lift Table', _model)) {
        renderPlot('Training Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
      }
      if (table = _.inspect('output - validation_metrics - Gains/Lift Table', _model)) {
        renderPlot('Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
      }
      if (table = _.inspect('output - cross_validation_metrics - Gains/Lift Table', _model)) {
        renderPlot('Cross Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
      }
      _ref24 = _.ls(_model);
      for (_i = 0, _len = _ref24.length; _i < _len; _i++) {
        tableName = _ref24[_i];
        if (!(tableName !== 'parameters')) {
          continue;
        }
        if (output = ((_ref25 = _model.output) != null ? _ref25.model_category : void 0) === 'Multinomial') {
          if (tableName.indexOf('output - training_metrics - cm') === 0) {
            continue;
          } else if (tableName.indexOf('output - validation_metrics - cm') === 0) {
            continue;
          } else if (tableName.indexOf('output - cross_validation_metrics - cm') === 0) {
            continue;
          }
        }
        if (table = _.inspect(tableName, _model)) {
          renderPlot(tableName + (table.metadata.description ? ` (${ table.metadata.description })` : ''), true, _.plot(g => g(table.indices.length > 1 ? g.select() : g.select(0), g.from(table))));
        }
      }
      toggle = () => _isExpanded(!_isExpanded());
      cloneModel = () => alert('Not implemented');
      predict = () => _.insertAndExecuteCell('cs', `predict model: ${ flowPrelude$15.stringify(_model.model_id.name) }`);
      inspect = () => _.insertAndExecuteCell('cs', `inspect getModel ${ flowPrelude$15.stringify(_model.model_id.name) }`);
      previewPojo = () => _.requestPojoPreview(_model.model_id.name, (error, result) => {
        if (error) {
          return _pojoPreview(`<pre>${ lodash.escape(error) }</pre>`);
        }
        return _pojoPreview(`<pre>${ Flow.Util.highlight(result, 'java') }</pre>`);
      });
      downloadPojo = () => window.open(`/3/Models.java/${ encodeURIComponent(_model.model_id.name) }`, '_blank');
      downloadMojo = () => window.open(`/3/Models/${ encodeURIComponent(_model.model_id.name) }/mojo`, '_blank');
      exportModel = () => _.insertAndExecuteCell('cs', `exportModel ${ flowPrelude$15.stringify(_model.model_id.name) }`);
      deleteModel = () => _.confirm('Are you sure you want to delete this model?', {
        acceptCaption: 'Delete Model',
        declineCaption: 'Cancel'
      }, accept => {
        if (accept) {
          return _.insertAndExecuteCell('cs', `deleteModel ${ flowPrelude$15.stringify(_model.model_id.name) }`);
        }
      });
      return {
        key: _model.model_id,
        algo: _model.algo_full_name,
        plots: _plots,
        inputParameters: _inputParameters,
        isExpanded: _isExpanded,
        toggle,
        cloneModel,
        predict,
        inspect,
        previewPojo,
        downloadPojo,
        downloadMojo,
        pojoPreview: _pojoPreview,
        isPojoLoaded: _isPojoLoaded,
        exportModel,
        deleteModel
      };
    };
    _isLive = Flow.Dataflow.signal(false);
    Flow.Dataflow.act(_isLive, isLive => {
      if (isLive) {
        return _refresh();
      }
    });
    _refresh = () => refresh((error, model) => {
      if (!error) {
        _output(createOutput(model));
        if (_isLive()) {
          return lodash.delay(_refresh, 2000);
        }
      }
    });
    _toggleRefresh = () => _isLive(!_isLive());
    _output(createOutput(_model));
    lodash.defer(_go);
    return {
      output: _output,
      toggleRefresh: _toggleRefresh,
      isLive: _isLive,
      template: 'flow-model-output'
    };
  }

  const flowPrelude$16 = flowPreludeFunction();

  function h2oGridOutput(_, _go, _grid) {
    var lodash = window._;
    var Flow = window.Flow;
    var buildModel;
    var collectSelectedKeys;
    var compareModels;
    var createModelView;
    var deleteModels;
    var initialize;
    var inspect;
    var inspectAll;
    var inspectHistory;
    var predictUsingModels;
    var _canCompareModels;
    var _checkAllModels;
    var _checkedModelCount;
    var _errorViews;
    var _hasErrors;
    var _hasModels;
    var _hasSelectedModels;
    var _isCheckingAll;
    var _modelViews;
    _modelViews = Flow.Dataflow.signal([]);
    _hasModels = _grid.model_ids.length > 0;
    _errorViews = Flow.Dataflow.signal([]);
    _hasErrors = _grid.failure_details.length > 0;
    _checkAllModels = Flow.Dataflow.signal(false);
    _checkedModelCount = Flow.Dataflow.signal(0);
    _canCompareModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 1);
    _hasSelectedModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 0);
    _isCheckingAll = false;
    Flow.Dataflow.react(_checkAllModels, checkAll => {
      var view;
      var views;
      var _i;
      var _len;
      _isCheckingAll = true;
      views = _modelViews();
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        view.isChecked(checkAll);
      }
      _checkedModelCount(checkAll ? views.length : 0);
      _isCheckingAll = false;
    });
    createModelView = model_id => {
      var cloneModel;
      var inspect;
      var predict;
      var view;
      var _isChecked;
      _isChecked = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(_isChecked, () => {
        var checkedViews;
        var view;
        if (_isCheckingAll) {
          return;
        }
        checkedViews = (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = _modelViews();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            view = _ref[_i];
            if (view.isChecked()) {
              _results.push(view);
            }
          }
          return _results;
        })();
        return _checkedModelCount(checkedViews.length);
      });
      predict = () => _.insertAndExecuteCell('cs', `predict model: ${ flowPrelude$16.stringify(model_id.name) }`);
      cloneModel = () => // return _.insertAndExecuteCell('cs', `cloneModel ${flowPrelude.stringify(model_id.name)}`);
      alert('Not implemented');
      view = () => _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$16.stringify(model_id.name) }`);
      inspect = () => _.insertAndExecuteCell('cs', `inspect getModel ${ flowPrelude$16.stringify(model_id.name) }`);
      return {
        key: model_id.name,
        isChecked: _isChecked,
        predict,
        clone: cloneModel,
        inspect,
        view
      };
    };
    buildModel = () => _.insertAndExecuteCell('cs', 'buildModel');
    collectSelectedKeys = () => {
      var view;
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _modelViews();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        if (view.isChecked()) {
          _results.push(view.key);
        }
      }
      return _results;
    };
    compareModels = () => _.insertAndExecuteCell('cs', `'inspect getModels ${ flowPrelude$16.stringify(collectSelectedKeys()) }`);
    predictUsingModels = () => _.insertAndExecuteCell('cs', `predict models: ${ flowPrelude$16.stringify(collectSelectedKeys()) }`);
    deleteModels = () => _.confirm('Are you sure you want to delete these models?', {
      acceptCaption: 'Delete Models',
      declineCaption: 'Cancel'
    }, accept => {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteModels ${ flowPrelude$16.stringify(collectSelectedKeys()) }`);
      }
    });
    inspect = () => {
      var summary;
      summary = _.inspect('summary', _grid);
      return _.insertAndExecuteCell('cs', `grid inspect \'summary\', ${ summary.metadata.origin }`);
    };
    inspectHistory = () => {
      var history;
      history = _.inspect('scoring_history', _grid);
      return _.insertAndExecuteCell('cs', `grid inspect \'scoring_history\', ${ history.metadata.origin }`);
    };
    inspectAll = () => {
      var allKeys;
      var view;
      allKeys = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = _modelViews();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          _results.push(view.key);
        }
        return _results;
      })();
      return _.insertAndExecuteCell('cs', `inspect getModels ${ flowPrelude$16.stringify(allKeys) }`);
    };
    initialize = grid => {
      var errorViews;
      var i;
      _modelViews(lodash.map(grid.model_ids, createModelView));
      errorViews = (() => {
        var _i;
        var _ref;
        var _results;
        _results = [];
        for (i = _i = 0, _ref = grid.failure_details.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
          _results.push({
            title: `Error ${ i + 1 }`,
            detail: grid.failure_details[i],
            params: `Parameters: [ ${ grid.failed_raw_params[i].join(', ') } ]`,
            stacktrace: grid.failure_stack_traces[i]
          });
        }
        return _results;
      })();
      _errorViews(errorViews);
      return lodash.defer(_go);
    };
    initialize(_grid);
    return {
      modelViews: _modelViews,
      hasModels: _hasModels,
      errorViews: _errorViews,
      hasErrors: _hasErrors,
      buildModel,
      compareModels,
      predictUsingModels,
      deleteModels,
      checkedModelCount: _checkedModelCount,
      canCompareModels: _canCompareModels,
      hasSelectedModels: _hasSelectedModels,
      checkAllModels: _checkAllModels,
      inspect,
      inspectHistory,
      inspectAll,
      template: 'flow-grid-output'
    };
  }

  const flowPrelude$17 = flowPreludeFunction();

  function h2oGridsOutput(_, _go, _grids) {
    var lodash = window._;
    var Flow = window.Flow;
    var buildModel;
    var createGridView;
    var initialize;
    var _gridViews;
    _gridViews = Flow.Dataflow.signal([]);
    createGridView = grid => {
      var view;
      view = () => _.insertAndExecuteCell('cs', `getGrid ${ flowPrelude$17.stringify(grid.grid_id.name) }`);
      return {
        key: grid.grid_id.name,
        size: grid.model_ids.length,
        view
      };
    };
    buildModel = () => _.insertAndExecuteCell('cs', 'buildModel');
    initialize = grids => {
      _gridViews(lodash.map(grids, createGridView));
      return lodash.defer(_go);
    };
    initialize(_grids);
    return {
      gridViews: _gridViews,
      hasGrids: _grids.length > 0,
      buildModel,
      template: 'flow-grids-output'
    };
  }

  const flowPrelude$18 = flowPreludeFunction();

  function h2oModelsOutput(_, _go, _models) {
    var lodash = window._;
    var Flow = window.Flow;
    var buildModel;
    var collectSelectedKeys;
    var compareModels;
    var createModelView;
    var deleteModels;
    var initialize;
    var inspectAll;
    var predictUsingModels;
    var _canCompareModels;
    var _checkAllModels;
    var _checkedModelCount;
    var _hasSelectedModels;
    var _isCheckingAll;
    var _modelViews;
    _modelViews = Flow.Dataflow.signal([]);
    _checkAllModels = Flow.Dataflow.signal(false);
    _checkedModelCount = Flow.Dataflow.signal(0);
    _canCompareModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 1);
    _hasSelectedModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 0);
    _isCheckingAll = false;
    Flow.Dataflow.react(_checkAllModels, checkAll => {
      var view;
      var views;
      var _i;
      var _len;
      _isCheckingAll = true;
      views = _modelViews();
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        view.isChecked(checkAll);
      }
      _checkedModelCount(checkAll ? views.length : 0);
      _isCheckingAll = false;
    });
    createModelView = model => {
      var cloneModel;
      var inspect;
      var predict;
      var view;
      var _isChecked;
      _isChecked = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(_isChecked, () => {
        var checkedViews;
        var view;
        if (_isCheckingAll) {
          return;
        }
        checkedViews = (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = _modelViews();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            view = _ref[_i];
            if (view.isChecked()) {
              _results.push(view);
            }
          }
          return _results;
        })();
        return _checkedModelCount(checkedViews.length);
      });
      predict = () => _.insertAndExecuteCell('cs', `predict model: ${ flowPrelude$18.stringify(model.model_id.name) }`);
      cloneModel = () => // return _.insertAndExecuteCell('cs', `cloneModel ${flowPrelude.stringify(model.model_id.name)}`);
      alert('Not implemented');
      view = () => _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$18.stringify(model.model_id.name) }`);
      inspect = () => _.insertAndExecuteCell('cs', `inspect getModel ${ flowPrelude$18.stringify(model.model_id.name) }`);
      return {
        key: model.model_id.name,
        algo: model.algo_full_name,
        isChecked: _isChecked,
        predict,
        clone: cloneModel,
        inspect,
        view
      };
    };
    buildModel = () => _.insertAndExecuteCell('cs', 'buildModel');
    collectSelectedKeys = () => {
      var view;
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _modelViews();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        if (view.isChecked()) {
          _results.push(view.key);
        }
      }
      return _results;
    };
    compareModels = () => _.insertAndExecuteCell('cs', `inspect getModels ${ flowPrelude$18.stringify(collectSelectedKeys()) }`);
    predictUsingModels = () => _.insertAndExecuteCell('cs', `predict models: ${ flowPrelude$18.stringify(collectSelectedKeys()) }`);
    deleteModels = () => _.confirm('Are you sure you want to delete these models?', {
      acceptCaption: 'Delete Models',
      declineCaption: 'Cancel'
    }, accept => {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteModels ${ flowPrelude$18.stringify(collectSelectedKeys()) }`);
      }
    });
    inspectAll = () => {
      var allKeys;
      var view;
      allKeys = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = _modelViews();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          _results.push(view.key);
        }
        return _results;
      })();
      return _.insertAndExecuteCell('cs', `inspect getModels ${ flowPrelude$18.stringify(allKeys) }`);
    };
    initialize = models => {
      _modelViews(lodash.map(models, createModelView));
      return lodash.defer(_go);
    };
    initialize(_models);
    return {
      modelViews: _modelViews,
      hasModels: _models.length > 0,
      buildModel,
      compareModels,
      predictUsingModels,
      deleteModels,
      checkedModelCount: _checkedModelCount,
      canCompareModels: _canCompareModels,
      hasSelectedModels: _hasSelectedModels,
      checkAllModels: _checkAllModels,
      inspect: inspectAll,
      template: 'flow-models-output'
    };
  }

  const flowPrelude$19 = flowPreludeFunction();

  function h2oPredictsOutput(_, _go, opts, _predictions) {
    var lodash = window._;
    var Flow = window.Flow;
    var arePredictionsComparable;
    var comparePredictions;
    var createPredictionView;
    var initialize;
    var inspectAll;
    var plotMetrics;
    var plotPredictions;
    var plotScores;
    var predict;
    var _canComparePredictions;
    var _checkAllPredictions;
    var _isCheckingAll;
    var _metricsTable;
    var _predictionViews;
    var _predictionsTable;
    var _rocCurve;
    var _scoresTable;
    _predictionViews = Flow.Dataflow.signal([]);
    _checkAllPredictions = Flow.Dataflow.signal(false);
    _canComparePredictions = Flow.Dataflow.signal(false);
    _rocCurve = Flow.Dataflow.signal(null);
    arePredictionsComparable = views => {
      if (views.length === 0) {
        return false;
      }
      return lodash.every(views, view => view.modelCategory === 'Binomial');
    };
    _isCheckingAll = false;
    Flow.Dataflow.react(_checkAllPredictions, checkAll => {
      var view;
      var _i;
      var _len;
      var _ref;
      _isCheckingAll = true;
      _ref = _predictionViews();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        view.isChecked(checkAll);
      }
      _canComparePredictions(checkAll && arePredictionsComparable(_predictionViews()));
      _isCheckingAll = false;
    });
    createPredictionView = prediction => {
      var inspect;
      var view;
      var _frameKey;
      var _hasFrame;
      var _isChecked;
      var _modelKey;
      var _ref;
      _modelKey = prediction.model.name;
      _frameKey = (_ref = prediction.frame) != null ? _ref.name : void 0;
      _hasFrame = _frameKey;
      _isChecked = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(_isChecked, () => {
        var checkedViews;
        var view;
        if (_isCheckingAll) {
          return;
        }
        checkedViews = (() => {
          var _i;
          var _len;
          var _ref1;
          var _results;
          _ref1 = _predictionViews();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            view = _ref1[_i];
            if (view.isChecked()) {
              _results.push(view);
            }
          }
          return _results;
        })();
        return _canComparePredictions(arePredictionsComparable(checkedViews));
      });
      view = () => {
        if (_hasFrame) {
          return _.insertAndExecuteCell('cs', `getPrediction model: ${ flowPrelude$19.stringify(_modelKey) }, frame: ${ flowPrelude$19.stringify(_frameKey) }`);
        }
      };
      inspect = () => {
        if (_hasFrame) {
          return _.insertAndExecuteCell('cs', `inspect getPrediction model: ${ flowPrelude$19.stringify(_modelKey) }, frame: ${ flowPrelude$19.stringify(_frameKey) }`);
        }
      };
      return {
        modelKey: _modelKey,
        frameKey: _frameKey,
        modelCategory: prediction.model_category,
        isChecked: _isChecked,
        hasFrame: _hasFrame,
        view,
        inspect
      };
    };
    _predictionsTable = _.inspect('predictions', _predictions);
    _metricsTable = _.inspect('metrics', _predictions);
    _scoresTable = _.inspect('scores', _predictions);
    comparePredictions = () => {
      var selectedKeys;
      var view;
      selectedKeys = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = _predictionViews();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          if (view.isChecked()) {
            _results.push({
              model: view.modelKey,
              frame: view.frameKey
            });
          }
        }
        return _results;
      })();
      return _.insertAndExecuteCell('cs', `getPredictions ${ flowPrelude$19.stringify(selectedKeys) }`);
    };
    plotPredictions = () => _.insertAndExecuteCell('cs', _predictionsTable.metadata.plot);
    plotScores = () => _.insertAndExecuteCell('cs', _scoresTable.metadata.plot);
    plotMetrics = () => _.insertAndExecuteCell('cs', _metricsTable.metadata.plot);
    inspectAll = () => _.insertAndExecuteCell('cs', `inspect ${ _predictionsTable.metadata.origin }`);
    predict = () => _.insertAndExecuteCell('cs', 'predict');
    initialize = predictions => {
      _predictionViews(lodash.map(predictions, createPredictionView));
      return lodash.defer(_go);
    };
    initialize(_predictions);
    return {
      predictionViews: _predictionViews,
      hasPredictions: _predictions.length > 0,
      comparePredictions,
      canComparePredictions: _canComparePredictions,
      checkAllPredictions: _checkAllPredictions,
      plotPredictions,
      plotScores,
      plotMetrics,
      inspect: inspectAll,
      predict,
      rocCurve: _rocCurve,
      template: 'flow-predicts-output'
    };
  }

  const flowPrelude$20 = flowPreludeFunction();

  function h2oPredictOutput(_, _go, prediction) {
    var lodash = window._;
    var Flow = window.Flow;
    var frame;
    var inspect;
    var model;
    var renderPlot;
    var table;
    var tableName;
    var _canInspect;
    var _i;
    var _len;
    var _plots;
    var _ref;
    var _ref1;
    if (prediction) {
      frame = prediction.frame, model = prediction.model;
    }
    _plots = Flow.Dataflow.signals([]);
    _canInspect = prediction.__meta;
    renderPlot = (title, prediction, render) => {
      var combineWithFrame;
      var container;
      container = Flow.Dataflow.signal(null);
      combineWithFrame = () => {
        var predictionsFrameName;
        var targetFrameName;
        predictionsFrameName = prediction.predictions.frame_id.name;
        targetFrameName = `combined-${ predictionsFrameName }`;
        return _.insertAndExecuteCell('cs', `bindFrames ${ flowPrelude$20.stringify(targetFrameName) }, [ ${ flowPrelude$20.stringify(predictionsFrameName) }, ${ flowPrelude$20.stringify(frame.name) } ]`);
      };
      render((error, vis) => {
        if (error) {
          return console.debug(error);
        }
        $('a', vis.element).on('click', e => {
          var $a;
          $a = $(e.target);
          switch ($a.attr('data-type')) {
            case 'frame':
              return _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$20.stringify($a.attr('data-key')) }`);
            case 'model':
              return _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$20.stringify($a.attr('data-key')) }`);
          }
        });
        return container(vis.element);
      });
      return _plots.push({
        title,
        plot: container,
        combineWithFrame,
        canCombineWithFrame: title === 'Prediction'
      });
    };
    if (prediction) {
      switch ((_ref = prediction.__meta) != null ? _ref.schema_type : void 0) {
        case 'ModelMetricsBinomial':
          if (table = _.inspect('Prediction - Metrics for Thresholds', prediction)) {
            renderPlot('ROC Curve', prediction, _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1))));
          }
      }
      _ref1 = _.ls(prediction);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tableName = _ref1[_i];
        if (table = _.inspect(tableName, prediction)) {
          if (table.indices.length > 1) {
            renderPlot(tableName, prediction, _.plot(g => g(g.select(), g.from(table))));
          } else {
            renderPlot(tableName, prediction, _.plot(g => g(g.select(0), g.from(table))));
          }
        }
      }
    }
    inspect = () => _.insertAndExecuteCell('cs', `inspect getPrediction model: ${ flowPrelude$20.stringify(model.name) }, frame: ${ flowPrelude$20.stringify(frame.name) }`);
    lodash.defer(_go);
    return {
      plots: _plots,
      inspect,
      canInspect: _canInspect,
      template: 'flow-predict-output'
    };
  }

  function h2oH2OFrameOutput(_, _go, _result) {
    var lodash = window._;
    var Flow = window.Flow;
    var createH2oFrameView;
    var _h2oframeView;
    _h2oframeView = Flow.Dataflow.signal(null);
    createH2oFrameView = result => ({
      h2oframe_id: result.h2oframe_id
    });
    _h2oframeView(createH2oFrameView(_result));
    lodash.defer(_go);
    return {
      h2oframeView: _h2oframeView,
      template: 'flow-h2oframe-output'
    };
  }

  const flowPrelude$21 = flowPreludeFunction();

  function h2oFrameOutput(_, _go, _frame) {
    var lodash = window._;
    var Flow = window.Flow;
    var MaxItemsPerPage;
    var createModel;
    var deleteFrame;
    var download;
    var exportFrame;
    var goToNextPage;
    var goToPreviousPage;
    var inspect;
    var inspectData;
    var predict;
    var refreshColumns;
    var renderFrame;
    var renderGrid;
    var renderPlot;
    var splitFrame;
    var _canGoToNextPage;
    var _canGoToPreviousPage;
    var _chunkSummary;
    var _columnNameSearchTerm;
    var _currentPage;
    var _distributionSummary;
    var _grid;
    var _lastUsedSearchTerm;
    var _maxPages;
    MaxItemsPerPage = 20;
    _grid = Flow.Dataflow.signal(null);
    _chunkSummary = Flow.Dataflow.signal(null);
    _distributionSummary = Flow.Dataflow.signal(null);
    _columnNameSearchTerm = Flow.Dataflow.signal(null);
    _currentPage = Flow.Dataflow.signal(0);
    _maxPages = Flow.Dataflow.signal(Math.ceil(_frame.total_column_count / MaxItemsPerPage));
    _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, index => index > 0);
    _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, (maxPages, index) => index < maxPages - 1);
    renderPlot = (container, render) => render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      return container(vis.element);
    });
    renderGrid = render => render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      $('a', vis.element).on('click', e => {
        var $a;
        $a = $(e.target);
        switch ($a.attr('data-type')) {
          case 'summary-link':
            return _.insertAndExecuteCell('cs', `getColumnSummary ${ flowPrelude$21.stringify(_frame.frame_id.name) }, ${ flowPrelude$21.stringify($a.attr('data-key')) }`);
          case 'as-factor-link':
            return _.insertAndExecuteCell('cs', `changeColumnType frame: ${ flowPrelude$21.stringify(_frame.frame_id.name) }, column: ${ flowPrelude$21.stringify($a.attr('data-key')) }, type: \'enum\'`);
          case 'as-numeric-link':
            return _.insertAndExecuteCell('cs', `changeColumnType frame: ${ flowPrelude$21.stringify(_frame.frame_id.name) }, column: ${ flowPrelude$21.stringify($a.attr('data-key')) }, type: \'int\'`);
        }
      });
      return _grid(vis.element);
    });
    createModel = () => _.insertAndExecuteCell('cs', `assist buildModel, null, training_frame: ${ flowPrelude$21.stringify(_frame.frame_id.name) }`);
    inspect = () => _.insertAndExecuteCell('cs', `inspect getFrameSummary ${ flowPrelude$21.stringify(_frame.frame_id.name) }`);
    inspectData = () => _.insertAndExecuteCell('cs', `getFrameData ${ flowPrelude$21.stringify(_frame.frame_id.name) }`);
    splitFrame = () => _.insertAndExecuteCell('cs', `assist splitFrame, ${ flowPrelude$21.stringify(_frame.frame_id.name) }`);
    predict = () => _.insertAndExecuteCell('cs', `predict frame: ${ flowPrelude$21.stringify(_frame.frame_id.name) }`);
    download = () => window.open(`${ window.Flow.ContextPath }${ `3/DownloadDataset?frame_id=${ encodeURIComponent(_frame.frame_id.name) }` }`, '_blank');
    exportFrame = () => _.insertAndExecuteCell('cs', `exportFrame ${ flowPrelude$21.stringify(_frame.frame_id.name) }`);
    deleteFrame = () => _.confirm('Are you sure you want to delete this frame?', {
      acceptCaption: 'Delete Frame',
      declineCaption: 'Cancel'
    }, accept => {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteFrame ${ flowPrelude$21.stringify(_frame.frame_id.name) }`);
      }
    });
    renderFrame = frame => {
      renderGrid(_.plot(g => g(g.select(), g.from(_.inspect('columns', frame)))));
      renderPlot(_chunkSummary, _.plot(g => g(g.select(), g.from(_.inspect('Chunk compression summary', frame)))));
      return renderPlot(_distributionSummary, _.plot(g => g(g.select(), g.from(_.inspect('Frame distribution summary', frame)))));
    };
    _lastUsedSearchTerm = null;
    refreshColumns = pageIndex => {
      var itemCount;
      var searchTerm;
      var startIndex;
      searchTerm = _columnNameSearchTerm();
      if (searchTerm !== _lastUsedSearchTerm) {
        pageIndex = 0;
      }
      startIndex = pageIndex * MaxItemsPerPage;
      itemCount = startIndex + MaxItemsPerPage < _frame.total_column_count ? MaxItemsPerPage : _frame.total_column_count - startIndex;
      return _.requestFrameSummarySliceE(_frame.frame_id.name, searchTerm, startIndex, itemCount, (error, frame) => {
        if (error) {
          // empty
        } else {
          _lastUsedSearchTerm = searchTerm;
          _currentPage(pageIndex);
          return renderFrame(frame);
        }
      });
    };
    goToPreviousPage = () => {
      var currentPage;
      currentPage = _currentPage();
      if (currentPage > 0) {
        refreshColumns(currentPage - 1);
      }
    };
    goToNextPage = () => {
      var currentPage;
      currentPage = _currentPage();
      if (currentPage < _maxPages() - 1) {
        refreshColumns(currentPage + 1);
      }
    };
    Flow.Dataflow.react(_columnNameSearchTerm, lodash.throttle(refreshColumns, 500));
    renderFrame(_frame);
    lodash.defer(_go);
    return {
      key: _frame.frame_id.name,
      rowCount: _frame.rows,
      columnCount: _frame.total_column_count,
      size: Flow.Util.formatBytes(_frame.byte_size),
      chunkSummary: _chunkSummary,
      distributionSummary: _distributionSummary,
      columnNameSearchTerm: _columnNameSearchTerm,
      grid: _grid,
      inspect,
      createModel,
      inspectData,
      splitFrame,
      predict,
      download,
      exportFrame,
      canGoToPreviousPage: _canGoToPreviousPage,
      canGoToNextPage: _canGoToNextPage,
      goToPreviousPage,
      goToNextPage,
      deleteFrame,
      template: 'flow-frame-output'
    };
  }

  const flowPrelude$22 = flowPreludeFunction();

  function h2oColumnSummaryOutput(_, _go, frameKey, frame, columnName) {
    var lodash = window._;
    var Flow = window.Flow;
    var column;
    var impute;
    var inspect;
    var renderPlot;
    var table;
    var _characteristicsPlot;
    var _distributionPlot;
    var _domainPlot;
    var _summaryPlot;
    column = lodash.head(frame.columns);
    _characteristicsPlot = Flow.Dataflow.signal(null);
    _summaryPlot = Flow.Dataflow.signal(null);
    _distributionPlot = Flow.Dataflow.signal(null);
    _domainPlot = Flow.Dataflow.signal(null);
    renderPlot = (target, render) => render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      return target(vis.element);
    });
    if (table = _.inspect('characteristics', frame)) {
      renderPlot(_characteristicsPlot, _.plot(g => g(g.rect(g.position(g.stack(g.avg('percent'), 0), 'All'), g.fillColor('characteristic')), g.groupBy(g.factor(g.value('All')), 'characteristic'), g.from(table))));
    }
    if (table = _.inspect('distribution', frame)) {
      renderPlot(_distributionPlot, _.plot(g => g(g.rect(g.position('interval', 'count'), g.width(g.value(1))), g.from(table))));
    }
    if (table = _.inspect('summary', frame)) {
      renderPlot(_summaryPlot, _.plot(g => g(g.schema(g.position('min', 'q1', 'q2', 'q3', 'max', 'column')), g.from(table))));
    }
    if (table = _.inspect('domain', frame)) {
      renderPlot(_domainPlot, _.plot(g => g(g.rect(g.position('count', 'label')), g.from(table), g.limit(1000))));
    }
    impute = () => _.insertAndExecuteCell('cs', `imputeColumn frame: ${ flowPrelude$22.stringify(frameKey) }, column: ${ flowPrelude$22.stringify(columnName) }`);
    inspect = () => _.insertAndExecuteCell('cs', `inspect getColumnSummary ${ flowPrelude$22.stringify(frameKey) }, ${ flowPrelude$22.stringify(columnName) }`);
    lodash.defer(_go);
    return {
      label: column.label,
      characteristicsPlot: _characteristicsPlot,
      summaryPlot: _summaryPlot,
      distributionPlot: _distributionPlot,
      domainPlot: _domainPlot,
      impute,
      inspect,
      template: 'flow-column-summary-output'
    };
  }

  function h2oExportFrameOutput(_, _go, result) {
    var lodash = window._;
    lodash.defer(_go);
    return { template: 'flow-export-frame-output' };
  }

  const flowPrelude$23 = flowPreludeFunction();

  function h2oBindFramesOutput(_, _go, key, result) {
    var lodash = window._;
    var Flow = window.Flow;
    var viewFrame;
    viewFrame = () => _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$23.stringify(key) }`);
    lodash.defer(_go);
    return {
      viewFrame,
      template: 'flow-bind-frames-output'
    };
  }

  function h2oExportModelOutput(_, _go, result) {
    var lodash = window._;
    lodash.defer(_go);
    return { template: 'flow-export-model-output' };
  }

  const flowPrelude$24 = flowPreludeFunction();

  function h2oImportFilesOutput(_, _go, _importResults) {
    var lodash = window._;
    var Flow = window.Flow;
    var createImportView;
    var parse;
    var _allFrames;
    var _canParse;
    var _importViews;
    var _title;
    _allFrames = lodash.flatten(lodash.compact(lodash.map(_importResults, result => result.destination_frames)));
    _canParse = _allFrames.length > 0;
    _title = `${ _allFrames.length } / ${ _importResults.length } files imported.`;
    createImportView = result => ({
      files: result.files,
      template: 'flow-import-file-output'
    });
    _importViews = lodash.map(_importResults, createImportView);
    parse = () => {
      var paths;
      paths = lodash.map(_allFrames, flowPrelude$24.stringify);
      return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${ paths.join(',') } ]`);
    };
    lodash.defer(_go);
    return {
      title: _title,
      importViews: _importViews,
      canParse: _canParse,
      parse,
      template: 'flow-import-files-output',
      templateOf(view) {
        return view.template;
      }
    };
  }

  function h2oRDDsOutput(_, _go, _rDDs) {
    var lodash = window._;
    var Flow = window.Flow;
    var createRDDView;
    var _rDDViews;
    _rDDViews = Flow.Dataflow.signal([]);
    createRDDView = rDD => ({
      id: rDD.rdd_id,
      name: rDD.name,
      partitions: rDD.partitions
    });
    _rDDViews(lodash.map(_rDDs, createRDDView));
    lodash.defer(_go);
    return {
      rDDViews: _rDDViews,
      hasRDDs: _rDDs.length > 0,
      template: 'flow-rdds-output'
    };
  }

  function h2oDataFramesOutput(_, _go, _dataFrames) {
    var lodash = window._;
    var Flow = window.Flow;
    var createDataFrameView;
    var _dataFramesViews;
    _dataFramesViews = Flow.Dataflow.signal([]);
    createDataFrameView = dataFrame => ({
      dataframe_id: dataFrame.dataframe_id,
      partitions: dataFrame.partitions
    });
    _dataFramesViews(lodash.map(_dataFrames, createDataFrameView));
    lodash.defer(_go);
    return {
      dataFrameViews: _dataFramesViews,
      hasDataFrames: _dataFrames.length > 0,
      template: 'flow-dataframes-output'
    };
  }

  function h2oScalaCodeOutput(_, _go, _result) {
    var lodash = window._;
    var Flow = window.Flow;
    var createScalaCodeView;
    var _scalaCodeView;
    var _scalaLinkText;
    var _scalaResponseVisible;
    _scalaCodeView = Flow.Dataflow.signal(null);
    _scalaResponseVisible = Flow.Dataflow.signal(false);
    _scalaLinkText = Flow.Dataflow.signal('Show Scala Response');
    createScalaCodeView = result => ({
      output: result.output,
      response: result.response,
      status: result.status,
      scalaResponseVisible: _scalaResponseVisible,
      scalaLinkText: _scalaLinkText,

      toggleVisibility() {
        _scalaResponseVisible(!_scalaResponseVisible());
        if (_scalaResponseVisible()) {
          return _scalaLinkText('Hide Scala Response');
        }
        return _scalaLinkText('Show Scala Response');
      }
    });
    _scalaCodeView(createScalaCodeView(_result));
    lodash.defer(_go);
    return {
      scalaCodeView: _scalaCodeView,
      template: 'flow-scala-code-output'
    };
  }

  function h2oScalaIntpOutput(_, _go, _result) {
    var lodash = window._;
    var Flow = window.Flow;
    var createScalaIntpView;
    var _scalaIntpView;
    _scalaIntpView = Flow.Dataflow.signal(null);
    createScalaIntpView = result => ({
      session_id: result.session_id
    });
    _scalaIntpView(createScalaIntpView(_result));
    lodash.defer(_go);
    return {
      scalaIntpView: _scalaIntpView,
      template: 'flow-scala-intp-output'
    };
  }

  function h2oAssist(_, _go, _items) {
    var lodash = window._;
    var createAssistItem;
    var item;
    var name;
    createAssistItem = (name, item) => ({
      name,
      description: item.description,
      icon: `fa fa-${ item.icon } flow-icon`,

      execute() {
        return _.insertAndExecuteCell('cs', name);
      }
    });
    lodash.defer(_go);
    return {
      routines: (() => {
        var _results;
        _results = [];
        for (name in _items) {
          if ({}.hasOwnProperty.call(_items, name)) {
            item = _items[name];
            _results.push(createAssistItem(name, item));
          }
        }
        return _results;
      })(),
      template: 'flow-assist'
    };
  }

  const flowPrelude$25 = flowPreludeFunction();

  function h2oImportFilesInput(_, _go) {
    var lodash = window._;
    var Flow = window.Flow;
    var createFileItem;
    var createFileItems;
    var createSelectedFileItem;
    var deselectAllFiles;
    var importFiles;
    var importSelectedFiles;
    var listPathHints;
    var processImportResult;
    var selectAllFiles;
    var tryImportFiles;
    var _exception;
    var _hasErrorMessage;
    var _hasImportedFiles;
    var _hasSelectedFiles;
    var _hasUnselectedFiles;
    var _importedFileCount;
    var _importedFiles;
    var _selectedFileCount;
    var _selectedFiles;
    var _selectedFilesDictionary;
    var _specifiedPath;
    _specifiedPath = Flow.Dataflow.signal('');
    _exception = Flow.Dataflow.signal('');
    _hasErrorMessage = Flow.Dataflow.lift(_exception, exception => {
      if (exception) {
        return true;
      }
      return false;
    });
    tryImportFiles = () => {
      var specifiedPath;
      specifiedPath = _specifiedPath();
      return _.requestFileGlob(specifiedPath, -1, (error, result) => {
        if (error) {
          return _exception(error.stack);
        }
        _exception('');
        return processImportResult(result);
      });
    };
    _importedFiles = Flow.Dataflow.signals([]);
    _importedFileCount = Flow.Dataflow.lift(_importedFiles, files => {
      if (files.length) {
        return `Found ${ Flow.Util.describeCount(files.length, 'file') }:`;
      }
      return '';
    });
    _hasImportedFiles = Flow.Dataflow.lift(_importedFiles, files => files.length > 0);
    _hasUnselectedFiles = Flow.Dataflow.lift(_importedFiles, files => lodash.some(files, file => !file.isSelected()));
    _selectedFiles = Flow.Dataflow.signals([]);
    _selectedFilesDictionary = Flow.Dataflow.lift(_selectedFiles, files => {
      var dictionary;
      var file;
      var _i;
      var _len;
      dictionary = {};
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        dictionary[file.path] = true;
      }
      return dictionary;
    });
    _selectedFileCount = Flow.Dataflow.lift(_selectedFiles, files => {
      if (files.length) {
        return `${ Flow.Util.describeCount(files.length, 'file') } selected:`;
      }
      return '(No files selected)';
    });
    _hasSelectedFiles = Flow.Dataflow.lift(_selectedFiles, files => files.length > 0);
    importFiles = files => {
      var paths;
      paths = lodash.map(files, file => flowPrelude$25.stringify(file.path));
      return _.insertAndExecuteCell('cs', `importFiles [ ${ paths.join(',') } ]`);
    };
    importSelectedFiles = () => importFiles(_selectedFiles());
    createSelectedFileItem = path => {
      var self;
      return self = {
        path,
        deselect() {
          var file;
          var _i;
          var _len;
          var _ref;
          _selectedFiles.remove(self);
          _ref = _importedFiles();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            if (file.path === path) {
              file.isSelected(false);
            }
          }
        }
      };
    };
    createFileItem = (path, isSelected) => {
      var self;
      self = {
        path,
        isSelected: Flow.Dataflow.signal(isSelected),
        select() {
          _selectedFiles.push(createSelectedFileItem(self.path));
          return self.isSelected(true);
        }
      };
      Flow.Dataflow.act(self.isSelected, isSelected => _hasUnselectedFiles(lodash.some(_importedFiles(), file => !file.isSelected())));
      return self;
    };
    createFileItems = result => lodash.map(result.matches, path => createFileItem(path, _selectedFilesDictionary()[path]));
    listPathHints = (query, process) => _.requestFileGlob(query, 10, (error, result) => {
      if (!error) {
        return process(lodash.map(result.matches, value => ({
          value
        })));
      }
    });
    selectAllFiles = () => {
      var dict;
      var file;
      var _i;
      var _j;
      var _len;
      var _len1;
      var _ref;
      var _ref1;
      dict = {};
      _ref = _selectedFiles();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        dict[file.path] = true;
      }
      _ref1 = _importedFiles();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        file = _ref1[_j];
        if (!dict[file.path]) {
          file.select();
        }
      }
    };
    deselectAllFiles = () => {
      var file;
      var _i;
      var _len;
      var _ref;
      _selectedFiles([]);
      _ref = _importedFiles();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        file.isSelected(false);
      }
    };
    processImportResult = result => {
      var files;
      files = createFileItems(result);
      return _importedFiles(files);
    };
    lodash.defer(_go);
    return {
      specifiedPath: _specifiedPath,
      hasErrorMessage: _hasErrorMessage,
      exception: _exception,
      tryImportFiles,
      listPathHints: lodash.throttle(listPathHints, 100),
      hasImportedFiles: _hasImportedFiles,
      importedFiles: _importedFiles,
      importedFileCount: _importedFileCount,
      selectedFiles: _selectedFiles,
      selectAllFiles,
      deselectAllFiles,
      hasUnselectedFiles: _hasUnselectedFiles,
      hasSelectedFiles: _hasSelectedFiles,
      selectedFileCount: _selectedFileCount,
      importSelectedFiles,
      template: 'flow-import-files'
    };
  }

  function h2oAutoModelInput(_, _go, opts) {
    var lodash = window._;
    var Flow = window.Flow;
    var buildModel;
    var defaultMaxRunTime;
    var _canBuildModel;
    var _column;
    var _columns;
    var _frame;
    var _frames;
    var _hasFrame;
    var _maxRunTime;
    if (opts == null) {
      opts = {};
    }
    _frames = Flow.Dataflow.signal([]);
    _frame = Flow.Dataflow.signal(null);
    _hasFrame = Flow.Dataflow.lift(_frame, frame => {
      if (frame) {
        return true;
      }
      return false;
    });
    _columns = Flow.Dataflow.signal([]);
    _column = Flow.Dataflow.signal(null);
    _canBuildModel = Flow.Dataflow.lift(_frame, _column, (frame, column) => frame && column);
    defaultMaxRunTime = 3600;
    _maxRunTime = Flow.Dataflow.signal(defaultMaxRunTime);
    buildModel = () => {
      var arg;
      var maxRunTime;
      var parsed;
      maxRunTime = defaultMaxRunTime;
      if (!lodash.isNaN(parsed = parseInt(_maxRunTime(), 10))) {
        maxRunTime = parsed;
      }
      arg = {
        frame: _frame(),
        column: _column(),
        maxRunTime
      };
      return _.insertAndExecuteCell('cs', `buildAutoModel ${ JSON.stringify(arg) }`);
    };
    _.requestFrames((error, frames) => {
      var frame;
      if (error) {
        // empty
      } else {
        _frames((() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = frames.length; _i < _len; _i++) {
            frame = frames[_i];
            if (!frame.is_text) {
              _results.push(frame.frame_id.name);
            }
          }
          return _results;
        })());
        if (opts.frame) {
          _frame(opts.frame);
        }
      }
    });
    Flow.Dataflow.react(_frame, frame => {
      if (frame) {
        return _.requestFrameSummaryWithoutData(frame, (error, frame) => {
          var column;
          if (error) {
            // empty
          } else {
            _columns((() => {
              var _i;
              var _len;
              var _ref;
              var _results;
              _ref = frame.columns;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                column = _ref[_i];
                _results.push(column.label);
              }
              return _results;
            })());
            if (opts.column) {
              _column(opts.column);
              return delete opts.column;
            }
          }
        });
      }
      return _columns([]);
    });
    lodash.defer(_go);
    return {
      frames: _frames,
      frame: _frame,
      hasFrame: _hasFrame,
      columns: _columns,
      column: _column,
      maxRunTime: _maxRunTime,
      canBuildModel: _canBuildModel,
      buildModel,
      template: 'flow-automodel-input'
    };
  }

  const flowPrelude$26 = flowPreludeFunction();

  function h2oPredictInput(_, _go, opt) {
    var lodash = window._;
    var Flow = window.Flow;
    var predict;
    var _canPredict;
    var _computeDeepFeaturesHiddenLayer;
    var _computeLeafNodeAssignment;
    var _computeReconstructionError;
    var _deepFeaturesHiddenLayer;
    var _deepFeaturesHiddenLayerValue;
    var _destinationKey;
    var _exception;
    var _exemplarIndex;
    var _exemplarIndexValue;
    var _frames;
    var _hasExemplarIndex;
    var _hasFrames;
    var _hasLeafNodeAssignment;
    var _hasModels;
    var _hasReconError;
    var _isDeepLearning;
    var _models;
    var _ref;
    var _selectedFrame;
    var _selectedFrames;
    var _selectedFramesCaption;
    var _selectedModel;
    var _selectedModels;
    var _selectedModelsCaption;
    _destinationKey = Flow.Dataflow.signal((_ref = opt.predictions_frame) != null ? _ref : `prediction-${ Flow.Util.uuid() }`);
    _selectedModels = opt.models ? opt.models : opt.model ? [opt.model] : [];
    _selectedFrames = opt.frames ? opt.frames : opt.frame ? [opt.frame] : [];
    _selectedModelsCaption = _selectedModels.join(', ');
    _selectedFramesCaption = _selectedFrames.join(', ');
    _exception = Flow.Dataflow.signal(null);
    _selectedFrame = Flow.Dataflow.signal(null);
    _selectedModel = Flow.Dataflow.signal(null);
    _hasFrames = _selectedFrames.length;
    _hasModels = _selectedModels.length;
    _frames = Flow.Dataflow.signals([]);
    _models = Flow.Dataflow.signals([]);
    _isDeepLearning = Flow.Dataflow.lift(_selectedModel, model => model && model.algo === 'deeplearning');
    _hasReconError = Flow.Dataflow.lift(_selectedModel, model => {
      var parameter;
      var _i;
      var _len;
      var _ref1;
      if (model) {
        if (model.algo === 'deeplearning') {
          _ref1 = model.parameters;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            parameter = _ref1[_i];
            if (parameter.name === 'autoencoder' && parameter.actual_value === true) {
              return true;
            }
          }
        }
      }
      return false;
    });
    _hasLeafNodeAssignment = Flow.Dataflow.lift(_selectedModel, model => {
      if (model) {
        switch (model.algo) {
          case 'gbm':
          case 'drf':
            return true;
          default:
            return false;
        }
      }
    });
    _hasExemplarIndex = Flow.Dataflow.lift(_selectedModel, model => {
      if (model) {
        switch (model.algo) {
          case 'aggregator':
            return true;
          default:
            return false;
        }
      }
    });
    _computeReconstructionError = Flow.Dataflow.signal(false);
    _computeDeepFeaturesHiddenLayer = Flow.Dataflow.signal(false);
    _computeLeafNodeAssignment = Flow.Dataflow.signal(false);
    _deepFeaturesHiddenLayer = Flow.Dataflow.signal(0);
    _deepFeaturesHiddenLayerValue = Flow.Dataflow.lift(_deepFeaturesHiddenLayer, text => parseInt(text, 10));
    _exemplarIndex = Flow.Dataflow.signal(0);
    _exemplarIndexValue = Flow.Dataflow.lift(_exemplarIndex, text => parseInt(text, 10));
    _canPredict = Flow.Dataflow.lift(_selectedFrame, _selectedModel, _hasReconError, _computeReconstructionError, _computeDeepFeaturesHiddenLayer, _deepFeaturesHiddenLayerValue, _exemplarIndexValue, _hasExemplarIndex, (frame, model, hasReconError, computeReconstructionError, computeDeepFeaturesHiddenLayer, deepFeaturesHiddenLayerValue, exemplarIndexValue, hasExemplarIndex) => {
      var hasFrameAndModel;
      var hasValidOptions;
      hasFrameAndModel = frame && model || _hasFrames && model || _hasModels && frame || _hasModels && hasExemplarIndex;
      hasValidOptions = hasReconError ? computeReconstructionError ? true : computeDeepFeaturesHiddenLayer ? !lodash.isNaN(deepFeaturesHiddenLayerValue) : true : true;
      return hasFrameAndModel && hasValidOptions;
    });
    if (!_hasFrames) {
      _.requestFrames((error, frames) => {
        var frame;
        if (error) {
          return _exception(new Flow.Error('Error fetching frame list.', error));
        }
        return _frames((() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = frames.length; _i < _len; _i++) {
            frame = frames[_i];
            if (!frame.is_text) {
              _results.push(frame.frame_id.name);
            }
          }
          return _results;
        })());
      });
    }
    if (!_hasModels) {
      _.requestModels((error, models) => {
        var model;
        if (error) {
          return _exception(new Flow.Error('Error fetching model list.', error));
        }
        return _models((() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = models.length; _i < _len; _i++) {
            model = models[_i];
            _results.push(model.model_id.name);
          }
          return _results;
        })());
      });
    }
    if (!_selectedModel()) {
      if (opt.model && lodash.isString(opt.model)) {
        _.requestModel(opt.model, (error, model) => _selectedModel(model));
      }
    }
    predict = () => {
      var cs;
      var destinationKey;
      var frameArg;
      var modelArg;
      if (_hasFrames) {
        frameArg = _selectedFrames.length > 1 ? _selectedFrames : lodash.head(_selectedFrames);
        modelArg = _selectedModel();
      } else if (_hasModels) {
        modelArg = _selectedModels.length > 1 ? _selectedModels : lodash.head(_selectedModels);
        frameArg = _selectedFrame();
      } else {
        modelArg = _selectedModel();
        frameArg = _selectedFrame();
      }
      destinationKey = _destinationKey();
      cs = `predict model: ${ flowPrelude$26.stringify(modelArg) }, frame: ${ flowPrelude$26.stringify(frameArg) }`;
      if (destinationKey) {
        cs += `, predictions_frame: ${ flowPrelude$26.stringify(destinationKey) }`;
      }
      if (_hasReconError()) {
        if (_computeReconstructionError()) {
          cs += ', reconstruction_error: true';
        }
      }
      if (_computeDeepFeaturesHiddenLayer()) {
        cs += `, deep_features_hidden_layer: ${ _deepFeaturesHiddenLayerValue() }`;
      }
      if (_hasLeafNodeAssignment()) {
        if (_computeLeafNodeAssignment()) {
          cs += ', leaf_node_assignment: true';
        }
      }
      if (_hasExemplarIndex()) {
        cs += `, exemplar_index: ${ _exemplarIndexValue() }`;
      }
      return _.insertAndExecuteCell('cs', cs);
    };
    lodash.defer(_go);
    return {
      destinationKey: _destinationKey,
      exception: _exception,
      hasModels: _hasModels,
      hasFrames: _hasFrames,
      canPredict: _canPredict,
      selectedFramesCaption: _selectedFramesCaption,
      selectedModelsCaption: _selectedModelsCaption,
      selectedFrame: _selectedFrame,
      selectedModel: _selectedModel,
      frames: _frames,
      models: _models,
      predict,
      isDeepLearning: _isDeepLearning,
      hasReconError: _hasReconError,
      hasLeafNodeAssignment: _hasLeafNodeAssignment,
      hasExemplarIndex: _hasExemplarIndex,
      computeReconstructionError: _computeReconstructionError,
      computeDeepFeaturesHiddenLayer: _computeDeepFeaturesHiddenLayer,
      computeLeafNodeAssignment: _computeLeafNodeAssignment,
      deepFeaturesHiddenLayer: _deepFeaturesHiddenLayer,
      exemplarIndex: _exemplarIndex,
      template: 'flow-predict-input'
    };
  }

  const flowPrelude$27 = flowPreludeFunction();

  function h2oCreateFrameInput(_, _go) {
    var lodash = window._;
    var Flow = window.Flow;
    var createFrame;
    var _binaryFraction;
    var _binaryOnesFraction;
    var _categoricalFraction;
    var _columns;
    var _factors;
    var _hasResponse;
    var _integerFraction;
    var _integerRange;
    var _key;
    var _missingFraction;
    var _randomize;
    var _realRange;
    var _responseFactors;
    var _rows;
    var _seed;
    var _seed_for_column_types;
    var _stringFraction;
    var _timeFraction;
    var _value;
    _key = Flow.Dataflow.signal('');
    _rows = Flow.Dataflow.signal(10000);
    _columns = Flow.Dataflow.signal(100);
    _seed = Flow.Dataflow.signal(7595850248774472000);
    _seed_for_column_types = Flow.Dataflow.signal(-1);
    _randomize = Flow.Dataflow.signal(true);
    _value = Flow.Dataflow.signal(0);
    _realRange = Flow.Dataflow.signal(100);
    _categoricalFraction = Flow.Dataflow.signal(0.1);
    _factors = Flow.Dataflow.signal(5);
    _integerFraction = Flow.Dataflow.signal(0.5);
    _binaryFraction = Flow.Dataflow.signal(0.1);
    _binaryOnesFraction = Flow.Dataflow.signal(0.02);
    _timeFraction = Flow.Dataflow.signal(0);
    _stringFraction = Flow.Dataflow.signal(0);
    _integerRange = Flow.Dataflow.signal(1);
    _missingFraction = Flow.Dataflow.signal(0.01);
    _responseFactors = Flow.Dataflow.signal(2);
    _hasResponse = Flow.Dataflow.signal(false);
    createFrame = () => {
      var opts;
      opts = {
        dest: _key(),
        rows: _rows(),
        cols: _columns(),
        seed: _seed(),
        seed_for_column_types: _seed_for_column_types(),
        randomize: _randomize(),
        value: _value(),
        real_range: _realRange(),
        categorical_fraction: _categoricalFraction(),
        factors: _factors(),
        integer_fraction: _integerFraction(),
        binary_fraction: _binaryFraction(),
        binary_ones_fraction: _binaryOnesFraction(),
        time_fraction: _timeFraction(),
        string_fraction: _stringFraction(),
        integer_range: _integerRange(),
        missing_fraction: _missingFraction(),
        response_factors: _responseFactors(),
        has_response: _hasResponse()
      };
      return _.insertAndExecuteCell('cs', `createFrame ${ flowPrelude$27.stringify(opts) }`);
    };
    lodash.defer(_go);
    return {
      key: _key,
      rows: _rows,
      columns: _columns,
      seed: _seed,
      seed_for_column_types: _seed_for_column_types,
      randomize: _randomize,
      value: _value,
      realRange: _realRange,
      categoricalFraction: _categoricalFraction,
      factors: _factors,
      integerFraction: _integerFraction,
      binaryFraction: _binaryFraction,
      binaryOnesFraction: _binaryOnesFraction,
      timeFraction: _timeFraction,
      stringFraction: _stringFraction,
      integerRange: _integerRange,
      missingFraction: _missingFraction,
      responseFactors: _responseFactors,
      hasResponse: _hasResponse,
      createFrame,
      template: 'flow-create-frame-input'
    };
  }

  const flowPrelude$28 = flowPreludeFunction();

  function h2oSplitFrameInput(_, _go, _frameKey) {
    var lodash = window._;
    var Flow = window.Flow;
    var addSplit;
    var addSplitRatio;
    var collectKeys;
    var collectRatios;
    var computeSplits;
    var createSplit;
    var createSplitName;
    var format4f;
    var initialize;
    var splitFrame;
    var updateSplitRatiosAndNames;
    var _frame;
    var _frames;
    var _lastSplitKey;
    var _lastSplitRatio;
    var _lastSplitRatioText;
    var _seed;
    var _splits;
    var _validationMessage;
    _frames = Flow.Dataflow.signal([]);
    _frame = Flow.Dataflow.signal(null);
    _lastSplitRatio = Flow.Dataflow.signal(1);
    format4f = value => value.toPrecision(4).replace(/0+$/, '0');
    _lastSplitRatioText = Flow.Dataflow.lift(_lastSplitRatio, ratio => {
      if (lodash.isNaN(ratio)) {
        return ratio;
      }
      return format4f(ratio);
    });
    _lastSplitKey = Flow.Dataflow.signal('');
    _splits = Flow.Dataflow.signals([]);
    _seed = Flow.Dataflow.signal(Math.random() * 1000000 | 0);
    Flow.Dataflow.react(_splits, () => updateSplitRatiosAndNames());
    _validationMessage = Flow.Dataflow.signal('');
    collectRatios = () => {
      var entry;
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _splits();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        _results.push(entry.ratio());
      }
      return _results;
    };
    collectKeys = () => {
      var entry;
      var splitKeys;
      splitKeys = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = _splits();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          _results.push(entry.key().trim());
        }
        return _results;
      })();
      splitKeys.push(_lastSplitKey().trim());
      return splitKeys;
    };
    createSplitName = (key, ratio) => `${ key }_${ format4f(ratio) }`;
    updateSplitRatiosAndNames = () => {
      var entry;
      var frame;
      var frameKey;
      var lastSplitRatio;
      var ratio;
      var totalRatio;
      var _i;
      var _j;
      var _len;
      var _len1;
      var _ref;
      var _ref1;
      totalRatio = 0;
      _ref = collectRatios();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ratio = _ref[_i];
        totalRatio += ratio;
      }
      lastSplitRatio = _lastSplitRatio(1 - totalRatio);
      frameKey = (frame = _frame()) ? frame : 'frame';
      _ref1 = _splits();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        entry = _ref1[_j];
        entry.key(createSplitName(frameKey, entry.ratio()));
      }
      _lastSplitKey(createSplitName(frameKey, _lastSplitRatio()));
    };
    computeSplits = go => {
      var key;
      var ratio;
      var splitKeys;
      var splitRatios;
      var totalRatio;
      var _i;
      var _j;
      var _len;
      var _len1;
      if (!_frame()) {
        return go('Frame not specified.');
      }
      splitRatios = collectRatios();
      totalRatio = 0;
      for (_i = 0, _len = splitRatios.length; _i < _len; _i++) {
        ratio = splitRatios[_i];
        if (ratio > 0 && ratio < 1) {
          totalRatio += ratio;
        } else {
          return go('One or more split ratios are invalid. Ratios should between 0 and 1.');
        }
      }
      if (totalRatio >= 1) {
        return go('Sum of ratios is >= 1.');
      }
      splitKeys = collectKeys();
      for (_j = 0, _len1 = splitKeys.length; _j < _len1; _j++) {
        key = splitKeys[_j];
        if (key === '') {
          return go('One or more keys are empty or invalid.');
        }
      }
      if (splitKeys.length < 2) {
        return go('Please specify at least two splits.');
      }
      if (splitKeys.length !== lodash.unique(splitKeys).length) {
        return go('Duplicate keys specified.');
      }
      return go(null, splitRatios, splitKeys);
    };
    createSplit = ratio => {
      var self;
      var _key;
      var _ratio;
      var _ratioText;
      _ratioText = Flow.Dataflow.signal(`${ ratio }`);
      _key = Flow.Dataflow.signal('');
      _ratio = Flow.Dataflow.lift(_ratioText, text => parseFloat(text));
      Flow.Dataflow.react(_ratioText, updateSplitRatiosAndNames);
      flowPrelude$28.remove = () => _splits.remove(self);
      return self = {
        key: _key,
        ratioText: _ratioText,
        ratio: _ratio,
        remove: flowPrelude$28.remove
      };
    };
    addSplitRatio = ratio => _splits.push(createSplit(ratio));
    addSplit = () => addSplitRatio(0);
    splitFrame = () => computeSplits((error, splitRatios, splitKeys) => {
      if (error) {
        return _validationMessage(error);
      }
      _validationMessage('');
      return _.insertAndExecuteCell('cs', `splitFrame ${ flowPrelude$28.stringify(_frame()) }, ${ flowPrelude$28.stringify(splitRatios) }, ${ flowPrelude$28.stringify(splitKeys) }, ${ _seed() }`); // eslint-disable-line
    });
    initialize = () => {
      _.requestFrames((error, frames) => {
        var frame;
        var frameKeys;
        if (!error) {
          frameKeys = (() => {
            var _i;
            var _len;
            var _results;
            _results = [];
            for (_i = 0, _len = frames.length; _i < _len; _i++) {
              frame = frames[_i];
              if (!frame.is_text) {
                _results.push(frame.frame_id.name);
              }
            }
            return _results;
          })();
          frameKeys.sort();
          _frames(frameKeys);
          return _frame(_frameKey);
        }
      });
      addSplitRatio(0.75);
      return lodash.defer(_go);
    };
    initialize();
    return {
      frames: _frames,
      frame: _frame,
      lastSplitRatio: _lastSplitRatio,
      lastSplitRatioText: _lastSplitRatioText,
      lastSplitKey: _lastSplitKey,
      splits: _splits,
      seed: _seed,
      addSplit,
      splitFrame,
      validationMessage: _validationMessage,
      template: 'flow-split-frame-input'
    };
  }

  const flowPrelude$29 = flowPreludeFunction();

  function h2oMergeFramesInput(_, _go) {
    var lodash = window._;
    var Flow = window.Flow;
    var _canMerge;
    var _destinationKey;
    var _exception;
    var _frames;
    var _includeAllLeftRows;
    var _includeAllRightRows;
    var _leftColumns;
    var _merge;
    var _rightColumns;
    var _selectedLeftColumn;
    var _selectedLeftFrame;
    var _selectedRightColumn;
    var _selectedRightFrame;
    _exception = Flow.Dataflow.signal(null);
    _destinationKey = Flow.Dataflow.signal(`merged-${ Flow.Util.uuid() }`);
    _frames = Flow.Dataflow.signals([]);
    _selectedLeftFrame = Flow.Dataflow.signal(null);
    _leftColumns = Flow.Dataflow.signals([]);
    _selectedLeftColumn = Flow.Dataflow.signal(null);
    _includeAllLeftRows = Flow.Dataflow.signal(false);
    _selectedRightFrame = Flow.Dataflow.signal(null);
    _rightColumns = Flow.Dataflow.signals([]);
    _selectedRightColumn = Flow.Dataflow.signal(null);
    _includeAllRightRows = Flow.Dataflow.signal(false);
    _canMerge = Flow.Dataflow.lift(_selectedLeftFrame, _selectedLeftColumn, _selectedRightFrame, _selectedRightColumn, (lf, lc, rf, rc) => lf && lc && rf && rc);
    Flow.Dataflow.react(_selectedLeftFrame, frameKey => {
      if (frameKey) {
        return _.requestFrameSummaryWithoutData(frameKey, (error, frame) => _leftColumns(lodash.map(frame.columns, (column, i) => ({
          label: column.label,
          index: i
        }))));
      }
      _selectedLeftColumn(null);
      return _leftColumns([]);
    });
    Flow.Dataflow.react(_selectedRightFrame, frameKey => {
      if (frameKey) {
        return _.requestFrameSummaryWithoutData(frameKey, (error, frame) => _rightColumns(lodash.map(frame.columns, (column, i) => ({
          label: column.label,
          index: i
        }))));
      }
      _selectedRightColumn(null);
      return _rightColumns([]);
    });
    _merge = () => {
      var cs;
      if (!_canMerge()) {
        return;
      }
      cs = `mergeFrames ${ flowPrelude$29.stringify(_destinationKey()) }, ${ flowPrelude$29.stringify(_selectedLeftFrame()) }, ${ _selectedLeftColumn().index }, ${ _includeAllLeftRows() }, ${ flowPrelude$29.stringify(_selectedRightFrame()) }, ${ _selectedRightColumn().index }, ${ _includeAllRightRows() }`;
      return _.insertAndExecuteCell('cs', cs);
    };
    _.requestFrames((error, frames) => {
      var frame;
      if (error) {
        return _exception(new Flow.Error('Error fetching frame list.', error));
      }
      return _frames((() => {
        var _i;
        var _len;
        var _results;
        _results = [];
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
      destinationKey: _destinationKey,
      frames: _frames,
      selectedLeftFrame: _selectedLeftFrame,
      leftColumns: _leftColumns,
      selectedLeftColumn: _selectedLeftColumn,
      includeAllLeftRows: _includeAllLeftRows,
      selectedRightFrame: _selectedRightFrame,
      rightColumns: _rightColumns,
      selectedRightColumn: _selectedRightColumn,
      includeAllRightRows: _includeAllRightRows,
      merge: _merge,
      canMerge: _canMerge,
      template: 'flow-merge-frames-input'
    };
  }

  const flowPrelude$30 = flowPreludeFunction();

  function h2oPartialDependenceInput(_, _go) {
    var lodash = window._;
    var Flow = window.Flow;
    var _canCompute;
    var _compute;
    var _destinationKey;
    var _exception;
    var _frames;
    var _models;
    var _nbins;
    var _selectedFrame;
    var _selectedModel;
    _exception = Flow.Dataflow.signal(null);
    _destinationKey = Flow.Dataflow.signal(`ppd-${ Flow.Util.uuid() }`);
    _frames = Flow.Dataflow.signals([]);
    _models = Flow.Dataflow.signals([]);
    _selectedModel = Flow.Dataflow.signals(null);
    _selectedFrame = Flow.Dataflow.signal(null);
    _nbins = Flow.Dataflow.signal(20);
    _canCompute = Flow.Dataflow.lift(_destinationKey, _selectedFrame, _selectedModel, _nbins, (dk, sf, sm, nb) => dk && sf && sm && nb);
    _compute = () => {
      var cs;
      var opts;
      if (!_canCompute()) {
        return;
      }
      opts = {
        destination_key: _destinationKey(),
        model_id: _selectedModel(),
        frame_id: _selectedFrame(),
        nbins: _nbins()
      };
      cs = `buildPartialDependence ${ flowPrelude$30.stringify(opts) }`;
      return _.insertAndExecuteCell('cs', cs);
    };
    _.requestFrames((error, frames) => {
      var frame;
      if (error) {
        return _exception(new Flow.Error('Error fetching frame list.', error));
      }
      return _frames((() => {
        var _i;
        var _len;
        var _results;
        _results = [];
        for (_i = 0, _len = frames.length; _i < _len; _i++) {
          frame = frames[_i];
          if (!frame.is_text) {
            _results.push(frame.frame_id.name);
          }
        }
        return _results;
      })());
    });
    _.requestModels((error, models) => {
      var model;
      if (error) {
        return _exception(new Flow.Error('Error fetching model list.', error));
      }
      return _models((() => {
        var _i;
        var _len;
        var _results;
        _results = [];
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
      template: 'flow-partial-dependence-input'
    };
  }

  const flowPrelude$31 = flowPreludeFunction();

  function h2oExportFrameInput(_, _go, frameKey, path, opt) {
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
    _canExportFrame = Flow.Dataflow.lift(_selectedFrame, _path, (frame, path) => frame && path);
    exportFrame = () => _.insertAndExecuteCell('cs', `exportFrame ${ flowPrelude$31.stringify(_selectedFrame()) }, ${ flowPrelude$31.stringify(_path()) }, overwrite: ${ _overwrite() ? 'true' : 'false' }`);
    _.requestFrames((error, frames) => {
      var frame;
      if (error) {
        // empty
      } else {
        _frames((() => {
          var _i;
          var _len;
          var _results;
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

  const flowPrelude$32 = flowPreludeFunction();

  function h2oImportModelInput(_, _go, path, opt) {
    var lodash = window._;
    var Flow = window.Flow;
    var importModel;
    var _canImportModel;
    var _overwrite;
    var _path;
    if (opt == null) {
      opt = {};
    }
    _path = Flow.Dataflow.signal(path);
    _overwrite = Flow.Dataflow.signal(opt.overwrite);
    _canImportModel = Flow.Dataflow.lift(_path, path => path && path.length);
    importModel = () => _.insertAndExecuteCell('cs', `importModel ${ flowPrelude$32.stringify(_path()) }, overwrite: ${ _overwrite() ? 'true' : 'false' }`);
    lodash.defer(_go);
    return {
      path: _path,
      overwrite: _overwrite,
      canImportModel: _canImportModel,
      importModel,
      template: 'flow-import-model-input'
    };
  }

  const flowPrelude$33 = flowPreludeFunction();

  function h2oExportModelInput(_, _go, modelKey, path, opt) {
    var lodash = window._;
    var Flow = window.Flow;
    var exportModel;
    var _canExportModel;
    var _models;
    var _overwrite;
    var _path;
    var _selectedModelKey;
    if (opt == null) {
      opt = {};
    }
    _models = Flow.Dataflow.signal([]);
    _selectedModelKey = Flow.Dataflow.signal(null);
    _path = Flow.Dataflow.signal(null);
    _overwrite = Flow.Dataflow.signal(opt.overwrite);
    _canExportModel = Flow.Dataflow.lift(_selectedModelKey, _path, (modelKey, path) => modelKey && path);
    exportModel = () => _.insertAndExecuteCell('cs', `exportModel ${ flowPrelude$33.stringify(_selectedModelKey()) }, ${ flowPrelude$33.stringify(_path()) }, overwrite: ${ _overwrite() ? 'true' : 'false' }`);
    _.requestModels((error, models) => {
      var model;
      if (error) {
        // empty
      } else {
        _models((() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = models.length; _i < _len; _i++) {
            model = models[_i];
            _results.push(model.model_id.name);
          }
          return _results;
        })());
        return _selectedModelKey(modelKey);
      }
    });
    lodash.defer(_go);
    return {
      models: _models,
      selectedModelKey: _selectedModelKey,
      path: _path,
      overwrite: _overwrite,
      canExportModel: _canExportModel,
      exportModel,
      template: 'flow-export-model-input'
    };
  }

  function h2oNoAssist(_, _go) {
    var lodash = window._;
    lodash.defer(_go);
    return {
      showAssist() {
        return _.insertAndExecuteCell('cs', 'assist');
      },
      template: 'flow-no-assist'
    };
  }

  const flowPrelude$6 = flowPreludeFunction();

  function routines() {
    var lodash = window._;
    var Flow = window.Flow;
    var combineTables;
    var computeFalsePositiveRate;
    var computeTruePositiveRate;
    var concatArrays;
    var convertColumnToVector;
    var convertTableToFrame;
    var createArrays;
    var createDataframe;
    var createFactor;
    var createList;
    var createTempKey;
    var createVector;
    var format4f;
    var format6fi;
    var formatConfusionMatrix;
    var formulateGetPredictionsOrigin;
    var getTwoDimData;
    var lightning;
    var parseAndFormatArray;
    var parseAndFormatObjectArray;
    var parseNaNs;
    var parseNulls;
    var parseNumbers;
    var repeatValues;
    var _assistance;
    var __slice = [].slice;
    lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
    if (lightning.settings) {
      lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
      lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
    }
    createTempKey = () => `flow_${ Flow.Util.uuid().replace(/\-/g, '') }`;
    createVector = lightning.createVector;
    createFactor = lightning.createFactor;
    createList = lightning.createList;
    createDataframe = lightning.createFrame;
    _assistance = {
      importFiles: {
        description: 'Import file(s) into H<sub>2</sub>O',
        icon: 'files-o'
      },
      getFrames: {
        description: 'Get a list of frames in H<sub>2</sub>O',
        icon: 'table'
      },
      splitFrame: {
        description: 'Split a frame into two or more frames',
        icon: 'scissors'
      },
      mergeFrames: {
        description: 'Merge two frames into one',
        icon: 'link'
      },
      getModels: {
        description: 'Get a list of models in H<sub>2</sub>O',
        icon: 'cubes'
      },
      getGrids: {
        description: 'Get a list of grid search results in H<sub>2</sub>O',
        icon: 'th'
      },
      getPredictions: {
        description: 'Get a list of predictions in H<sub>2</sub>O',
        icon: 'bolt'
      },
      getJobs: {
        description: 'Get a list of jobs running in H<sub>2</sub>O',
        icon: 'tasks'
      },
      buildModel: {
        description: 'Build a model',
        icon: 'cube'
      },
      importModel: {
        description: 'Import a saved model',
        icon: 'cube'
      },
      predict: {
        description: 'Make a prediction',
        icon: 'bolt'
      }
    };
    parseNumbers = source => {
      var i;
      var target;
      var value;
      var _i;
      var _len;
      target = new Array(source.length);
      for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
        value = source[i];
        target[i] = value === 'NaN' ? void 0 : value === 'Infinity' ? Number.POSITIVE_INFINITY : value === '-Infinity' ? Number.NEGATIVE_INFINITY : value;
      }
      return target;
    };
    convertColumnToVector = (column, data) => {
      switch (column.type) {
        case 'byte':
        case 'short':
        case 'int':
        case 'integer':
        case 'long':
          return createVector(column.name, 'Number', parseNumbers(data));
        case 'float':
        case 'double':
          return createVector(column.name, 'Number', parseNumbers(data), format4f);
        case 'string':
          return createFactor(column.name, 'String', data);
        case 'matrix':
          return createList(column.name, data, formatConfusionMatrix);
        default:
          return createList(column.name, data);
      }
    };
    convertTableToFrame = (table, tableName, metadata) => {
      var column;
      var i;
      var vectors;
      vectors = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = table.columns;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          column = _ref[i];
          _results.push(convertColumnToVector(column, table.data[i]));
        }
        return _results;
      })();
      return createDataframe(tableName, vectors, lodash.range(table.rowcount), null, metadata);
    };
    getTwoDimData = (table, columnName) => {
      var columnIndex;
      columnIndex = lodash.findIndex(table.columns, column => column.name === columnName);
      if (columnIndex >= 0) {
        return table.data[columnIndex];
      }
      return void 0;
    };
    format4f = number => {
      if (number) {
        if (number === 'NaN') {
          return void 0;
        }
        return number.toFixed(4).replace(/\.0+$/, '.0');
      }
      return number;
    };
    format6fi = number => {
      if (number) {
        if (number === 'NaN') {
          return void 0;
        }
        return number.toFixed(6).replace(/\.0+$/, '');
      }
      return number;
    };
    combineTables = tables => {
      var columnCount;
      var columnData;
      var data;
      var element;
      var i;
      var index;
      var leader;
      var rowCount;
      var table;
      var _i;
      var _j;
      var _k;
      var _l;
      var _len;
      var _len1;
      var _len2;
      var _ref;
      leader = lodash.head(tables);
      rowCount = 0;
      columnCount = leader.data.length;
      data = new Array(columnCount);
      for (_i = 0, _len = tables.length; _i < _len; _i++) {
        table = tables[_i];
        rowCount += table.rowcount;
      }
      for (i = _j = 0; columnCount >= 0 ? _j < columnCount : _j > columnCount; i = columnCount >= 0 ? ++_j : --_j) {
        data[i] = columnData = new Array(rowCount);
        index = 0;
        for (_k = 0, _len1 = tables.length; _k < _len1; _k++) {
          table = tables[_k];
          _ref = table.data[i];
          for (_l = 0, _len2 = _ref.length; _l < _len2; _l++) {
            element = _ref[_l];
            columnData[index++] = element;
          }
        }
      }
      return {
        name: leader.name,
        columns: leader.columns,
        data,
        rowcount: rowCount
      };
    };
    createArrays = (count, length) => {
      var i;
      var _i;
      var _results;
      _results = [];
      for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
        _results.push(new Array(length));
      }
      return _results;
    };
    parseNaNs = source => {
      var element;
      var i;
      var target;
      var _i;
      var _len;
      target = new Array(source.length);
      for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
        element = source[i];
        target[i] = element === 'NaN' ? void 0 : element;
      }
      return target;
    };
    parseNulls = source => {
      var element;
      var i;
      var target;
      var _i;
      var _len;
      target = new Array(source.length);
      for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
        element = source[i];
        target[i] = element != null ? element : void 0;
      }
      return target;
    };
    parseAndFormatArray = source => {
      var element;
      var i;
      var target;
      var _i;
      var _len;
      target = new Array(source.length);
      for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
        element = source[i];
        target[i] = element != null ? lodash.isNumber(element) ? format6fi(element) : element : void 0;
      }
      return target;
    };
    parseAndFormatObjectArray = source => {
      var element;
      var i;
      var target;
      var _i;
      var _len;
      var _ref;
      var _ref1;
      target = new Array(source.length);
      for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
        element = source[i];
        target[i] = element != null ? ((_ref = element.__meta) != null ? _ref.schema_type : void 0) === 'Key<Model>' ? `<a href=\'#\' data-type=\'model\' data-key=${ flowPrelude$6.stringify(element.name) }>${ lodash.escape(element.name) }</a>` : ((_ref1 = element.__meta) != null ? _ref1.schema_type : void 0) === 'Key<Frame>' ? `<a href=\'#\' data-type=\'frame\' data-key=${ flowPrelude$6.stringify(element.name) }>${ lodash.escape(element.name) }</a>` : element : void 0;
      }
      return target;
    };
    repeatValues = (count, value) => {
      var i;
      var target;
      var _i;
      target = new Array(count);
      for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
        target[i] = value;
      }
      return target;
    };
    concatArrays = arrays => {
      var a;
      switch (arrays.length) {
        case 0:
          return [];
        case 1:
          return lodash.head(arrays);
        default:
          a = lodash.head(arrays);
          return a.concat(...lodash.tail(arrays));
      }
    };
    computeTruePositiveRate = cm => {
      var fn;
      var fp;
      var tn;
      var tp;
      var _ref;
      var _ref1;
      (_ref = cm[0], tn = _ref[0], fp = _ref[1]), (_ref1 = cm[1], fn = _ref1[0], tp = _ref1[1]);
      return tp / (tp + fn);
    };
    computeFalsePositiveRate = cm => {
      var fn;
      var fp;
      var tn;
      var tp;
      var _ref;
      var _ref1;
      (_ref = cm[0], tn = _ref[0], fp = _ref[1]), (_ref1 = cm[1], fn = _ref1[0], tp = _ref1[1]);
      return fp / (fp + tn);
    };
    formatConfusionMatrix = cm => {
      var domain;
      var fn;
      var fnr;
      var fp;
      var fpr;
      var normal;
      var strong;
      var table;
      var tbody;
      var tn;
      var tp;
      var tr;
      var yellow;
      var _ref;
      var _ref1;
      var _ref2;
      var _ref3;
      _ref = cm.matrix, (_ref1 = _ref[0], tn = _ref1[0], fp = _ref1[1]), (_ref2 = _ref[1], fn = _ref2[0], tp = _ref2[1]);
      fnr = fn / (tp + fn);
      fpr = fp / (fp + tn);
      domain = cm.domain;
      _ref3 = Flow.HTML.template('table.flow-matrix', 'tbody', 'tr', 'td.strong.flow-center', 'td', 'td.bg-yellow'), table = _ref3[0], tbody = _ref3[1], tr = _ref3[2], strong = _ref3[3], normal = _ref3[4], yellow = _ref3[5];
      return table([tbody([tr([strong('Actual/Predicted'), strong(domain[0]), strong(domain[1]), strong('Error'), strong('Rate')]), tr([strong(domain[0]), yellow(tn), normal(fp), normal(format4f(fpr)), normal(`${ fp } / ${ fp + tn }`)]), tr([strong(domain[1]), normal(fn), yellow(tp), normal(format4f(fnr)), normal(`${ fn } / ${ tp + fn }`)]), tr([strong('Total'), strong(tn + fn), strong(tp + fp), strong(format4f((fn + fp) / (fp + tn + tp + fn))), strong(`${ fn }${ fp } / ${ fp + tn + tp + fn }`)])])]);
    };
    formulateGetPredictionsOrigin = opts => {
      var frameKey;
      var modelKey;
      var opt;
      var sanitizedOpt;
      var sanitizedOpts;
      if (lodash.isArray(opts)) {
        sanitizedOpts = (() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = opts.length; _i < _len; _i++) {
            opt = opts[_i];
            sanitizedOpt = {};
            if (opt.model) {
              sanitizedOpt.model = opt.model;
            }
            if (opt.frame) {
              sanitizedOpt.frame = opt.frame;
            }
            _results.push(sanitizedOpt);
          }
          return _results;
        })();
        return `getPredictions ${ flowPrelude$6.stringify(sanitizedOpts) }`;
      }
      modelKey = opts.model, frameKey = opts.frame;
      if (modelKey && frameKey) {
        return `getPredictions model: ${ flowPrelude$6.stringify(modelKey) }, frame: ${ flowPrelude$6.stringify(frameKey) }`;
      } else if (modelKey) {
        return `getPredictions model: ${ flowPrelude$6.stringify(modelKey) }`;
      } else if (frameKey) {
        return `getPredictions frame: ${ flowPrelude$6.stringify(frameKey) }`;
      }
      return 'getPredictions()';
    };
    H2O.Routines = _ => {
      var asDataFrame;
      var asH2OFrameFromDF;
      var asH2OFrameFromRDD;
      var assist;
      var attrname;
      var bindFrames;
      var blacklistedAttributesBySchema;
      var buildAutoModel;
      var buildModel;
      var buildPartialDependence;
      var cancelJob;
      var changeColumnType;
      var computeSplits;
      var createFrame;
      var createGui;
      var createPlot;
      var deleteAll;
      var deleteFrame;
      var deleteFrames;
      var deleteModel;
      var deleteModels;
      var dump;
      var dumpFuture;
      var exportFrame;
      var exportModel;
      var extendAsDataFrame;
      var extendAsH2OFrame;
      var extendBindFrames;
      var extendCancelJob;
      var extendCloud;
      var extendColumnSummary;
      var extendDataFrames;
      var extendDeletedKeys;
      var extendExportFrame;
      var extendExportModel;
      var extendFrame;
      var extendFrameData;
      var extendFrameSummary;
      var extendFrames;
      var extendGrid;
      var extendGrids;
      var extendGuiForm;
      var extendImportModel;
      var extendImportResults;
      var extendJob;
      var extendJobs;
      var extendLogFile;
      var extendMergeFramesResult;
      var extendModel;
      var extendModels;
      var extendNetworkTest;
      var extendParseResult;
      var extendParseSetupResults;
      var extendPartialDependence;
      var extendPlot;
      var extendPrediction;
      var extendPredictions;
      var extendProfile;
      var extendRDDs;
      var extendScalaCode;
      var extendScalaIntp;
      var extendSplitFrameResult;
      var extendStackTrace;
      var extendTimeline;
      var f;
      var findColumnIndexByColumnLabel;
      var findColumnIndicesByColumnLabels;
      var flow_;
      var getCloud;
      var getColumnSummary;
      var getDataFrames;
      var getFrame;
      var getFrameData;
      var getFrameSummary;
      var getFrames;
      var getGrid;
      var getGrids;
      var getJob;
      var getJobs;
      var getLogFile;
      var getModel;
      var getModelParameterValue;
      var getModels;
      var getPartialDependence;
      var getPrediction;
      var getPredictions;
      var getProfile;
      var getRDDs;
      var getScalaIntp;
      var getStackTrace;
      var getTimeline;
      var grid;
      var gui;
      var importFiles;
      var importModel;
      var imputeColumn;
      var initAssistanceSparklingWater;
      var inspect;
      var inspect$1;
      var inspect$2;
      var inspectFrameColumns;
      var inspectFrameData;
      var inspectModelParameters;
      var inspectNetworkTestResult;
      var inspectObject;
      var inspectObjectArray_;
      var inspectParametersAcrossModels;
      var inspectRawArray_;
      var inspectRawObject_;
      var inspectTwoDimTable_;
      var inspect_;
      var loadScript;
      var ls;
      var mergeFrames;
      var name;
      var parseFiles;
      var plot;
      var predict;
      var proceed;
      var read;
      var render_;
      var requestAsDataFrame;
      var requestAsH2OFrameFromDF;
      var requestAsH2OFrameFromRDD;
      var requestAutoModelBuild;
      var requestBindFrames;
      var requestCancelJob;
      var requestChangeColumnType;
      var requestCloud;
      var requestColumnSummary;
      var requestCreateFrame;
      var requestDataFrames;
      var requestDeleteFrame;
      var requestDeleteFrames;
      var requestDeleteModel;
      var requestDeleteModels;
      var requestExportFrame;
      var requestExportModel;
      var requestFrame;
      var requestFrameData;
      var requestFrameSummary;
      var requestFrameSummarySlice;
      var requestFrames;
      var requestGrid;
      var requestGrids;
      var requestImportAndParseFiles;
      var requestImportAndParseSetup;
      var requestImportFiles;
      var requestImportModel;
      var requestImputeColumn;
      var requestJob;
      var requestJobs;
      var requestLogFile;
      var requestMergeFrames;
      var requestModel;
      var requestModelBuild;
      var requestModels;
      var requestModelsByKeys;
      var requestNetworkTest;
      var requestParseFiles;
      var requestParseSetup;
      var requestPartialDependence;
      var requestPartialDependenceData;
      var requestPredict;
      var requestPrediction;
      var requestPredictions;
      var requestPredicts;
      var requestProfile;
      var requestRDDs;
      var requestRemoveAll;
      var requestScalaCode;
      var requestScalaIntp;
      var requestSplitFrame;
      var requestStackTrace;
      var requestTimeline;
      var routines;
      var routinesOnSw;
      var runScalaCode;
      var schemaTransforms;
      var setupParse;
      var splitFrame;
      var testNetwork;
      var transformBinomialMetrics;
      var unwrapPrediction;
      var _apply;
      var _async;
      var _call;
      var _fork;
      var _get;
      var _isFuture;
      var _join;
      var _plot;
      var _ref;
      var _schemaHacks;
      _fork = function () {
        var args;
        var f;
        f = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
        return Flow.Async.fork(f, args);
      };
      _join = function () {
        var args;
        var go;
        var _i;
        args = arguments.length >= 2 ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), go = arguments[_i++];
        return Flow.Async.join(args, Flow.Async.applicate(go));
      };
      _call = function () {
        var args;
        var go;
        go = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
        return Flow.Async.join(args, Flow.Async.applicate(go));
      };
      _apply = (go, args) => Flow.Async.join(args, go);
      _isFuture = Flow.Async.isFuture;
      _async = Flow.Async.async;
      _get = Flow.Async.get;
      proceed = (func, args, go) => go(null, render_({}, () => func(...[_].concat(args || []))));
      proceed = (func, args, go) => go(null, render_(...[{}, func].concat(args || [])));
      extendGuiForm = form => render_(form, flowForm, form);
      createGui = (controls, go) => go(null, extendGuiForm(Flow.Dataflow.signals(controls || [])));
      gui = controls => _fork(createGui, controls);
      _ref = Flow.Gui;
      for (name in _ref) {
        if ({}.hasOwnProperty.call(_ref, name)) {
          f = _ref[name];
          gui[name] = f;
        }
      }
      flow_ = raw => raw._flow_ || (raw._flow_ = { _cache_: {} });
      render_ = (raw, render) => {
        flow_(raw).render = render;
        return raw;
      };
      render_ = function () {
        var args;
        var raw;
        var render;
        raw = arguments[0], render = arguments[1], args = arguments.length >= 3 ? __slice.call(arguments, 2) : [];
        flow_(raw).render = go => render(...[_, go].concat(args));
        return raw;
      };
      inspect_ = (raw, inspectors) => {
        var attr;
        var root;
        root = flow_(raw);
        if (root.inspect == null) {
          root.inspect = {};
        }
        for (attr in inspectors) {
          if ({}.hasOwnProperty.call(inspectors, attr)) {
            f = inspectors[attr];
            root.inspect[attr] = f;
          }
        }
        return raw;
      };
      inspect = function (a, b) {
        if (arguments.length === 1) {
          return inspect$1(a);
        }
        return inspect$2(a, b);
      };
      inspect$1 = obj => {
        var attr;
        var inspections;
        var inspectors;
        var _ref1;
        if (_isFuture(obj)) {
          return _async(inspect, obj);
        }
        if (inspectors = obj != null ? (_ref1 = obj._flow_) != null ? _ref1.inspect : void 0 : void 0) {
          inspections = [];
          for (attr in inspectors) {
            if ({}.hasOwnProperty.call(inspectors, attr)) {
              f = inspectors[attr];
              inspections.push(inspect$2(attr, obj));
            }
          }
          render_(inspections, h2oInspectsOutput, inspections);
          return inspections;
        }
        return {};
      };
      ls = obj => {
        var inspectors;
        var _ref1;
        if (_isFuture(obj)) {
          return _async(ls, obj);
        }
        if (inspectors = obj != null ? (_ref1 = obj._flow_) != null ? _ref1.inspect : void 0 : void 0) {
          return lodash.keys(inspectors);
        }
        return [];
      };
      inspect$2 = (attr, obj) => {
        var cached;
        var inspection;
        var inspectors;
        var key;
        var root;
        if (!attr) {
          return;
        }
        if (_isFuture(obj)) {
          return _async(inspect, attr, obj);
        }
        if (!obj) {
          return;
        }
        if (!(root = obj._flow_)) {
          return;
        }
        if (!(inspectors = root.inspect)) {
          return;
        }
        if (cached = root._cache_[key = `inspect_${ attr }`]) {
          return cached;
        }
        if (!(f = inspectors[attr])) {
          return;
        }
        if (!lodash.isFunction(f)) {
          return;
        }
        root._cache_[key] = inspection = f();
        render_(inspection, h2oInspectOutput, inspection);
        return inspection;
      };
      _plot = (render, go) => render((error, vis) => {
        if (error) {
          return go(new Flow.Error('Error rendering vis.', error));
        }
        return go(null, vis);
      });
      extendPlot = vis => render_(vis, h2oPlotOutput, vis.element);
      createPlot = (f, go) => _plot(f(lightning), (error, vis) => {
        if (error) {
          return go(error);
        }
        return go(null, extendPlot(vis));
      });
      plot = f => {
        if (_isFuture(f)) {
          return _fork(proceed, h2oPlotInput, f);
        } else if (lodash.isFunction(f)) {
          return _fork(createPlot, f);
        }
        return assist(plot);
      };
      grid = f => plot(g => g(g.select(), g.from(f)));
      transformBinomialMetrics = metrics => {
        var cms;
        var domain;
        var fns;
        var fps;
        var i;
        var scores;
        var tns;
        var tp;
        var tps;
        if (scores = metrics.thresholds_and_metric_scores) {
          domain = metrics.domain;
          tps = getTwoDimData(scores, 'tps');
          tns = getTwoDimData(scores, 'tns');
          fps = getTwoDimData(scores, 'fps');
          fns = getTwoDimData(scores, 'fns');
          cms = (() => {
            var _i;
            var _len;
            var _results;
            _results = [];
            for (i = _i = 0, _len = tps.length; _i < _len; i = ++_i) {
              tp = tps[i];
              _results.push({
                domain,
                matrix: [[tns[i], fps[i]], [fns[i], tp]]
              });
            }
            return _results;
          })();
          scores.columns.push({
            name: 'CM',
            description: 'CM',
            format: 'matrix',
            type: 'matrix'
          });
          scores.data.push(cms);
        }
        return metrics;
      };
      extendCloud = cloud => render_(cloud, h2oCloudOutput, cloud);
      extendTimeline = timeline => render_(timeline, h2oTimelineOutput, timeline);
      extendStackTrace = stackTrace => render_(stackTrace, h2oStackTraceOutput, stackTrace);
      extendLogFile = (cloud, nodeIndex, fileType, logFile) => render_(logFile, h2oLogFileOutput, cloud, nodeIndex, fileType, logFile);
      inspectNetworkTestResult = testResult => () => convertTableToFrame(testResult.table, testResult.table.name, {
        description: testResult.table.name,
        origin: 'testNetwork'
      });
      extendNetworkTest = testResult => {
        inspect_(testResult, { result: inspectNetworkTestResult(testResult) });
        return render_(testResult, h2oNetworkTestOutput, testResult);
      };
      extendProfile = profile => render_(profile, h2oProfileOutput, profile);
      extendFrames = frames => {
        render_(frames, h2oFramesOutput, frames);
        return frames;
      };
      extendSplitFrameResult = result => {
        render_(result, h2oSplitFrameOutput, result);
        return result;
      };
      extendMergeFramesResult = result => {
        render_(result, h2oMergeFramesOutput, result);
        return result;
      };
      extendPartialDependence = result => {
        var data;
        var i;
        var inspections;
        var origin;
        var _i;
        var _len;
        var _ref1;
        inspections = {};
        _ref1 = result.partial_dependence_data;
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          data = _ref1[i];
          origin = `getPartialDependence ${ flowPrelude$6.stringify(result.destination_key) }`;
          inspections[`plot${ i + 1 }`] = inspectTwoDimTable_(origin, `plot${ i + 1 }`, data);
        }
        inspect_(result, inspections);
        render_(result, h2oPartialDependenceOutput, result);
        return result;
      };
      getModelParameterValue = (type, value) => {
        switch (type) {
          case 'Key<Frame>':
          case 'Key<Model>':
            if (value != null) {
              return value.name;
            }
            return void 0;
          // break; // no-unreachable
          case 'VecSpecifier':
            if (value != null) {
              return value.column_name;
            }
            return void 0;
          // break; // no-unreachable
          default:
            if (value != null) {
              return value;
            }
            return void 0;
        }
      };
      inspectParametersAcrossModels = models => () => {
        var data;
        var i;
        var leader;
        var model;
        var modelKeys;
        var parameter;
        var vectors;
        leader = lodash.head(models);
        vectors = (() => {
          var _i;
          var _len;
          var _ref1;
          var _results;
          _ref1 = leader.parameters;
          _results = [];
          for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
            parameter = _ref1[i];
            data = (() => {
              var _j;
              var _len1;
              var _results1;
              _results1 = [];
              for (_j = 0, _len1 = models.length; _j < _len1; _j++) {
                model = models[_j];
                _results1.push(getModelParameterValue(parameter.type, model.parameters[i].actual_value));
              }
              return _results1;
            })();
            switch (parameter.type) {
              case 'enum':
              case 'Frame':
              case 'string':
                _results.push(createFactor(parameter.label, 'String', data));
                break;
              case 'byte':
              case 'short':
              case 'int':
              case 'long':
              case 'float':
              case 'double':
                _results.push(createVector(parameter.label, 'Number', data));
                break;
              case 'string[]':
              case 'byte[]':
              case 'short[]':
              case 'int[]':
              case 'long[]':
              case 'float[]':
              case 'double[]':
                _results.push(createList(parameter.label, data, a => {
                  if (a) {
                    return a;
                  }
                  return void 0;
                }));
                break;
              case 'boolean':
                _results.push(createList(parameter.label, data, a => {
                  if (a) {
                    return 'true';
                  }
                  return 'false';
                }));
                break;
              default:
                _results.push(createList(parameter.label, data));
            }
          }
          return _results;
        })();
        modelKeys = (() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = models.length; _i < _len; _i++) {
            model = models[_i];
            _results.push(model.model_id.name);
          }
          return _results;
        })();
        return createDataframe('parameters', vectors, lodash.range(models.length), null, {
          description: `Parameters for models ${ modelKeys.join(', ') }`,
          origin: `getModels ${ flowPrelude$6.stringify(modelKeys) }`
        });
      };
      inspectModelParameters = model => () => {
        var attr;
        var attrs;
        var data;
        var i;
        var parameter;
        var parameters;
        var vectors;
        parameters = model.parameters;
        attrs = ['label', 'type', 'level', 'actual_value', 'default_value'];
        vectors = (() => {
          var _i;
          var _j;
          var _len;
          var _len1;
          var _results;
          _results = [];
          for (_i = 0, _len = attrs.length; _i < _len; _i++) {
            attr = attrs[_i];
            data = new Array(parameters.length);
            for (i = _j = 0, _len1 = parameters.length; _j < _len1; i = ++_j) {
              parameter = parameters[i];
              data[i] = attr === 'actual_value' ? getModelParameterValue(parameter.type, parameter[attr]) : parameter[attr];
            }
            _results.push(createList(attr, data));
          }
          return _results;
        })();
        return createDataframe('parameters', vectors, lodash.range(parameters.length), null, {
          description: `Parameters for model \'${ model.model_id.name }\'`,
          origin: `getModel ${ flowPrelude$6.stringify(model.model_id.name) }`
        });
      };
      extendJob = job => render_(job, H2O.JobOutput, job);
      extendJobs = jobs => {
        var job;
        var _i;
        var _len;
        for (_i = 0, _len = jobs.length; _i < _len; _i++) {
          job = jobs[_i];
          extendJob(job);
        }
        return render_(jobs, h2oJobsOutput, jobs);
      };
      extendCancelJob = cancellation => render_(cancellation, h2oCancelJobOutput, cancellation);
      extendDeletedKeys = keys => render_(keys, h2oDeleteObjectsOutput, keys);
      inspectTwoDimTable_ = (origin, tableName, table) => () => convertTableToFrame(table, tableName, {
        description: table.description || '',
        origin
      });
      inspectRawArray_ = (name, origin, description, array) => () => createDataframe(name, [createList(name, parseAndFormatArray(array))], lodash.range(array.length), null, {
        description: '',
        origin
      });
      inspectObjectArray_ = (name, origin, description, array) => () => createDataframe(name, [createList(name, parseAndFormatObjectArray(array))], lodash.range(array.length), null, {
        description: '',
        origin
      });
      inspectRawObject_ = (name, origin, description, obj) => () => {
        var k;
        var v;
        var vectors;
        vectors = (() => {
          var _results;
          _results = [];
          for (k in obj) {
            if ({}.hasOwnProperty.call(obj, k)) {
              v = obj[k];
              _results.push(createList(k, [v === null ? void 0 : lodash.isNumber(v) ? format6fi(v) : v]));
            }
          }
          return _results;
        })();
        return createDataframe(name, vectors, lodash.range(1), null, {
          description: '',
          origin
        });
      };
      _schemaHacks = {
        KMeansOutput: { fields: 'names domains help' },
        GBMOutput: { fields: 'names domains help' },
        GLMOutput: { fields: 'names domains help' },
        DRFOutput: { fields: 'names domains help' },
        DeepLearningModelOutput: { fields: 'names domains help' },
        NaiveBayesOutput: { fields: 'names domains help pcond' },
        PCAOutput: { fields: 'names domains help' },
        ModelMetricsBinomialGLM: {
          fields: null,
          transform: transformBinomialMetrics
        },
        ModelMetricsBinomial: {
          fields: null,
          transform: transformBinomialMetrics
        },
        ModelMetricsMultinomialGLM: { fields: null },
        ModelMetricsMultinomial: { fields: null },
        ModelMetricsRegressionGLM: { fields: null },
        ModelMetricsRegression: { fields: null },
        ModelMetricsClustering: { fields: null },
        ModelMetricsAutoEncoder: { fields: null },
        ConfusionMatrix: { fields: null }
      };
      blacklistedAttributesBySchema = (() => {
        var attrs;
        var dict;
        var dicts;
        var field;
        var schema;
        var _i;
        var _len;
        var _ref1;
        dicts = {};
        for (schema in _schemaHacks) {
          if ({}.hasOwnProperty.call(_schemaHacks, schema)) {
            attrs = _schemaHacks[schema];
            dicts[schema] = dict = { __meta: true };
            if (attrs.fields) {
              _ref1 = flowPrelude$6.words(attrs.fields);
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                field = _ref1[_i];
                dict[field] = true;
              }
            }
          }
        }
        return dicts;
      })();
      schemaTransforms = (() => {
        var attrs;
        var schema;
        var transform;
        var transforms;
        transforms = {};
        for (schema in _schemaHacks) {
          if ({}.hasOwnProperty.call(_schemaHacks, schema)) {
            attrs = _schemaHacks[schema];
            if (transform = attrs.transform) {
              transforms[schema] = transform;
            }
          }
        }
        return transforms;
      })();
      inspectObject = (inspections, name, origin, obj) => {
        var attrs;
        var blacklistedAttributes;
        var k;
        var meta;
        var record;
        var schemaType;
        var transform;
        var v;
        var _ref1;
        var _ref2;
        schemaType = (_ref1 = obj.__meta) != null ? _ref1.schema_type : void 0;
        blacklistedAttributes = schemaType ? (attrs = blacklistedAttributesBySchema[schemaType]) ? attrs : {} : {};
        if (transform = schemaTransforms[schemaType]) {
          obj = transform(obj);
        }
        record = {};
        inspections[name] = inspectRawObject_(name, origin, name, record);
        for (k in obj) {
          if ({}.hasOwnProperty.call(obj, k)) {
            v = obj[k];
            if (!blacklistedAttributes[k]) {
              if (v === null) {
                record[k] = null;
              } else {
                if (((_ref2 = v.__meta) != null ? _ref2.schema_type : void 0) === 'TwoDimTable') {
                  inspections[`${ name } - ${ v.name }`] = inspectTwoDimTable_(origin, `${ name } - ${ v.name }`, v);
                } else {
                  if (lodash.isArray(v)) {
                    if (k === 'cross_validation_models' || k === 'cross_validation_predictions' || name === 'output' && (k === 'weights' || k === 'biases')) {
                      inspections[k] = inspectObjectArray_(k, origin, k, v);
                    } else {
                      inspections[k] = inspectRawArray_(k, origin, k, v);
                    }
                  } else if (lodash.isObject(v)) {
                    if (meta = v.__meta) {
                      if (meta.schema_type === 'Key<Frame>') {
                        record[k] = `<a href=\'#\' data-type=\'frame\' data-key=${ flowPrelude$6.stringify(v.name) }>${ lodash.escape(v.name) }</a>`;
                      } else if (meta.schema_type === 'Key<Model>') {
                        record[k] = `<a href=\'#\' data-type=\'model\' data-key=${ flowPrelude$6.stringify(v.name) }>${ lodash.escape(v.name) }</a>`;
                      } else if (meta.schema_type === 'Frame') {
                        record[k] = `<a href=\'#\' data-type=\'frame\' data-key=${ flowPrelude$6.stringify(v.frame_id.name) }>${ lodash.escape(v.frame_id.name) }</a>`;
                      } else {
                        inspectObject(inspections, `${ name } - ${ k }`, origin, v);
                      }
                    } else {
                      console.log(`WARNING: dropping [${ k }] from inspection:`, v);
                    }
                  } else {
                    record[k] = lodash.isNumber(v) ? format6fi(v) : v;
                  }
                }
              }
            }
          }
        }
      };
      extendModel = model => {
        var refresh;
        lodash.extend = model => {
          var inspections;
          var origin;
          var table;
          var tableName;
          var _i;
          var _len;
          var _ref1;
          inspections = {};
          inspections.parameters = inspectModelParameters(model);
          origin = `getModel ${ flowPrelude$6.stringify(model.model_id.name) }`;
          inspectObject(inspections, 'output', origin, model.output);
          if (model.__meta.schema_type === 'NaiveBayesModel') {
            if (lodash.isArray(model.output.pcond)) {
              _ref1 = model.output.pcond;
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                table = _ref1[_i];
                tableName = `output - pcond - ${ table.name }`;
                inspections[tableName] = inspectTwoDimTable_(origin, tableName, table);
              }
            }
          }
          inspect_(model, inspections);
          return model;
        };
        refresh = go => _.requestModel(model.model_id.name, (error, model) => {
          if (error) {
            return go(error);
          }
          return go(null, lodash.extend(model));
        });
        lodash.extend(model);
        return render_(model, h2oModelOutput, model, refresh);
      };
      extendGrid = (grid, opts) => {
        var inspections;
        var origin;
        origin = `getGrid ${ flowPrelude$6.stringify(grid.grid_id.name) }`;
        if (opts) {
          origin += `, ${ flowPrelude$6.stringify(opts) }`;
        }
        inspections = {
          summary: inspectTwoDimTable_(origin, 'summary', grid.summary_table),
          scoring_history: inspectTwoDimTable_(origin, 'scoring_history', grid.scoring_history)
        };
        inspect_(grid, inspections);
        return render_(grid, h2oGridOutput, grid);
      };
      extendGrids = grids => render_(grids, h2oGridsOutput, grids);
      extendModels = models => {
        var algos;
        var inspections;
        var model;
        inspections = {};
        algos = lodash.unique((() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = models.length; _i < _len; _i++) {
            model = models[_i];
            _results.push(model.algo);
          }
          return _results;
        })());
        if (algos.length === 1) {
          inspections.parameters = inspectParametersAcrossModels(models);
        }
        inspect_(models, inspections);
        return render_(models, h2oModelsOutput, models);
      };
      read = value => {
        if (value === 'NaN') {
          return null;
        }
        return value;
      };
      extendPredictions = (opts, predictions) => {
        render_(predictions, h2oPredictsOutput, opts, predictions);
        return predictions;
      };
      extendPrediction = result => {
        var frameKey;
        var inspections;
        var modelKey;
        var prediction;
        var predictionFrame;
        var _ref1;
        modelKey = result.model.name;
        frameKey = (_ref1 = result.frame) != null ? _ref1.name : void 0;
        prediction = lodash.head(result.model_metrics);
        predictionFrame = result.predictions_frame;
        inspections = {};
        if (prediction) {
          inspectObject(inspections, 'Prediction', `getPrediction model: ${ flowPrelude$6.stringify(modelKey) }, frame: ${ flowPrelude$6.stringify(frameKey) }`, prediction);
        } else {
          prediction = {};
          inspectObject(inspections, 'Prediction', `getPrediction model: ${ flowPrelude$6.stringify(modelKey) }, frame: ${ flowPrelude$6.stringify(frameKey) }`, { prediction_frame: predictionFrame });
        }
        inspect_(prediction, inspections);
        return render_(prediction, h2oPredictOutput, prediction);
      };
      inspectFrameColumns = (tableLabel, frameKey, frame, frameColumns) => () => {
        var actionsData;
        var attr;
        var attrs;
        var column;
        var i;
        var labelVector;
        var title;
        var toColumnSummaryLink;
        var toConversionLink;
        var typeVector;
        var vectors;
        attrs = ['label', 'type', 'missing_count|Missing', 'zero_count|Zeros', 'positive_infinity_count|+Inf', 'negative_infinity_count|-Inf', 'min', 'max', 'mean', 'sigma', 'cardinality'];
        toColumnSummaryLink = label => `<a href=\'#\' data-type=\'summary-link\' data-key=${ flowPrelude$6.stringify(label) }>${ lodash.escape(label) }</a>`;
        toConversionLink = value => {
          var label;
          var type;
          var _ref1;
          _ref1 = value.split('\0'), type = _ref1[0], label = _ref1[1];
          switch (type) {
            case 'enum':
              return `<a href=\'#\' data-type=\'as-numeric-link\' data-key=${ flowPrelude$6.stringify(label) }>Convert to numeric</a>`;
            case 'int':
            case 'string':
              return `<a href=\'#\' data-type=\'as-factor-link\' data-key=${ flowPrelude$6.stringify(label) }>Convert to enum</a>'`;
            default:
              return void 0;
          }
        };
        vectors = (() => {
          var _i;
          var _len;
          var _ref1;
          var _results;
          _results = [];
          for (_i = 0, _len = attrs.length; _i < _len; _i++) {
            attr = attrs[_i];
            _ref1 = attr.split('|'), name = _ref1[0], title = _ref1[1];
            title = title != null ? title : name;
            switch (name) {
              case 'min':
                _results.push(createVector(title, 'Number', (() => {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(lodash.head(column.mins));
                  }
                  return _results1;
                })(), format4f));
                break;
              case 'max':
                _results.push(createVector(title, 'Number', (() => {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(lodash.head(column.maxs));
                  }
                  return _results1;
                })(), format4f));
                break;
              case 'cardinality':
                _results.push(createVector(title, 'Number', (() => {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column.type === 'enum' ? column.domain_cardinality : void 0);
                  }
                  return _results1;
                })()));
                break;
              case 'label':
                _results.push(createFactor(title, 'String', (() => {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column[name]);
                  }
                  return _results1;
                })(), null, toColumnSummaryLink));
                break;
              case 'type':
                _results.push(createFactor(title, 'String', (() => {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column[name]);
                  }
                  return _results1;
                })()));
                break;
              case 'mean':
              case 'sigma':
                _results.push(createVector(title, 'Number', (() => {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column[name]);
                  }
                  return _results1;
                })(), format4f));
                break;
              default:
                _results.push(createVector(title, 'Number', (() => {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column[name]);
                  }
                  return _results1;
                })()));
            }
          }
          return _results;
        })();
        labelVector = vectors[0], typeVector = vectors[1];
        actionsData = (() => {
          var _i;
          var _ref1;
          var _results;
          _results = [];
          for (i = _i = 0, _ref1 = frameColumns.length; _ref1 >= 0 ? _i < _ref1 : _i > _ref1; i = _ref1 >= 0 ? ++_i : --_i) {
            _results.push(`${ typeVector.valueAt(i) }\0${ labelVector.valueAt(i) }`);
          }
          return _results;
        })();
        vectors.push(createFactor('Actions', 'String', actionsData, null, toConversionLink));
        return createDataframe(tableLabel, vectors, lodash.range(frameColumns.length), null, {
          description: `A list of ${ tableLabel } in the H2O Frame.`,
          origin: `getFrameSummary ${ flowPrelude$6.stringify(frameKey) }`,
          plot: `plot inspect \'${ tableLabel }\', getFrameSummary ${ flowPrelude$6.stringify(frameKey) }`
        });
      };
      inspectFrameData = (frameKey, frame) => () => {
        var column;
        var domain;
        var frameColumns;
        var index;
        var rowIndex;
        var vectors;
        frameColumns = frame.columns;
        vectors = (() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = frameColumns.length; _i < _len; _i++) {
            column = frameColumns[_i];
            switch (column.type) {
              case 'int':
              case 'real':
                _results.push(createVector(column.label, 'Number', parseNaNs(column.data), format4f));
                break;
              case 'enum':
                domain = column.domain;
                _results.push(createFactor(column.label, 'String', (() => {
                  var _j;
                  var _len1;
                  var _ref1;
                  var _results1;
                  _ref1 = column.data;
                  _results1 = [];
                  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    index = _ref1[_j];
                    _results1.push(index != null ? domain[index] : void 0);
                  }
                  return _results1;
                })()));
                break;
              case 'time':
                _results.push(createVector(column.label, 'Number', parseNaNs(column.data)));
                break;
              case 'string':
              case 'uuid':
                _results.push(createList(column.label, parseNulls(column.string_data)));
                break;
              default:
                _results.push(createList(column.label, parseNulls(column.data)));
            }
          }
          return _results;
        })();
        vectors.unshift(createVector('Row', 'Number', (() => {
          var _i;
          var _ref1;
          var _ref2;
          var _results;
          _results = [];
          for (rowIndex = _i = _ref1 = frame.row_offset, _ref2 = frame.row_count; _ref1 <= _ref2 ? _i < _ref2 : _i > _ref2; rowIndex = _ref1 <= _ref2 ? ++_i : --_i) {
            _results.push(rowIndex + 1);
          }
          return _results;
        })()));
        return createDataframe('data', vectors, lodash.range(frame.row_count - frame.row_offset), null, {
          description: 'A partial list of rows in the H2O Frame.',
          origin: `getFrameData ${ flowPrelude$6.stringify(frameKey) }`
        });
      };
      extendFrameData = (frameKey, frame) => {
        var inspections;
        var origin;
        inspections = { data: inspectFrameData(frameKey, frame) };
        origin = `getFrameData ${ flowPrelude$6.stringify(frameKey) }`;
        inspect_(frame, inspections);
        return render_(frame, h2oFrameDataOutput, frame);
      };
      extendFrame = (frameKey, frame) => {
        var column;
        var enumColumns;
        var inspections;
        var origin;
        inspections = {
          columns: inspectFrameColumns('columns', frameKey, frame, frame.columns),
          data: inspectFrameData(frameKey, frame)
        };
        enumColumns = (() => {
          var _i;
          var _len;
          var _ref1;
          var _results;
          _ref1 = frame.columns;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            column = _ref1[_i];
            if (column.type === 'enum') {
              _results.push(column);
            }
          }
          return _results;
        })();
        if (enumColumns.length > 0) {
          inspections.factors = inspectFrameColumns('factors', frameKey, frame, enumColumns);
        }
        origin = `getFrameSummary ${ flowPrelude$6.stringify(frameKey) }`;
        inspections[frame.chunk_summary.name] = inspectTwoDimTable_(origin, frame.chunk_summary.name, frame.chunk_summary);
        inspections[frame.distribution_summary.name] = inspectTwoDimTable_(origin, frame.distribution_summary.name, frame.distribution_summary);
        inspect_(frame, inspections);
        return render_(frame, h2oFrameOutput, frame);
      };
      extendFrameSummary = (frameKey, frame) => {
        var column;
        var enumColumns;
        var inspections;
        var origin;
        inspections = { columns: inspectFrameColumns('columns', frameKey, frame, frame.columns) };
        enumColumns = (() => {
          var _i;
          var _len;
          var _ref1;
          var _results;
          _ref1 = frame.columns;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            column = _ref1[_i];
            if (column.type === 'enum') {
              _results.push(column);
            }
          }
          return _results;
        })();
        if (enumColumns.length > 0) {
          inspections.factors = inspectFrameColumns('factors', frameKey, frame, enumColumns);
        }
        origin = `getFrameSummary ${ flowPrelude$6.stringify(frameKey) }`;
        inspections[frame.chunk_summary.name] = inspectTwoDimTable_(origin, frame.chunk_summary.name, frame.chunk_summary);
        inspections[frame.distribution_summary.name] = inspectTwoDimTable_(origin, frame.distribution_summary.name, frame.distribution_summary);
        inspect_(frame, inspections);
        return render_(frame, h2oFrameOutput, frame);
      };
      extendColumnSummary = (frameKey, frame, columnName) => {
        var column;
        var inspectCharacteristics;
        var inspectDistribution;
        var inspectDomain;
        var inspectPercentiles;
        var inspectSummary;
        var inspections;
        var rowCount;
        column = lodash.head(frame.columns);
        rowCount = frame.rows;
        inspectPercentiles = () => {
          var vectors;
          vectors = [createVector('percentile', 'Number', frame.default_percentiles), createVector('value', 'Number', column.percentiles)];
          return createDataframe('percentiles', vectors, lodash.range(frame.default_percentiles.length), null, {
            description: `Percentiles for column \'${ column.label }\' in frame \'${ frameKey }\'.`,
            origin: `getColumnSummary ${ flowPrelude$6.stringify(frameKey) }, ${ flowPrelude$6.stringify(columnName) }`
          });
        };
        inspectDistribution = () => {
          var base;
          var binCount;
          var binIndex;
          var bins;
          var count;
          var countData;
          var i;
          var interval;
          var intervalData;
          var m;
          var minBinCount;
          var n;
          var rows;
          var stride;
          var vectors;
          var width;
          var widthData;
          var _i;
          var _j;
          var _k;
          var _l;
          var _len;
          var _ref1;
          minBinCount = 32;
          base = column.histogram_base, stride = column.histogram_stride, bins = column.histogram_bins;
          width = Math.ceil(bins.length / minBinCount);
          interval = stride * width;
          rows = [];
          if (width > 0) {
            binCount = minBinCount + (bins.length % width > 0 ? 1 : 0);
            intervalData = new Array(binCount);
            widthData = new Array(binCount);
            countData = new Array(binCount);
            for (i = _i = 0; binCount >= 0 ? _i < binCount : _i > binCount; i = binCount >= 0 ? ++_i : --_i) {
              m = i * width;
              n = m + width;
              count = 0;
              for (binIndex = _j = m; m <= n ? _j < n : _j > n; binIndex = m <= n ? ++_j : --_j) {
                if (binIndex < bins.length) {
                  count += bins[binIndex];
                }
              }
              intervalData[i] = base + i * interval;
              widthData[i] = interval;
              countData[i] = count;
            }
          } else {
            binCount = bins.length;
            intervalData = new Array(binCount);
            widthData = new Array(binCount);
            countData = new Array(binCount);
            for (i = _k = 0, _len = bins.length; _k < _len; i = ++_k) {
              count = bins[i];
              intervalData[i] = base + i * stride;
              widthData[i] = stride;
              countData[i] = count;
            }
          }
          for (i = _l = _ref1 = binCount - 1; _ref1 <= 0 ? _l <= 0 : _l >= 0; i = _ref1 <= 0 ? ++_l : --_l) {
            if (countData[i] !== 0) {
              binCount = i + 1;
              intervalData = intervalData.slice(0, binCount);
              widthData = widthData.slice(0, binCount);
              countData = countData.slice(0, binCount);
              break;
            }
          }
          vectors = [createFactor('interval', 'String', intervalData), createVector('width', 'Number', widthData), createVector('count', 'Number', countData)];
          return createDataframe('distribution', vectors, lodash.range(binCount), null, {
            description: `Distribution for column \'${ column.label }\' in frame \'${ frameKey }\'.`,
            origin: `getColumnSummary ${ flowPrelude$6.stringify(frameKey) }, ${ flowPrelude$6.stringify(columnName) }`,
            plot: `plot inspect \'distribution\', getColumnSummary ${ flowPrelude$6.stringify(frameKey) }, ${ flowPrelude$6.stringify(columnName) }`
          });
        };
        inspectCharacteristics = () => {
          var characteristicData;
          var count;
          var countData;
          var missing_count;
          var negative_infinity_count;
          var other;
          var percentData;
          var positive_infinity_count;
          var vectors;
          var zero_count;
          missing_count = column.missing_count, zero_count = column.zero_count, positive_infinity_count = column.positive_infinity_count, negative_infinity_count = column.negative_infinity_count;
          other = rowCount - missing_count - zero_count - positive_infinity_count - negative_infinity_count;
          characteristicData = ['Missing', '-Inf', 'Zero', '+Inf', 'Other'];
          countData = [missing_count, negative_infinity_count, zero_count, positive_infinity_count, other];
          percentData = (() => {
            var _i;
            var _len;
            var _results;
            _results = [];
            for (_i = 0, _len = countData.length; _i < _len; _i++) {
              count = countData[_i];
              _results.push(100 * count / rowCount);
            }
            return _results;
          })();
          vectors = [createFactor('characteristic', 'String', characteristicData), createVector('count', 'Number', countData), createVector('percent', 'Number', percentData)];
          return createDataframe('characteristics', vectors, lodash.range(characteristicData.length), null, {
            description: `Characteristics for column \'${ column.label }\' in frame \'${ frameKey }\'.`,
            origin: `getColumnSummary ${ flowPrelude$6.stringify(frameKey) }, ${ flowPrelude$6.stringify(columnName) }`,
            plot: `plot inspect \'characteristics\', getColumnSummary ${ flowPrelude$6.stringify(frameKey) }, ${ flowPrelude$6.stringify(columnName) }`
          });
        };
        inspectSummary = () => {
          var defaultPercentiles;
          var maximum;
          var mean;
          var minimum;
          var outliers;
          var percentiles;
          var q1;
          var q2;
          var q3;
          var vectors;
          defaultPercentiles = frame.default_percentiles;
          percentiles = column.percentiles;
          mean = column.mean;
          q1 = percentiles[defaultPercentiles.indexOf(0.25)];
          q2 = percentiles[defaultPercentiles.indexOf(0.5)];
          q3 = percentiles[defaultPercentiles.indexOf(0.75)];
          outliers = lodash.unique(column.mins.concat(column.maxs));
          minimum = lodash.head(column.mins);
          maximum = lodash.head(column.maxs);
          vectors = [createFactor('column', 'String', [columnName]), createVector('mean', 'Number', [mean]), createVector('q1', 'Number', [q1]), createVector('q2', 'Number', [q2]), createVector('q3', 'Number', [q3]), createVector('min', 'Number', [minimum]), createVector('max', 'Number', [maximum])];
          return createDataframe('summary', vectors, lodash.range(1), null, {
            description: `Summary for column \'${ column.label }\' in frame \'${ frameKey }\'.`,
            origin: `getColumnSummary ${ flowPrelude$6.stringify(frameKey) }, ${ flowPrelude$6.stringify(columnName) }`,
            plot: `plot inspect \'summary\', getColumnSummary ${ flowPrelude$6.stringify(frameKey) }, ${ flowPrelude$6.stringify(columnName) }`
          });
        };
        inspectDomain = () => {
          var counts;
          var i;
          var labels;
          var level;
          var levels;
          var percents;
          var sortedLevels;
          var vectors;
          var _i;
          var _len;
          var _ref1;
          levels = lodash.map(column.histogram_bins, (count, index) => ({
            count,
            index
          }));
          sortedLevels = lodash.sortBy(levels, level => -level.count);
          _ref1 = createArrays(3, sortedLevels.length), labels = _ref1[0], counts = _ref1[1], percents = _ref1[2];
          for (i = _i = 0, _len = sortedLevels.length; _i < _len; i = ++_i) {
            level = sortedLevels[i];
            labels[i] = column.domain[level.index];
            counts[i] = level.count;
            percents[i] = 100 * level.count / rowCount;
          }
          vectors = [createFactor('label', 'String', labels), createVector('count', 'Number', counts), createVector('percent', 'Number', percents)];
          return createDataframe('domain', vectors, lodash.range(sortedLevels.length), null, {
            description: `Domain for column \'${ column.label }\' in frame \'${ frameKey }\'.`,
            origin: `getColumnSummary ${ flowPrelude$6.stringify(frameKey) }, ${ flowPrelude$6.stringify(columnName) }`,
            plot: `plot inspect \'domain\', getColumnSummary ${ flowPrelude$6.stringify(frameKey) }, ${ flowPrelude$6.stringify(columnName) }`
          });
        };
        inspections = { characteristics: inspectCharacteristics };
        switch (column.type) {
          case 'int':
          case 'real':
            if (column.histogram_bins.length) {
              inspections.distribution = inspectDistribution;
            }
            if (!lodash.some(column.percentiles, a => a === 'NaN')) {
              inspections.summary = inspectSummary;
              inspections.percentiles = inspectPercentiles;
            }
            break;
          case 'enum':
            inspections.domain = inspectDomain;
        }
        inspect_(frame, inspections);
        return render_(frame, h2oColumnSummaryOutput, frameKey, frame, columnName);
      };
      requestFrame = (frameKey, go) => _.requestFrameSlice(frameKey, void 0, 0, 20, (error, frame) => {
        if (error) {
          return go(error);
        }
        return go(null, extendFrame(frameKey, frame));
      });
      requestFrameData = (frameKey, searchTerm, offset, count, go) => _.requestFrameSlice(frameKey, searchTerm, offset, count, (error, frame) => {
        if (error) {
          return go(error);
        }
        return go(null, extendFrameData(frameKey, frame));
      });
      requestFrameSummarySlice = (frameKey, searchTerm, offset, length, go) => _.requestFrameSummarySlice(frameKey, searchTerm, offset, length, (error, frame) => {
        if (error) {
          return go(error);
        }
        return go(null, extendFrameSummary(frameKey, frame));
      });
      requestFrameSummary = (frameKey, go) => _.requestFrameSummarySlice(frameKey, void 0, 0, 20, (error, frame) => {
        if (error) {
          return go(error);
        }
        return go(null, extendFrameSummary(frameKey, frame));
      });
      requestColumnSummary = (frameKey, columnName, go) => _.requestColumnSummary(frameKey, columnName, (error, frame) => {
        if (error) {
          return go(error);
        }
        return go(null, extendColumnSummary(frameKey, frame, columnName));
      });
      requestFrames = go => _.requestFrames((error, frames) => {
        if (error) {
          return go(error);
        }
        return go(null, extendFrames(frames));
      });
      requestCreateFrame = (opts, go) => _.requestCreateFrame(opts, (error, result) => {
        if (error) {
          return go(error);
        }
        return _.requestJob(result.key.name, (error, job) => {
          if (error) {
            return go(error);
          }
          return go(null, extendJob(job));
        });
      });
      requestPartialDependence = (opts, go) => _.requestPartialDependence(opts, (error, result) => {
        if (error) {
          return go(error);
        }
        return _.requestJob(result.key.name, (error, job) => {
          if (error) {
            return go(error);
          }
          return go(null, extendJob(job));
        });
      });
      requestPartialDependenceData = (key, go) => _.requestPartialDependenceData(key, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendPartialDependence(result));
      });
      computeSplits = (ratios, keys) => {
        var i;
        var key;
        var part;
        var parts;
        var ratio;
        var splits;
        var sum;
        var _i;
        var _j;
        var _len;
        var _len1;
        var _ref1;
        parts = [];
        sum = 0;
        _ref1 = keys.slice(0, ratios.length);
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          key = _ref1[i];
          sum += ratio = ratios[i];
          parts.push({
            key,
            ratio
          });
        }
        parts.push({
          key: keys[keys.length - 1],
          ratio: 1 - sum
        });
        splits = [];
        sum = 0;
        for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
          part = parts[_j];
          splits.push({
            min: sum,
            max: sum + part.ratio,
            key: part.key
          });
          sum += part.ratio;
        }
        return splits;
      };
      requestBindFrames = (key, sourceKeys, go) => _.requestExec(`(assign ${ key } (cbind ${ sourceKeys.join(' ') }))`, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendBindFrames(key, result));
      });
      requestSplitFrame = (frameKey, splitRatios, splitKeys, seed, go) => {
        var g;
        var i;
        var l;
        var part;
        var randomVecKey;
        var sliceExpr;
        var splits;
        var statements;
        var _i;
        var _len;
        if (splitRatios.length === splitKeys.length - 1) {
          splits = computeSplits(splitRatios, splitKeys);
          randomVecKey = createTempKey();
          statements = [];
          statements.push(`(tmp= ${ randomVecKey } (h2o.runif ${ frameKey } ${ seed }))`);
          for (i = _i = 0, _len = splits.length; _i < _len; i = ++_i) {
            part = splits[i];
            g = i !== 0 ? `(> ${ randomVecKey } ${ part.min })` : null;
            l = i !== splits.length - 1 ? `(<= ${ randomVecKey } ${ part.max })` : null;
            if (g && l) {
              sliceExpr = `(& ${ g } ${ l })`;
            } else {
              if (l) {
                sliceExpr = l;
              } else {
                sliceExpr = g;
              }
            }
            statements.push(`(assign ${ part.key } (rows ${ frameKey } ${ sliceExpr }))`);
          }
          statements.push(`(rm ${ randomVecKey })`);
          return _.requestExec(`(, ${ statements.join(' ') })`, (error, result) => {
            if (error) {
              return go(error);
            }
            return go(null, extendSplitFrameResult({
              keys: splitKeys,
              ratios: splitRatios
            }));
          });
        }
        return go(new Flow.Error('The number of split ratios should be one less than the number of split keys'));
      };
      requestMergeFrames = (destinationKey, leftFrameKey, leftColumnIndex, includeAllLeftRows, rightFrameKey, rightColumnIndex, includeAllRightRows, go) => {
        var lr;
        var rr;
        var statement;
        lr = includeAllLeftRows ? 'TRUE' : 'FALSE';
        rr = includeAllRightRows ? 'TRUE' : 'FALSE';
        statement = `(assign ${ destinationKey } (merge ${ leftFrameKey } ${ rightFrameKey } ${ lr } ${ rr } ${ leftColumnIndex } ${ rightColumnIndex } "radix"))`;
        return _.requestExec(statement, (error, result) => {
          if (error) {
            return go(error);
          }
          return go(null, extendMergeFramesResult({ key: destinationKey }));
        });
      };
      createFrame = opts => {
        if (opts) {
          return _fork(requestCreateFrame, opts);
        }
        return assist(createFrame);
      };
      splitFrame = (frameKey, splitRatios, splitKeys, seed) => {
        if (seed == null) {
          seed = -1;
        }
        if (frameKey && splitRatios && splitKeys) {
          return _fork(requestSplitFrame, frameKey, splitRatios, splitKeys, seed);
        }
        return assist(splitFrame);
      };
      mergeFrames = (destinationKey, leftFrameKey, leftColumnIndex, includeAllLeftRows, rightFrameKey, rightColumnIndex, includeAllRightRows) => {
        if (destinationKey && leftFrameKey && rightFrameKey) {
          return _fork(requestMergeFrames, destinationKey, leftFrameKey, leftColumnIndex, includeAllLeftRows, rightFrameKey, rightColumnIndex, includeAllRightRows);
        }
        return assist(mergeFrames);
      };
      buildPartialDependence = opts => {
        if (opts) {
          return _fork(requestPartialDependence, opts);
        }
        return assist(buildPartialDependence);
      };
      getPartialDependence = destinationKey => {
        if (destinationKey) {
          return _fork(requestPartialDependenceData, destinationKey);
        }
        return assist(getPartialDependence);
      };
      getFrames = () => _fork(requestFrames);
      getFrame = frameKey => {
        switch (flowPrelude$6.typeOf(frameKey)) {
          case 'String':
            return _fork(requestFrame, frameKey);
          default:
            return assist(getFrame);
        }
      };
      bindFrames = (key, sourceKeys) => _fork(requestBindFrames, key, sourceKeys);
      getFrameSummary = frameKey => {
        switch (flowPrelude$6.typeOf(frameKey)) {
          case 'String':
            return _fork(requestFrameSummary, frameKey);
          default:
            return assist(getFrameSummary);
        }
      };
      getFrameData = frameKey => {
        switch (flowPrelude$6.typeOf(frameKey)) {
          case 'String':
            return _fork(requestFrameData, frameKey, void 0, 0, 20);
          default:
            return assist(getFrameSummary);
        }
      };
      requestDeleteFrame = (frameKey, go) => _.requestDeleteFrame(frameKey, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys([frameKey]));
      });
      deleteFrame = frameKey => {
        if (frameKey) {
          return _fork(requestDeleteFrame, frameKey);
        }
        return assist(deleteFrame);
      };
      extendExportFrame = result => render_(result, h2oExportFrameOutput, result);
      extendBindFrames = (key, result) => render_(result, h2oBindFramesOutput, key, result);
      requestExportFrame = (frameKey, path, opts, go) => _.requestExportFrame(frameKey, path, opts.overwrite, (error, result) => {
        if (error) {
          return go(error);
        }
        return _.requestJob(result.job.key.name, (error, job) => {
          if (error) {
            return go(error);
          }
          return go(null, extendJob(job));
        });
      });
      exportFrame = (frameKey, path, opts) => {
        if (opts == null) {
          opts = {};
        }
        if (frameKey && path) {
          return _fork(requestExportFrame, frameKey, path, opts);
        }
        return assist(exportFrame, frameKey, path, opts);
      };
      requestDeleteFrames = (frameKeys, go) => {
        var futures;
        futures = lodash.map(frameKeys, frameKey => _fork(_.requestDeleteFrame, frameKey));
        return Flow.Async.join(futures, (error, results) => {
          if (error) {
            return go(error);
          }
          return go(null, extendDeletedKeys(frameKeys));
        });
      };
      deleteFrames = frameKeys => {
        switch (frameKeys.length) {
          case 0:
            return assist(deleteFrames);
          case 1:
            return deleteFrame(lodash.head(frameKeys));
          default:
            return _fork(requestDeleteFrames, frameKeys);
        }
      };
      getColumnSummary = (frameKey, columnName) => _fork(requestColumnSummary, frameKey, columnName);
      requestModels = go => _.requestModels((error, models) => {
        if (error) {
          return go(error);
        }
        return go(null, extendModels(models));
      });
      requestModelsByKeys = (modelKeys, go) => {
        var futures;
        futures = lodash.map(modelKeys, key => _fork(_.requestModel, key));
        return Flow.Async.join(futures, (error, models) => {
          if (error) {
            return go(error);
          }
          return go(null, extendModels(models));
        });
      };
      getModels = modelKeys => {
        if (lodash.isArray(modelKeys)) {
          if (modelKeys.length) {
            return _fork(requestModelsByKeys, modelKeys);
          }
          return _fork(requestModels);
        }
        return _fork(requestModels);
      };
      requestGrids = go => _.requestGrids((error, grids) => {
        if (error) {
          return go(error);
        }
        return go(null, extendGrids(grids));
      });
      getGrids = () => _fork(requestGrids);
      requestModel = (modelKey, go) => _.requestModel(modelKey, (error, model) => {
        if (error) {
          return go(error);
        }
        return go(null, extendModel(model));
      });
      getModel = modelKey => {
        switch (flowPrelude$6.typeOf(modelKey)) {
          case 'String':
            return _fork(requestModel, modelKey);
          default:
            return assist(getModel);
        }
      };
      requestGrid = (gridKey, opts, go) => _.requestGrid(gridKey, opts, (error, grid) => {
        if (error) {
          return go(error);
        }
        return go(null, extendGrid(grid, opts));
      });
      getGrid = (gridKey, opts) => {
        switch (flowPrelude$6.typeOf(gridKey)) {
          case 'String':
            return _fork(requestGrid, gridKey, opts);
          default:
            return assist(getGrid);
        }
      };
      findColumnIndexByColumnLabel = (frame, columnLabel) => {
        var column;
        var i;
        var _i;
        var _len;
        var _ref1;
        _ref1 = frame.columns;
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          column = _ref1[i];
          if (column.label === columnLabel) {
            return i;
          }
        }
        throw new Flow.Error(`Column [${ columnLabel }] not found in frame`);
      };
      findColumnIndicesByColumnLabels = (frame, columnLabels) => {
        var columnLabel;
        var _i;
        var _len;
        var _results;
        _results = [];
        for (_i = 0, _len = columnLabels.length; _i < _len; _i++) {
          columnLabel = columnLabels[_i];
          _results.push(findColumnIndexByColumnLabel(frame, columnLabel));
        }
        return _results;
      };
      requestImputeColumn = (opts, go) => {
        var column;
        var combineMethod;
        var frame;
        var groupByColumns;
        var method;
        frame = opts.frame, column = opts.column, method = opts.method, combineMethod = opts.combineMethod, groupByColumns = opts.groupByColumns;
        combineMethod = combineMethod != null ? combineMethod : 'interpolate';
        return _.requestFrameSummaryWithoutData(frame, (error, result) => {
          var columnIndex;
          var columnIndicesError;
          var columnKeyError;
          var groupByArg;
          var groupByColumnIndices;
          if (error) {
            return go(error);
          }
          try {
            columnIndex = findColumnIndexByColumnLabel(result, column);
          } catch (_error) {
            columnKeyError = _error;
            return go(columnKeyError);
          }
          if (groupByColumns && groupByColumns.length) {
            try {
              groupByColumnIndices = findColumnIndicesByColumnLabels(result, groupByColumns);
            } catch (_error) {
              columnIndicesError = _error;
              return go(columnIndicesError);
            }
          } else {
            groupByColumnIndices = null;
          }
          groupByArg = groupByColumnIndices ? `[${ groupByColumnIndices.join(' ') }]` : '[]';
          return _.requestExec(`(h2o.impute ${ frame } ${ columnIndex } ${ JSON.stringify(method) } ${ JSON.stringify(combineMethod) } ${ groupByArg } _ _)`, (error, result) => {
            if (error) {
              return go(error);
            }
            return requestColumnSummary(frame, column, go);
          });
        });
      };
      requestChangeColumnType = (opts, go) => {
        var column;
        var frame;
        var method;
        var type;
        frame = opts.frame, column = opts.column, type = opts.type;
        method = type === 'enum' ? 'as.factor' : 'as.numeric';
        return _.requestFrameSummaryWithoutData(frame, (error, result) => {
          var columnIndex;
          var columnKeyError;
          try {
            columnIndex = findColumnIndexByColumnLabel(result, column);
          } catch (_error) {
            columnKeyError = _error;
            return go(columnKeyError);
          }
          return _.requestExec(`(assign ${ frame } (:= ${ frame } (${ method } (cols ${ frame } ${ columnIndex })) ${ columnIndex } [0:${ result.rows }]))`, (error, result) => {
            if (error) {
              return go(error);
            }
            return requestColumnSummary(frame, column, go);
          });
        });
      };
      imputeColumn = opts => {
        if (opts && opts.frame && opts.column && opts.method) {
          return _fork(requestImputeColumn, opts);
        }
        return assist(imputeColumn, opts);
      };
      changeColumnType = opts => {
        if (opts && opts.frame && opts.column && opts.type) {
          return _fork(requestChangeColumnType, opts);
        }
        return assist(changeColumnType, opts);
      };
      requestDeleteModel = (modelKey, go) => _.requestDeleteModel(modelKey, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys([modelKey]));
      });
      deleteModel = modelKey => {
        if (modelKey) {
          return _fork(requestDeleteModel, modelKey);
        }
        return assist(deleteModel);
      };
      extendImportModel = result => render_(result, H2O.ImportModelOutput, result);
      requestImportModel = (path, opts, go) => _.requestImportModel(path, opts.overwrite, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendImportModel(result));
      });
      importModel = (path, opts) => {
        if (path && path.length) {
          return _fork(requestImportModel, path, opts);
        }
        return assist(importModel, path, opts);
      };
      extendExportModel = result => render_(result, h2oExportModelOutput, result);
      requestExportModel = (modelKey, path, opts, go) => _.requestExportModel(modelKey, path, opts.overwrite, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendExportModel(result));
      });
      exportModel = (modelKey, path, opts) => {
        if (modelKey && path) {
          return _fork(requestExportModel, modelKey, path, opts);
        }
        return assist(exportModel, modelKey, path, opts);
      };
      requestDeleteModels = (modelKeys, go) => {
        var futures;
        futures = lodash.map(modelKeys, modelKey => _fork(_.requestDeleteModel, modelKey));
        return Flow.Async.join(futures, (error, results) => {
          if (error) {
            return go(error);
          }
          return go(null, extendDeletedKeys(modelKeys));
        });
      };
      deleteModels = modelKeys => {
        switch (modelKeys.length) {
          case 0:
            return assist(deleteModels);
          case 1:
            return deleteModel(lodash.head(modelKeys));
          default:
            return _fork(requestDeleteModels, modelKeys);
        }
      };
      requestJob = (key, go) => _.requestJob(key, (error, job) => {
        if (error) {
          return go(error);
        }
        return go(null, extendJob(job));
      });
      requestJobs = go => _.requestJobs((error, jobs) => {
        if (error) {
          return go(error);
        }
        return go(null, extendJobs(jobs));
      });
      getJobs = () => _fork(requestJobs);
      getJob = arg => {
        switch (flowPrelude$6.typeOf(arg)) {
          case 'String':
            return _fork(requestJob, arg);
          case 'Object':
            if (arg.key != null) {
              return getJob(arg.key);
            }
            return assist(getJob);
          // break; // no-unreachable
          default:
            return assist(getJob);
        }
      };
      requestCancelJob = (key, go) => _.requestCancelJob(key, error => {
        if (error) {
          return go(error);
        }
        return go(null, extendCancelJob({}));
      });
      cancelJob = arg => {
        switch (flowPrelude$6.typeOf(arg)) {
          case 'String':
            return _fork(requestCancelJob, arg);
          default:
            return assist(cancelJob);
        }
      };
      extendImportResults = importResults => render_(importResults, h2oImportFilesOutput, importResults);
      requestImportFiles = (paths, go) => _.requestImportFiles(paths, (error, importResults) => {
        if (error) {
          return go(error);
        }
        return go(null, extendImportResults(importResults));
      });
      importFiles = paths => {
        switch (flowPrelude$6.typeOf(paths)) {
          case 'Array':
            return _fork(requestImportFiles, paths);
          default:
            return assist(importFiles);
        }
      };
      extendParseSetupResults = (args, parseSetupResults) => render_(parseSetupResults, H2O.SetupParseOutput, args, parseSetupResults);
      requestImportAndParseSetup = (paths, go) => _.requestImportFiles(paths, (error, importResults) => {
        var sourceKeys;
        if (error) {
          return go(error);
        }
        sourceKeys = lodash.flatten(lodash.compact(lodash.map(importResults, result => result.destination_frames)));
        return _.requestParseSetup(sourceKeys, (error, parseSetupResults) => {
          if (error) {
            return go(error);
          }
          return go(null, extendParseSetupResults({ paths }, parseSetupResults));
        });
      });
      requestParseSetup = (sourceKeys, go) => _.requestParseSetup(sourceKeys, (error, parseSetupResults) => {
        if (error) {
          return go(error);
        }
        return go(null, extendParseSetupResults({ source_frames: sourceKeys }, parseSetupResults));
      });
      setupParse = args => {
        if (args.paths && lodash.isArray(args.paths)) {
          return _fork(requestImportAndParseSetup, args.paths);
        } else if (args.source_frames && lodash.isArray(args.source_frames)) {
          return _fork(requestParseSetup, args.source_frames);
        }
        return assist(setupParse);
      };
      extendParseResult = parseResult => render_(parseResult, H2O.JobOutput, parseResult.job);
      requestImportAndParseFiles = (paths, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, go) => _.requestImportFiles(paths, (error, importResults) => {
        var sourceKeys;
        if (error) {
          return go(error);
        }
        sourceKeys = lodash.flatten(lodash.compact(lodash.map(importResults, result => result.destination_frames)));
        return _.requestParseFiles(sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, (error, parseResult) => {
          if (error) {
            return go(error);
          }
          return go(null, extendParseResult(parseResult));
        });
      });
      requestParseFiles = (sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, go) => _.requestParseFiles(sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, (error, parseResult) => {
        if (error) {
          return go(error);
        }
        return go(null, extendParseResult(parseResult));
      });
      parseFiles = opts => {
        var checkHeader;
        var chunkSize;
        var columnCount;
        var columnNames;
        var columnTypes;
        var deleteOnDone;
        var destinationKey;
        var parseType;
        var separator;
        var useSingleQuotes;
        destinationKey = opts.destination_frame;
        parseType = opts.parse_type;
        separator = opts.separator;
        columnCount = opts.number_columns;
        useSingleQuotes = opts.single_quotes;
        columnNames = opts.column_names;
        columnTypes = opts.column_types;
        deleteOnDone = opts.delete_on_done;
        checkHeader = opts.check_header;
        chunkSize = opts.chunk_size;
        if (opts.paths) {
          return _fork(requestImportAndParseFiles, opts.paths, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize);
        }
        return _fork(requestParseFiles, opts.source_frames, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize);
      };
      requestModelBuild = (algo, opts, go) => _.requestModelBuild(algo, opts, (error, result) => {
        var messages;
        var validation;
        if (error) {
          return go(error);
        }
        if (result.error_count > 0) {
          messages = (() => {
            var _i;
            var _len;
            var _ref1;
            var _results;
            _ref1 = result.messages;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              validation = _ref1[_i];
              _results.push(validation.message);
            }
            return _results;
          })();
          return go(new Flow.Error(`Model build failure: ${ messages.join('; ') }`));
        }
        return go(null, extendJob(result.job));
      });
      requestAutoModelBuild = (opts, go) => {
        var params;
        params = {
          input_spec: {
            training_frame: opts.frame,
            response_column: opts.column
          },
          build_control: { stopping_criteria: { max_runtime_secs: opts.maxRunTime } }
        };
        return _.requestAutoModelBuild(params, (error, result) => {
          if (error) {
            return go(error);
          }
          return go(null, extendJob(result.job));
        });
      };
      buildAutoModel = opts => {
        if (opts && lodash.keys(opts).length > 1) {
          return _fork(requestAutoModelBuild, opts);
        }
        return assist(buildAutoModel, opts);
      };
      buildModel = (algo, opts) => {
        if (algo && opts && lodash.keys(opts).length > 1) {
          return _fork(requestModelBuild, algo, opts);
        }
        return assist(buildModel, algo, opts);
      };
      unwrapPrediction = go => (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendPrediction(result));
      };
      requestPredict = (destinationKey, modelKey, frameKey, options, go) => _.requestPredict(destinationKey, modelKey, frameKey, options, unwrapPrediction(go));
      requestPredicts = (opts, go) => {
        var futures;
        futures = lodash.map(opts, opt => {
          var frameKey;
          var modelKey;
          var options;
          modelKey = opt.model, frameKey = opt.frame, options = opt.options;
          return _fork(_.requestPredict, null, modelKey, frameKey, options || {});
        });
        return Flow.Async.join(futures, (error, predictions) => {
          if (error) {
            return go(error);
          }
          return go(null, extendPredictions(opts, predictions));
        });
      };
      predict = opts => {
        var combos;
        var deep_features_hidden_layer;
        var exemplar_index;
        var frame;
        var frames;
        var leaf_node_assignment;
        var model;
        var models;
        var predictions_frame;
        var reconstruction_error;
        var _i;
        var _j;
        var _len;
        var _len1;
        if (opts == null) {
          opts = {};
        }
        predictions_frame = opts.predictions_frame, model = opts.model, models = opts.models, frame = opts.frame, frames = opts.frames, reconstruction_error = opts.reconstruction_error, deep_features_hidden_layer = opts.deep_features_hidden_layer, leaf_node_assignment = opts.leaf_node_assignment, exemplar_index = opts.exemplar_index;
        if (models || frames) {
          if (!models) {
            if (model) {
              models = [model];
            }
          }
          if (!frames) {
            if (frame) {
              frames = [frame];
            }
          }
          if (frames && models) {
            combos = [];
            for (_i = 0, _len = models.length; _i < _len; _i++) {
              model = models[_i];
              for (_j = 0, _len1 = frames.length; _j < _len1; _j++) {
                frame = frames[_j];
                combos.push({
                  model,
                  frame
                });
              }
            }
            return _fork(requestPredicts, combos);
          }
          return assist(predict, {
            predictions_frame,
            models,
            frames
          });
        }
        if (model && frame) {
          return _fork(requestPredict, predictions_frame, model, frame, {
            reconstruction_error,
            deep_features_hidden_layer,
            leaf_node_assignment
          });
        } else if (model && exemplar_index !== void 0) {
          return _fork(requestPredict, predictions_frame, model, null, { exemplar_index });
        }
        return assist(predict, {
          predictions_frame,
          model,
          frame
        });
      };
      requestPrediction = (modelKey, frameKey, go) => _.requestPrediction(modelKey, frameKey, unwrapPrediction(go));
      requestPredictions = (opts, go) => {
        var frameKey;
        var futures;
        var modelKey;
        if (lodash.isArray(opts)) {
          futures = lodash.map(opts, opt => {
            var frameKey;
            var modelKey;
            modelKey = opt.model, frameKey = opt.frame;
            return _fork(_.requestPredictions, modelKey, frameKey);
          });
          return Flow.Async.join(futures, (error, predictions) => {
            var uniquePredictions;
            if (error) {
              return go(error);
            }
            uniquePredictions = lodash.values(lodash.indexBy(lodash.flatten(predictions, true), prediction => prediction.model.name + prediction.frame.name));
            return go(null, extendPredictions(opts, uniquePredictions));
          });
        }
        modelKey = opts.model, frameKey = opts.frame;
        return _.requestPredictions(modelKey, frameKey, (error, predictions) => {
          if (error) {
            return go(error);
          }
          return go(null, extendPredictions(opts, predictions));
        });
      };
      getPrediction = opts => {
        var frame;
        var model;
        var predictions_frame;
        if (opts == null) {
          opts = {};
        }
        predictions_frame = opts.predictions_frame, model = opts.model, frame = opts.frame;
        if (model && frame) {
          return _fork(requestPrediction, model, frame);
        }
        return assist(getPrediction, {
          predictions_frame,
          model,
          frame
        });
      };
      getPredictions = opts => {
        if (opts == null) {
          opts = {};
        }
        return _fork(requestPredictions, opts);
      };
      requestCloud = go => _.requestCloud((error, cloud) => {
        if (error) {
          return go(error);
        }
        return go(null, extendCloud(cloud));
      });
      getCloud = () => _fork(requestCloud);
      requestTimeline = go => _.requestTimeline((error, timeline) => {
        if (error) {
          return go(error);
        }
        return go(null, extendTimeline(timeline));
      });
      getTimeline = () => _fork(requestTimeline);
      requestStackTrace = go => _.requestStackTrace((error, stackTrace) => {
        if (error) {
          return go(error);
        }
        return go(null, extendStackTrace(stackTrace));
      });
      getStackTrace = () => _fork(requestStackTrace);
      requestLogFile = (nodeIndex, fileType, go) => _.requestCloud((error, cloud) => {
        var NODE_INDEX_SELF;
        if (error) {
          return go(error);
        }
        if (nodeIndex < 0 || nodeIndex >= cloud.nodes.length) {
          NODE_INDEX_SELF = -1;
          nodeIndex = NODE_INDEX_SELF;
        }
        return _.requestLogFile(nodeIndex, fileType, (error, logFile) => {
          if (error) {
            return go(error);
          }
          return go(null, extendLogFile(cloud, nodeIndex, fileType, logFile));
        });
      });
      getLogFile = (nodeIndex, fileType) => {
        if (nodeIndex == null) {
          nodeIndex = -1;
        }
        if (fileType == null) {
          fileType = 'info';
        }
        return _fork(requestLogFile, nodeIndex, fileType);
      };
      requestNetworkTest = go => _.requestNetworkTest((error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendNetworkTest(result));
      });
      testNetwork = () => _fork(requestNetworkTest);
      requestRemoveAll = go => _.requestRemoveAll((error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys([]));
      });
      deleteAll = () => _fork(requestRemoveAll);
      extendRDDs = rdds => {
        render_(rdds, h2oRDDsOutput, rdds);
        return rdds;
      };
      requestRDDs = go => _.requestRDDs((error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendRDDs(result.rdds));
      });
      getRDDs = () => _fork(requestRDDs);
      extendDataFrames = dataframes => {
        render_(dataframes, h2oDataFramesOutput, dataframes);
        return dataframes;
      };
      requestDataFrames = go => _.requestDataFrames((error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendDataFrames(result.dataframes));
      });
      getDataFrames = () => _fork(requestDataFrames);
      extendAsH2OFrame = result => {
        render_(result, h2oH2OFrameOutput, result);
        return result;
      };
      requestAsH2OFrameFromRDD = (rdd_id, name, go) => _.requestAsH2OFrameFromRDD(rdd_id, name, (error, h2oframe_id) => {
        if (error) {
          return go(error);
        }
        return go(null, extendAsH2OFrame(h2oframe_id));
      });
      asH2OFrameFromRDD = (rdd_id, name) => {
        if (name == null) {
          name = void 0;
        }
        return _fork(requestAsH2OFrameFromRDD, rdd_id, name);
      };
      requestAsH2OFrameFromDF = (df_id, name, go) => _.requestAsH2OFrameFromDF(df_id, name, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendAsH2OFrame(result));
      });
      asH2OFrameFromDF = (df_id, name) => {
        if (name == null) {
          name = void 0;
        }
        return _fork(requestAsH2OFrameFromDF, df_id, name);
      };
      extendAsDataFrame = result => {
        render_(result, h2oDataFrameOutput, result);
        return result;
      };
      requestAsDataFrame = (hf_id, name, go) => _.requestAsDataFrame(hf_id, name, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendAsDataFrame(result));
      });
      asDataFrame = (hf_id, name) => {
        if (name == null) {
          name = void 0;
        }
        return _fork(requestAsDataFrame, hf_id, name);
      };
      requestScalaCode = (session_id, code, go) => _.requestScalaCode(session_id, code, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendScalaCode(result));
      });
      extendScalaCode = result => {
        render_(result, h2oScalaCodeOutput, result);
        return result;
      };
      runScalaCode = (session_id, code) => _fork(requestScalaCode, session_id, code);
      requestScalaIntp = go => _.requestScalaIntp((error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendScalaIntp(result));
      });
      extendScalaIntp = result => {
        render_(result, h2oScalaIntpOutput, result);
        return result;
      };
      getScalaIntp = () => _fork(requestScalaIntp);
      requestProfile = (depth, go) => _.requestProfile(depth, (error, profile) => {
        if (error) {
          return go(error);
        }
        return go(null, extendProfile(profile));
      });
      getProfile = opts => {
        if (!opts) {
          opts = { depth: 10 };
        }
        return _fork(requestProfile, opts.depth);
      };
      loadScript = (path, go) => {
        var onDone;
        var onFail;
        onDone = (script, status) => go(null, {
          script,
          status
        });
        onFail = (jqxhr, settings, error) => go(error);
        return $.getScript(path).done(onDone).fail(onFail);
      };
      dumpFuture = (result, go) => {
        if (result == null) {
          result = {};
        }
        console.debug(result);
        return go(null, render_(result, Flow.ObjectBrowser, 'dump', result));
      };
      dump = f => {
        if (f != null ? f.isFuture : void 0) {
          return _fork(dumpFuture, f);
        }
        return Flow.Async.async(() => f);
      };
      assist = function () {
        var args;
        var func;
        func = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
        if (func === void 0) {
          return _fork(proceed, h2oAssist, [_assistance]);
        }
        switch (func) {
          case importFiles:
            return _fork(proceed, h2oImportFilesInput, []);
          case buildModel:
            return _fork(proceed, H2O.ModelInput, args);
          case buildAutoModel:
            return _fork(proceed, h2oAutoModelInput, args);
          case predict:
          case getPrediction:
            return _fork(proceed, h2oPredictInput, args);
          case createFrame:
            return _fork(proceed, h2oCreateFrameInput, args);
          case splitFrame:
            return _fork(proceed, h2oSplitFrameInput, args);
          case mergeFrames:
            return _fork(proceed, h2oMergeFramesInput, args);
          case buildPartialDependence:
            return _fork(proceed, h2oPartialDependenceInput, args);
          case exportFrame:
            return _fork(proceed, h2oExportFrameInput, args);
          case imputeColumn:
            return _fork(proceed, H2O.ImputeInput, args);
          case importModel:
            return _fork(proceed, h2oImportModelInput, args);
          case exportModel:
            return _fork(proceed, h2oExportModelInput, args);
          default:
            return _fork(proceed, h2oNoAssist, []);
        }
      };
      Flow.Dataflow.link(_.ready, () => {
        Flow.Dataflow.link(_.ls, ls);
        Flow.Dataflow.link(_.inspect, inspect);
        Flow.Dataflow.link(_.plot, plot => plot(lightning));
        Flow.Dataflow.link(_.grid, frame => lightning(lightning.select(), lightning.from(frame)));
        Flow.Dataflow.link(_.enumerate, frame => lightning(lightning.select(0), lightning.from(frame)));
        Flow.Dataflow.link(_.requestFrameDataE, requestFrameData);
        return Flow.Dataflow.link(_.requestFrameSummarySliceE, requestFrameSummarySlice);
      });
      initAssistanceSparklingWater = () => {
        _assistance.getRDDs = {
          description: 'Get a list of Spark\'s RDDs',
          icon: 'table'
        };
        return _assistance.getDataFrames = {
          description: 'Get a list of Spark\'s data frames',
          icon: 'table'
        };
      };
      Flow.Dataflow.link(_.initialized, () => {
        if (_.onSparklingWater) {
          return initAssistanceSparklingWater();
        }
      });
      routines = {
        fork: _fork,
        join: _join,
        call: _call,
        apply: _apply,
        isFuture: _isFuture,
        signal: Flow.Dataflow.signal,
        signals: Flow.Dataflow.signals,
        isSignal: Flow.Dataflow.isSignal,
        act: Flow.Dataflow.act,
        react: Flow.Dataflow.react,
        lift: Flow.Dataflow.lift,
        merge: Flow.Dataflow.merge,
        dump,
        inspect,
        plot,
        grid,
        get: _get,
        assist,
        gui,
        loadScript,
        getJobs,
        getJob,
        cancelJob,
        importFiles,
        setupParse,
        parseFiles,
        createFrame,
        splitFrame,
        mergeFrames,
        buildPartialDependence,
        getPartialDependence,
        getFrames,
        getFrame,
        bindFrames,
        getFrameSummary,
        getFrameData,
        deleteFrames,
        deleteFrame,
        exportFrame,
        getColumnSummary,
        changeColumnType,
        imputeColumn,
        buildModel,
        buildAutoModel,
        getGrids,
        getModels,
        getModel,
        getGrid,
        deleteModels,
        deleteModel,
        importModel,
        exportModel,
        predict,
        getPrediction,
        getPredictions,
        getCloud,
        getTimeline,
        getProfile,
        getStackTrace,
        getLogFile,
        testNetwork,
        deleteAll
      };
      if (_.onSparklingWater) {
        routinesOnSw = {
          getDataFrames,
          getRDDs,
          getScalaIntp,
          runScalaCode,
          asH2OFrameFromRDD,
          asH2OFrameFromDF,
          asDataFrame
        };
        for (attrname in routinesOnSw) {
          if ({}.hasOwnProperty.call(routinesOnSw, attrname)) {
            routines[attrname] = routinesOnSw[attrname];
          }
        }
      }
      return routines;
    };
  }

  function coreUtils() {
    var lodash = window._;
    var Flow = window.Flow;
    var EOL;
    var describeCount;
    var format1d0;
    var formatBytes;
    var formatClockTime;
    var formatElapsedTime;
    var formatMilliseconds;
    var fromNow;
    var highlight;
    var multilineTextToHTML;
    var padTime;
    var sanitizeName;
    var splitTime;
    describeCount = (count, singular, plural) => {
      if (!plural) {
        plural = `${ singular }s`;
      }
      switch (count) {
        case 0:
          return `No ${ plural }`;
        case 1:
          return `1 ${ singular }`;
        default:
          return `${ count } ${ plural }`;
      }
    };
    fromNow = date => moment(date).fromNow();
    formatBytes = bytes => {
      var i;
      var sizes;
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) {
        return '0 Byte';
      }
      i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
      return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
    };
    padTime = n => `${ n < 10 ? '0' : '' }${ n }`;
    splitTime = s => {
      var hrs;
      var mins;
      var ms;
      var secs;
      ms = s % 1000;
      s = (s - ms) / 1000;
      secs = s % 60;
      s = (s - secs) / 60;
      mins = s % 60;
      hrs = (s - mins) / 60;
      return [hrs, mins, secs, ms];
    };
    formatMilliseconds = s => {
      var hrs;
      var mins;
      var ms;
      var secs;
      var _ref;
      _ref = splitTime(s), hrs = _ref[0], mins = _ref[1], secs = _ref[2], ms = _ref[3];
      return `${ padTime(hrs) }:${ padTime(mins) }:${ padTime(secs) }.${ ms }`;
    };
    format1d0 = n => Math.round(n * 10) / 10;
    formatElapsedTime = s => {
      var hrs;
      var mins;
      var ms;
      var secs;
      var _ref;
      _ref = splitTime(s), hrs = _ref[0], mins = _ref[1], secs = _ref[2], ms = _ref[3];
      if (hrs !== 0) {
        return `${ format1d0((hrs * 60 + mins) / 60) }h`;
      } else if (mins !== 0) {
        return `${ format1d0((mins * 60 + secs) / 60) }m`;
      } else if (secs !== 0) {
        return `${ format1d0((secs * 1000 + ms) / 1000) }s`;
      }
      return `${ ms }ms`;
    };
    formatClockTime = date => moment(date).format('h:mm:ss a');
    EOL = '\n';
    multilineTextToHTML = text => lodash.map(text.split(EOL), str => lodash.escape(str)).join('<br/>');
    sanitizeName = name => name.replace(/[^a-z0-9_ \(\)-]/gi, '-').trim();
    highlight = (code, lang) => {
      if (window.hljs) {
        return window.hljs.highlightAuto(code, [lang]).value;
      }
      return code;
    };
    Flow.Util = {
      describeCount,
      fromNow,
      formatBytes,
      formatMilliseconds,
      formatElapsedTime,
      formatClockTime,
      multilineTextToHTML,
      uuid: (typeof window !== 'undefined' && window !== null ? window.uuid : void 0) ? window.uuid : null,
      sanitizeName,
      highlight
    };
  }

  function localStorage() {
    var lodash = window._;
    var Flow = window.Flow;
    var keyOf;
    var list;
    var purge;
    var purgeAll;
    var read;
    var write;
    var _ls;
    if (!(typeof window !== 'undefined' && window !== null ? window.localStorage : void 0)) {
      return;
    }
    _ls = window.localStorage;
    keyOf = (type, id) => `${ type }:${ id }`;
    list = type => {
      var i;
      var id;
      var key;
      var objs;
      var t;
      var _i;
      var _ref;
      var _ref1;
      objs = [];
      for (i = _i = 0, _ref = _ls.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
        key = _ls.key(i);
        _ref1 = key.split(':'), t = _ref1[0], id = _ref1[1];
        if (type === t) {
          objs.push([type, id, JSON.parse(_ls.getItem(key))]);
        }
      }
      return objs;
    };
    read = (type, id) => {
      var raw;
      if (raw = _ls.getobj(keyOf(type, id))) {
        return JSON.parse(raw);
      }
      return null;
    };
    write = (type, id, obj) => _ls.setItem(keyOf(type, id), JSON.stringify(obj));
    purge = (type, id) => {
      if (id) {
        return _ls.removeItem(keyOf(type, id));
      }
      return purgeAll(type);
    };
    purgeAll = type => {
      var allKeys;
      var i;
      var key;
      var _i;
      var _len;
      allKeys = (() => {
        var _i;
        var _ref;
        var _results;
        _results = [];
        for (i = _i = 0, _ref = _ls.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
          _results.push(_ls.key(i));
        }
        return _results;
      })();
      for (_i = 0, _len = allKeys.length; _i < _len; _i++) {
        key = allKeys[_i];
        if (type === lodash.head(key.split(':'))) {
          _ls.removeItem(key);
        }
      }
    };
    Flow.LocalStorage = {
      list,
      read,
      write,
      purge
    };
  }

  function knockout() {
    var lodash = window._;
    if ((typeof window !== 'undefined' && window !== null ? window.ko : void 0) == null) {
      return;
    }
    ko.bindingHandlers.raw = {
      update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element;
        var arg;
        arg = ko.unwrap(valueAccessor());
        if (arg) {
          $element = $(element);
          $element.empty();
          $element.append(arg);
        }
      }
    };
    ko.bindingHandlers.markdown = {
      update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var data;
        var error;
        var html;
        data = ko.unwrap(valueAccessor());
        try {
          html = marked(data || '');
        } catch (_error) {
          error = _error;
          html = error.message || 'Error rendering markdown.';
        }
        return $(element).html(html);
      }
    };
    ko.bindingHandlers.stringify = {
      update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var data;
        data = ko.unwrap(valueAccessor());
        return $(element).text(JSON.stringify(data, null, 2));
      }
    };
    ko.bindingHandlers.enterKey = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element;
        var action;
        if (action = ko.unwrap(valueAccessor())) {
          if (lodash.isFunction(action)) {
            $element = $(element);
            $element.keydown(e => {
              if (e.which === 13) {
                action(viewModel);
              }
            });
          } else {
            throw 'Enter key action is not a function';
          }
        }
      }
    };
    ko.bindingHandlers.typeahead = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element;
        var action;
        if (action = ko.unwrap(valueAccessor())) {
          if (lodash.isFunction(action)) {
            $element = $(element);
            $element.typeahead(null, {
              displayKey: 'value',
              source: action
            });
          } else {
            throw 'Typeahead action is not a function';
          }
        }
      }
    };
    ko.bindingHandlers.cursorPosition = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var arg;
        if (arg = ko.unwrap(valueAccessor())) {
          arg.getCursorPosition = () => $(element).textrange('get', 'position');
        }
      }
    };
    ko.bindingHandlers.autoResize = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $el;
        var arg;
        var resize;
        if (arg = ko.unwrap(valueAccessor())) {
          arg.autoResize = resize = () => lodash.defer(() => $el.css('height', 'auto').height(element.scrollHeight));
          $el = $(element).on('input', resize);
          resize();
        }
      }
    };
    ko.bindingHandlers.scrollIntoView = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $el;
        var $viewport;
        var arg;
        if (arg = ko.unwrap(valueAccessor())) {
          $el = $(element);
          $viewport = $el.closest('.flow-box-notebook');
          arg.scrollIntoView = immediate => {
            var height;
            var position;
            var top;
            if (immediate == null) {
              immediate = false;
            }
            position = $viewport.scrollTop();
            top = $el.position().top + position;
            height = $viewport.height();
            if (top - 20 < position || top + 20 > position + height) {
              if (immediate) {
                return $viewport.scrollTop(top);
              }
              return $viewport.animate({ scrollTop: top }, 'fast');
            }
          };
        }
      }
    };
    ko.bindingHandlers.collapse = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $caretEl;
        var $el;
        var $nextEl;
        var caretDown;
        var caretEl;
        var caretRight;
        var isCollapsed;
        var toggle;
        caretDown = 'fa-caret-down';
        caretRight = 'fa-caret-right';
        isCollapsed = ko.unwrap(valueAccessor());
        caretEl = document.createElement('i');
        caretEl.className = 'fa';
        caretEl.style.marginRight = '3px';
        element.insertBefore(caretEl, element.firstChild);
        $el = $(element);
        $nextEl = $el.next();
        if (!$nextEl.length) {
          throw new Error('No collapsible sibling found');
        }
        $caretEl = $(caretEl);
        toggle = () => {
          if (isCollapsed) {
            $caretEl.removeClass(caretDown).addClass(caretRight);
            $nextEl.hide();
          } else {
            $caretEl.removeClass(caretRight).addClass(caretDown);
            $nextEl.show();
          }
          return isCollapsed = !isCollapsed;
        };
        $el.css('cursor', 'pointer');
        $el.attr('title', 'Click to expand/collapse');
        $el.on('click', toggle);
        toggle();
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => $el.off('click'));
      }
    };
    ko.bindingHandlers.dom = {
      update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $element;
        var arg;
        arg = ko.unwrap(valueAccessor());
        if (arg) {
          $element = $(element);
          $element.empty();
          $element.append(arg);
        }
      }
    };
    ko.bindingHandlers.dump = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var object;
        return object = ko.unwrap(valueAccessor());
      }
    };
    ko.bindingHandlers.element = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return valueAccessor()(element);
      }
    };
    ko.bindingHandlers.file = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var $file;
        var file;
        file = valueAccessor();
        if (file) {
          $file = $(element);
          $file.change(function () {
            return file(this.files[0]);
          });
        }
      }
    };
    ko.bindingHandlers.codemirror = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var editor;
        var internalTextArea;
        var options;
        options = ko.unwrap(valueAccessor());
        editor = CodeMirror.fromTextArea(element, options);
        editor.on('change', cm => allBindings().value(cm.getValue()));
        element.editor = editor;
        if (allBindings().value()) {
          editor.setValue(allBindings().value());
        }
        internalTextArea = $(editor.getWrapperElement()).find('div textarea');
        internalTextArea.attr('rows', '1');
        internalTextArea.attr('spellcheck', 'false');
        internalTextArea.removeAttr('wrap');
        return editor.refresh();
      },
      update(element, valueAccessor) {
        if (element.editor) {
          return element.editor.refresh();
        }
      }
    };
  }

  function html() {
    var lodash = window._;
    var Flow = window.Flow;
    if ((typeof window !== 'undefined' && window !== null ? window.diecut : void 0) == null) {
      return;
    }
    Flow.HTML = {
      template: diecut,
      render(name, html) {
        var el;
        el = document.createElement(name);
        if (html) {
          if (lodash.isString(html)) {
            el.innerHTML = html;
          } else {
            el.appendChild(html);
          }
        }
        return el;
      }
    };
  }

  function format() {
    var lodash = window._;
    var Flow = window.Flow;
    var Digits;
    var formatDate;
    var formatReal;
    var formatTime;
    var significantDigitsBeforeDecimal;
    var __formatReal;
    significantDigitsBeforeDecimal = value => 1 + Math.floor(Math.log(Math.abs(value)) / Math.LN10);
    Digits = (digits, value) => {
      var magnitude;
      var sd;
      if (value === 0) {
        return 0;
      }
      sd = significantDigitsBeforeDecimal(value);
      if (sd >= digits) {
        return value.toFixed(0);
      }
      magnitude = Math.pow(10, digits - sd);
      return Math.round(value * magnitude) / magnitude;
    };
    if (typeof exports === 'undefined' || exports === null) {
      formatTime = d3.time.format('%Y-%m-%d %H:%M:%S');
    }
    formatDate = time => {
      if (time) {
        return formatTime(new Date(time));
      }
      return '-';
    };
    __formatReal = {};
    formatReal = precision => {
      var cached;
      var format;
      format = (cached = __formatReal[precision]) ? cached : __formatReal[precision] = precision === -1 ? lodash.identity : d3.format(`.${ precision }f`);
      return value => format(value);
    };
    Flow.Format = {
      Digits,
      Real: formatReal,
      Date: formatDate,
      Time: formatTime
    };
  }

  function error$1() {
    var Flow = window.Flow;
    var FlowError;
    var __hasProp = {}.hasOwnProperty;

    var __extends = (child, parent) => {
      var key;
      for (key in parent) {
        if (__hasProp.call(parent, key)) {
          child[key] = parent[key];
        }
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };

    FlowError = (_super => {
      __extends(FlowError, _super);
      function FlowError(message, cause) {
        var error;
        var _ref;
        this.message = message;
        this.cause = cause;
        this.name = 'FlowError';
        if ((_ref = this.cause) != null ? _ref.stack : void 0) {
          this.stack = this.cause.stack;
        } else {
          error = new Error();
          if (error.stack) {
            this.stack = error.stack;
          } else {
            this.stack = printStackTrace();
          }
        }
      }
      return FlowError;
    })(Error);
    Flow.Error = FlowError;
  }

  function flowConfirmDialog(_, _message, _opts, _go) {
    var lodash = window._;
    var Flow = window.Flow;
    var accept;
    var decline;
    if (_opts == null) {
      _opts = {};
    }
    lodash.defaults(_opts, {
      title: 'Confirm',
      acceptCaption: 'Yes',
      declineCaption: 'No'
    });
    accept = () => _go(true);
    decline = () => _go(false);
    return {
      title: _opts.title,
      acceptCaption: _opts.acceptCaption,
      declineCaption: _opts.declineCaption,
      message: Flow.Util.multilineTextToHTML(_message),
      accept,
      decline,
      template: 'confirm-dialog'
    };
  }

  function flowAlertDialog(_, _message, _opts, _go) {
    var lodash = window._;
    var Flow = window.Flow;
    var accept;
    if (_opts == null) {
      _opts = {};
    }
    lodash.defaults(_opts, {
      title: 'Alert',
      acceptCaption: 'OK'
    });
    accept = () => _go(true);
    return {
      title: _opts.title,
      acceptCaption: _opts.acceptCaption,
      message: Flow.Util.multilineTextToHTML(_message),
      accept,
      template: 'alert-dialog'
    };
  }

  function dialogs() {
    var Flow = window.Flow;
    var __slice = [].slice;
    Flow.Dialogs = _ => {
      var showDialog;
      var _dialog;
      _dialog = Flow.Dataflow.signal(null);
      showDialog = (ctor, args, _go) => {
        var $dialog;
        var dialog;
        var go;
        var responded;
        responded = false;
        go = response => {
          if (!responded) {
            responded = true;
            $dialog.modal('hide');
            if (_go) {
              return _go(response);
            }
          }
        };
        _dialog(dialog = ctor(...[_].concat(args).concat(go)));
        $dialog = $(`#${ dialog.template }`);
        $dialog.modal();
        $dialog.on('hidden.bs.modal', e => {
          if (!responded) {
            responded = true;
            _dialog(null);
            if (_go) {
              return _go(null);
            }
          }
        });
      };
      Flow.Dataflow.link(_.dialog, function () {
        var args;
        var ctor;
        var go;
        var _i;
        ctor = arguments[0], args = arguments.length >= 3 ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), go = arguments[_i++];
        return showDialog(ctor, args, go);
      });
      Flow.Dataflow.link(_.confirm, (message, opts, go) => showDialog(flowConfirmDialog, [message, opts], go));
      Flow.Dataflow.link(_.alert, (message, opts, go) => showDialog(flowAlertDialog, [message, opts], go));
      return {
        dialog: _dialog,
        template(dialog) {
          return `flow-${ dialog.template }`;
        }
      };
    };
  }

  const flowPrelude$34 = flowPreludeFunction();

  function dataflow() {
    var lodash = window._;
    var Flow = window.Flow;
    var __slice = [].slice;
    Flow.Dataflow = (() => {
      var createObservable;
      var createObservableArray;
      var createSignal;
      var createSignals;
      var createSlot;
      var createSlots;
      var isObservable;
      var _act;
      var _apply;
      var _isSignal;
      var _lift;
      var _link;
      var _merge;
      var _react;
      var _unlink;
      createSlot = () => {
        var arrow;
        var self;
        arrow = null;
        self = function () {
          var args;
          args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
          if (arrow) {
            return arrow.func.apply(null, args);
          }
          return void 0;
        };
        self.subscribe = func => {
          console.assert(lodash.isFunction(func));
          if (arrow) {
            throw new Error('Cannot re-attach slot');
          } else {
            return arrow = {
              func,
              dispose() {
                return arrow = null;
              }
            };
          }
        };
        self.dispose = () => {
          if (arrow) {
            return arrow.dispose();
          }
        };
        return self;
      };
      createSlots = () => {
        var arrows;
        var self;
        arrows = [];
        self = function () {
          var args;
          args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
          return lodash.map(arrows, arrow => arrow.func.apply(null, args));
        };
        self.subscribe = func => {
          var arrow;
          console.assert(lodash.isFunction(func));
          arrows.push(arrow = {
            func,
            dispose() {
              return flowPrelude$34.remove(arrows, arrow);
            }
          });
          return arrow;
        };
        self.dispose = () => lodash.forEach(flowPrelude$34.copy(arrows), arrow => arrow.dispose());
        return self;
      };
      if (typeof ko !== 'undefined' && ko !== null) {
        createObservable = ko.observable;
        createObservableArray = ko.observableArray;
        isObservable = ko.isObservable;
      } else {
        createObservable = initialValue => {
          var arrows;
          var currentValue;
          var notifySubscribers;
          var self;
          arrows = [];
          currentValue = initialValue;
          notifySubscribers = (arrows, newValue) => {
            var arrow;
            var _i;
            var _len;
            for (_i = 0, _len = arrows.length; _i < _len; _i++) {
              arrow = arrows[_i];
              arrow.func(newValue);
            }
          };
          self = function (newValue) {
            var unchanged;
            if (arguments.length === 0) {
              return currentValue;
            }
            unchanged = self.equalityComparer ? self.equalityComparer(currentValue, newValue) : currentValue === newValue;
            if (!unchanged) {
              currentValue = newValue;
              return notifySubscribers(arrows, newValue);
            }
          };
          self.subscribe = func => {
            var arrow;
            console.assert(lodash.isFunction(func));
            arrows.push(arrow = {
              func,
              dispose() {
                return flowPrelude$34.remove(arrows, arrow);
              }
            });
            return arrow;
          };
          self.__observable__ = true;
          return self;
        };
        createObservableArray = createObservable;
        isObservable = obj => {
          if (obj.__observable__) {
            return true;
          }
          return false;
        };
      }
      createSignal = function (value, equalityComparer) {
        var observable;
        if (arguments.length === 0) {
          return createSignal(void 0, flowPrelude$34.never);
        }
        observable = createObservable(value);
        if (lodash.isFunction(equalityComparer)) {
          observable.equalityComparer = equalityComparer;
        }
        return observable;
      };
      _isSignal = isObservable;
      createSignals = array => createObservableArray(array || []);
      _link = (source, func) => {
        console.assert(lodash.isFunction(source, '[signal] is not a function'));
        console.assert(lodash.isFunction(source.subscribe, '[signal] does not have a [dispose] method'));
        console.assert(lodash.isFunction(func, '[func] is not a function'));
        return source.subscribe(func);
      };
      _unlink = arrows => {
        var arrow;
        var _i;
        var _len;
        var _results;
        if (lodash.isArray(arrows)) {
          _results = [];
          for (_i = 0, _len = arrows.length; _i < _len; _i++) {
            arrow = arrows[_i];
            console.assert(lodash.isFunction(arrow.dispose, '[arrow] does not have a [dispose] method'));
            _results.push(arrow.dispose());
          }
          return _results;
        }
        console.assert(lodash.isFunction(arrows.dispose, '[arrow] does not have a [dispose] method'));
        return arrows.dispose();
      };
      _apply = (sources, func) => func(...lodash.map(sources, source => source()));
      _act = (...args) => {
        var func;
        var sources;
        var _i;
        sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []), func = args[_i++];
        _apply(sources, func);
        return lodash.map(sources, source => _link(source, () => _apply(sources, func)));
      };
      _react = (...args) => {
        var func;
        var sources;
        var _i;
        sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []), func = args[_i++];
        return lodash.map(sources, source => _link(source, () => _apply(sources, func)));
      };
      _lift = (...args) => {
        var evaluate;
        var func;
        var sources;
        var target;
        var _i;
        sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []), func = args[_i++];
        evaluate = () => _apply(sources, func);
        target = createSignal(evaluate());
        lodash.map(sources, source => _link(source, () => target(evaluate())));
        return target;
      };
      _merge = (...args) => {
        var evaluate;
        var func;
        var sources;
        var target;
        var _i;
        sources = args.length >= 3 ? __slice.call(args, 0, _i = args.length - 2) : (_i = 0, []), target = args[_i++], func = args[_i++];
        evaluate = () => _apply(sources, func);
        target(evaluate());
        return lodash.map(sources, source => _link(source, () => target(evaluate())));
      };
      return {
        slot: createSlot,
        slots: createSlots,
        signal: createSignal,
        signals: createSignals,
        isSignal: _isSignal,
        link: _link,
        unlink: _unlink,
        act: _act,
        react: _react,
        lift: _lift,
        merge: _merge
      };
    })();
  }

  function data() {
    var lodash = window._;
    var Flow = window.Flow;
    var combineRanges;
    var computeRange;
    var createAbstractVariable;
    var createCompiledPrototype;
    var createFactor;
    var createNumericVariable;
    var createRecordConstructor;
    var createTable;
    var createVariable;
    var factor;
    var includeZeroInRange;
    var nextPrototypeName;
    var permute;
    var _prototypeCache;
    var _prototypeId;
    var __slice = [].slice;
    _prototypeId = 0;
    nextPrototypeName = () => `Map${ ++_prototypeId }`;
    _prototypeCache = {};
    createCompiledPrototype = attrs => {
      var attr;
      var cacheKey;
      var i;
      var inits;
      var params;
      var proto;
      var prototypeName;
      cacheKey = attrs.join('\0');
      if (proto = _prototypeCache[cacheKey]) {
        return proto;
      }
      params = (() => {
        var _i;
        var _ref;
        var _results;
        _results = [];
        for (i = _i = 0, _ref = attrs.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
          _results.push(`a${ i }`);
        }
        return _results;
      })();
      inits = (() => {
        var _i;
        var _len;
        var _results;
        _results = [];
        for (i = _i = 0, _len = attrs.length; _i < _len; i = ++_i) {
          attr = attrs[i];
          _results.push(`this[${ JSON.stringify(attr) }]=a${ i };`);
        }
        return _results;
      })();
      prototypeName = nextPrototypeName();
      return _prototypeCache[cacheKey] = new Function(`function ${ prototypeName }(${ params.join(',') }){${ inits.join('') }} return ${ prototypeName };`)();
    };
    createRecordConstructor = variables => {
      var variable;
      return createCompiledPrototype((() => {
        var _i;
        var _len;
        var _results;
        _results = [];
        for (_i = 0, _len = variables.length; _i < _len; _i++) {
          variable = variables[_i];
          _results.push(variable.label);
        }
        return _results;
      })());
    };
    createTable = opts => {
      var description;
      var expand;
      var fill;
      var label;
      var meta;
      var rows;
      var schema;
      var variable;
      var variables;
      var _i;
      var _len;
      label = opts.label, description = opts.description, variables = opts.variables, rows = opts.rows, meta = opts.meta;
      if (!description) {
        description = 'No description available.';
      }
      schema = {};
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        schema[variable.label] = variable;
      }
      fill = (i, go) => {
        _fill(i, (error, result) => {
          var index;
          var startIndex;
          var value;
          var _j;
          var _len1;
          if (error) {
            return go(error);
          }
          startIndex = result.index, lodash.values = result.values;
          for (index = _j = 0, _len1 = lodash.values.length; _j < _len1; index = ++_j) {
            value = lodash.values[index];
            rows[startIndex + index] = lodash.values[index];
          }
          return go(null);
        });
      };
      expand = (...args) => {
        var type;
        var types;
        var _j;
        var _len1;
        var _results;
        types = args.length >= 1 ? __slice.call(args, 0) : [];
        _results = [];
        for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
          type = types[_j];
          label = lodash.uniqueId('__flow_variable_');
          _results.push(schema[label] = createNumericVariable(label));
        }
        return _results;
      };
      return {
        label,
        description,
        schema,
        variables,
        rows,
        meta,
        fill,
        expand,
        _is_table_: true
      };
    };
    includeZeroInRange = range => {
      var hi;
      var lo;
      lo = range[0], hi = range[1];
      if (lo > 0 && hi > 0) {
        return [0, hi];
      } else if (lo < 0 && hi < 0) {
        return [lo, 0];
      }
      return range;
    };
    combineRanges = (...args) => {
      var hi;
      var lo;
      var range;
      var ranges;
      var value;
      var _i;
      var _len;
      ranges = args.length >= 1 ? __slice.call(args, 0) : [];
      lo = Number.POSITIVE_INFINITY;
      hi = Number.NEGATIVE_INFINITY;
      for (_i = 0, _len = ranges.length; _i < _len; _i++) {
        range = ranges[_i];
        if (lo > (value = range[0])) {
          lo = value;
        }
        if (hi < (value = range[1])) {
          hi = value;
        }
      }
      return [lo, hi];
    };
    computeRange = (rows, attr) => {
      var hi;
      var lo;
      var row;
      var value;
      var _i;
      var _len;
      if (rows.length) {
        lo = Number.POSITIVE_INFINITY;
        hi = Number.NEGATIVE_INFINITY;
        for (_i = 0, _len = rows.length; _i < _len; _i++) {
          row = rows[_i];
          value = row[attr];
          if (value < lo) {
            lo = value;
          }
          if (value > hi) {
            hi = value;
          }
        }
        return [lo, hi];
      }
      return [-1, 1];
    };
    permute = (array, indices) => {
      var i;
      var index;
      var permuted;
      var _i;
      var _len;
      permuted = new Array(array.length);
      for (i = _i = 0, _len = indices.length; _i < _len; i = ++_i) {
        index = indices[i];
        permuted[i] = array[index];
      }
      return permuted;
    };
    createAbstractVariable = (_label, _type, _domain, _format, _read) => ({
      label: _label,
      type: _type,
      domain: _domain || [],
      format: _format || lodash.identity,
      read: _read
    });
    createNumericVariable = (_label, _domain, _format, _read) => {
      var self;
      self = createAbstractVariable(_label, 'Number', _domain || [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY], _format, _read);
      if (!self.read) {
        self.read = datum => {
          if (datum < self.domain[0]) {
            self.domain[0] = datum;
          }
          if (datum > self.domain[1]) {
            self.domain[1] = datum;
          }
          return datum;
        };
      }
      return self;
    };
    createVariable = (_label, _type, _domain, _format, _read) => {
      if (_type === 'Number') {
        return createNumericVariable(_label, _domain, _format, _read);
      }
      return createAbstractVariable(_label, _type, _domain, _format, _read);
    };
    createFactor = (_label, _domain, _format, _read) => {
      var level;
      var self;
      var _i;
      var _id;
      var _len;
      var _levels;
      var _ref;
      self = createAbstractVariable(_label, 'Factor', _domain || [], _format, _read);
      _id = 0;
      _levels = {};
      if (self.domain.length) {
        _ref = self.domain;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          level = _ref[_i];
          _levels[level] = _id++;
        }
      }
      if (!self.read) {
        self.read = datum => {
          var id;
          level = datum === void 0 || datum === null ? 'null' : datum;
          if (void 0 === (id = _levels[level])) {
            _levels[level] = id = _id++;
            self.domain.push(level);
          }
          return id;
        };
      }
      return self;
    };
    factor = array => {
      var data;
      var domain;
      var i;
      var id;
      var level;
      var levels;
      var _i;
      var _id;
      var _len;
      _id = 0;
      levels = {};
      domain = [];
      data = new Array(array.length);
      for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
        level = array[i];
        if (void 0 === (id = levels[level])) {
          levels[level] = id = _id++;
          domain.push(level);
        }
        data[i] = id;
      }
      return [domain, data];
    };
    Flow.Data = {
      Table: createTable,
      Variable: createVariable,
      Factor: createFactor,
      computeColumnInterpretation(type) {
        if (type === 'Number') {
          return 'c';
        } else if (type === 'Factor') {
          return 'd';
        }
        return 't';
      },
      Record: createRecordConstructor,
      computeRange,
      combineRanges,
      includeZeroInRange,
      factor,
      permute
    };
  }

  const flowPrelude$35 = flowPreludeFunction();

  function async() {
    var lodash = window._;
    var Flow = window.Flow;
    var createBuffer;
    var iterate;
    var pipe;
    var _applicate;
    var _async;
    var _find;
    var _find$2;
    var _find$3;
    var _fork;
    var _get;
    var _isFuture;
    var _join;
    var _noop;
    var __slice = [].slice;
    createBuffer = array => {
      var buffer;
      var _array;
      var _go;
      _array = array || [];
      _go = null;
      buffer = element => {
        if (element === void 0) {
          return _array;
        }
        _array.push(element);
        if (_go) {
          _go(element);
        }
        return element;
      };
      buffer.subscribe = go => _go = go;
      buffer.buffer = _array;
      buffer.isBuffer = true;
      return buffer;
    };
    _noop = go => go(null);
    _applicate = go => (error, args) => {
      if (lodash.isFunction(go)) {
        return go(...[error].concat(args));
      }
    };
    _fork = (f, args) => {
      var self;
      if (!lodash.isFunction(f)) {
        throw new Error('Not a function.');
      }
      self = go => {
        var canGo;
        canGo = lodash.isFunction(go);
        if (self.settled) {
          if (self.rejected) {
            if (canGo) {
              return go(self.error);
            }
          } else {
            if (canGo) {
              return go(null, self.result);
            }
          }
        } else {
          return _join(args, (error, args) => {
            if (error) {
              self.error = error;
              self.fulfilled = false;
              self.rejected = true;
              if (canGo) {
                return go(error);
              }
            } else {
              return f(...args.concat((error, result) => {
                if (error) {
                  self.error = error;
                  self.fulfilled = false;
                  self.rejected = true;
                  if (canGo) {
                    go(error);
                  }
                } else {
                  self.result = result;
                  self.fulfilled = true;
                  self.rejected = false;
                  if (canGo) {
                    go(null, result);
                  }
                }
                self.settled = true;
                return self.pending = false;
              }));
            }
          });
        }
      };
      self.method = f;
      self.args = args;
      self.fulfilled = false;
      self.rejected = false;
      self.settled = false;
      self.pending = true;
      self.isFuture = true;
      return self;
    };
    _isFuture = a => {
      if (a != null ? a.isFuture : void 0) {
        return true;
      }
      return false;
    };
    _join = (args, go) => {
      var arg;
      var i;
      var _actual;
      var _i;
      var _len;
      var _results;
      var _settled;
      var _tasks;
      if (args.length === 0) {
        return go(null, []);
      }
      _tasks = [];
      _results = [];
      for (i = _i = 0, _len = args.length; _i < _len; i = ++_i) {
        arg = args[i];
        if (arg != null ? arg.isFuture : void 0) {
          _tasks.push({
            future: arg,
            resultIndex: i
          });
        } else {
          _results[i] = arg;
        }
      }
      if (_tasks.length === 0) {
        return go(null, _results);
      }
      _actual = 0;
      _settled = false;
      lodash.forEach(_tasks, task => task.future.call(null, (error, result) => {
        if (_settled) {
          return;
        }
        if (error) {
          _settled = true;
          go(new Flow.Error(`Error evaluating future[${ task.resultIndex }]`, error));
        } else {
          _results[task.resultIndex] = result;
          _actual++;
          if (_actual === _tasks.length) {
            _settled = true;
            go(null, _results);
          }
        }
      }));
    };
    pipe = tasks => {
      var next;
      var _tasks;
      _tasks = tasks.slice(0);
      next = (args, go) => {
        var task;
        task = _tasks.shift();
        if (task) {
          return task(...args.concat(function () {
            var error;
            var results;
            error = arguments[0], results = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
            if (error) {
              return go(error);
            }
            return next(results, go);
          }));
        }
        return go(...[null].concat(args));
      };
      return function () {
        var args;
        var go;
        var _i;
        args = arguments.length >= 2 ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), go = arguments[_i++];
        return next(args, go);
      };
    };
    iterate = tasks => {
      var next;
      var _results;
      var _tasks;
      _tasks = tasks.slice(0);
      _results = [];
      next = go => {
        var task;
        task = _tasks.shift();
        if (task) {
          return task((error, result) => {
            if (error) {
              return go(error);
            }
            _results.push(result);
            return next(go);
          });
        }
        return go(null, _results);
      };
      return go => next(go);
    };
    _async = function () {
      var args;
      var f;
      var later;
      f = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
      later = function () {
        var args;
        var error;
        var go;
        var result;
        var _i;
        args = arguments.length >= 2 ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), go = arguments[_i++];
        try {
          result = f(...args);
          return go(null, result);
        } catch (_error) {
          error = _error;
          return go(error);
        }
      };
      return _fork(later, args);
    };
    _find$3 = (attr, prop, obj) => {
      var v;
      var _i;
      var _len;
      if (_isFuture(obj)) {
        return _async(_find$3, attr, prop, obj);
      } else if (lodash.isArray(obj)) {
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          v = obj[_i];
          if (v[attr] === prop) {
            return v;
          }
        }
        return;
      }
    };
    _find$2 = (attr, obj) => {
      if (_isFuture(obj)) {
        return _async(_find$2, attr, obj);
      } else if (lodash.isString(attr)) {
        if (lodash.isArray(obj)) {
          return _find$3('name', attr, obj);
        }
        return obj[attr];
      }
    };
    _find = function () {
      var a;
      var args;
      var b;
      var c;
      var ta;
      var tb;
      var tc;
      args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
      switch (args.length) {
        case 3:
          a = args[0], b = args[1], c = args[2];
          ta = flowPrelude$35.typeOf(a);
          tb = flowPrelude$35.typeOf(b);
          tc = flowPrelude$35.typeOf(c);
          if (ta === 'Array' && tb === 'String') {
            return _find$3(b, c, a);
          } else if (ta === 'String' && (tc = 'Array')) {
            return _find$3(a, b, c);
          }
          break;
        case 2:
          a = args[0], b = args[1];
          if (!a) {
            return;
          }
          if (!b) {
            return;
          }
          if (lodash.isString(b)) {
            return _find$2(b, a);
          } else if (lodash.isString(a)) {
            return _find$2(a, b);
          }
      }
    };
    _get = (attr, obj) => {
      if (_isFuture(obj)) {
        return _async(_get, attr, obj);
      } else if (lodash.isString(attr)) {
        if (lodash.isArray(obj)) {
          return _find$3('name', attr, obj);
        }
        return obj[attr];
      }
    };
    Flow.Async = {
      createBuffer,
      noop: _noop,
      applicate: _applicate,
      isFuture: _isFuture,
      fork: _fork,
      join: _join,
      pipe,
      iterate,
      async: _async,
      find: _find,
      get: _get
    };
  }

  const flowPrelude$36 = flowPreludeFunction();

  function objectBrowser() {
    var lodash = window._;
    var Flow = window.Flow;
    var isExpandable;
    var preview;
    var previewArray;
    var previewObject;
    isExpandable = type => {
      switch (type) {
        case 'null':
        case 'undefined':
        case 'Boolean':
        case 'String':
        case 'Number':
        case 'Date':
        case 'RegExp':
        case 'Arguments':
        case 'Function':
          return false;
        default:
          return true;
      }
    };
    previewArray = array => {
      var element;
      var ellipsis;
      var previews;
      ellipsis = array.length > 5 ? ', ...' : '';
      previews = (() => {
        var _i;
        var _len;
        var _ref;
        var _results;
        _ref = lodash.head(array, 5);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          _results.push(preview(element));
        }
        return _results;
      })();
      return `[${ previews.join(', ') }${ ellipsis }]`;
    };
    previewObject = object => {
      var count;
      var ellipsis;
      var key;
      var previews;
      var value;
      count = 0;
      previews = [];
      ellipsis = '';
      for (key in object) {
        if ({}.hasOwnProperty.call(object, key)) {
          value = object[key];
          if (!(key !== '_flow_')) {
            continue;
          }
          previews.push(`${ key }: ${ preview(value) }`);
          if (++count === 5) {
            ellipsis = ', ...';
            break;
          }
        }
      }
      return `{${ previews.join(', ') }${ ellipsis }}`;
    };
    preview = (element, recurse) => {
      var type;
      if (recurse == null) {
        recurse = false;
      }
      type = flowPrelude$36.typeOf(element);
      switch (type) {
        case 'Boolean':
        case 'String':
        case 'Number':
        case 'Date':
        case 'RegExp':
          return element;
        case 'undefined':
        case 'null':
        case 'Function':
        case 'Arguments':
          return type;
        case 'Array':
          if (recurse) {
            return previewArray(element);
          }
          return type;
        // break; // no-unreachable
        default:
          if (recurse) {
            return previewObject(element);
          }
          return type;
      }
    };
    Flow.ObjectBrowserElement = (key, object) => {
      var toggle;
      var _canExpand;
      var _expansions;
      var _isExpanded;
      var _type;
      _expansions = Flow.Dataflow.signal(null);
      _isExpanded = Flow.Dataflow.signal(false);
      _type = flowPrelude$36.typeOf(object);
      _canExpand = isExpandable(_type);
      toggle = () => {
        var expansions;
        var value;
        if (!_canExpand) {
          return;
        }
        if (_expansions() === null) {
          expansions = [];
          for (key in object) {
            if ({}.hasOwnProperty.call(object, key)) {
              value = object[key];
              if (key !== '_flow_') {
                expansions.push(Flow.ObjectBrowserElement(key, value));
              }
            }
          }
          _expansions(expansions);
        }
        return _isExpanded(!_isExpanded());
      };
      return {
        key,
        preview: preview(object, true),
        toggle,
        expansions: _expansions,
        isExpanded: _isExpanded,
        canExpand: _canExpand
      };
    };
    Flow.ObjectBrowser = (_, _go, key, object) => {
      lodash.defer(_go);
      return {
        object: Flow.ObjectBrowserElement(key, object),
        template: 'flow-object'
      };
    };
  }

  function help() {
    var lodash = window._;
    var Flow = window.Flow;
    var _catalog;
    var _homeContent;
    var _homeMarkdown;
    var _index;
    _catalog = null;
    _index = {};
    _homeContent = null;
    _homeMarkdown = '<blockquote>\nUsing Flow for the first time?\n<br/>\n<div style=\'margin-top:10px\'>\n  <button type=\'button\' data-action=\'get-flow\' data-pack-name=\'examples\' data-flow-name=\'QuickStartVideos.flow\' class=\'flow-button\'><i class=\'fa fa-file-movie-o\'></i><span>Quickstart Videos</span>\n  </button>\n</div>\n</blockquote>\n\nOr, <a href=\'#\' data-action=\'get-pack\' data-pack-name=\'examples\'>view example Flows</a> to explore and learn H<sub>2</sub>O.\n\n###### Star H2O on Github!\n\n<iframe src="https://ghbtns.com/github-btn.html?user=h2oai&repo=h2o-3&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>\n\n###### General\n\n%HELP_TOPICS%\n\n###### Examples\n\nFlow packs are a great way to explore and learn H<sub>2</sub>O. Try out these Flows and run them in your browser.<br/><a href=\'#\' data-action=\'get-packs\'>Browse installed packs...</a>\n\n###### H<sub>2</sub>O REST API\n\n- <a href=\'#\' data-action=\'endpoints\'>Routes</a>\n- <a href=\'#\' data-action=\'schemas\'>Schemas</a>\n';
    Flow.Help = _ => {
      var buildToc;
      var buildTopics;
      var displayEndpoint;
      var displayEndpoints;
      var displayFlows;
      var displayHtml;
      var displayPacks;
      var displaySchema;
      var displaySchemas;
      var fixImageSources;
      var goBack;
      var goForward;
      var goHome;
      var goTo;
      var initialize;
      var performAction;
      var _canGoBack;
      var _canGoForward;
      var _content;
      var _history;
      var _historyIndex;
      _content = Flow.Dataflow.signal(null);
      _history = [];
      _historyIndex = -1;
      _canGoBack = Flow.Dataflow.signal(false);
      _canGoForward = Flow.Dataflow.signal(false);
      goTo = index => {
        var content;
        content = _history[_historyIndex = index];
        $('a, button', $(content)).each(function (i) {
          var $a;
          var action;
          $a = $(this);
          if (action = $a.attr('data-action')) {
            return $a.click(() => performAction(action, $a));
          }
        });
        _content(content);
        _canGoForward(_historyIndex < _history.length - 1);
        _canGoBack(_historyIndex > 0);
      };
      goBack = () => {
        if (_historyIndex > 0) {
          return goTo(_historyIndex - 1);
        }
      };
      goForward = () => {
        if (_historyIndex < _history.length - 1) {
          return goTo(_historyIndex + 1);
        }
      };
      displayHtml = content => {
        if (_historyIndex < _history.length - 1) {
          _history.splice(_historyIndex + 1, _history.length - (_historyIndex + 1), content);
        } else {
          _history.push(content);
        }
        return goTo(_history.length - 1);
      };
      fixImageSources = html => html.replace(/\s+src\s*=\s*"images\//g, ' src="help/images/');
      performAction = (action, $el) => {
        var packName;
        var routeIndex;
        var schemaName;
        var topic;
        switch (action) {
          case 'help':
            topic = _index[$el.attr('data-topic')];
            _.requestHelpContent(topic.name, (error, html) => {
              var contents;
              var div;
              var h5;
              var h6;
              var mark;
              var _ref;
              _ref = Flow.HTML.template('div', 'mark', 'h5', 'h6'), div = _ref[0], mark = _ref[1], h5 = _ref[2], h6 = _ref[3];
              contents = [mark('Help'), h5(topic.title), fixImageSources(div(html))];
              if (topic.children.length) {
                contents.push(h6('Topics'));
                contents.push(buildToc(topic.children));
              }
              return displayHtml(Flow.HTML.render('div', div(contents)));
            });
            break;
          case 'assist':
            _.insertAndExecuteCell('cs', 'assist');
            break;
          case 'get-packs':
            _.requestPacks((error, packNames) => {
              if (!error) {
                return displayPacks(lodash.filter(packNames, packName => packName !== 'test'));
              }
            });
            break;
          case 'get-pack':
            packName = $el.attr('data-pack-name');
            _.requestPack(packName, (error, flowNames) => {
              if (!error) {
                return displayFlows(packName, flowNames);
              }
            });
            break;
          case 'get-flow':
            _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
              acceptCaption: 'Load Notebook',
              declineCaption: 'Cancel'
            }, accept => {
              var flowName;
              if (accept) {
                packName = $el.attr('data-pack-name');
                flowName = $el.attr('data-flow-name');
                if (H2O.Util.validateFileExtension(flowName, '.flow')) {
                  return _.requestFlow(packName, flowName, (error, flow) => {
                    if (!error) {
                      return _.open(H2O.Util.getFileBaseName(flowName, '.flow'), flow);
                    }
                  });
                }
              }
            });
            break;
          case 'endpoints':
            _.requestEndpoints((error, response) => {
              if (!error) {
                return displayEndpoints(response.routes);
              }
            });
            break;
          case 'endpoint':
            routeIndex = $el.attr('data-index');
            _.requestEndpoint(routeIndex, (error, response) => {
              if (!error) {
                return displayEndpoint(lodash.head(response.routes));
              }
            });
            break;
          case 'schemas':
            _.requestSchemas((error, response) => {
              if (!error) {
                return displaySchemas(lodash.sortBy(response.schemas, schema => schema.name));
              }
            });
            break;
          case 'schema':
            schemaName = $el.attr('data-schema');
            _.requestSchema(schemaName, (error, response) => {
              if (!error) {
                return displaySchema(lodash.head(response.schemas));
              }
            });
        }
      };
      buildToc = nodes => {
        var a;
        var li;
        var ul;
        var _ref;
        _ref = Flow.HTML.template('ul', 'li', 'a href=\'#\' data-action=\'help\' data-topic=\'$1\''), ul = _ref[0], li = _ref[1], a = _ref[2];
        return ul(lodash.map(nodes, node => li(a(node.title, node.name))));
      };
      buildTopics = (index, topics) => {
        var topic;
        var _i;
        var _len;
        for (_i = 0, _len = topics.length; _i < _len; _i++) {
          topic = topics[_i];
          index[topic.name] = topic;
          if (topic.children.length) {
            buildTopics(index, topic.children);
          }
        }
      };
      displayPacks = packNames => {
        var a;
        var div;
        var h5;
        var i;
        var mark;
        var p;
        var _ref;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'p', 'i.fa.fa-folder-o', 'a href=\'#\' data-action=\'get-pack\' data-pack-name=\'$1\''), div = _ref[0], mark = _ref[1], h5 = _ref[2], p = _ref[3], i = _ref[4], a = _ref[5];
        displayHtml(Flow.HTML.render('div', div([mark('Packs'), h5('Installed Packs'), div(lodash.map(packNames, packName => p([i(), a(packName, packName)])))])));
      };
      displayFlows = (packName, flowNames) => {
        var a;
        var div;
        var h5;
        var i;
        var mark;
        var p;
        var _ref;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'p', 'i.fa.fa-file-text-o', `a href=\'#\' data-action=\'get-flow\' data-pack-name=\'${ packName }\' data-flow-name=\'$1\'`), div = _ref[0], mark = _ref[1], h5 = _ref[2], p = _ref[3], i = _ref[4], a = _ref[5];
        displayHtml(Flow.HTML.render('div', div([mark('Pack'), h5(packName), div(lodash.map(flowNames, flowName => p([i(), a(flowName, flowName)])))])));
      };
      displayEndpoints = routes => {
        var action;
        var code;
        var div;
        var els;
        var h5;
        var mark;
        var p;
        var route;
        var routeIndex;
        var _i;
        var _len;
        var _ref;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'p', 'a href=\'#\' data-action=\'endpoint\' data-index=\'$1\'', 'code'), div = _ref[0], mark = _ref[1], h5 = _ref[2], p = _ref[3], action = _ref[4], code = _ref[5];
        els = [mark('API'), h5('List of Routes')];
        for (routeIndex = _i = 0, _len = routes.length; _i < _len; routeIndex = ++_i) {
          route = routes[routeIndex];
          els.push(p(`${ action(code(`${ route.http_method } ${ route.url_pattern }`), routeIndex) }<br/>${ route.summary }`));
        }
        displayHtml(Flow.HTML.render('div', div(els)));
      };
      goHome = () => displayHtml(Flow.HTML.render('div', _homeContent));
      displayEndpoint = route => {
        var action;
        var code;
        var div;
        var h5;
        var h6;
        var mark;
        var p;
        var _ref;
        var _ref1;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'h6', 'p', 'a href=\'#\' data-action=\'schema\' data-schema=\'$1\'', 'code'), div = _ref[0], mark = _ref[1], h5 = _ref[2], h6 = _ref[3], p = _ref[4], action = _ref[5], code = _ref[6];
        return displayHtml(Flow.HTML.render('div', div([mark('Route'), h5(route.url_pattern), h6('Method'), p(code(route.http_method)), h6('Summary'), p(route.summary), h6('Parameters'), p(((_ref1 = route.path_params) != null ? _ref1.length : void 0) ? route.path_params.join(', ') : '-'), h6('Input Schema'), p(action(code(route.input_schema), route.input_schema)), h6('Output Schema'), p(action(code(route.output_schema), route.output_schema))])));
      };
      displaySchemas = schemas => {
        var action;
        var code;
        var div;
        var els;
        var h5;
        var li;
        var mark;
        var schema;
        var ul;
        var variable;
        var _ref;
        _ref = Flow.HTML.template('div', 'h5', 'ul', 'li', 'var', 'mark', 'code', 'a href=\'#\' data-action=\'schema\' data-schema=\'$1\''), div = _ref[0], h5 = _ref[1], ul = _ref[2], li = _ref[3], variable = _ref[4], mark = _ref[5], code = _ref[6], action = _ref[7];
        els = [mark('API'), h5('List of Schemas'), ul((() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = schemas.length; _i < _len; _i++) {
            schema = schemas[_i];
            _results.push(li(`${ action(code(schema.name), schema.name) } ${ variable(lodash.escape(schema.type)) }`));
          }
          return _results;
        })())];
        return displayHtml(Flow.HTML.render('div', div(els)));
      };
      displaySchema = schema => {
        var code;
        var content;
        var div;
        var field;
        var h5;
        var h6;
        var mark;
        var p;
        var small;
        var variable;
        var _i;
        var _len;
        var _ref;
        var _ref1;
        _ref = Flow.HTML.template('div', 'mark', 'h5', 'h6', 'p', 'code', 'var', 'small'), div = _ref[0], mark = _ref[1], h5 = _ref[2], h6 = _ref[3], p = _ref[4], code = _ref[5], variable = _ref[6], small = _ref[7];
        content = [mark('Schema'), h5(`${ schema.name } (${ lodash.escape(schema.type) })`), h6('Fields')];
        _ref1 = schema.fields;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          field = _ref1[_i];
          if (field.name !== '__meta') {
            content.push(p(`${ variable(field.name) }${ field.required ? '*' : '' } ${ code(lodash.escape(field.type)) }<br/>${ small(field.help) }`));
          }
        }
        return displayHtml(Flow.HTML.render('div', div(content)));
      };
      initialize = catalog => {
        _catalog = catalog;
        buildTopics(_index, _catalog);
        _homeContent = marked(_homeMarkdown).replace('%HELP_TOPICS%', buildToc(_catalog));
        return goHome();
      };
      Flow.Dataflow.link(_.ready, () => _.requestHelpIndex((error, catalog) => {
        if (!error) {
          return initialize(catalog);
        }
      }));
      return {
        content: _content,
        goHome,
        goBack,
        canGoBack: _canGoBack,
        goForward,
        canGoForward: _canGoForward
      };
    };
  }

  function flowHeading(_, level) {
    var render;
    render = (input, output) => {
      output.data({
        text: input.trim() || '(Untitled)',
        template: `flow-${ level }`
      });
      return output.end();
    };
    render.isCode = false;
    return render;
  }

  function flowCoffeescriptKernel() {
    var lodash = window._;
    var Flow = window.Flow;
    var coalesceScopes;
    var compileCoffeescript;
    var compileJavascript;
    var createGlobalScope;
    var createLocalScope;
    var createRootScope;
    var deleteAstNode;
    var executeJavascript;
    var generateJavascript;
    var identifyDeclarations;
    var parseDeclarations;
    var parseJavascript;
    var removeHoistedDeclarations;
    var rewriteJavascript;
    var safetyWrapCoffeescript;
    var traverseJavascript;
    var traverseJavascriptScoped;
    safetyWrapCoffeescript = guid => (cs, go) => {
      var block;
      var lines;
      lines = cs.replace(/[\n\r]/g, '\n').split('\n');
      block = lodash.map(lines, line => `  ${ line }`);
      block.unshift(`_h2o_results_[\'${ guid }\'].result do ->`);
      return go(null, block.join('\n'));
    };
    compileCoffeescript = (cs, go) => {
      var error;
      try {
        return go(null, CoffeeScript.compile(cs, { bare: true }));
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error compiling coffee-script', error));
      }
    };
    parseJavascript = (js, go) => {
      var error;
      try {
        return go(null, esprima.parse(js));
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error parsing javascript expression', error));
      }
    };
    identifyDeclarations = node => {
      var declaration;
      if (!node) {
        return null;
      }
      switch (node.type) {
        case 'VariableDeclaration':
          return (() => {
            var _i;
            var _len;
            var _ref;
            var _results;
            _ref = node.declarations;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              declaration = _ref[_i];
              if (declaration.type === 'VariableDeclarator' && declaration.id.type === 'Identifier') {
                _results.push({
                  name: declaration.id.name,
                  object: '_h2o_context_'
                });
              }
            }
            return _results;
          })();
        case 'FunctionDeclaration':
          if (node.id.type === 'Identifier') {
            return [{
              name: node.id.name,
              object: '_h2o_context_'
            }];
          }
          break;
        case 'ForStatement':
          return identifyDeclarations(node.init);
        case 'ForInStatement':
        case 'ForOfStatement':
          return identifyDeclarations(node.left);
      }
      return null;
    };
    parseDeclarations = block => {
      var declaration;
      var declarations;
      var identifiers;
      var node;
      var _i;
      var _j;
      var _len;
      var _len1;
      var _ref;
      identifiers = [];
      _ref = block.body;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if (declarations = identifyDeclarations(node)) {
          for (_j = 0, _len1 = declarations.length; _j < _len1; _j++) {
            declaration = declarations[_j];
            identifiers.push(declaration);
          }
        }
      }
      return lodash.indexBy(identifiers, identifier => identifier.name);
    };
    traverseJavascript = (parent, key, node, f) => {
      var child;
      var i;
      if (lodash.isArray(node)) {
        i = node.length;
        while (i--) {
          child = node[i];
          if (lodash.isObject(child)) {
            traverseJavascript(node, i, child, f);
            f(node, i, child);
          }
        }
      } else {
        for (i in node) {
          if ({}.hasOwnProperty.call(node, i)) {
            child = node[i];
            if (lodash.isObject(child)) {
              traverseJavascript(node, i, child, f);
              f(node, i, child);
            }
          }
        }
      }
    };
    deleteAstNode = (parent, i) => {
      if (_.isArray(parent)) {
        return parent.splice(i, 1);
      } else if (lodash.isObject(parent)) {
        return delete parent[i];
      }
    };
    createLocalScope = node => {
      var localScope;
      var param;
      var _i;
      var _len;
      var _ref;
      localScope = parseDeclarations(node.body);
      _ref = node.params;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        if (param.type === 'Identifier') {
          localScope[param.name] = {
            name: param.name,
            object: 'local'
          };
        }
      }
      return localScope;
    };
    coalesceScopes = scopes => {
      var currentScope;
      var i;
      var identifier;
      var name;
      var scope;
      var _i;
      var _len;
      currentScope = {};
      for (i = _i = 0, _len = scopes.length; _i < _len; i = ++_i) {
        scope = scopes[i];
        if (i === 0) {
          for (name in scope) {
            if ({}.hasOwnProperty.call(scope, name)) {
              identifier = scope[name];
              currentScope[name] = identifier;
            }
          }
        } else {
          for (name in scope) {
            if ({}.hasOwnProperty.call(scope, name)) {
              identifier = scope[name];
              currentScope[name] = null;
            }
          }
        }
      }
      return currentScope;
    };
    traverseJavascriptScoped = (scopes, parentScope, parent, key, node, f) => {
      var child;
      var currentScope;
      var isNewScope;
      isNewScope = node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration';
      if (isNewScope) {
        scopes.push(createLocalScope(node));
        currentScope = coalesceScopes(scopes);
      } else {
        currentScope = parentScope;
      }
      for (key in node) {
        if ({}.hasOwnProperty.call(node, key)) {
          child = node[key];
          if (lodash.isObject(child)) {
            traverseJavascriptScoped(scopes, currentScope, node, key, child, f);
            f(currentScope, node, key, child);
          }
        }
      }
      if (isNewScope) {
        scopes.pop();
      }
    };
    createRootScope = sandbox => function (program, go) {
      var error;
      var name;
      var rootScope;
      try {
        rootScope = parseDeclarations(program.body[0].expression.arguments[0].callee.body);
        for (name in sandbox.context) {
          if ({}.hasOwnProperty.call(sandbox.context, name)) {
            rootScope[name] = {
              name,
              object: '_h2o_context_'
            };
          }
        }
        return go(null, rootScope, program);
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error parsing root scope', error));
      }
    };
    removeHoistedDeclarations = (rootScope, program, go) => {
      var error;
      try {
        traverseJavascript(null, null, program, (parent, key, node) => {
          var declarations;
          if (node.type === 'VariableDeclaration') {
            declarations = node.declarations.filter(declaration => declaration.type === 'VariableDeclarator' && declaration.id.type === 'Identifier' && !rootScope[declaration.id.name]);
            if (declarations.length === 0) {
              return deleteAstNode(parent, key);
            }
            return node.declarations = declarations;
          }
        });
        return go(null, rootScope, program);
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error rewriting javascript', error));
      }
    };
    createGlobalScope = (rootScope, routines) => {
      var globalScope;
      var identifier;
      var name;
      globalScope = {};
      for (name in rootScope) {
        if ({}.hasOwnProperty.call(rootScope, name)) {
          identifier = rootScope[name];
          globalScope[name] = identifier;
        }
      }
      for (name in routines) {
        if ({}.hasOwnProperty.call(routines, name)) {
          globalScope[name] = {
            name,
            object: 'h2o'
          };
        }
      }
      return globalScope;
    };
    rewriteJavascript = sandbox => (rootScope, program, go) => {
      var error;
      var globalScope;
      globalScope = createGlobalScope(rootScope, sandbox.routines);
      try {
        traverseJavascriptScoped([globalScope], globalScope, null, null, program, (globalScope, parent, key, node) => {
          var identifier;
          if (node.type === 'Identifier') {
            if (parent.type === 'VariableDeclarator' && key === 'id') {
              return;
            }
            if (key === 'property') {
              return;
            }
            if (!(identifier = globalScope[node.name])) {
              return;
            }
            return parent[key] = {
              type: 'MemberExpression',
              computed: false,
              object: {
                type: 'Identifier',
                name: identifier.object
              },
              property: {
                type: 'Identifier',
                name: identifier.name
              }
            };
          }
        });
        return go(null, program);
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error rewriting javascript', error));
      }
    };
    generateJavascript = (program, go) => {
      var error;
      try {
        return go(null, escodegen.generate(program));
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error generating javascript', error));
      }
    };
    compileJavascript = (js, go) => {
      var closure;
      var error;
      try {
        closure = new Function('h2o', '_h2o_context_', '_h2o_results_', 'print', js);
        return go(null, closure);
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error compiling javascript', error));
      }
    };
    executeJavascript = (sandbox, print) => (closure, go) => {
      var error;
      try {
        return go(null, closure(sandbox.routines, sandbox.context, sandbox.results, print));
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error executing javascript', error));
      }
    };
    return {
      safetyWrapCoffeescript,
      compileCoffeescript,
      parseJavascript,
      createRootScope,
      removeHoistedDeclarations,
      rewriteJavascript,
      generateJavascript,
      compileJavascript,
      executeJavascript
    };
  }

  function flowCoffeescript(_, guid, sandbox) {
    var lodash = window._;
    var Flow = window.Flow;
    var isRoutine;
    var print;
    var render;
    var _kernel;
    _kernel = flowCoffeescriptKernel();
    print = arg => {
      if (arg !== print) {
        sandbox.results[guid].outputs(arg);
      }
      return print;
    };
    isRoutine = f => {
      var name;
      var routine;
      var _ref;
      _ref = sandbox.routines;
      for (name in _ref) {
        if ({}.hasOwnProperty.call(_ref, name)) {
          routine = _ref[name];
          if (f === routine) {
            return true;
          }
        }
      }
      return false;
    };
    render = (input, output) => {
      var cellResult;
      var evaluate;
      var outputBuffer;
      var tasks;
      sandbox.results[guid] = cellResult = {
        result: Flow.Dataflow.signal(null),
        outputs: outputBuffer = Flow.Async.createBuffer([])
      };
      evaluate = ft => {
        if (ft != null ? ft.isFuture : void 0) {
          return ft((error, result) => {
            var _ref;
            if (error) {
              output.error(new Flow.Error('Error evaluating cell', error));
              return output.end();
            }
            if (result != null ? (_ref = result._flow_) != null ? _ref.render : void 0 : void 0) {
              return output.data(result._flow_.render(() => output.end()));
            }
            return output.data(Flow.ObjectBrowser(_, (() => output.end())('output', result)));
          });
        }
        return output.data(Flow.ObjectBrowser(_, () => output.end(), 'output', ft));
      };
      outputBuffer.subscribe(evaluate);
      tasks = [_kernel.safetyWrapCoffeescript(guid), _kernel.compileCoffeescript, _kernel.parseJavascript, _kernel.createRootScope(sandbox), _kernel.removeHoistedDeclarations, _kernel.rewriteJavascript(sandbox), _kernel.generateJavascript, _kernel.compileJavascript, _kernel.executeJavascript(sandbox, print)];
      return Flow.Async.pipe(tasks)(input, error => {
        var result;
        if (error) {
          output.error(error);
        }
        result = cellResult.result();
        if (lodash.isFunction(result)) {
          if (isRoutine(result)) {
            return print(result());
          }
          return evaluate(result);
        }
        return output.close(Flow.ObjectBrowser(_, () => output.end(), 'result', result));
      });
    };
    render.isCode = true;
    return render;
  }

  function flowRaw(_) {
    var render;
    render = (input, output) => {
      output.data({
        text: input,
        template: 'flow-raw'
      });
      return output.end();
    };
    render.isCode = false;
    return render;
  }

  function flowStatus(_) {
    var lodash = window._;
    var Flow = window.Flow;
    var defaultMessage;
    var onStatus;
    var _connections;
    var _isBusy;
    var _message;
    defaultMessage = 'Ready';
    _message = Flow.Dataflow.signal(defaultMessage);
    _connections = Flow.Dataflow.signal(0);
    _isBusy = Flow.Dataflow.lift(_connections, connections => connections > 0);
    onStatus = (category, type, data) => {
      var connections;
      console.debug('Status:', category, type, data);
      switch (category) {
        case 'server':
          switch (type) {
            case 'request':
              _connections(_connections() + 1);
              return lodash.defer(_message, `Requesting ${ data }`);
            case 'response':
            case 'error':
              _connections(connections = _connections() - 1);
              if (connections) {
                return lodash.defer(_message, `Waiting for ${ connections } responses...`);
              }
              return lodash.defer(_message, defaultMessage);
          }
      }
    };
    Flow.Dataflow.link(_.ready, () => Flow.Dataflow.link(_.status, onStatus));
    return {
      message: _message,
      connections: _connections,
      isBusy: _isBusy
    };
  }

  function flowOutline(_, _cells) {
    return { cells: _cells };
  }

  function flowBrowser(_) {
    var lodash = window._;
    var Flow = window.Flow;
    var createNotebookView;
    var loadNotebooks;
    var _docs;
    var _hasDocs;
    var _sortedDocs;
    _docs = Flow.Dataflow.signals([]);
    _sortedDocs = Flow.Dataflow.lift(_docs, docs => lodash.sortBy(docs, doc => -doc.date().getTime()));
    _hasDocs = Flow.Dataflow.lift(_docs, docs => docs.length > 0);
    createNotebookView = notebook => {
      var load;
      var purge;
      var self;
      var _date;
      var _fromNow;
      var _name;
      _name = notebook.name;
      _date = Flow.Dataflow.signal(new Date(notebook.timestamp_millis));
      _fromNow = Flow.Dataflow.lift(_date, Flow.Util.fromNow);
      load = () => _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
        acceptCaption: 'Load Notebook',
        declineCaption: 'Cancel'
      }, accept => {
        if (accept) {
          return _.load(_name);
        }
      });
      purge = () => _.confirm(`Are you sure you want to delete this notebook?\n"${ _name }"`, {
        acceptCaption: 'Delete',
        declineCaption: 'Keep'
      }, accept => {
        if (accept) {
          return _.requestDeleteObject('notebook', _name, error => {
            var _ref;
            if (error) {
              return _alert((_ref = error.message) != null ? _ref : error);
            }
            _docs.remove(self);
            return _.growl('Notebook deleted.');
          });
        }
      });
      return self = {
        name: _name,
        date: _date,
        fromNow: _fromNow,
        load,
        purge
      };
    };
    loadNotebooks = () => _.requestObjects('notebook', (error, notebooks) => {
      if (error) {
        return console.debug(error);
      }
      return _docs(lodash.map(notebooks, notebook => createNotebookView(notebook)));
    });
    Flow.Dataflow.link(_.ready, () => {
      loadNotebooks();
      Flow.Dataflow.link(_.saved, () => loadNotebooks());
      return Flow.Dataflow.link(_.loaded, () => loadNotebooks());
    });
    return {
      docs: _sortedDocs,
      hasDocs: _hasDocs,
      loadNotebooks
    };
  }

  function flowSidebar(_, cells) {
    var Flow = window.Flow;
    var switchToBrowser;
    var switchToClipboard;
    var switchToHelp;
    var switchToOutline;
    var _browser;
    var _clipboard;
    var _help;
    var _isBrowserMode;
    var _isClipboardMode;
    var _isHelpMode;
    var _isOutlineMode;
    var _mode;
    var _outline;
    _mode = Flow.Dataflow.signal('help');
    _outline = flowOutline(_, cells);
    _isOutlineMode = Flow.Dataflow.lift(_mode, mode => mode === 'outline');
    switchToOutline = () => _mode('outline');
    _browser = flowBrowser(_);
    _isBrowserMode = Flow.Dataflow.lift(_mode, mode => mode === 'browser');
    switchToBrowser = () => _mode('browser');
    _clipboard = Flow.Clipboard(_);
    _isClipboardMode = Flow.Dataflow.lift(_mode, mode => mode === 'clipboard');
    switchToClipboard = () => _mode('clipboard');
    _help = Flow.Help(_);
    _isHelpMode = Flow.Dataflow.lift(_mode, mode => mode === 'help');
    switchToHelp = () => _mode('help');
    Flow.Dataflow.link(_.ready, () => {
      Flow.Dataflow.link(_.showHelp, () => switchToHelp());
      Flow.Dataflow.link(_.showClipboard, () => switchToClipboard());
      Flow.Dataflow.link(_.showBrowser, () => switchToBrowser());
      return Flow.Dataflow.link(_.showOutline, () => switchToOutline());
    });
    return {
      outline: _outline,
      isOutlineMode: _isOutlineMode,
      switchToOutline,
      browser: _browser,
      isBrowserMode: _isBrowserMode,
      switchToBrowser,
      clipboard: _clipboard,
      isClipboardMode: _isClipboardMode,
      switchToClipboard,
      help: _help,
      isHelpMode: _isHelpMode,
      switchToHelp
    };
  }

  function flowCell(_, _renderers, type, input) {
    var lodash = window._;
    var Flow = window.Flow;
    var activate;
    var clear;
    var clip;
    var execute;
    var navigate;
    var select;
    var self;
    var toggleInput;
    var toggleOutput;
    var _actions;
    var _errors;
    var _guid;
    var _hasError;
    var _hasInput;
    var _hasOutput;
    var _input;
    var _isActive;
    var _isBusy;
    var _isCode;
    var _isInputVisible;
    var _isOutputHidden;
    var _isReady;
    var _isSelected;
    var _outputs;
    var _render;
    var _result;
    var _time;
    var _type;
    if (type == null) {
      type = 'cs';
    }
    if (input == null) {
      input = '';
    }
    _guid = lodash.uniqueId();
    _type = Flow.Dataflow.signal(type);
    _render = Flow.Dataflow.lift(_type, type => _renderers[type](_guid));
    _isCode = Flow.Dataflow.lift(_render, render => render.isCode);
    _isSelected = Flow.Dataflow.signal(false);
    _isActive = Flow.Dataflow.signal(false);
    _hasError = Flow.Dataflow.signal(false);
    _isBusy = Flow.Dataflow.signal(false);
    _isReady = Flow.Dataflow.lift(_isBusy, isBusy => !isBusy);
    _time = Flow.Dataflow.signal('');
    _hasInput = Flow.Dataflow.signal(true);
    _input = Flow.Dataflow.signal(input);
    _outputs = Flow.Dataflow.signals([]);
    _errors = [];
    _result = Flow.Dataflow.signal(null);
    _hasOutput = Flow.Dataflow.lift(_outputs, outputs => outputs.length > 0);
    _isInputVisible = Flow.Dataflow.signal(true);
    _isOutputHidden = Flow.Dataflow.signal(false);
    _actions = {};
    Flow.Dataflow.act(_isActive, isActive => {
      if (isActive) {
        _.selectCell(self);
        _hasInput(true);
        if (!_isCode()) {
          _outputs([]);
        }
      }
    });
    Flow.Dataflow.act(_isSelected, isSelected => {
      if (!isSelected) {
        return _isActive(false);
      }
    });
    select = () => {
      _.selectCell(self, false);
      return true;
    };
    navigate = () => {
      _.selectCell(self);
      return true;
    };
    activate = () => _isActive(true);
    clip = () => _.saveClip('user', _type(), _input());
    toggleInput = () => _isInputVisible(!_isInputVisible());
    toggleOutput = () => _isOutputHidden(!_isOutputHidden());
    clear = () => {
      _result(null);
      _outputs([]);
      _errors.length = 0;
      _hasError(false);
      if (!_isCode()) {
        return _hasInput(true);
      }
    };
    execute = go => {
      var render;
      var startTime;
      startTime = Date.now();
      _time(`Started at ${ Flow.Util.formatClockTime(startTime) }`);
      input = _input().trim();
      if (!input) {
        if (go) {
          return go(null);
        }
        return void 0;
      }
      render = _render();
      _isBusy(true);
      clear();
      if (_type() === 'sca') {
        input = input.replace(/\\/g, '\\\\');
        input = input.replace(/'/g, '\\\'');
        input = input.replace(/\n/g, '\\n');
        input = `runScalaCode ${ _.scalaIntpId() }, \'${ input }\'`;
      }
      render(input, {
        data(result) {
          return _outputs.push(result);
        },
        close(result) {
          return _result(result);
        },
        error(error) {
          _hasError(true);
          if (error.name === 'FlowError') {
            _outputs.push(Flow.Failure(_, error));
          } else {
            _outputs.push({
              text: JSON.stringify(error, null, 2),
              template: 'flow-raw'
            });
          }
          return _errors.push(error);
        },
        end() {
          _hasInput(_isCode());
          _isBusy(false);
          _time(Flow.Util.formatElapsedTime(Date.now() - startTime));
          if (go) {
            go(_hasError() ? _errors.slice(0) : null);
          }
        }
      });
      return _isActive(false);
    };
    return self = {
      guid: _guid,
      type: _type,
      isCode: _isCode,
      isSelected: _isSelected,
      isActive: _isActive,
      hasError: _hasError,
      isBusy: _isBusy,
      isReady: _isReady,
      time: _time,
      input: _input,
      hasInput: _hasInput,
      outputs: _outputs,
      result: _result,
      hasOutput: _hasOutput,
      isInputVisible: _isInputVisible,
      toggleInput,
      isOutputHidden: _isOutputHidden,
      toggleOutput,
      select,
      navigate,
      activate,
      execute,
      clear,
      clip,
      _actions,
      getCursorPosition() {
        return _actions.getCursorPosition();
      },
      autoResize() {
        return _actions.autoResize();
      },
      scrollIntoView(immediate) {
        return _actions.scrollIntoView(immediate);
      },
      templateOf(view) {
        return view.template;
      },
      template: 'flow-cell'
    };
  }

  function flowFileOpenDialog(_, _go) {
    var Flow = window.Flow;
    var accept;
    var checkIfNameIsInUse;
    var decline;
    var uploadFile;
    var _canAccept;
    var _file;
    var _form;
    var _overwrite;
    _overwrite = Flow.Dataflow.signal(false);
    _form = Flow.Dataflow.signal(null);
    _file = Flow.Dataflow.signal(null);
    _canAccept = Flow.Dataflow.lift(_file, file => {
      if (file != null ? file.name : void 0) {
        return H2O.Util.validateFileExtension(file.name, '.flow');
      }
      return false;
    });
    checkIfNameIsInUse = (name, go) => _.requestObjectExists('notebook', name, (error, exists) => go(exists));
    uploadFile = basename => _.requestUploadObject('notebook', basename, new FormData(_form()), (error, filename) => _go({
      error,
      filename
    }));
    accept = () => {
      var basename;
      var file;
      if (file = _file()) {
        basename = H2O.Util.getFileBaseName(file.name, '.flow');
        if (_overwrite()) {
          return uploadFile(basename);
        }
        return checkIfNameIsInUse(basename, isNameInUse => {
          if (isNameInUse) {
            return _overwrite(true);
          }
          return uploadFile(basename);
        });
      }
    };
    decline = () => _go(null);
    return {
      form: _form,
      file: _file,
      overwrite: _overwrite,
      canAccept: _canAccept,
      accept,
      decline,
      template: 'file-open-dialog'
    };
  }

  function flowFileUploadDialog(_, _go) {
    var Flow = window.Flow;
    var accept;
    var decline;
    var uploadFile;
    var _file;
    var _form;
    _form = Flow.Dataflow.signal(null);
    _file = Flow.Dataflow.signal(null);
    uploadFile = key => _.requestUploadFile(key, new FormData(_form()), (error, result) => _go({
      error,
      result
    }));
    accept = () => {
      var file;
      if (file = _file()) {
        return uploadFile(file.name);
      }
    };
    decline = () => _go(null);
    return {
      form: _form,
      file: _file,
      accept,
      decline,
      template: 'file-upload-dialog'
    };
  }

  function flowMarkdown(_) {
    var render;
    render = (input, output) => {
      var error;
      try {
        return output.data({
          html: marked(input.trim() || '(No content)'),
          template: 'flow-html'
        });
      } catch (_error) {
        error = _error;
        return output.error(error);
      } finally {
        output.end();
      }
    };
    render.isCode = false;
    return render;
  }

  const flowPrelude$37 = flowPreludeFunction();

  function notebook() {
    var lodash = window._;
    var Flow = window.Flow;
    var __slice = [].slice;
    Flow.Renderers = (_, _sandbox) => ({
      h1() {
        return flowHeading(_, 'h1');
      },

      h2() {
        return flowHeading(_, 'h2');
      },

      h3() {
        return flowHeading(_, 'h3');
      },

      h4() {
        return flowHeading(_, 'h4');
      },

      h5() {
        return flowHeading(_, 'h5');
      },

      h6() {
        return flowHeading(_, 'h6');
      },

      md() {
        return flowMarkdown(_);
      },

      cs(guid) {
        return flowCoffeescript(_, guid, _sandbox);
      },

      sca(guid) {
        return flowCoffeescript(_, guid, _sandbox);
      },

      raw() {
        return flowRaw(_);
      }
    });
    Flow.Notebook = (_, _renderers) => {
      var appendCell;
      var appendCellAndRun;
      var checkConsistency;
      var checkIfNameIsInUse;
      var clearAllCells;
      var clearCell;
      var cloneCell;
      var continueRunningAllCells;
      var convertCellToCode;
      var convertCellToHeading;
      var convertCellToMarkdown;
      var convertCellToRaw;
      var convertCellToScala;
      var copyCell;
      var createCell;
      var createMenu;
      var createMenuHeader;
      var createMenuItem;
      var createNotebook;
      var createShortcutHint;
      var createTool;
      var cutCell;
      var deleteCell;
      var deserialize;
      var displayAbout;
      var displayDocumentation;
      var displayFAQ;
      var displayKeyboardShortcuts;
      var duplicateNotebook;
      var editModeKeyboardShortcuts;
      var editModeKeyboardShortcutsHelp;
      var editName;
      var executeAllCells;
      var executeCommand;
      var exportNotebook;
      var findBuildProperty;
      var getBuildProperties;
      var goToH2OUrl;
      var goToUrl;
      var initialize;
      var initializeMenus;
      var insertAbove;
      var insertBelow;
      var insertCell;
      var insertCellAbove;
      var insertCellAboveAndRun;
      var insertCellBelow;
      var insertCellBelowAndRun;
      var insertNewCellAbove;
      var insertNewCellBelow;
      var insertNewScalaCellAbove;
      var insertNewScalaCellBelow;
      var loadNotebook;
      var menuCell;
      var menuCellSW;
      var menuDivider;
      var mergeCellAbove;
      var mergeCellBelow;
      var moveCellDown;
      var moveCellUp;
      var normalModeKeyboardShortcuts;
      var normalModeKeyboardShortcutsHelp;
      var notImplemented;
      var openNotebook;
      var pasteCellAbove;
      var pasteCellBelow;
      var pasteCellandReplace;
      var promptForNotebook;
      var removeCell;
      var runAllCells;
      var runCell;
      var runCellAndInsertBelow;
      var runCellAndSelectBelow;
      var saveName;
      var saveNotebook;
      var selectCell;
      var selectNextCell;
      var selectPreviousCell;
      var serialize;
      var setupKeyboardHandling;
      var setupMenus;
      var showBrowser;
      var showClipboard;
      var showHelp;
      var showOutline;
      var shutdown;
      var splitCell;
      var startTour;
      var stopRunningAll;
      var storeNotebook;
      var switchToCommandMode;
      var switchToEditMode;
      var toKeyboardHelp;
      var toggleAllInputs;
      var toggleAllOutputs;
      var toggleInput;
      var toggleOutput;
      var toggleSidebar;
      var undoLastDelete;
      var uploadFile;
      var _about;
      var _areInputsHidden;
      var _areOutputsHidden;
      var _cells;
      var _clipboardCell;
      var _dialogs;
      var _initializeInterpreter;
      var _isEditingName;
      var _isRunningAll;
      var _isSidebarHidden;
      var _lastDeletedCell;
      var _localName;
      var _menus;
      var _remoteName;
      var _runningCaption;
      var _runningCellInput;
      var _runningPercent;
      var _selectedCell;
      var _selectedCellIndex;
      var _sidebar;
      var _status;
      var _toolbar;
      _localName = Flow.Dataflow.signal('Untitled Flow');
      Flow.Dataflow.react(_localName, name => document.title = `H2O${ name && name.trim() ? `- ${ name }` : '' }`);
      _remoteName = Flow.Dataflow.signal(null);
      _isEditingName = Flow.Dataflow.signal(false);
      editName = () => _isEditingName(true);
      saveName = () => _isEditingName(false);
      _cells = Flow.Dataflow.signals([]);
      _selectedCell = null;
      _selectedCellIndex = -1;
      _clipboardCell = null;
      _lastDeletedCell = null;
      _areInputsHidden = Flow.Dataflow.signal(false);
      _areOutputsHidden = Flow.Dataflow.signal(false);
      _isSidebarHidden = Flow.Dataflow.signal(false);
      _isRunningAll = Flow.Dataflow.signal(false);
      _runningCaption = Flow.Dataflow.signal('Running');
      _runningPercent = Flow.Dataflow.signal('0%');
      _runningCellInput = Flow.Dataflow.signal('');
      _status = flowStatus(_);
      _sidebar = flowSidebar(_, _cells);
      _about = Flow.About(_);
      _dialogs = Flow.Dialogs(_);
      _initializeInterpreter = () => _.requestScalaIntp((error, response) => {
        if (error) {
          return _.scalaIntpId(-1);
        }
        return _.scalaIntpId(response.session_id);
      });
      serialize = () => {
        var cell;
        var cells;
        cells = (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = _cells();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cell = _ref[_i];
            _results.push({
              type: cell.type(),
              input: cell.input()
            });
          }
          return _results;
        })();
        return {
          version: '1.0.0',
          cells
        };
      };
      deserialize = (localName, remoteName, doc) => {
        var cell;
        var cells;
        var _i;
        var _len;
        var _ref;
        _localName(localName);
        _remoteName(remoteName);
        cells = (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = doc.cells;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cell = _ref[_i];
            _results.push(createCell(cell.type, cell.input));
          }
          return _results;
        })();
        _cells(cells);
        selectCell(lodash.head(cells));
        _ref = _cells();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cell = _ref[_i];
          if (!cell.isCode()) {
            cell.execute();
          }
        }
      };
      createCell = (type, input) => {
        if (type == null) {
          type = 'cs';
        }
        if (input == null) {
          input = '';
        }
        return flowCell(_, _renderers, type, input);
      };
      checkConsistency = () => {
        var cell;
        var i;
        var selectionCount;
        var _i;
        var _len;
        var _ref;
        selectionCount = 0;
        _ref = _cells();
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          cell = _ref[i];
          if (!cell) {
            error(`index ${ i } is empty`);
          } else {
            if (cell.isSelected()) {
              selectionCount++;
            }
          }
        }
        if (selectionCount !== 1) {
          error(`selected cell count = ${ selectionCount }`);
        }
      };
      selectCell = (target, scrollIntoView, scrollImmediately) => {
        if (scrollIntoView == null) {
          scrollIntoView = true;
        }
        if (scrollImmediately == null) {
          scrollImmediately = false;
        }
        if (_selectedCell === target) {
          return;
        }
        if (_selectedCell) {
          _selectedCell.isSelected(false);
        }
        _selectedCell = target;
        _selectedCell.isSelected(true);
        _selectedCellIndex = _cells.indexOf(_selectedCell);
        checkConsistency();
        if (scrollIntoView) {
          lodash.defer(() => _selectedCell.scrollIntoView(scrollImmediately));
        }
        return _selectedCell;
      };
      cloneCell = cell => createCell(cell.type(), cell.input());
      switchToCommandMode = () => _selectedCell.isActive(false);
      switchToEditMode = () => {
        _selectedCell.isActive(true);
        return false;
      };
      convertCellToCode = () => _selectedCell.type('cs');
      convertCellToHeading = level => () => {
        _selectedCell.type(`h${ level }`);
        return _selectedCell.execute();
      };
      convertCellToMarkdown = () => {
        _selectedCell.type('md');
        return _selectedCell.execute();
      };
      convertCellToRaw = () => {
        _selectedCell.type('raw');
        return _selectedCell.execute();
      };
      convertCellToScala = () => _selectedCell.type('sca');
      copyCell = () => _clipboardCell = _selectedCell;
      cutCell = () => {
        copyCell();
        return removeCell();
      };
      deleteCell = () => {
        _lastDeletedCell = _selectedCell;
        return removeCell();
      };
      removeCell = () => {
        var cells;
        var removedCell;
        cells = _cells();
        if (cells.length > 1) {
          if (_selectedCellIndex === cells.length - 1) {
            removedCell = lodash.head(_cells.splice(_selectedCellIndex, 1));
            selectCell(cells[_selectedCellIndex - 1]);
          } else {
            removedCell = lodash.head(_cells.splice(_selectedCellIndex, 1));
            selectCell(cells[_selectedCellIndex]);
          }
          if (removedCell) {
            _.saveClip('trash', removedCell.type(), removedCell.input());
          }
        }
      };
      insertCell = (index, cell) => {
        _cells.splice(index, 0, cell);
        selectCell(cell);
        return cell;
      };
      insertAbove = cell => insertCell(_selectedCellIndex, cell);
      insertBelow = cell => insertCell(_selectedCellIndex + 1, cell);
      appendCell = cell => insertCell(_cells().length, cell);
      insertCellAbove = (type, input) => insertAbove(createCell(type, input));
      insertCellBelow = (type, input) => insertBelow(createCell(type, input));
      insertNewCellAbove = () => insertAbove(createCell('cs'));
      insertNewCellBelow = () => insertBelow(createCell('cs'));
      insertNewScalaCellAbove = () => insertAbove(createCell('sca'));
      insertNewScalaCellBelow = () => insertBelow(createCell('sca'));
      insertCellAboveAndRun = (type, input) => {
        var cell;
        cell = insertAbove(createCell(type, input));
        cell.execute();
        return cell;
      };
      insertCellBelowAndRun = (type, input) => {
        var cell;
        cell = insertBelow(createCell(type, input));
        cell.execute();
        return cell;
      };
      appendCellAndRun = (type, input) => {
        var cell;
        cell = appendCell(createCell(type, input));
        cell.execute();
        return cell;
      };
      moveCellDown = () => {
        var cells;
        cells = _cells();
        if (_selectedCellIndex !== cells.length - 1) {
          _cells.splice(_selectedCellIndex, 1);
          _selectedCellIndex++;
          _cells.splice(_selectedCellIndex, 0, _selectedCell);
        }
      };
      moveCellUp = () => {
        var cells;
        if (_selectedCellIndex !== 0) {
          cells = _cells();
          _cells.splice(_selectedCellIndex, 1);
          _selectedCellIndex--;
          _cells.splice(_selectedCellIndex, 0, _selectedCell);
        }
      };
      mergeCellBelow = () => {
        var cells;
        var nextCell;
        cells = _cells();
        if (_selectedCellIndex !== cells.length - 1) {
          nextCell = cells[_selectedCellIndex + 1];
          if (_selectedCell.type() === nextCell.type()) {
            nextCell.input(`${ _selectedCell.input() }\n${ nextCell.input() }`);
            removeCell();
          }
        }
      };
      splitCell = () => {
        var cursorPosition;
        var input;
        var left;
        var right;
        if (_selectedCell.isActive()) {
          input = _selectedCell.input();
          if (input.length > 1) {
            cursorPosition = _selectedCell.getCursorPosition();
            if (cursorPosition > 0 && cursorPosition < input.length - 1) {
              left = input.substr(0, cursorPosition);
              right = input.substr(cursorPosition);
              _selectedCell.input(left);
              insertCell(_selectedCellIndex + 1, createCell('cs', right));
              _selectedCell.isActive(true);
            }
          }
        }
      };
      pasteCellAbove = () => {
        if (_clipboardCell) {
          return insertCell(_selectedCellIndex, cloneCell(_clipboardCell));
        }
      };
      pasteCellBelow = () => {
        if (_clipboardCell) {
          return insertCell(_selectedCellIndex + 1, cloneCell(_clipboardCell));
        }
      };
      undoLastDelete = () => {
        if (_lastDeletedCell) {
          insertCell(_selectedCellIndex + 1, _lastDeletedCell);
        }
        return _lastDeletedCell = null;
      };
      runCell = () => {
        _selectedCell.execute();
        return false;
      };
      runCellAndInsertBelow = () => {
        _selectedCell.execute(() => insertNewCellBelow());
        return false;
      };
      runCellAndSelectBelow = () => {
        _selectedCell.execute(() => selectNextCell());
        return false;
      };
      checkIfNameIsInUse = (name, go) => _.requestObjectExists('notebook', name, (error, exists) => go(exists));
      storeNotebook = (localName, remoteName) => _.requestPutObject('notebook', localName, serialize(), error => {
        if (error) {
          return _.alert(`Error saving notebook: ${ error.message }`);
        }
        _remoteName(localName);
        _localName(localName);
        if (remoteName !== localName) {
          return _.requestDeleteObject('notebook', remoteName, error => {
            if (error) {
              _.alert(`Error deleting remote notebook [${ remoteName }]: ${ error.message }`);
            }
            return _.saved();
          });
        }
        return _.saved();
      });
      saveNotebook = () => {
        var localName;
        var remoteName;
        localName = Flow.Util.sanitizeName(_localName());
        if (localName === '') {
          return _.alert('Invalid notebook name.');
        }
        remoteName = _remoteName();
        if (remoteName) {
          storeNotebook(localName, remoteName);
        }
        checkIfNameIsInUse(localName, isNameInUse => {
          if (isNameInUse) {
            return _.confirm('A notebook with that name already exists.\nDo you want to replace it with the one you\'re saving?', {
              acceptCaption: 'Replace',
              declineCaption: 'Cancel'
            }, accept => {
              if (accept) {
                return storeNotebook(localName, remoteName);
              }
            });
          }
          return storeNotebook(localName, remoteName);
        });
      };
      promptForNotebook = () => _.dialog(flowFileOpenDialog, result => {
        var error;
        var filename;
        var _ref;
        if (result) {
          error = result.error, filename = result.filename;
          if (error) {
            return _.growl((_ref = error.message) != null ? _ref : error);
          }
          loadNotebook(filename);
          return _.loaded();
        }
      });
      uploadFile = () => _.dialog(flowFileUploadDialog, result => {
        var error;
        var _ref;
        if (result) {
          error = result.error;
          if (error) {
            return _.growl((_ref = error.message) != null ? _ref : error);
          }
          _.growl('File uploaded successfully!');
          return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${ flowPrelude$37.stringify(result.result.destination_frame) }]`);
        }
      });
      toggleInput = () => _selectedCell.toggleInput();
      toggleOutput = () => _selectedCell.toggleOutput();
      toggleAllInputs = () => {
        var cell;
        var wereHidden;
        var _i;
        var _len;
        var _ref;
        wereHidden = _areInputsHidden();
        _areInputsHidden(!wereHidden);
        if (wereHidden) {
          _ref = _cells();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cell = _ref[_i];
            cell.autoResize();
          }
        }
      };
      toggleAllOutputs = () => _areOutputsHidden(!_areOutputsHidden());
      toggleSidebar = () => _isSidebarHidden(!_isSidebarHidden());
      showBrowser = () => {
        _isSidebarHidden(false);
        return _.showBrowser();
      };
      showOutline = () => {
        _isSidebarHidden(false);
        return _.showOutline();
      };
      showClipboard = () => {
        _isSidebarHidden(false);
        return _.showClipboard();
      };
      selectNextCell = () => {
        var cells;
        cells = _cells();
        if (_selectedCellIndex !== cells.length - 1) {
          selectCell(cells[_selectedCellIndex + 1]);
        }
        return false;
      };
      selectPreviousCell = () => {
        var cells;
        if (_selectedCellIndex !== 0) {
          cells = _cells();
          selectCell(cells[_selectedCellIndex - 1]);
        }
        return false;
      };
      displayKeyboardShortcuts = () => $('#keyboardHelpDialog').modal();
      findBuildProperty = caption => {
        var entry;
        if (Flow.BuildProperties) {
          if (entry = lodash.find(Flow.BuildProperties, entry => entry.caption === caption)) {
            return entry.value;
          }
          return void 0;
        }
        return void 0;
      };
      getBuildProperties = () => {
        var projectVersion;
        projectVersion = findBuildProperty('H2O Build project version');
        return [findBuildProperty('H2O Build git branch'), projectVersion, projectVersion ? lodash.last(projectVersion.split('.')) : void 0, findBuildProperty('H2O Build git hash') || 'master'];
      };
      displayDocumentation = () => {
        var buildVersion;
        var gitBranch;
        var gitHash;
        var projectVersion;
        var _ref;
        _ref = getBuildProperties(), gitBranch = _ref[0], projectVersion = _ref[1], buildVersion = _ref[2], gitHash = _ref[3];
        if (buildVersion && buildVersion !== '99999') {
          return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${ gitBranch }/${ buildVersion }/docs-website/h2o-docs/index.html`, '_blank');
        }
        return window.open(`https://github.com/h2oai/h2o-3/blob/${ gitHash }/h2o-docs/src/product/flow/README.md`, '_blank');
      };
      displayFAQ = () => {
        var buildVersion;
        var gitBranch;
        var gitHash;
        var projectVersion;
        var _ref;
        _ref = getBuildProperties(), gitBranch = _ref[0], projectVersion = _ref[1], buildVersion = _ref[2], gitHash = _ref[3];
        if (buildVersion && buildVersion !== '99999') {
          return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${ gitBranch }/${ buildVersion }/docs-website/h2o-docs/index.html`, '_blank');
        }
        return window.open(`https://github.com/h2oai/h2o-3/blob/${ gitHash }/h2o-docs/src/product/howto/FAQ.md`, '_blank');
      };
      executeCommand = command => () => _.insertAndExecuteCell('cs', command);
      displayAbout = () => $('#aboutDialog').modal();
      shutdown = () => _.requestShutdown((error, result) => {
        if (error) {
          return _.growl(`Shutdown failed: ${ error.message }`, 'danger');
        }
        return _.growl('Shutdown complete!', 'warning');
      });
      showHelp = () => {
        _isSidebarHidden(false);
        return _.showHelp();
      };
      createNotebook = () => _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
        acceptCaption: 'Create New Notebook',
        declineCaption: 'Cancel'
      }, accept => {
        var currentTime;
        if (accept) {
          currentTime = new Date().getTime();
          return deserialize('Untitled Flow', null, {
            cells: [{
              type: 'cs',
              input: ''
            }]
          });
        }
      });
      duplicateNotebook = () => deserialize(`Copy of ${ _localName() }`, null, serialize());
      openNotebook = (name, doc) => deserialize(name, null, doc);
      loadNotebook = name => _.requestObject('notebook', name, (error, doc) => {
        var _ref;
        if (error) {
          return _.alert((_ref = error.message) != null ? _ref : error);
        }
        return deserialize(name, name, doc);
      });
      exportNotebook = () => {
        var remoteName;
        if (remoteName = _remoteName()) {
          return window.open(`/3/NodePersistentStorage.bin/notebook/${ remoteName }`, '_blank');
        }
        return _.alert('Please save this notebook before exporting.');
      };
      goToH2OUrl = url => () => window.open(window.Flow.ContextPath + url, '_blank');
      goToUrl = url => () => window.open(url, '_blank');
      executeAllCells = (fromBeginning, go) => {
        var cellCount;
        var cellIndex;
        var cells;
        var executeNextCell;
        _isRunningAll(true);
        cells = _cells().slice(0);
        cellCount = cells.length;
        cellIndex = 0;
        if (!fromBeginning) {
          cells = cells.slice(_selectedCellIndex);
          cellIndex = _selectedCellIndex;
        }
        executeNextCell = () => {
          var cell;
          if (_isRunningAll()) {
            cell = cells.shift();
            if (cell) {
              cell.scrollIntoView(true);
              cellIndex++;
              _runningCaption(`Running cell ${ cellIndex } of ${ cellCount }`);
              _runningPercent(`${ Math.floor(100 * cellIndex / cellCount) }%`);
              _runningCellInput(cell.input());
              return cell.execute(errors => {
                if (errors) {
                  return go('failed', errors);
                }
                return executeNextCell();
              });
            }
            return go('done');
          }
          return go('aborted');
        };
        return executeNextCell();
      };
      runAllCells = fromBeginning => {
        if (fromBeginning == null) {
          fromBeginning = true;
        }
        return executeAllCells(fromBeginning, status => {
          _isRunningAll(false);
          switch (status) {
            case 'aborted':
              return _.growl('Stopped running your flow.', 'warning');
            case 'failed':
              return _.growl('Failed running your flow.', 'danger');
            default:
              return _.growl('Finished running your flow!', 'success');
          }
        });
      };
      continueRunningAllCells = () => runAllCells(false);
      stopRunningAll = () => _isRunningAll(false);
      clearCell = () => {
        _selectedCell.clear();
        return _selectedCell.autoResize();
      };
      clearAllCells = () => {
        var cell;
        var _i;
        var _len;
        var _ref;
        _ref = _cells();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cell = _ref[_i];
          cell.clear();
          cell.autoResize();
        }
      };
      notImplemented = () => {};
      pasteCellandReplace = notImplemented;
      mergeCellAbove = notImplemented;
      startTour = notImplemented;
      createMenu = (label, items) => ({
        label,
        items
      });
      createMenuHeader = label => ({
        label,
        action: null
      });
      createShortcutHint = shortcut => `<span style=\'float:right\'>${ lodash.map(shortcut, key => `<kbd>${ key }</kbd>`).join(' ') }</span>`;
      createMenuItem = (label, action, shortcut) => {
        var kbds;
        kbds = shortcut ? createShortcutHint(shortcut) : '';
        return {
          label: `${ lodash.escape(label) }${ kbds }`,
          action
        };
      };
      menuDivider = {
        label: null,
        action: null
      };
      _menus = Flow.Dataflow.signal(null);
      menuCell = [createMenuItem('Run Cell', runCell, ['ctrl', 'enter']), menuDivider, createMenuItem('Cut Cell', cutCell, ['x']), createMenuItem('Copy Cell', copyCell, ['c']), createMenuItem('Paste Cell Above', pasteCellAbove, ['shift', 'v']), createMenuItem('Paste Cell Below', pasteCellBelow, ['v']), createMenuItem('Delete Cell', deleteCell, ['d', 'd']), createMenuItem('Undo Delete Cell', undoLastDelete, ['z']), menuDivider, createMenuItem('Move Cell Up', moveCellUp, ['ctrl', 'k']), createMenuItem('Move Cell Down', moveCellDown, ['ctrl', 'j']), menuDivider, createMenuItem('Insert Cell Above', insertNewCellAbove, ['a']), createMenuItem('Insert Cell Below', insertNewCellBelow, ['b']), menuDivider, createMenuItem('Toggle Cell Input', toggleInput), createMenuItem('Toggle Cell Output', toggleOutput, ['o']), createMenuItem('Clear Cell Output', clearCell)];
      menuCellSW = [menuDivider, createMenuItem('Insert Scala Cell Above', insertNewScalaCellAbove), createMenuItem('Insert Scala Cell Below', insertNewScalaCellBelow)];
      if (_.onSparklingWater) {
        menuCell = __slice.call(menuCell).concat(__slice.call(menuCellSW));
      }
      initializeMenus = builder => {
        var modelMenuItems;
        modelMenuItems = lodash.map(builder, builder => createMenuItem(`${ builder.algo_full_name }...`, executeCommand(`buildModel ${ flowPrelude$37.stringify(builder.algo) }`))).concat([menuDivider, createMenuItem('List All Models', executeCommand('getModels')), createMenuItem('List Grid Search Results', executeCommand('getGrids')), createMenuItem('Import Model...', executeCommand('importModel')), createMenuItem('Export Model...', executeCommand('exportModel'))]);
        return [createMenu('Flow', [createMenuItem('New Flow', createNotebook), createMenuItem('Open Flow...', promptForNotebook), createMenuItem('Save Flow', saveNotebook, ['s']), createMenuItem('Make a Copy...', duplicateNotebook), menuDivider, createMenuItem('Run All Cells', runAllCells), createMenuItem('Run All Cells Below', continueRunningAllCells), menuDivider, createMenuItem('Toggle All Cell Inputs', toggleAllInputs), createMenuItem('Toggle All Cell Outputs', toggleAllOutputs), createMenuItem('Clear All Cell Outputs', clearAllCells), menuDivider, createMenuItem('Download this Flow...', exportNotebook)]), createMenu('Cell', menuCell), createMenu('Data', [createMenuItem('Import Files...', executeCommand('importFiles')), createMenuItem('Upload File...', uploadFile), createMenuItem('Split Frame...', executeCommand('splitFrame')), createMenuItem('Merge Frames...', executeCommand('mergeFrames')), menuDivider, createMenuItem('List All Frames', executeCommand('getFrames')), menuDivider, createMenuItem('Impute...', executeCommand('imputeColumn'))]), createMenu('Model', modelMenuItems), createMenu('Score', [createMenuItem('Predict...', executeCommand('predict')), createMenuItem('Partial Dependence Plots...', executeCommand('buildPartialDependence')), menuDivider, createMenuItem('List All Predictions', executeCommand('getPredictions'))]), createMenu('Admin', [createMenuItem('Jobs', executeCommand('getJobs')), createMenuItem('Cluster Status', executeCommand('getCloud')), createMenuItem('Water Meter (CPU meter)', goToH2OUrl('perfbar.html')), menuDivider, createMenuHeader('Inspect Log'), createMenuItem('View Log', executeCommand('getLogFile')), createMenuItem('Download Logs', goToH2OUrl('3/Logs/download')), menuDivider, createMenuHeader('Advanced'), createMenuItem('Create Synthetic Frame...', executeCommand('createFrame')), createMenuItem('Stack Trace', executeCommand('getStackTrace')), createMenuItem('Network Test', executeCommand('testNetwork')), createMenuItem('Profiler', executeCommand('getProfile depth: 10')), createMenuItem('Timeline', executeCommand('getTimeline')), createMenuItem('Shut Down', shutdown)]), createMenu('Help', [createMenuItem('Assist Me', executeCommand('assist')), menuDivider, createMenuItem('Contents', showHelp), createMenuItem('Keyboard Shortcuts', displayKeyboardShortcuts, ['h']), menuDivider, createMenuItem('Documentation', displayDocumentation), createMenuItem('FAQ', displayFAQ), createMenuItem('H2O.ai', goToUrl('http://h2o.ai/')), createMenuItem('H2O on Github', goToUrl('https://github.com/h2oai/h2o-3')), createMenuItem('Report an issue', goToUrl('http://jira.h2o.ai')), createMenuItem('Forum / Ask a question', goToUrl('https://groups.google.com/d/forum/h2ostream')), menuDivider, createMenuItem('About', displayAbout)])];
      };
      setupMenus = () => _.requestModelBuilders((error, builders) => _menus(initializeMenus(error ? [] : builders)));
      createTool = (icon, label, action, isDisabled) => {
        if (isDisabled == null) {
          isDisabled = false;
        }
        return {
          label,
          action,
          isDisabled,
          icon: `fa fa-${ icon }`
        };
      };
      _toolbar = [[createTool('file-o', 'New', createNotebook), createTool('folder-open-o', 'Open', promptForNotebook), createTool('save', 'Save (s)', saveNotebook)], [createTool('plus', 'Insert Cell Below (b)', insertNewCellBelow), createTool('arrow-up', 'Move Cell Up (ctrl+k)', moveCellUp), createTool('arrow-down', 'Move Cell Down (ctrl+j)', moveCellDown)], [createTool('cut', 'Cut Cell (x)', cutCell), createTool('copy', 'Copy Cell (c)', copyCell), createTool('paste', 'Paste Cell Below (v)', pasteCellBelow), createTool('eraser', 'Clear Cell', clearCell), createTool('trash-o', 'Delete Cell (d d)', deleteCell)], [createTool('step-forward', 'Run and Select Below', runCellAndSelectBelow), createTool('play', 'Run (ctrl+enter)', runCell), createTool('forward', 'Run All', runAllCells)], [createTool('question-circle', 'Assist Me', executeCommand('assist'))]];
      normalModeKeyboardShortcuts = [['enter', 'edit mode', switchToEditMode], ['y', 'to code', convertCellToCode], ['m', 'to markdown', convertCellToMarkdown], ['r', 'to raw', convertCellToRaw], ['1', 'to heading 1', convertCellToHeading(1)], ['2', 'to heading 2', convertCellToHeading(2)], ['3', 'to heading 3', convertCellToHeading(3)], ['4', 'to heading 4', convertCellToHeading(4)], ['5', 'to heading 5', convertCellToHeading(5)], ['6', 'to heading 6', convertCellToHeading(6)], ['up', 'select previous cell', selectPreviousCell], ['down', 'select next cell', selectNextCell], ['k', 'select previous cell', selectPreviousCell], ['j', 'select next cell', selectNextCell], ['ctrl+k', 'move cell up', moveCellUp], ['ctrl+j', 'move cell down', moveCellDown], ['a', 'insert cell above', insertNewCellAbove], ['b', 'insert cell below', insertNewCellBelow], ['x', 'cut cell', cutCell], ['c', 'copy cell', copyCell], ['shift+v', 'paste cell above', pasteCellAbove], ['v', 'paste cell below', pasteCellBelow], ['z', 'undo last delete', undoLastDelete], ['d d', 'delete cell (press twice)', deleteCell], ['shift+m', 'merge cell below', mergeCellBelow], ['s', 'save notebook', saveNotebook], ['o', 'toggle output', toggleOutput], ['h', 'keyboard shortcuts', displayKeyboardShortcuts]];
      if (_.onSparklingWater) {
        normalModeKeyboardShortcuts.push(['q', 'to Scala', convertCellToScala]);
      }
      editModeKeyboardShortcuts = [['esc', 'command mode', switchToCommandMode], ['ctrl+m', 'command mode', switchToCommandMode], ['shift+enter', 'run cell, select below', runCellAndSelectBelow], ['ctrl+enter', 'run cell', runCell], ['alt+enter', 'run cell, insert below', runCellAndInsertBelow], ['ctrl+shift+-', 'split cell', splitCell], ['mod+s', 'save notebook', saveNotebook]];
      toKeyboardHelp = shortcut => {
        var caption;
        var keystrokes;
        var seq;
        seq = shortcut[0], caption = shortcut[1];
        keystrokes = lodash.map(seq.split(/\+/g), key => `<kbd>${ key }</kbd>`).join(' ');
        return {
          keystrokes,
          caption
        };
      };
      normalModeKeyboardShortcutsHelp = lodash.map(normalModeKeyboardShortcuts, toKeyboardHelp);
      editModeKeyboardShortcutsHelp = lodash.map(editModeKeyboardShortcuts, toKeyboardHelp);
      setupKeyboardHandling = mode => {
        var caption;
        var f;
        var shortcut;
        var _i;
        var _j;
        var _len;
        var _len1;
        var _ref;
        var _ref1;
        for (_i = 0, _len = normalModeKeyboardShortcuts.length; _i < _len; _i++) {
          _ref = normalModeKeyboardShortcuts[_i], shortcut = _ref[0], caption = _ref[1], f = _ref[2];
          Mousetrap.bind(shortcut, f);
        }
        for (_j = 0, _len1 = editModeKeyboardShortcuts.length; _j < _len1; _j++) {
          _ref1 = editModeKeyboardShortcuts[_j], shortcut = _ref1[0], caption = _ref1[1], f = _ref1[2];
          Mousetrap.bindGlobal(shortcut, f);
        }
      };
      initialize = () => {
        setupKeyboardHandling('normal');
        setupMenus();
        Flow.Dataflow.link(_.load, loadNotebook);
        Flow.Dataflow.link(_.open, openNotebook);
        Flow.Dataflow.link(_.selectCell, selectCell);
        Flow.Dataflow.link(_.executeAllCells, executeAllCells);
        Flow.Dataflow.link(_.insertAndExecuteCell, (type, input) => lodash.defer(appendCellAndRun, type, input));
        Flow.Dataflow.link(_.insertCell, (type, input) => lodash.defer(insertCellBelow, type, input));
        Flow.Dataflow.link(_.saved, () => _.growl('Notebook saved.'));
        Flow.Dataflow.link(_.loaded, () => _.growl('Notebook loaded.'));
        executeCommand('assist')();
        _.setDirty();
        if (_.onSparklingWater) {
          return _initializeInterpreter();
        }
      };
      Flow.Dataflow.link(_.ready, initialize);
      return {
        name: _localName,
        isEditingName: _isEditingName,
        editName,
        saveName,
        menus: _menus,
        sidebar: _sidebar,
        status: _status,
        toolbar: _toolbar,
        cells: _cells,
        areInputsHidden: _areInputsHidden,
        areOutputsHidden: _areOutputsHidden,
        isSidebarHidden: _isSidebarHidden,
        isRunningAll: _isRunningAll,
        runningCaption: _runningCaption,
        runningPercent: _runningPercent,
        runningCellInput: _runningCellInput,
        stopRunningAll,
        toggleSidebar,
        shortcutsHelp: {
          normalMode: normalModeKeyboardShortcutsHelp,
          editMode: editModeKeyboardShortcutsHelp
        },
        about: _about,
        dialogs: _dialogs,
        templateOf(view) {
          return view.template;
        }
      };
    };
  }

  function failure() {
    var Flow = window.Flow;
    var traceCauses;
    traceCauses = (error, causes) => {
      causes.push(error.message);
      if (error.cause) {
        traceCauses(error.cause, causes);
      }
      return causes;
    };
    Flow.Failure = (_, error) => {
      var causes;
      var message;
      var toggleStack;
      var _isStackVisible;
      causes = traceCauses(error, []);
      message = causes.shift();
      _isStackVisible = Flow.Dataflow.signal(false);
      toggleStack = () => _isStackVisible(!_isStackVisible());
      _.trackException(`${ message }; ${ causes.join('; ') }`);
      return {
        message,
        stack: error.stack,
        causes,
        isStackVisible: _isStackVisible,
        toggleStack,
        template: 'flow-failure'
      };
    };
  }

  const flowPrelude$38 = flowPreludeFunction();

  function clipboard() {
    var lodash = window._;
    var Flow = window.Flow;
    var SystemClips;
    SystemClips = ['assist', 'importFiles', 'getFrames', 'getModels', 'getPredictions', 'getJobs', 'buildModel', 'predict'];
    Flow.Clipboard = _ => {
      var addClip;
      var createClip;
      var emptyTrash;
      var initialize;
      var lengthOf;
      var loadUserClips;
      var removeClip;
      var saveUserClips;
      var serializeUserClips;
      var _hasTrashClips;
      var _hasUserClips;
      var _systemClipCount;
      var _systemClips;
      var _trashClipCount;
      var _trashClips;
      var _userClipCount;
      var _userClips;
      lengthOf = array => {
        if (array.length) {
          return `(${ array.length })`;
        }
        return '';
      };
      _systemClips = Flow.Dataflow.signals([]);
      _systemClipCount = Flow.Dataflow.lift(_systemClips, lengthOf);
      _userClips = Flow.Dataflow.signals([]);
      _userClipCount = Flow.Dataflow.lift(_userClips, lengthOf);
      _hasUserClips = Flow.Dataflow.lift(_userClips, clips => clips.length > 0);
      _trashClips = Flow.Dataflow.signals([]);
      _trashClipCount = Flow.Dataflow.lift(_trashClips, lengthOf);
      _hasTrashClips = Flow.Dataflow.lift(_trashClips, clips => clips.length > 0);
      createClip = (_list, _type, _input, _canRemove) => {
        var execute;
        var insert;
        var self;
        if (_canRemove == null) {
          _canRemove = true;
        }
        execute = () => _.insertAndExecuteCell(_type, _input);
        insert = () => _.insertCell(_type, _input);
        flowPrelude$38.remove = () => {
          if (_canRemove) {
            return removeClip(_list, self);
          }
        };
        return self = {
          type: _type,
          input: _input,
          execute,
          insert,
          remove: flowPrelude$38.remove,
          canRemove: _canRemove
        };
      };
      addClip = (list, type, input) => list.push(createClip(list, type, input));
      removeClip = (list, clip) => {
        if (list === _userClips) {
          _userClips.remove(clip);
          saveUserClips();
          return _trashClips.push(createClip(_trashClips, clip.type, clip.input));
        }
        return _trashClips.remove(clip);
      };
      emptyTrash = () => _trashClips.removeAll();
      loadUserClips = () => _.requestObjectExists('environment', 'clips', (error, exists) => {
        if (exists) {
          return _.requestObject('environment', 'clips', (error, doc) => {
            if (!error) {
              return _userClips(lodash.map(doc.clips, clip => createClip(_userClips, clip.type, clip.input)));
            }
          });
        }
      });
      serializeUserClips = () => ({
        version: '1.0.0',

        clips: lodash.map(_userClips(), clip => ({
          type: clip.type,
          input: clip.input
        }))
      });
      saveUserClips = () => _.requestPutObject('environment', 'clips', serializeUserClips(), error => {
        if (error) {
          _.alert(`Error saving clips: ${ error.message }`);
        }
      });
      initialize = () => {
        _systemClips(lodash.map(SystemClips, input => createClip(_systemClips, 'cs', input, false)));
        return Flow.Dataflow.link(_.ready, () => {
          loadUserClips();
          return Flow.Dataflow.link(_.saveClip, (category, type, input) => {
            input = input.trim();
            if (input) {
              if (category === 'user') {
                addClip(_userClips, type, input);
                return saveUserClips();
              }
              return addClip(_trashClips, type, input);
            }
          });
        });
      };
      initialize();
      return {
        systemClips: _systemClips,
        systemClipCount: _systemClipCount,
        userClips: _userClips,
        hasUserClips: _hasUserClips,
        userClipCount: _userClipCount,
        trashClips: _trashClips,
        trashClipCount: _trashClipCount,
        hasTrashClips: _hasTrashClips,
        emptyTrash
      };
    };
  }

  function about() {
    var Flow = window.Flow;
    Flow.Version = '0.4.54';
    Flow.About = _ => {
      var _properties;
      _properties = Flow.Dataflow.signals([]);
      Flow.Dataflow.link(_.ready, () => {
        if (Flow.BuildProperties) {
          return _properties(Flow.BuildProperties);
        }
        return _.requestAbout((error, response) => {
          var name;
          var properties;
          var value;
          var _i;
          var _len;
          var _ref;
          var _ref1;
          properties = [];
          if (!error) {
            _ref = response.entries;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              _ref1 = _ref[_i], name = _ref1.name, value = _ref1.value;
              properties.push({
                caption: `H2O ${ name }`,
                value
              });
            }
          }
          properties.push({
            caption: 'Flow version',
            value: Flow.Version
          });
          return _properties(Flow.BuildProperties = properties);
        });
      });
      return { properties: _properties };
    };
  }

  function gui() {
    var lodash = window._;
    var Flow = window.Flow;
    var button;
    var checkbox;
    var content;
    var control;
    var dropdown;
    var html;
    var listbox;
    var markdown;
    var text;
    var textarea;
    var textbox;
    var wrapArray;
    var wrapValue;
    wrapValue = (value, init) => {
      if (value === void 0) {
        return Flow.Dataflow.signal(init);
      }
      if (Flow.Dataflow.isSignal(value)) {
        return value;
      }
      return Flow.Dataflow.signal(value);
    };
    wrapArray = elements => {
      var element;
      if (elements) {
        if (Flow.Dataflow.isSignal(elements)) {
          element = elements();
          if (lodash.isArray(element)) {
            return elements;
          }
          return Flow.Dataflow.signal([element]);
        }
        return Flow.Dataflow.signals(lodash.isArray(elements) ? elements : [elements]);
      }
      return Flow.Dataflow.signals([]);
    };
    control = (type, opts) => {
      var guid;
      if (!opts) {
        opts = {};
      }
      guid = `gui_${ lodash.uniqueId() }`;
      return {
        type,
        id: opts.id || guid,
        label: Flow.Dataflow.signal(opts.label || ' '),
        description: Flow.Dataflow.signal(opts.description || ' '),
        visible: Flow.Dataflow.signal(opts.visible !== false),
        disable: Flow.Dataflow.signal(opts.disable === true),
        template: `flow-form-${ type }`,
        templateOf(control) {
          return control.template;
        }
      };
    };
    content = (type, opts) => {
      var self;
      self = control(type, opts);
      self.value = wrapValue(opts.value, '');
      return self;
    };
    text = opts => content('text', opts);
    html = opts => content('html', opts);
    markdown = opts => content('markdown', opts);
    checkbox = opts => {
      var self;
      self = control('checkbox', opts);
      self.value = wrapValue(opts.value, opts.value);
      return self;
    };
    dropdown = opts => {
      var self;
      self = control('dropdown', opts);
      self.options = opts.options || [];
      self.value = wrapValue(opts.value);
      self.caption = opts.caption || 'Choose...';
      return self;
    };
    listbox = opts => {
      var self;
      self = control('listbox', opts);
      self.options = opts.options || [];
      self.values = wrapArray(opts.values);
      return self;
    };
    textbox = opts => {
      var self;
      self = control('textbox', opts);
      self.value = wrapValue(opts.value, '');
      self.event = lodash.isString(opts.event) ? opts.event : null;
      return self;
    };
    textarea = opts => {
      var self;
      self = control('textarea', opts);
      self.value = wrapValue(opts.value, '');
      self.event = lodash.isString(opts.event) ? opts.event : null;
      self.rows = lodash.isNumber(opts.rows) ? opts.rows : 5;
      return self;
    };
    button = opts => {
      var self;
      self = control('button', opts);
      self.click = lodash.isFunction(opts.click) ? opts.click : lodash.noop;
      return self;
    };
    Flow.Gui = {
      text,
      html,
      markdown,
      checkbox,
      dropdown,
      listbox,
      textbox,
      textarea,
      button
    };
  }

  function h2oApplicationContext(_) {
    var Flow = window.Flow;
    _.requestFileGlob = Flow.Dataflow.slot();
    _.requestCreateFrame = Flow.Dataflow.slot();
    _.requestSplitFrame = Flow.Dataflow.slot();
    _.requestImportFile = Flow.Dataflow.slot();
    _.requestImportFiles = Flow.Dataflow.slot();
    _.requestParseFiles = Flow.Dataflow.slot();
    _.requestInspect = Flow.Dataflow.slot();
    _.requestParseSetup = Flow.Dataflow.slot();
    _.requestParseSetupPreview = Flow.Dataflow.slot();
    _.requestFrames = Flow.Dataflow.slot();
    _.requestFrame = Flow.Dataflow.slot();
    _.requestFrameSlice = Flow.Dataflow.slot();
    _.requestFrameSummary = Flow.Dataflow.slot();
    _.requestFrameDataE = Flow.Dataflow.slot();
    _.requestFrameSummarySlice = Flow.Dataflow.slot();
    _.requestFrameSummarySliceE = Flow.Dataflow.slot();
    _.requestFrameSummaryWithoutData = Flow.Dataflow.slot();
    _.requestDeleteFrame = Flow.Dataflow.slot();
    _.requestExportFrame = Flow.Dataflow.slot();
    _.requestColumnSummary = Flow.Dataflow.slot();
    _.requestModelBuilder = Flow.Dataflow.slot();
    _.requestModelBuilders = Flow.Dataflow.slot();
    _.requestModelBuild = Flow.Dataflow.slot();
    _.requestModelInputValidation = Flow.Dataflow.slot();
    _.requestAutoModelBuild = Flow.Dataflow.slot();
    _.requestPredict = Flow.Dataflow.slot();
    _.requestPrediction = Flow.Dataflow.slot();
    _.requestPredictions = Flow.Dataflow.slot();
    _.requestPartialDependence = Flow.Dataflow.slot();
    _.requestPartialDependenceData = Flow.Dataflow.slot();
    _.requestGrids = Flow.Dataflow.slot();
    _.requestModels = Flow.Dataflow.slot();
    _.requestGrid = Flow.Dataflow.slot();
    _.requestModel = Flow.Dataflow.slot();
    _.requestPojoPreview = Flow.Dataflow.slot();
    _.requestDeleteModel = Flow.Dataflow.slot();
    _.requestImportModel = Flow.Dataflow.slot();
    _.requestExportModel = Flow.Dataflow.slot();
    _.requestJobs = Flow.Dataflow.slot();
    _.requestJob = Flow.Dataflow.slot();
    _.requestCancelJob = Flow.Dataflow.slot();
    _.requestObjects = Flow.Dataflow.slot();
    _.requestObject = Flow.Dataflow.slot();
    _.requestObjectExists = Flow.Dataflow.slot();
    _.requestDeleteObject = Flow.Dataflow.slot();
    _.requestPutObject = Flow.Dataflow.slot();
    _.requestUploadObject = Flow.Dataflow.slot();
    _.requestUploadFile = Flow.Dataflow.slot();
    _.requestCloud = Flow.Dataflow.slot();
    _.requestTimeline = Flow.Dataflow.slot();
    _.requestProfile = Flow.Dataflow.slot();
    _.requestStackTrace = Flow.Dataflow.slot();
    _.requestRemoveAll = Flow.Dataflow.slot();
    _.requestEcho = Flow.Dataflow.slot();
    _.requestLogFile = Flow.Dataflow.slot();
    _.requestNetworkTest = Flow.Dataflow.slot();
    _.requestAbout = Flow.Dataflow.slot();
    _.requestShutdown = Flow.Dataflow.slot();
    _.requestEndpoints = Flow.Dataflow.slot();
    _.requestEndpoint = Flow.Dataflow.slot();
    _.requestSchemas = Flow.Dataflow.slot();
    _.requestSchema = Flow.Dataflow.slot();
    _.requestPacks = Flow.Dataflow.slot();
    _.requestPack = Flow.Dataflow.slot();
    _.requestFlow = Flow.Dataflow.slot();
    _.requestHelpIndex = Flow.Dataflow.slot();
    _.requestHelpContent = Flow.Dataflow.slot();
    _.requestExec = Flow.Dataflow.slot();
    _.ls = Flow.Dataflow.slot();
    _.inspect = Flow.Dataflow.slot();
    _.plot = Flow.Dataflow.slot();
    _.grid = Flow.Dataflow.slot();
    _.enumerate = Flow.Dataflow.slot();
    _.scalaIntpId = Flow.Dataflow.signal(-1);
    _.requestRDDs = Flow.Dataflow.slot();
    _.requestDataFrames = Flow.Dataflow.slot();
    _.requestScalaIntp = Flow.Dataflow.slot();
    _.requestScalaCode = Flow.Dataflow.slot();
    _.requestAsH2OFrameFromRDD = Flow.Dataflow.slot();
    _.requestAsH2OFrameFromDF = Flow.Dataflow.slot();
    return _.requestAsDataFrame = Flow.Dataflow.slot();
  }

  function h2oProxy(_) {
    var lodash = window._;
    var Flow = window.Flow;
    var cacheModelBuilders;
    var composePath;
    var doDelete;
    var doGet;
    var doPost;
    var doPostJSON;
    var doPut;
    var doUpload;
    var download;
    var encodeArrayForPost;
    var encodeObject;
    var encodeObjectForPost;
    var getGridModelBuilderEndpoint;
    var getLines;
    var getModelBuilderEndpoint;
    var getModelBuilders;
    var http;
    var mapWithKey;
    var optsToString;
    var requestAbout;
    var requestAsDataFrame;
    var requestAsH2OFrameFromDF;
    var requestAsH2OFrameFromRDD;
    var requestAutoModelBuild;
    var requestCancelJob;
    var requestCloud;
    var requestColumnSummary;
    var requestCreateFrame;
    var requestDataFrames;
    var requestDeleteFrame;
    var requestDeleteModel;
    var requestDeleteObject;
    var requestEcho;
    var requestEndpoint;
    var requestEndpoints;
    var requestExec;
    var requestExportFrame;
    var requestExportModel;
    var requestFileGlob;
    var requestFlow;
    var requestFrame;
    var requestFrameSlice;
    var requestFrameSummary;
    var requestFrameSummarySlice;
    var requestFrameSummaryWithoutData;
    var requestFrames;
    var requestGrid;
    var requestGrids;
    var requestHelpContent;
    var requestHelpIndex;
    var requestImportFile;
    var requestImportFiles;
    var requestImportModel;
    var requestInspect;
    var requestIsStorageConfigured;
    var requestJob;
    var requestJobs;
    var requestLogFile;
    var requestModel;
    var requestModelBuild;
    var requestModelBuilder;
    var requestModelBuilders;
    var requestModelBuildersVisibility;
    var requestModelInputValidation;
    var requestModels;
    var requestNetworkTest;
    var requestObject;
    var requestObjectExists;
    var requestObjects;
    var requestPack;
    var requestPacks;
    var requestParseFiles;
    var requestParseSetup;
    var requestParseSetupPreview;
    var requestPartialDependence;
    var requestPartialDependenceData;
    var requestPojoPreview;
    var requestPredict;
    var requestPrediction;
    var requestPredictions;
    var requestProfile;
    var requestPutObject;
    var requestRDDs;
    var requestRemoveAll;
    var requestScalaCode;
    var requestScalaIntp;
    var requestSchema;
    var requestSchemas;
    var requestShutdown;
    var requestSplitFrame;
    var requestStackTrace;
    var requestTimeline;
    var requestUploadFile;
    var requestUploadObject;
    var requestWithOpts;
    var trackPath;
    var unwrap;
    var __gridModelBuilderEndpoints;
    var __modelBuilderEndpoints;
    var __modelBuilders;
    var _storageConfiguration;
    download = (type, url, go) => {
      if (url.substring(0, 1) === '/') {
        url = window.Flow.ContextPath + url.substring(1);
      }
      return $.ajax({
        dataType: type,
        url,
        success(data, status, xhr) {
          return go(null, data);
        },
        error(xhr, status, error) {
          return go(new Flow.Error(error));
        }
      });
    };
    optsToString = opts => {
      var str;
      if (opts != null) {
        str = ` with opts ${ JSON.stringify(opts) }`;
        if (str.length > 50) {
          return `${ str.substr(0, 50) }...`;
        }
        return str;
      }
      return '';
    };
    http = (method, path, opts, go) => {
      var req;
      if (path.substring(0, 1) === '/') {
        path = window.Flow.ContextPath + path.substring(1);
      }
      _.status('server', 'request', path);
      trackPath(path);
      req = (() => {
        switch (method) {
          case 'GET':
            return $.getJSON(path);
          case 'POST':
            return $.post(path, opts);
          case 'POSTJSON':
            return $.ajax({
              url: path,
              type: 'POST',
              contentType: 'application/json',
              cache: false,
              data: JSON.stringify(opts)
            });
          case 'PUT':
            return $.ajax({
              url: path,
              type: method,
              data: opts
            });
          case 'DELETE':
            return $.ajax({
              url: path,
              type: method
            });
          case 'UPLOAD':
            return $.ajax({
              url: path,
              type: 'POST',
              data: opts,
              cache: false,
              contentType: false,
              processData: false
            });
        }
      })();
      req.done((data, status, xhr) => {
        var error;
        _.status('server', 'response', path);
        try {
          return go(null, data);
        } catch (_error) {
          error = _error;
          return go(new Flow.Error(`Error processing ${ method } ${ path }`, error));
        }
      });
      return req.fail((xhr, status, error) => {
        var cause;
        var meta;
        var response;
        var serverError;
        _.status('server', 'error', path);
        response = xhr.responseJSON;
        cause = (meta = response != null ? response.__meta : void 0) && (meta.schema_type === 'H2OError' || meta.schema_type === 'H2OModelBuilderError') ? (serverError = new Flow.Error(response.exception_msg), serverError.stack = `${ response.dev_msg } (${ response.exception_type })\n  ${ response.stacktrace.join('\n  ') }`, serverError) : (error != null ? error.message : void 0) ? new Flow.Error(error.message) : status === 'error' && xhr.status === 0 ? new Flow.Error('Could not connect to H2O. Your H2O cloud is currently unresponsive.') : new Flow.Error(`HTTP connection failure: status=${ status }, code=${ xhr.status }, error=${ error || '?' }`);
        return go(new Flow.Error(`Error calling ${ method } ${ path }${ optsToString(opts) }`, cause));
      });
    };
    doGet = (path, go) => http('GET', path, null, go);
    doPost = (path, opts, go) => http('POST', path, opts, go);
    doPostJSON = (path, opts, go) => http('POSTJSON', path, opts, go);
    doPut = (path, opts, go) => http('PUT', path, opts, go);
    doUpload = (path, formData, go) => http('UPLOAD', path, formData, go);
    doDelete = (path, go) => http('DELETE', path, null, go);
    trackPath = path => {
      var base;
      var e;
      var name;
      var other;
      var root;
      var version;
      var _ref;
      var _ref1;
      try {
        _ref = path.split('/'), root = _ref[0], version = _ref[1], name = _ref[2];
        _ref1 = name.split('?'), base = _ref1[0], other = _ref1[1];
        if (base !== 'Typeahead' && base !== 'Jobs') {
          _.trackEvent('api', base, version);
        }
      } catch (_error) {
        e = _error;
      }
    };
    mapWithKey = (obj, f) => {
      var key;
      var result;
      var value;
      result = [];
      for (key in obj) {
        if ({}.hasOwnProperty.call(obj, key)) {
          value = obj[key];
          result.push(f(value, key));
        }
      }
      return result;
    };
    composePath = (path, opts) => {
      var params;
      if (opts) {
        params = mapWithKey(opts, (v, k) => `${ k }=${ v }`);
        return `${ path }?${ params.join('&') }`;
      }
      return path;
    };
    requestWithOpts = (path, opts, go) => doGet(composePath(path, opts), go);
    encodeArrayForPost = array => {
      if (array) {
        if (array.length === 0) {
          return null;
        }
        return `[${ lodash.map(array, element => {
          if (lodash.isNumber(element)) {
            return element;
          }return `"${ element }"`;
        }).join(',') } ]`;
      }
      return null;
    };
    encodeObject = source => {
      var k;
      var target;
      var v;
      target = {};
      for (k in source) {
        if ({}.hasOwnProperty.call(source, k)) {
          v = source[k];
          target[k] = encodeURIComponent(v);
        }
      }
      return target;
    };
    encodeObjectForPost = source => {
      var k;
      var target;
      var v;
      target = {};
      for (k in source) {
        if ({}.hasOwnProperty.call(source, k)) {
          v = source[k];
          target[k] = lodash.isArray(v) ? encodeArrayForPost(v) : v;
        }
      }
      return target;
    };
    unwrap = (go, transform) => (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, transform(result));
    };
    requestExec = (ast, go) => doPost('/99/Rapids', { ast }, (error, result) => {
      if (error) {
        return go(error);
      }
      if (result.error) {
        return go(new Flow.Error(result.error));
      }
      return go(null, result);
    });
    requestInspect = (key, go) => {
      var opts;
      opts = { key: encodeURIComponent(key) };
      return requestWithOpts('/3/Inspect', opts, go);
    };
    requestCreateFrame = (opts, go) => doPost('/3/CreateFrame', opts, go);
    requestSplitFrame = (frameKey, splitRatios, splitKeys, go) => {
      var opts;
      opts = {
        dataset: frameKey,
        ratios: encodeArrayForPost(splitRatios),
        dest_keys: encodeArrayForPost(splitKeys)
      };
      return doPost('/3/SplitFrame', opts, go);
    };
    requestFrames = go => doGet('/3/Frames', (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, result.frames);
    });
    requestFrame = (key, go) => doGet(`/3/Frames/${ encodeURIComponent(key) }`, unwrap(go, result => lodash.head(result.frames)));
    requestFrameSlice = (key, searchTerm, offset, count, go) => doGet(`/3/Frames/${ encodeURIComponent(key) }?column_offset=${ offset }&column_count=${ count }`, unwrap(go, result => lodash.head(result.frames)));
    requestFrameSummary = (key, go) => doGet(`/3/Frames/${ encodeURIComponent(key) }/summary`, unwrap(go, result => lodash.head(result.frames)));
    requestFrameSummarySlice = (key, searchTerm, offset, count, go) => doGet(`/3/Frames/${ encodeURIComponent(key) }/summary?column_offset=${ offset }&column_count=${ count }&_exclude_fields=frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, unwrap(go, result => lodash.head(result.frames)));
    requestFrameSummaryWithoutData = (key, go) => doGet(`/3/Frames/${ encodeURIComponent(key) }/summary?_exclude_fields=frames/chunk_summary,frames/distribution_summary,frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, lodash.head(result.frames));
    });
    requestDeleteFrame = (key, go) => doDelete(`/3/Frames/${ encodeURIComponent(key) }`, go);
    requestExportFrame = (key, path, overwrite, go) => {
      var params;
      params = {
        path,
        force: overwrite ? 'true' : 'false'
      };
      return doPost(`/3/Frames/${ encodeURIComponent(key) }/export`, params, go);
    };
    requestColumnSummary = (frameKey, column, go) => doGet(`/3/Frames/${ encodeURIComponent(frameKey) }/columns/${ encodeURIComponent(column) }/summary`, unwrap(go, result => lodash.head(result.frames)));
    requestJobs = go => doGet('/3/Jobs', (error, result) => {
      if (error) {
        return go(new Flow.Error('Error fetching jobs', error));
      }
      return go(null, result.jobs);
    });
    requestJob = (key, go) => doGet(`/3/Jobs/${ encodeURIComponent(key) }`, (error, result) => {
      if (error) {
        return go(new Flow.Error(`Error fetching job \'${ key }\'`, error));
      }
      return go(null, lodash.head(result.jobs));
    });
    requestCancelJob = (key, go) => doPost(`/3/Jobs/${ encodeURIComponent(key) }/cancel`, {}, (error, result) => {
      if (error) {
        return go(new Flow.Error(`Error canceling job \'${ key }\'`, error));
      }
      return go(null);
    });
    requestFileGlob = (path, limit, go) => {
      var opts;
      opts = {
        src: encodeURIComponent(path),
        limit
      };
      return requestWithOpts('/3/Typeahead/files', opts, go);
    };
    requestImportFiles = (paths, go) => {
      var tasks;
      tasks = lodash.map(paths, path => go => requestImportFile(path, go));
      return Flow.Async.iterate(tasks)(go);
    };
    requestImportFile = (path, go) => {
      var opts;
      opts = { path: encodeURIComponent(path) };
      return requestWithOpts('/3/ImportFiles', opts, go);
    };
    requestParseSetup = (sourceKeys, go) => {
      var opts;
      opts = { source_frames: encodeArrayForPost(sourceKeys) };
      return doPost('/3/ParseSetup', opts, go);
    };
    requestParseSetupPreview = (sourceKeys, parseType, separator, useSingleQuotes, checkHeader, columnTypes, go) => {
      var opts;
      opts = {
        source_frames: encodeArrayForPost(sourceKeys),
        parse_type: parseType,
        separator,
        single_quotes: useSingleQuotes,
        check_header: checkHeader,
        column_types: encodeArrayForPost(columnTypes)
      };
      return doPost('/3/ParseSetup', opts, go);
    };
    requestParseFiles = (sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, go) => {
      var opts;
      opts = {
        destination_frame: destinationKey,
        source_frames: encodeArrayForPost(sourceKeys),
        parse_type: parseType,
        separator,
        number_columns: columnCount,
        single_quotes: useSingleQuotes,
        column_names: encodeArrayForPost(columnNames),
        column_types: encodeArrayForPost(columnTypes),
        check_header: checkHeader,
        delete_on_done: deleteOnDone,
        chunk_size: chunkSize
      };
      return doPost('/3/Parse', opts, go);
    };
    requestPartialDependence = (opts, go) => doPost('/3/PartialDependence/', opts, go);
    requestPartialDependenceData = (key, go) => doGet(`/3/PartialDependence/${ encodeURIComponent(key) }`, (error, result) => {
      if (error) {
        return go(error, result);
      }
      return go(error, result);
    });
    requestGrids = (go, opts) => doGet('/99/Grids', (error, result) => {
      if (error) {
        return go(error, result);
      }
      return go(error, result.grids);
    });
    requestModels = (go, opts) => requestWithOpts('/3/Models', opts, (error, result) => {
      if (error) {
        return go(error, result);
      }
      return go(error, result.models);
    });
    requestGrid = (key, opts, go) => {
      var params;
      params = void 0;
      if (opts) {
        params = {};
        if (opts.sort_by) {
          params.sort_by = encodeURIComponent(opts.sort_by);
        }
        if (opts.decreasing === true || opts.decreasing === false) {
          params.decreasing = opts.decreasing;
        }
      }
      return doGet(composePath(`/99/Grids/' + ${ encodeURIComponent(key) }`, params), go);
    };
    requestModel = (key, go) => doGet(`/3/Models/${ encodeURIComponent(key) }`, (error, result) => {
      if (error) {
        return go(error, result);
      }
      return go(error, lodash.head(result.models));
    });
    requestPojoPreview = (key, go) => download('text', `/3/Models.java/${ encodeURIComponent(key) }/preview`, go);
    requestDeleteModel = (key, go) => doDelete(`/3/Models/${ encodeURIComponent(key) }`, go);
    requestImportModel = (path, overwrite, go) => {
      var opts;
      opts = {
        dir: path,
        force: overwrite
      };
      return doPost('/99/Models.bin/not_in_use', opts, go);
    };
    requestExportModel = (key, path, overwrite, go) => doGet(`/99/Models.bin/${ encodeURIComponent(key) }?dir=${ encodeURIComponent(path) }&force=${ overwrite }`, go);
    requestModelBuildersVisibility = go => doGet('/3/Configuration/ModelBuilders/visibility', unwrap(go, result => result.value));
    __modelBuilders = null;
    __modelBuilderEndpoints = null;
    __gridModelBuilderEndpoints = null;
    cacheModelBuilders = modelBuilders => {
      var gridModelBuilderEndpoints;
      var modelBuilder;
      var modelBuilderEndpoints;
      var _i;
      var _len;
      modelBuilderEndpoints = {};
      gridModelBuilderEndpoints = {};
      for (_i = 0, _len = modelBuilders.length; _i < _len; _i++) {
        modelBuilder = modelBuilders[_i];
        modelBuilderEndpoints[modelBuilder.algo] = `/${ modelBuilder.__meta.schema_version }/ModelBuilders/${ modelBuilder.algo }`;
        gridModelBuilderEndpoints[modelBuilder.algo] = `/99/Grid/${ modelBuilder.algo }`;
      }
      __modelBuilderEndpoints = modelBuilderEndpoints;
      __gridModelBuilderEndpoints = gridModelBuilderEndpoints;
      return __modelBuilders = modelBuilders;
    };
    getModelBuilders = () => __modelBuilders;
    getModelBuilderEndpoint = algo => __modelBuilderEndpoints[algo];
    getGridModelBuilderEndpoint = algo => __gridModelBuilderEndpoints[algo];
    requestModelBuilders = go => {
      var modelBuilders;
      var visibility;
      if (modelBuilders = getModelBuilders()) {
        return go(null, modelBuilders);
      }
      visibility = 'Stable';
      return doGet('/3/ModelBuilders', unwrap(go, result => {
        var algo;
        var availableBuilders;
        var builder;
        var builders;
        builders = (() => {
          var _ref;
          var _results;
          _ref = result.model_builders;
          _results = [];
          for (algo in _ref) {
            if ({}.hasOwnProperty.call(_ref, algo)) {
              builder = _ref[algo];
              _results.push(builder);
            }
          }
          return _results;
        })();
        availableBuilders = (() => {
          var _i;
          var _j;
          var _len;
          var _len1;
          var _results;
          var _results1;
          switch (visibility) {
            case 'Stable':
              _results = [];
              for (_i = 0, _len = builders.length; _i < _len; _i++) {
                builder = builders[_i];
                if (builder.visibility === visibility) {
                  _results.push(builder);
                }
              }
              return _results;
            // break; // no-unreachable
            case 'Beta':
              _results1 = [];
              for (_j = 0, _len1 = builders.length; _j < _len1; _j++) {
                builder = builders[_j];
                if (builder.visibility === visibility || builder.visibility === 'Stable') {
                  _results1.push(builder);
                }
              }
              return _results1;
            // break; // no-unreachable
            default:
              return builders;
          }
        })();
        return cacheModelBuilders(availableBuilders);
      }));
    };
    requestModelBuilder = (algo, go) => doGet(getModelBuilderEndpoint(algo), go);
    requestModelInputValidation = (algo, parameters, go) => doPost(`${ getModelBuilderEndpoint(algo) }/parameters`, encodeObjectForPost(parameters), go);
    requestModelBuild = (algo, parameters, go) => {
      _.trackEvent('model', algo);
      if (parameters.hyper_parameters) {
        parameters.hyper_parameters = flowPrelude.stringify(parameters.hyper_parameters);
        if (parameters.search_criteria) {
          parameters.search_criteria = flowPrelude.stringify(parameters.search_criteria);
        }
        return doPost(getGridModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
      }
      return doPost(getModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
    };
    requestAutoModelBuild = (parameters, go) => doPostJSON('/3/AutoMLBuilder', parameters, go);
    requestPredict = (destinationKey, modelKey, frameKey, options, go) => {
      var opt;
      var opts;
      opts = {};
      if (destinationKey) {
        opts.predictions_frame = destinationKey;
      }
      if (void 0 !== (opt = options.reconstruction_error)) {
        opts.reconstruction_error = opt;
      }
      if (void 0 !== (opt = options.deep_features_hidden_layer)) {
        opts.deep_features_hidden_layer = opt;
      }
      if (void 0 !== (opt = options.leaf_node_assignment)) {
        opts.leaf_node_assignment = opt;
      }
      if (void 0 !== (opt = options.exemplar_index)) {
        opts.exemplar_index = opt;
      }
      return doPost(`/3/Predictions/models/${ encodeURIComponent(modelKey) }/frames/${ encodeURIComponent(frameKey) }`, opts, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, result);
      });
    };
    requestPrediction = (modelKey, frameKey, go) => doGet(`/3/ModelMetrics/models/${ encodeURIComponent(modelKey) }/frames/${ encodeURIComponent(frameKey) }`, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, result);
    });
    requestPredictions = (modelKey, frameKey, _go) => {
      var go;
      go = (error, result) => {
        var prediction;
        var predictions;
        if (error) {
          return _go(error);
        }
        predictions = (() => {
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = result.model_metrics;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prediction = _ref[_i];
            if (modelKey && prediction.model.name !== modelKey) {
              _results.push(null);
            } else if (frameKey && prediction.frame.name !== frameKey) {
              _results.push(null);
            } else {
              _results.push(prediction);
            }
          }
          return _results;
        })();
        return _go(null, (() => {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = predictions.length; _i < _len; _i++) {
            prediction = predictions[_i];
            if (prediction) {
              _results.push(prediction);
            }
          }
          return _results;
        })());
      };
      if (modelKey && frameKey) {
        return doGet(`/3/ModelMetrics/models/${ encodeURIComponent(modelKey) }/frames/'${ encodeURIComponent(frameKey) }`, go);
      } else if (modelKey) {
        return doGet(`/3/ModelMetrics/models/${ encodeURIComponent(modelKey) }`, go);
      } else if (frameKey) {
        return doGet(`/3/ModelMetrics/frames/${ encodeURIComponent(frameKey) }`, go);
      }
      return doGet('/3/ModelMetrics', go);
    };
    _storageConfiguration = null;
    requestIsStorageConfigured = go => {
      if (_storageConfiguration) {
        return go(null, _storageConfiguration.isConfigured);
      }
      return doGet('/3/NodePersistentStorage/configured', (error, result) => {
        _storageConfiguration = { isConfigured: error ? false : result.configured };
        return go(null, _storageConfiguration.isConfigured);
      });
    };
    requestObjects = (type, go) => doGet(`/3/NodePersistentStorage/${ encodeURIComponent(type) }`, unwrap(go, result => result.entries));
    requestObjectExists = (type, name, go) => doGet(`/3/NodePersistentStorage/categories/${ encodeURIComponent(type) }/names/${ encodeURIComponent(name) }/exists`, (error, result) => go(null, error ? false : result.exists));
    requestObject = (type, name, go) => doGet(`/3/NodePersistentStorage/${ encodeURIComponent(type) }/${ encodeURIComponent(name) }`, unwrap(go, result => JSON.parse(result.value)));
    requestDeleteObject = (type, name, go) => doDelete(`/3/NodePersistentStorage/${ encodeURIComponent(type) }/${ encodeURIComponent(name) }`, go);
    requestPutObject = (type, name, value, go) => {
      var uri;
      uri = `/3/NodePersistentStorage/${ encodeURIComponent(type) }`;
      if (name) {
        uri += `/${ encodeURIComponent(name) }`;
      }
      return doPost(uri, { value: JSON.stringify(value, null, 2) }, unwrap(go, result => result.name));
    };
    requestUploadObject = (type, name, formData, go) => {
      var uri;
      uri = `/3/NodePersistentStorage.bin/${ encodeURIComponent(type) }`;
      if (name) {
        uri += `/${ encodeURIComponent(name) }`;
      }
      return doUpload(uri, formData, unwrap(go, result => result.name));
    };
    requestUploadFile = (key, formData, go) => doUpload(`/3/PostFile?destination_frame=${ encodeURIComponent(key) }`, formData, go);
    requestCloud = go => doGet('/3/Cloud', go);
    requestTimeline = go => doGet('/3/Timeline', go);
    requestProfile = (depth, go) => doGet(`/3/Profiler?depth=${ depth }`, go);
    requestStackTrace = go => doGet('/3/JStack', go);
    requestRemoveAll = go => doDelete('/3/DKV', go);
    requestEcho = (message, go) => doPost('/3/LogAndEcho', { message }, go);
    requestLogFile = (nodeIndex, fileType, go) => doGet(`/3/Logs/nodes/${ nodeIndex }/files/${ fileType }`, go);
    requestNetworkTest = go => doGet('/3/NetworkTest', go);
    requestAbout = go => doGet('/3/About', go);
    requestShutdown = go => doPost('/3/Shutdown', {}, go);
    requestEndpoints = go => doGet('/3/Metadata/endpoints', go);
    requestEndpoint = (index, go) => doGet(`/3/Metadata/endpoints/${ index }`, go);
    requestSchemas = go => doGet('/3/Metadata/schemas', go);
    requestSchema = (name, go) => doGet(`/3/Metadata/schemas/${ encodeURIComponent(name) }`, go);
    getLines = data => lodash.filter(data.split('\n'), line => {
      if (line.trim()) {
        return true;
      }
      return false;
    });
    requestPacks = go => download('text', '/flow/packs/index.list', unwrap(go, getLines));
    requestPack = (packName, go) => download('text', `/flow/packs/${ encodeURIComponent(packName) }/index.list`, unwrap(go, getLines));
    requestFlow = (packName, flowName, go) => download('json', `/flow/packs/${ encodeURIComponent(packName) }/${ encodeURIComponent(flowName) }`, go);
    requestHelpIndex = go => download('json', '/flow/help/catalog.json', go);
    requestHelpContent = (name, go) => download('text', `/flow/help/${ name }.html`, go);
    requestRDDs = go => doGet('/3/RDDs', go);
    requestDataFrames = go => doGet('/3/dataframes', go);
    requestScalaIntp = go => doPost('/3/scalaint', {}, go);
    requestScalaCode = (session_id, code, go) => doPost(`/3/scalaint/${ session_id }`, { code }, go);
    requestAsH2OFrameFromRDD = (rdd_id, name, go) => {
      if (name === void 0) {
        return doPost(`/3/RDDs/${ rdd_id }/h2oframe`, {}, go);
      }
      return doPost(`/3/RDDs/${ rdd_id }/h2oframe`, { h2oframe_id: name }, go);
    };
    requestAsH2OFrameFromDF = (df_id, name, go) => {
      if (name === void 0) {
        return doPost(`/3/dataframes/${ df_id }/h2oframe`, {}, go);
      }
      return doPost(`/3/dataframes/${ df_id }/h2oframe`, { h2oframe_id: name }, go);
    };
    requestAsDataFrame = (hf_id, name, go) => {
      if (name === void 0) {
        return doPost(`/3/h2oframes/${ hf_id }/dataframe`, {}, go);
      }
      return doPost(`/3/h2oframes/${ hf_id }/dataframe`, { dataframe_id: name }, go);
    };
    Flow.Dataflow.link(_.requestInspect, requestInspect);
    Flow.Dataflow.link(_.requestCreateFrame, requestCreateFrame);
    Flow.Dataflow.link(_.requestSplitFrame, requestSplitFrame);
    Flow.Dataflow.link(_.requestFrames, requestFrames);
    Flow.Dataflow.link(_.requestFrame, requestFrame);
    Flow.Dataflow.link(_.requestFrameSlice, requestFrameSlice);
    Flow.Dataflow.link(_.requestFrameSummary, requestFrameSummary);
    Flow.Dataflow.link(_.requestFrameSummaryWithoutData, requestFrameSummaryWithoutData);
    Flow.Dataflow.link(_.requestFrameSummarySlice, requestFrameSummarySlice);
    Flow.Dataflow.link(_.requestDeleteFrame, requestDeleteFrame);
    Flow.Dataflow.link(_.requestExportFrame, requestExportFrame);
    Flow.Dataflow.link(_.requestColumnSummary, requestColumnSummary);
    Flow.Dataflow.link(_.requestJobs, requestJobs);
    Flow.Dataflow.link(_.requestJob, requestJob);
    Flow.Dataflow.link(_.requestCancelJob, requestCancelJob);
    Flow.Dataflow.link(_.requestFileGlob, requestFileGlob);
    Flow.Dataflow.link(_.requestImportFiles, requestImportFiles);
    Flow.Dataflow.link(_.requestImportFile, requestImportFile);
    Flow.Dataflow.link(_.requestParseSetup, requestParseSetup);
    Flow.Dataflow.link(_.requestParseSetupPreview, requestParseSetupPreview);
    Flow.Dataflow.link(_.requestParseFiles, requestParseFiles);
    Flow.Dataflow.link(_.requestPartialDependence, requestPartialDependence);
    Flow.Dataflow.link(_.requestPartialDependenceData, requestPartialDependenceData);
    Flow.Dataflow.link(_.requestGrids, requestGrids);
    Flow.Dataflow.link(_.requestModels, requestModels);
    Flow.Dataflow.link(_.requestGrid, requestGrid);
    Flow.Dataflow.link(_.requestModel, requestModel);
    Flow.Dataflow.link(_.requestPojoPreview, requestPojoPreview);
    Flow.Dataflow.link(_.requestDeleteModel, requestDeleteModel);
    Flow.Dataflow.link(_.requestImportModel, requestImportModel);
    Flow.Dataflow.link(_.requestExportModel, requestExportModel);
    Flow.Dataflow.link(_.requestModelBuilder, requestModelBuilder);
    Flow.Dataflow.link(_.requestModelBuilders, requestModelBuilders);
    Flow.Dataflow.link(_.requestModelBuild, requestModelBuild);
    Flow.Dataflow.link(_.requestModelInputValidation, requestModelInputValidation);
    Flow.Dataflow.link(_.requestAutoModelBuild, requestAutoModelBuild);
    Flow.Dataflow.link(_.requestPredict, requestPredict);
    Flow.Dataflow.link(_.requestPrediction, requestPrediction);
    Flow.Dataflow.link(_.requestPredictions, requestPredictions);
    Flow.Dataflow.link(_.requestObjects, requestObjects);
    Flow.Dataflow.link(_.requestObject, requestObject);
    Flow.Dataflow.link(_.requestObjectExists, requestObjectExists);
    Flow.Dataflow.link(_.requestDeleteObject, requestDeleteObject);
    Flow.Dataflow.link(_.requestPutObject, requestPutObject);
    Flow.Dataflow.link(_.requestUploadObject, requestUploadObject);
    Flow.Dataflow.link(_.requestUploadFile, requestUploadFile);
    Flow.Dataflow.link(_.requestCloud, requestCloud);
    Flow.Dataflow.link(_.requestTimeline, requestTimeline);
    Flow.Dataflow.link(_.requestProfile, requestProfile);
    Flow.Dataflow.link(_.requestStackTrace, requestStackTrace);
    Flow.Dataflow.link(_.requestRemoveAll, requestRemoveAll);
    Flow.Dataflow.link(_.requestEcho, requestEcho);
    Flow.Dataflow.link(_.requestLogFile, requestLogFile);
    Flow.Dataflow.link(_.requestNetworkTest, requestNetworkTest);
    Flow.Dataflow.link(_.requestAbout, requestAbout);
    Flow.Dataflow.link(_.requestShutdown, requestShutdown);
    Flow.Dataflow.link(_.requestEndpoints, requestEndpoints);
    Flow.Dataflow.link(_.requestEndpoint, requestEndpoint);
    Flow.Dataflow.link(_.requestSchemas, requestSchemas);
    Flow.Dataflow.link(_.requestSchema, requestSchema);
    Flow.Dataflow.link(_.requestPacks, requestPacks);
    Flow.Dataflow.link(_.requestPack, requestPack);
    Flow.Dataflow.link(_.requestFlow, requestFlow);
    Flow.Dataflow.link(_.requestHelpIndex, requestHelpIndex);
    Flow.Dataflow.link(_.requestHelpContent, requestHelpContent);
    Flow.Dataflow.link(_.requestExec, requestExec);
    Flow.Dataflow.link(_.requestRDDs, requestRDDs);
    Flow.Dataflow.link(_.requestDataFrames, requestDataFrames);
    Flow.Dataflow.link(_.requestScalaIntp, requestScalaIntp);
    Flow.Dataflow.link(_.requestScalaCode, requestScalaCode);
    Flow.Dataflow.link(_.requestAsH2OFrameFromDF, requestAsH2OFrameFromDF);
    Flow.Dataflow.link(_.requestAsH2OFrameFromRDD, requestAsH2OFrameFromRDD);
    return Flow.Dataflow.link(_.requestAsDataFrame, requestAsDataFrame);
  }

  function h2oApplication(_) {
    h2oApplicationContext(_);
    return h2oProxy(_);
  }

  function flowApplicationContext(_) {
    var Flow = window.Flow;
    _.ready = Flow.Dataflow.slots();
    _.initialized = Flow.Dataflow.slots();
    _.open = Flow.Dataflow.slot();
    _.load = Flow.Dataflow.slot();
    _.saved = Flow.Dataflow.slots();
    _.loaded = Flow.Dataflow.slots();
    _.setDirty = Flow.Dataflow.slots();
    _.setPristine = Flow.Dataflow.slots();
    _.status = Flow.Dataflow.slot();
    _.trackEvent = Flow.Dataflow.slot();
    _.trackException = Flow.Dataflow.slot();
    _.selectCell = Flow.Dataflow.slot();
    _.insertCell = Flow.Dataflow.slot();
    _.insertAndExecuteCell = Flow.Dataflow.slot();
    _.executeAllCells = Flow.Dataflow.slot();
    _.showHelp = Flow.Dataflow.slot();
    _.showOutline = Flow.Dataflow.slot();
    _.showBrowser = Flow.Dataflow.slot();
    _.showClipboard = Flow.Dataflow.slot();
    _.saveClip = Flow.Dataflow.slot();
    _.growl = Flow.Dataflow.slot();
    _.confirm = Flow.Dataflow.slot();
    _.alert = Flow.Dataflow.slot();
    return _.dialog = Flow.Dataflow.slot();
  }

  function flowSandbox(_, routines) {
    return {
      routines,
      context: {},
      results: {}
    };
  }

  function flowAnalytics(_) {
    var lodash = window._;
    var Flow = window.Flow;
    Flow.Dataflow.link(_.trackEvent, (category, action, label, value) => lodash.defer(() => window.ga('send', 'event', category, action, label, value)));
    return Flow.Dataflow.link(_.trackException, description => lodash.defer(() => {
      _.requestEcho(`FLOW: ${ description }`, () => {});
      return window.ga('send', 'exception', {
        exDescription: description,
        exFatal: false,
        appName: 'Flow',
        appVersion: Flow.Version
      });
    }));
  }

  function flowGrowl(_) {
    var Flow = window.Flow;
    return Flow.Dataflow.link(_.growl, (message, type) => {
      if (type) {
        return $.bootstrapGrowl(message, { type });
      }
      return $.bootstrapGrowl(message);
    });
  }

  function flowAutosave(_) {
    var Flow = window.Flow;
    var setDirty;
    var setPristine;
    var warnOnExit;
    warnOnExit = e => {
      var message;
      message = 'Warning: you are about to exit Flow.';
      if (e = e != null ? e : window.event) {
        e.returnValue = message;
      }
      return message;
    };
    setDirty = () => window.onbeforeunload = warnOnExit;
    setPristine = () => window.onbeforeunload = null;
    return Flow.Dataflow.link(_.ready, () => {
      Flow.Dataflow.link(_.setDirty, setDirty);
      return Flow.Dataflow.link(_.setPristine, setPristine);
    });
  }

  function flowApplication(_, routines) {
    var Flow = window.Flow;
    var _notebook;
    var _renderers;
    var _sandbox;
    flowApplicationContext(_);
    _sandbox = flowSandbox(_, routines(_));
    _renderers = Flow.Renderers(_, _sandbox);
    flowAnalytics(_);
    flowGrowl(_);
    flowAutosave(_);
    _notebook = Flow.Notebook(_, _renderers);
    return {
      context: _,
      sandbox: _sandbox,
      view: _notebook
    };
  }

  function flow() {
    var Flow = window.Flow;
    var checkSparklingWater;
    var getContextPath;
    getContextPath = () => {
      window.Flow.ContextPath = '/';
      return $.ajax({
        url: window.referrer,
        type: 'GET',
        success(data, status, xhr) {
          if (xhr.getAllResponseHeaders().indexOf('X-h2o-context-path') !== -1) {
            return window.Flow.ContextPath = xhr.getResponseHeader('X-h2o-context-path');
          }
        },
        async: false
      });
    };
    checkSparklingWater = context => {
      context.onSparklingWater = false;
      return $.ajax({
        url: `${ window.Flow.ContextPath }3/Metadata/endpoints`,
        type: 'GET',
        dataType: 'json',
        success(response) {
          var route;
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = response.routes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            route = _ref[_i];
            if (route.url_pattern === '/3/scalaint') {
              _results.push(context.onSparklingWater = true);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        },
        async: false
      });
    };
    if ((typeof window !== 'undefined' && window !== null ? window.$ : void 0) != null) {
      $(() => {
        var context;
        context = {};
        getContextPath();
        checkSparklingWater(context);
        window.flow = flowApplication(context, H2O.Routines);
        h2oApplication(context);
        ko.applyBindings(window.flow);
        context.ready();
        return context.initialized();
      });
    }
  }

  const flowPrelude$1 = flowPreludeFunction();

  // flow.coffee
  // parent IIFE for the rest of this file
  // defer for now
  (function () {
    var lodash = window._;
    window.Flow = {};
    window.H2O = {};
    flow();
    about();
    clipboard();
    failure();
    help();
    notebook();
    objectBrowser();
    async();
    data();
    dataflow();
    dialogs();
    error$1();
    format();
    gui();
    html();
    knockout();
    localStorage();
    // src/core/modules/marked.coffee IIFE
    // experience errors on first abstraction attempt
    // defer for now
    (function () {
      if ((typeof window !== 'undefined' && window !== null ? window.marked : void 0) == null) {
        return;
      }
      marked.setOptions({
        smartypants: true,
        highlight(code, lang) {
          if (window.hljs) {
            return window.hljs.highlightAuto(code, [lang]).value;
          }
          return code;
        }
      });
    }).call(this);
    coreUtils();
    routines();
    util();
    imputeInput();
    jobOutput();
    modelInput();
    parseInput();
  }).call(undefined);

}));