(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, function () { 'use strict';

  function flowPreludeFunction() {
    const Flow = window.Flow;
    const lodash = window._;
    const _isDefined = value => !lodash.isUndefined(value);
    const _isTruthy = value => {
      if (value) {
        return true;
      }
      return false;
    };
    const _isFalsy = value => {
      if (value) {
        return false;
      }
      return true;
    };
    const _negative = value => !value;
    const _always = () => true;
    const _never = () => false;
    const _copy = array => array.slice(0);
    const _remove = (array, element) => {
      const index = lodash.indexOf(array, element);
      if (index > -1) {
        return lodash.head(array.splice(index, 1));
      }
      return void 0;
    };
    const _words = text => text.split(/\s+/);
    const _repeat = (count, value) => {
      let i;
      let _i;
      const array = [];
      for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
        array.push(value);
      }
      return array;
    };
    const _typeOf = a => {
      const type = Object.prototype.toString.call(a);
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
    const _deepClone = obj => JSON.parse(JSON.stringify(obj));
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

  const flowPrelude$1 = flowPreludeFunction();

  function h2oFrameDataOutput(_, _go, _frame) {
    const lodash = window._;
    const Flow = window.Flow;
    let _lastUsedSearchTerm;
    const MaxItemsPerPage = 20;
    const _data = Flow.Dataflow.signal(null);
    const _columnNameSearchTerm = Flow.Dataflow.signal(null);
    const _currentPage = Flow.Dataflow.signal(0);
    const _maxPages = Flow.Dataflow.signal(Math.ceil(_frame.total_column_count / MaxItemsPerPage));
    const _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, index => index > 0);
    const _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, (maxPages, index) => index < maxPages - 1);
    const renderPlot = (container, render) => render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      return container(vis.element);
    });
    const renderFrame = frame => renderPlot(_data, _.plot(g => g(g.select(), g.from(_.inspect('data', frame)))));
    _lastUsedSearchTerm = null;
    const refreshColumns = pageIndex => {
      const searchTerm = _columnNameSearchTerm();
      if (searchTerm !== _lastUsedSearchTerm) {
        pageIndex = 0;
      }
      const startIndex = pageIndex * MaxItemsPerPage;
      const itemCount = startIndex + MaxItemsPerPage < _frame.total_column_count ? MaxItemsPerPage : _frame.total_column_count - startIndex;
      return _.requestFrameDataE(_frame.frame_id.name, searchTerm, startIndex, itemCount, (error, frame) => {
        if (error) {
          // empty
        } else {
          _lastUsedSearchTerm = searchTerm;
          _currentPage(pageIndex);
          return renderFrame(frame);
        }
      });
    };
    const goToPreviousPage = () => {
      const currentPage = _currentPage();
      if (currentPage > 0) {
        refreshColumns(currentPage - 1);
      }
    };
    const goToNextPage = () => {
      const currentPage = _currentPage();
      if (currentPage < _maxPages() - 1) {
        refreshColumns(currentPage + 1);
      }
    };
    Flow.Dataflow.react(_columnNameSearchTerm, lodash.throttle(refreshColumns, 500));
    renderFrame(_frame);
    lodash.defer(_go);
    return {
      key: _frame.frame_id.name,
      data: _data,
      columnNameSearchTerm: _columnNameSearchTerm,
      canGoToPreviousPage: _canGoToPreviousPage,
      canGoToNextPage: _canGoToNextPage,
      goToPreviousPage,
      goToNextPage,
      template: 'flow-frame-data-output'
    };
  }

  function flowForm(_, _form, _go) {
    const lodash = window._;
    lodash.defer(_go);
    return {
      form: _form,
      template: 'flow-form',
      templateOf(control) {
        return control.template;
      }
    };
  }

  const flowPrelude$2 = flowPreludeFunction();

  function modelInput() {
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
        isNotGrided: _isNotGrided
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
      const _textGrided = Flow.Dataflow.signal(`${ _text() };`);
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
        const _ref2 = `${ text }`.split(/\s*;\s*/g);
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
      value: Flow.Dataflow.signal(true)
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
          missingPercent: value.missingPercent
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
      const _hasValidationFailures = Flow.Dataflow.lift(_validationFailureMessage, flowPrelude$2.isTruthy);
      const _gridStrategies = ['Cartesian', 'RandomDiscrete'];
      const _isGrided = Flow.Dataflow.signal(false);
      const _gridId = Flow.Dataflow.signal(`grid-${ Flow.Util.uuid() }`);
      const _gridStrategy = Flow.Dataflow.signal('Cartesian');
      const _isGridRandomDiscrete = Flow.Dataflow.lift(_gridStrategy, strategy => strategy !== _gridStrategies[0]);
      const _gridMaxModels = Flow.Dataflow.signal(1000);
      const _gridMaxRuntime = Flow.Dataflow.signal(28800);
      const _gridStoppingRounds = Flow.Dataflow.signal(0);
      const _gridStoppingMetrics = ['AUTO', 'deviance', 'logloss', 'MSE', 'AUC', 'lift_top_group', 'r2', 'misclassification'];
      const _gridStoppingMetric = Flow.Dataflow.signal(_gridStoppingMetrics[0]);
      const _gridStoppingTolerance = Flow.Dataflow.signal(0.001);
      const _parametersByLevel = lodash.groupBy(_parameters, parameter => parameter.level);
      const _controlGroups = lodash.map(['critical', 'secondary', 'expert'], type => {
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
      const parameterTemplateOf = control => `flow-${ control.kind }-model-parameter`;
      const findFormField = name => lodash.find(_form, field => field.name === name);
      (() => {
        const _ref = lodash.map(['training_frame', 'validation_frame', 'response_column', 'ignored_columns', 'offset_column', 'weights_column', 'fold_column'], findFormField);
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
                _.requestFrameSummaryWithoutData(frameKey, (error, frame) => {
                  let columnLabels;
                  let columnValues;
                  if (!error) {
                    columnValues = lodash.map(frame.columns, column => column.label);
                    columnLabels = lodash.map(frame.columns, column => {
                      const missingPercent = 100 * column.missing_count / frame.rows;
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
      })();
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
                  hyperParameters[control.name] = [true, false];
              }
            } else {
              value = control.value();
              console.log('control from modelInput', control);
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
          return _.insertAndExecuteCell('cs', `buildModel \'${ _algorithm }\', ${ flowPrelude$2.stringify(parameters) }`);
        });
      };
      const _revalidate = value => {
        // HACK: ko seems to be raising change notifications when dropdown boxes are initialized.
        if (value !== void 0) {
          return performValidations(false, () => {});
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
        validationFailureMessage: _validationFailureMessage
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
          destinationKeyParameter.actual_value = `${ algorithm }-${ Flow.Util.uuid() }`;
        }

        //
        // Force classification.
        //
        const classificationParameter = lodash.find(parameters, parameter => parameter.name === 'do_classification');
        if (classificationParameter) {
          classificationParameter.actual_value = true;
        }
        return _.requestFrames((error, frames) => {
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
      (() => _.requestModelBuilders((error, modelBuilders) => {
        _algorithms(modelBuilders);
        _algorithm(_algo ? lodash.find(modelBuilders, builder => builder.algo === _algo) : void 0);
        const frameKey = _opts != null ? _opts.training_frame : void 0;
        return Flow.Dataflow.act(_algorithm, builder => {
          let algorithm;
          let parameters;
          if (builder) {
            algorithm = builder.algo;
            parameters = flowPrelude$2.deepClone(builder.parameters);
            return populateFramesAndColumns(frameKey, algorithm, parameters, () => _modelForm(H2O.modelBuilderForm(_, algorithm, parameters)));
          }
          return _modelForm(null);
        });
      }))();
      const createModel = () => _modelForm().createModel();
      lodash.defer(_go);
      return {
        parentException: _exception, // XXX hacky
        algorithms: _algorithms,
        algorithm: _algorithm,
        modelForm: _modelForm,
        canCreateModel: _canCreateModel,
        createModel,
        template: 'flow-model-input'
      };
    };
  }

  const flowPrelude$3 = flowPreludeFunction();

  function parseInput() {
    const lodash = window._;
    const Flow = window.Flow;
    const H2O = window.H2O;
    const MaxItemsPerPage = 15;
    const parseTypes = lodash.map(['AUTO', 'ARFF', 'XLS', 'XLSX', 'CSV', 'SVMLight', 'ORC', 'AVRO', 'PARQUET'], type => ({
      type,
      caption: type
    }));
    const parseDelimiters = (() => {
      const whitespaceSeparators = ['NULL', 'SOH (start of heading)', 'STX (start of text)', 'ETX (end of text)', 'EOT (end of transmission)', 'ENQ (enquiry)', 'ACK (acknowledge)', 'BEL \'\\a\' (bell)', 'BS  \'\\b\' (backspace)', 'HT  \'\\t\' (horizontal tab)', 'LF  \'\\n\' (new line)', 'VT  \'\\v\' (vertical tab)', 'FF  \'\\f\' (form feed)', 'CR  \'\\r\' (carriage ret)', 'SO  (shift out)', 'SI  (shift in)', 'DLE (data link escape)', 'DC1 (device control 1) ', 'DC2 (device control 2)', 'DC3 (device control 3)', 'DC4 (device control 4)', 'NAK (negative ack.)', 'SYN (synchronous idle)', 'ETB (end of trans. blk)', 'CAN (cancel)', 'EM  (end of medium)', 'SUB (substitute)', 'ESC (escape)', 'FS  (file separator)', 'GS  (group separator)', 'RS  (record separator)', 'US  (unit separator)', '\' \' SPACE'];
      const createDelimiter = (caption, charCode) => ({
        charCode,
        caption: `${ caption }: \'${ `00${ charCode }`.slice(-2) }\'`
      });
      const whitespaceDelimiters = lodash.map(whitespaceSeparators, createDelimiter);
      const characterDelimiters = lodash.times(126 - whitespaceSeparators.length, i => {
        const charCode = i + whitespaceSeparators.length;
        return createDelimiter(String.fromCharCode(charCode), charCode);
      });
      const otherDelimiters = [{
        charCode: -1,
        caption: 'AUTO'
      }];
      return whitespaceDelimiters.concat(characterDelimiters, otherDelimiters);
    })();
    const dataTypes = ['Unknown', 'Numeric', 'Enum', 'Time', 'UUID', 'String', 'Invalid'];
    H2O.SetupParseOutput = (_, _go, _inputs, _result) => {
      let _currentPage;
      const _inputKey = _inputs.paths ? 'paths' : 'source_frames';
      const _sourceKeys = lodash.map(_result.source_frames, src => src.name);
      const _parseType = Flow.Dataflow.signal(lodash.find(parseTypes, parseType => parseType.type === _result.parse_type));
      const _canReconfigure = Flow.Dataflow.lift(_parseType, parseType => parseType.type !== 'SVMLight');
      const _delimiter = Flow.Dataflow.signal(lodash.find(parseDelimiters, delimiter => delimiter.charCode === _result.separator));
      const _useSingleQuotes = Flow.Dataflow.signal(_result.single_quotes);
      const _destinationKey = Flow.Dataflow.signal(_result.destination_frame);
      const _headerOptions = {
        auto: 0,
        header: 1,
        data: -1
      };
      const _headerOption = Flow.Dataflow.signal(_result.check_header === 0 ? 'auto' : _result.check_header === -1 ? 'data' : 'header');
      const _deleteOnDone = Flow.Dataflow.signal(true);
      const _columnNameSearchTerm = Flow.Dataflow.signal('');
      const _preview = Flow.Dataflow.signal(_result);
      const _chunkSize = Flow.Dataflow.lift(_preview, preview => preview.chunk_size);
      const refreshPreview = () => {
        let column;
        const columnTypes = (() => {
          let _i;
          let _len;
          const _ref = _columns();
          const _results = [];
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
      const _columns = Flow.Dataflow.lift(_preview, preview => {
        let data;
        let i;
        let j;
        let row;
        let _i;
        let _j;
        const columnTypes = preview.column_types;
        const columnCount = columnTypes.length;
        const previewData = preview.data;
        const rowCount = previewData.length;
        const columnNames = preview.column_names;
        const rows = new Array(columnCount);
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
      const _columnCount = Flow.Dataflow.lift(_columns, columns => (columns != null ? columns.length : void 0) || 0);
      _currentPage = 0;
      Flow.Dataflow.act(_columns, columns => lodash.forEach(columns, column => Flow.Dataflow.react(column.type, () => {
        _currentPage = _activePage().index;
        return refreshPreview();
      })));
      Flow.Dataflow.react(_parseType, _delimiter, _useSingleQuotes, _headerOption, () => {
        _currentPage = 0;
        return refreshPreview();
      });
      const _filteredColumns = Flow.Dataflow.lift(_columns, columns => columns);
      const makePage = (index, columns) => ({
        index,
        columns
      });
      const _activePage = Flow.Dataflow.lift(_columns, columns => makePage(_currentPage, columns));
      const filterColumns = () => _activePage(makePage(0, lodash.filter(_columns(), column => column.name().toLowerCase().indexOf(_columnNameSearchTerm().toLowerCase()) > -1)));
      Flow.Dataflow.react(_columnNameSearchTerm, lodash.throttle(filterColumns, 500));
      const _visibleColumns = Flow.Dataflow.lift(_activePage, currentPage => {
        const start = currentPage.index * MaxItemsPerPage;
        return currentPage.columns.slice(start, start + MaxItemsPerPage);
      });
      const parseFiles = () => {
        let column;
        let columnNames;
        let headerOption;
        columnNames = (() => {
          let _i;
          let _len;
          const _ref = _columns();
          const _results = [];
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
        const columnTypes = (() => {
          let _i;
          let _len;
          const _ref = _columns();
          const _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            column = _ref[_i];
            _results.push(column.type());
          }
          return _results;
        })();
        return _.insertAndExecuteCell('cs', 'parseFiles\n  ' + _inputKey + ': ' + flowPrelude$3.stringify(_inputs[_inputKey]) + '\n  destination_frame: ' + flowPrelude$3.stringify(_destinationKey()) + '\n  parse_type: ' + flowPrelude$3.stringify(_parseType().type) + '\n  separator: ' + _delimiter().charCode + '\n  number_columns: ' + _columnCount() + '\n  single_quotes: ' + _useSingleQuotes() + '\n  ' + (_canReconfigure() ? 'column_names: ' + flowPrelude$3.stringify(columnNames) + '\n  ' : '') + (_canReconfigure() ? 'column_types: ' + flowPrelude$3.stringify(columnTypes) + '\n  ' : '') + 'delete_on_done: ' + _deleteOnDone() + '\n  check_header: ' + headerOption + '\n  chunk_size: ' + _chunkSize()); // eslint-disable-line
      };
      const _canGoToNextPage = Flow.Dataflow.lift(_activePage, currentPage => (currentPage.index + 1) * MaxItemsPerPage < currentPage.columns.length);
      const _canGoToPreviousPage = Flow.Dataflow.lift(_activePage, currentPage => currentPage.index > 0);
      const goToNextPage = () => {
        const currentPage = _activePage();
        return _activePage(makePage(currentPage.index + 1, currentPage.columns));
      };
      const goToPreviousPage = () => {
        const currentPage = _activePage();
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

  const flowPrelude$4 = flowPreludeFunction();

  function jobOutput() {
    const lodash = window._;
    const Flow = window.Flow;
    const H2O = window.H2O;
    const jobOutputStatusColors = {
      failed: '#d9534f',
      done: '#ccc',
      running: '#f0ad4e'
    };
    const getJobOutputStatusColor = status => {
      // CREATED   Job was created
      // RUNNING   Job is running
      // CANCELLED Job was cancelled by user
      // FAILED    Job crashed, error message/exception is available
      // DONE      Job was successfully finished
      switch (status) {
        case 'DONE':
          return jobOutputStatusColors.done;
        case 'CREATED':
        case 'RUNNING':
          return jobOutputStatusColors.running;
        default:
          // 'CANCELLED', 'FAILED'
          return jobOutputStatusColors.failed;
      }
    };
    const getJobProgressPercent = progress => `${ Math.ceil(100 * progress) }%`;
    H2O.JobOutput = (_, _go, _job) => {
      const _isBusy = Flow.Dataflow.signal(false);
      const _isLive = Flow.Dataflow.signal(false);
      const _key = _job.key.name;
      const _description = _job.description;
      const _destinationKey = _job.dest.name;
      const _destinationType = (() => {
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
      const _runTime = Flow.Dataflow.signal(null);
      const _remainingTime = Flow.Dataflow.signal(null);
      const _progress = Flow.Dataflow.signal(null);
      const _progressMessage = Flow.Dataflow.signal(null);
      const _status = Flow.Dataflow.signal(null);
      const _statusColor = Flow.Dataflow.signal(null);
      const _exception = Flow.Dataflow.signal(null);
      const _messages = Flow.Dataflow.signal(null);
      const _canView = Flow.Dataflow.signal(false);
      const _canCancel = Flow.Dataflow.signal(false);
      const isJobRunning = job => job.status === 'CREATED' || job.status === 'RUNNING';
      const messageIcons = {
        ERROR: 'fa-times-circle red',
        WARN: 'fa-warning orange',
        INFO: 'fa-info-circle'
      };
      const canView = job => {
        switch (_destinationType) {
          case 'Model':
          case 'Grid':
            return job.ready_for_view;
          default:
            return !isJobRunning(job);
        }
      };
      const updateJob = job => {
        let cause;
        let message;
        let messages;
        _runTime(Flow.Util.formatMilliseconds(job.msec));
        _progress(getJobProgressPercent(job.progress));
        _remainingTime(job.progress ? Flow.Util.formatMilliseconds(Math.round((1 - job.progress) * job.msec / job.progress)) : 'Estimating...');
        _progressMessage(job.progress_msg);
        _status(job.status);
        _statusColor(getJobOutputStatusColor(job.status));
        if (job.error_count) {
          messages = (() => {
            let _i;
            let _len;
            const _ref = job.messages;
            const _results = [];
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
          _exception(Flow.failure(_, new Flow.Error('Job failure.', cause)));
        }
        _canView(canView(job));
        return _canCancel(isJobRunning(job));
      };
      const refresh = () => {
        _isBusy(true);
        return _.requestJob(_key, (error, job) => {
          _isBusy(false);
          if (error) {
            _exception(Flow.failure(_, new Flow.Error('Error fetching jobs', error)));
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
      const view = () => {
        if (!_canView()) {
          return;
        }
        switch (_destinationType) {
          case 'Frame':
            return _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$4.stringify(_destinationKey) }`);
          case 'Model':
            return _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$4.stringify(_destinationKey) }`);
          case 'Grid':
            return _.insertAndExecuteCell('cs', `getGrid ${ flowPrelude$4.stringify(_destinationKey) }`);
          case 'PartialDependence':
            return _.insertAndExecuteCell('cs', `getPartialDependence ${ flowPrelude$4.stringify(_destinationKey) }`);
          case 'Auto Model':
            // FIXME getGrid() for AutoML is hosed; resort to getGrids() for now.
            return _.insertAndExecuteCell('cs', 'getGrids');
          case 'Void':
            return alert(`This frame was exported to\n${ _job.dest.name }`);
          default:
          // do nothing
        }
      };
      const cancel = () => _.requestCancelJob(_key, (error, result) => {
        if (error) {
          return console.debug(error);
        }
        return updateJob(_job);
      });
      const initialize = job => {
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
    const lodash = window._;
    const Flow = window.Flow;
    const H2O = window.H2O;
    const createOptions = options => {
      let option;
      let _i;
      let _len;
      const _results = [];
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        option = options[_i];
        _results.push({
          caption: option,
          value: option.toLowerCase()
        });
      }
      return _results;
    };
    const _allMethods = createOptions(['Mean', 'Median', 'Mode']);
    const _allCombineMethods = createOptions(['Interpolate', 'Average', 'Low', 'High']);
    H2O.ImputeInput = (_, _go, opts) => {
      if (opts == null) {
        opts = {};
      }
      const _frames = Flow.Dataflow.signal([]);
      const _frame = Flow.Dataflow.signal(null);
      const _hasFrame = Flow.Dataflow.lift(_frame, frame => {
        if (frame) {
          return true;
        }
        return false;
      });
      const _columns = Flow.Dataflow.signal([]);
      const _column = Flow.Dataflow.signal(null);
      const _methods = _allMethods;
      const _method = Flow.Dataflow.signal(_allMethods[0]);
      const _canUseCombineMethod = Flow.Dataflow.lift(_method, method => method.value === 'median');
      const _combineMethods = _allCombineMethods;
      const _combineMethod = Flow.Dataflow.signal(_allCombineMethods[0]);
      const _canGroupByColumns = Flow.Dataflow.lift(_method, method => method.value !== 'median');
      const _groupByColumns = Flow.Dataflow.signals([]);
      const _canImpute = Flow.Dataflow.lift(_frame, _column, (frame, column) => frame && column);
      const impute = () => {
        const combineMethod = _combineMethod();
        let groupByColumns;
        const method = _method();
        const arg = {
          frame: _frame(),
          column: _column(),
          method: method.value
        };
        if (method.value === 'median') {
          if (combineMethod) {
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
        let frame;
        if (error) {
          // empty
          // TODO handle properly
        } else {
          _frames((() => {
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
          if (opts.frame) {
            _frame(opts.frame);
          }
        }
      });
      Flow.Dataflow.react(_frame, frame => {
        if (frame) {
          return _.requestFrameSummaryWithoutData(frame, (error, frame) => {
            let column;
            if (error) {
              // empty
              // TODO handle properly
            } else {
              _columns((() => {
                let _i;
                let _len;
                const _ref = frame.columns;
                const _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  column = _ref[_i];
                  _results.push(column.label);
                }
                return _results;
              })());
              if (opts.column) {
                _column(opts.column);
                return delete opts.column; // HACK
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
    const Flow = window.Flow;
    const H2O = window.H2O;
    const validateFileExtension = (filename, extension) => filename.indexOf(extension, filename.length - extension.length) !== -1;
    const getFileBaseName = (filename, extension) => Flow.Util.sanitizeName(filename.substr(0, filename.length - extension.length));
    H2O.Util = {
      validateFileExtension,
      getFileBaseName
    };
  }

  function getTwoDimData(table, columnName) {
    const lodash = window._;
    const columnIndex = lodash.findIndex(table.columns, column => column.name === columnName);
    if (columnIndex >= 0) {
      return table.data[columnIndex];
    }
    return void 0;
  }

  function format6fi(number) {
    if (number) {
      if (number === 'NaN') {
        return void 0;
      }
      return number.toFixed(6).replace(/\.0+$/, '');
    }
    return number;
  }

  function createArrays(count, length) {
    let i;
    let _i;
    const _results = [];
    for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
      _results.push(new Array(length));
    }
    return _results;
  }

  function parseAndFormatArray(source) {
    const lodash = window._;
    let element;
    let i;
    let _i;
    let _len;
    const target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      element = source[i];
      target[i] = element != null ? lodash.isNumber(element) ? format6fi(element) : element : void 0;
    }
    return target;
  }

  const flowPrelude$6 = flowPreludeFunction();

  function parseAndFormatObjectArray(source) {
    const lodash = window._;
    let element;
    let i;
    let _i;
    let _len;
    let _ref;
    let _ref1;
    const target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      element = source[i];
      _ref = element.__meta;
      _ref1 = element.__meta;
      target[i] = element != null ? (_ref != null ? _ref.schema_type : void 0) === 'Key<Model>' ? `<a href=\'#\' data-type=\'model\' data-key=${ flowPrelude$6.stringify(element.name) }>${ lodash.escape(element.name) }</a>` : (_ref1 != null ? _ref1.schema_type : void 0) === 'Key<Frame>' ? `<a href=\'#\' data-type=\'frame\' data-key=${ flowPrelude$6.stringify(element.name) }>${ lodash.escape(element.name) }</a>` : element : void 0;
    }
    return target;
  }

  function _fork() {
    const Flow = window.Flow;
    const f = arguments[0];
    const __slice = [].slice;
    const args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
    return Flow.Async.fork(f, args);
  }

  function _join() {
    const Flow = window.Flow;
    const __slice = [].slice;
    let _i;
    const args = arguments.length >= 2 ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []);
    const go = arguments[_i++];
    return Flow.Async.join(args, Flow.Async.applicate(go));
  }

  function _call() {
    const Flow = window.Flow;
    const __slice = [].slice;
    const go = arguments[0];
    const args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
    return Flow.Async.join(args, Flow.Async.applicate(go));
  }

  function _apply(go, args) {
    const Flow = window.Flow;
    return Flow.Async.join(args, go);
  }

  function flow_(raw) {
    if (!raw._flow_) {
      raw._flow_ = { _cache_: {} };
    }
    return raw._flow_;
  }

  function inspect_(raw, inspectors) {
    let attr;
    const root = flow_(raw);
    if (root.inspect == null) {
      root.inspect = {};
    }
    for (attr in inspectors) {
      if ({}.hasOwnProperty.call(inspectors, attr)) {
        const f = inspectors[attr];
        root.inspect[attr] = f;
      }
    }
    return raw;
  }

  function render_() {
    const Flow = window.Flow;
    const __slice = [].slice;
    const _ = arguments[0];
    const raw = arguments[1];
    const render = arguments[2];
    const args = arguments.length >= 4 ? __slice.call(arguments, 3) : [];
    // Prepend current context (_) and a continuation (go)
    flow_(raw).render = go => render(...[_, go].concat(args));
    return raw;
  }

  const flowPrelude$7 = flowPreludeFunction();

  function h2oInspectOutput(_, _go, _frame) {
    const lodash = window._;
    const Flow = window.Flow;
    const view = () => _.insertAndExecuteCell('cs', `grid inspect ${ flowPrelude$7.stringify(_frame.label) }, ${ _frame.metadata.origin }`);
    const plot = () => _.insertAndExecuteCell('cs', _frame.metadata.plot);
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

  function inspect$2(attr, obj) {
    const Flow = window.Flow;
    const lodash = window._;
    const _async = Flow.Async.async;
    const _isFuture = Flow.Async.isFuture;
    let inspection;
    if (!attr) {
      return;
    }
    if (_isFuture(obj)) {
      return _async(inspect, attr, obj);
    }
    if (!obj) {
      return;
    }
    const root = obj._flow_;
    if (!root) {
      return;
    }
    const inspectors = root.inspect;
    if (!inspectors) {
      return;
    }
    const key = `inspect_${ attr }`;
    const cached = root._cache_[key];
    if (cached) {
      return cached;
    }
    const f = inspectors[attr];
    if (!f) {
      return;
    }
    if (!lodash.isFunction(f)) {
      return;
    }
    root._cache_[key] = inspection = f();
    render_(inspection, h2oInspectOutput, inspection);
    return inspection;
  }

  const flowPrelude$8 = flowPreludeFunction();

  function h2oInspectsOutput(_, _go, _tables) {
    const lodash = window._;
    const Flow = window.Flow;
    const createTableView = table => {
      const inspect = () => _.insertAndExecuteCell('cs', `inspect ${ flowPrelude$8.stringify(table.label) }, ${ table.metadata.origin }`);
      const grid = () => _.insertAndExecuteCell('cs', `grid inspect ${ flowPrelude$8.stringify(table.label) }, ${ table.metadata.origin }`);
      const plot = () => _.insertAndExecuteCell('cs', table.metadata.plot);
      return {
        label: table.label,
        description: table.metadata.description,
        // variables: table.variables #XXX unused?
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

  function inspect$1(obj) {
    const Flow = window.Flow;
    const _async = Flow.Async.async;
    const _isFuture = Flow.Async.isFuture;
    let attr;
    let inspections;

    if (_isFuture(obj)) {
      return _async(inspect, obj);
    }

    const _ref1 = obj._flow_;
    const inspectors = obj;
    if (inspectors != null ? _ref1 != null ? _ref1.inspect : void 0 : void 0) {
      inspections = [];
      for (attr in inspectors) {
        if ({}.hasOwnProperty.call(inspectors, attr)) {
          const f = inspectors[attr];
          inspections.push(inspect$2(attr, obj));
        }
      }
      render_(inspections, h2oInspectsOutput, inspections);
      return inspections;
    }
    return {};
  }

  function inspect(a, b) {
    if (arguments.length === 1) {
      return inspect$1(a);
    }
    return inspect$2(a, b);
  }

  function ls(obj) {
    const lodash = window._;
    const Flow = window.Flow;
    const _isFuture = Flow.Async.isFuture;
    const _async = Flow.Async.async;
    let inspectors;
    let _ref1;
    if (_isFuture(obj)) {
      return _async(ls, obj);
    }
    // if we refactor this for the rule no-cond-assign
    // then the model output breaks
    // TODO find a way to refactor that does not break model output
    if (inspectors = obj != null ? (_ref1 = obj._flow_) != null ? _ref1.inspect : void 0 : void 0) {
      // eslint-disable-line
      return lodash.keys(inspectors);
    }
    return [];
  }

  function transformBinomialMetrics(metrics) {
    let cms;
    let domain;
    let fns;
    let fps;
    let i;
    let tns;
    let tp;
    let tps;
    const scores = metrics.thresholds_and_metric_scores;
    if (scores) {
      domain = metrics.domain;
      tps = getTwoDimData(scores, 'tps');
      tns = getTwoDimData(scores, 'tns');
      fps = getTwoDimData(scores, 'fps');
      fns = getTwoDimData(scores, 'fns');
      cms = (() => {
        let _i;
        const _results = [];
        _i = 0;
        const _len = tps.length;
        for (i = _i, _len; _i < _len; i = ++_i) {
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
        format: 'matrix', // TODO HACK
        type: 'matrix'
      });
      scores.data.push(cms);
    }
    return metrics;
  }

  function parseNumbers(source) {
    let i;
    let value;
    let _i;
    let _len;
    const target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      value = source[i];
      // TODO handle formatting
      target[i] = value === 'NaN' ? void 0 : value === 'Infinity' ? Number.POSITIVE_INFINITY : value === '-Infinity' ? Number.NEGATIVE_INFINITY : value;
    }
    return target;
  }

  function format4f(number) {
    if (number) {
      if (number === 'NaN') {
        return void 0;
      }
      return number.toFixed(4).replace(/\.0+$/, '.0');
    }
    return number;
  }

  function formatConfusionMatrix(cm) {
    const Flow = window.Flow;
    const _ref = cm.matrix;
    const _ref1 = _ref[0];
    const tn = _ref1[0];
    const fp = _ref1[1];
    const _ref2 = _ref[1];
    const fn = _ref2[0];
    const tp = _ref2[1];
    const fnr = fn / (tp + fn);
    const fpr = fp / (fp + tn);
    const domain = cm.domain;
    const _ref3 = Flow.HTML.template('table.flow-matrix', 'tbody', 'tr', 'td.strong.flow-center', 'td', 'td.bg-yellow');
    const table = _ref3[0];
    const tbody = _ref3[1];
    const tr = _ref3[2];
    const strong = _ref3[3];
    const normal = _ref3[4];
    const yellow = _ref3[5];
    return table([tbody([tr([strong('Actual/Predicted'), strong(domain[0]), strong(domain[1]), strong('Error'), strong('Rate')]), tr([strong(domain[0]), yellow(tn), normal(fp), normal(format4f(fpr)), normal(`${ fp } / ${ fp + tn }`)]), tr([strong(domain[1]), normal(fn), yellow(tp), normal(format4f(fnr)), normal(`${ fn } / ${ tp + fn }`)]), tr([strong('Total'), strong(tn + fn), strong(tp + fp), strong(format4f((fn + fp) / (fp + tn + tp + fn))), strong(`${ fn }${ fp } / ${ fp + tn + tp + fn }`)])])]);
  }

  function convertColumnToVector(column, data) {
    const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
    if (lightning.settings) {
      lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
      lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
    }

    const createVector = lightning.createVector;
    const createFactor = lightning.createFactor;
    const createList = lightning.createList;

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
  }

  function convertTableToFrame(table, tableName, metadata) {
    const lodash = window._;

    const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
    if (lightning.settings) {
      lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
      lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
    }

    const createDataframe = lightning.createFrame;

    // TODO handle format strings and description
    let column;
    let i;
    const vectors = (() => {
      let _i;
      let _len;
      const _ref = table.columns;
      const _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        column = _ref[i];
        _results.push(convertColumnToVector(column, table.data[i]));
      }
      return _results;
    })();
    return createDataframe(tableName, vectors, lodash.range(table.rowcount), null, metadata);
  }

  function inspectTwoDimTable_(origin, tableName, table) {
    return function () {
      return convertTableToFrame(table, tableName, {
        description: table.description || '',
        origin
      });
    };
  }

  const flowPrelude$10 = flowPreludeFunction();

  function h2oPartialDependenceOutput(_, _go, _result) {
    const lodash = window._;
    const Flow = window.Flow;
    let data;
    let i;
    let section;
    let table;
    let x;
    let y;
    let _i;
    let _len;
    const _destinationKey = _result.destination_key;
    const _modelId = _result.model_id.name;
    const _frameId = _result.frame_id.name;
    const renderPlot = (target, render) => render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      return target(vis.element);
    });

    // Hold as many plots as are present in the result.
    const _plots = [];

    const _ref = _result.partial_dependence_data;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      data = _ref[i];
      table = _.inspect(`plot${ i + 1 }`, _result);
      if (table) {
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
    const _viewFrame = () => _.insertAndExecuteCell('cs', `requestPartialDependenceData ${ flowPrelude$10.stringify(_destinationKey) }`);
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

  const flowPrelude$9 = flowPreludeFunction();

  function extendPartialDependence(_, result) {
    let data;
    let i;
    let origin;
    let _i;
    const inspections = {};
    const _ref1 = result.partial_dependence_data;
    _i = 0;
    const _len = _ref1.length;
    for (i = _i, _len; _i < _len; i = ++_i) {
      data = _ref1[i];
      origin = `getPartialDependence ${ flowPrelude$9.stringify(result.destination_key) }`;
      inspections[`plot${ i + 1 }`] = inspectTwoDimTable_(origin, `plot${ i + 1 }`, data);
    }
    inspect_(result, inspections);
    render_(_, result, h2oPartialDependenceOutput, result);
    return result;
  }

  function getModelParameterValue(type, value) {
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
  }

  function inspectRawObject_(name, origin, description, obj) {
    return function () {
      const lodash = window._;

      const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
      if (lightning.settings) {
        lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
        lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
      }
      const createList = lightning.createList;
      const createDataframe = lightning.createFrame;

      let k;
      let v;
      const vectors = (() => {
        const _results = [];
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
  }

  function inspectRawArray_(name, origin, description, array) {
    return function () {
      const lodash = window._;

      const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
      if (lightning.settings) {
        lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
        lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
      }
      const createList = lightning.createList;
      const createDataframe = lightning.createFrame;

      return createDataframe(name, [createList(name, parseAndFormatArray(array))], lodash.range(array.length), null, {
        description: '',
        origin
      });
    };
  }

  function inspectObjectArray_(name, origin, description, array) {
    return function () {
      const lodash = window._;
      const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
      if (lightning.settings) {
        lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
        lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
      }
      const createList = lightning.createList;
      const createDataframe = lightning.createFrame;

      return createDataframe(name, [createList(name, parseAndFormatObjectArray(array))], lodash.range(array.length), null, {
        description: '',
        origin
      });
    };
  }

  const _schemaHacks = {
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

  function schemaTransforms() {
    let attrs;
    let schema;
    let transform;
    const transforms = {};
    for (schema in _schemaHacks) {
      if ({}.hasOwnProperty.call(_schemaHacks, schema)) {
        attrs = _schemaHacks[schema];
        transform = attrs.transform;
        if (transform) {
          transforms[schema] = transform;
        }
      }
    }
    return transforms;
  }

  const flowPrelude$12 = flowPreludeFunction();

  function blacklistedAttributesBySchema() {
    let attrs;
    let dict;
    let field;
    let schema;
    let _i;
    let _len;
    let _ref1;
    const dicts = {};
    for (schema in _schemaHacks) {
      if ({}.hasOwnProperty.call(_schemaHacks, schema)) {
        attrs = _schemaHacks[schema];
        dicts[schema] = dict = { __meta: true };
        if (attrs.fields) {
          _ref1 = flowPrelude$12.words(attrs.fields);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            field = _ref1[_i];
            dict[field] = true;
          }
        }
      }
    }
    return dicts;
  }

  const flowPrelude$11 = flowPreludeFunction();

  function inspectObject(inspections, name, origin, obj) {
    const lodash = window._;
    let k;
    let meta;
    let v;
    let _ref2;
    const _ref1 = obj.__meta;
    const schemaType = _ref1 != null ? _ref1.schema_type : void 0;
    const attrs = blacklistedAttributesBySchema()[schemaType];
    const blacklistedAttributes = schemaType ? attrs : {};
    const transform = schemaTransforms[schemaType];
    if (transform) {
      obj = transform(obj);
    }
    const record = {};
    inspections[name] = inspectRawObject_(name, origin, name, record);
    for (k in obj) {
      if ({}.hasOwnProperty.call(obj, k)) {
        v = obj[k];
        if (!blacklistedAttributes[k]) {
          if (v === null) {
            record[k] = null;
          } else {
            _ref2 = v.__meta;
            if ((_ref2 != null ? _ref2.schema_type : void 0) === 'TwoDimTable') {
              inspections[`${ name } - ${ v.name }`] = inspectTwoDimTable_(origin, `${ name } - ${ v.name }`, v);
            } else {
              if (lodash.isArray(v)) {
                if (k === 'cross_validation_models' || k === 'cross_validation_predictions' || name === 'output' && (k === 'weights' || k === 'biases')) {
                  inspections[k] = inspectObjectArray_(k, origin, k, v);
                } else {
                  inspections[k] = inspectRawArray_(k, origin, k, v);
                }
              } else if (lodash.isObject(v)) {
                meta = v.__meta;
                if (meta) {
                  if (meta.schema_type === 'Key<Frame>') {
                    record[k] = `<a href=\'#\' data-type=\'frame\' data-key=${ flowPrelude$11.stringify(v.name) }>${ lodash.escape(v.name) }</a>`;
                  } else if (meta.schema_type === 'Key<Model>') {
                    record[k] = `<a href=\'#\' data-type=\'model\' data-key=${ flowPrelude$11.stringify(v.name) }>${ lodash.escape(v.name) }</a>`;
                  } else if (meta.schema_type === 'Frame') {
                    record[k] = `<a href=\'#\' data-type=\'frame\' data-key=${ flowPrelude$11.stringify(v.frame_id.name) }>${ lodash.escape(v.frame_id.name) }</a>`;
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
  }

  function proceed(_, func, args, go) {
    return go(null, render_(_, ...[{}, func].concat(args || [])));
  }

  function extendGuiForm(_, form) {
    return render_(_, form, flowForm, form);
  }

  function createGui(_, controls, go) {
    const Flow = window.Flow;
    return go(null, extendGuiForm(_, Flow.Dataflow.signals(controls || [])));
  }

  // not used anywhere beyond src/routines/routines?
  // replaced by src/gui/gui?
  function gui(_, controls) {
    const Flow = window.Flow;
    _fork(createGui, _, controls);
    const _ref = Flow.Gui;
    let nameThing;
    for (nameThing in _ref) {
      if ({}.hasOwnProperty.call(_ref, nameThing)) {
        const f = _ref[nameThing];
        gui[nameThing] = f;
      }
    }
  }

  function _plot(render, go) {
    const Flow = window.Flow;
    return render((error, vis) => {
      if (error) {
        return go(new Flow.Error('Error rendering vis.', error));
      }
      return go(null, vis);
    });
  }

  function h2oPlotOutput(_, _go, _plot) {
    const lodash = window._;
    lodash.defer(_go);
    return {
      plot: _plot,
      template: 'flow-plot-output'
    };
  }

  function extendPlot(_, vis) {
    render_(_, vis, h2oPlotOutput, vis.element);
  }

  function createPlot(_, f, go) {
    const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
    if (lightning.settings) {
      lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
      lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
    }
    return _plot(f(lightning), (error, vis) => {
      if (error) {
        return go(error);
      }
      return go(null, extendPlot(_, vis));
    });
  }

  const _assistance = {
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

  function h2oCloudOutput(_, _go, _cloud) {
    const lodash = window._;
    const Flow = window.Flow;
    const moment = window.moment;
    const d3 = window.d3;
    let _isHealthy;
    // TODO Display in .jade
    const _exception = Flow.Dataflow.signal(null);
    const _isLive = Flow.Dataflow.signal(false);
    const _isBusy = Flow.Dataflow.signal(false);
    const _isExpanded = Flow.Dataflow.signal(false);
    const _name = Flow.Dataflow.signal();
    const _size = Flow.Dataflow.signal();
    const _uptime = Flow.Dataflow.signal();
    const _version = Flow.Dataflow.signal();
    const _nodeCounts = Flow.Dataflow.signal();
    const _hasConsensus = Flow.Dataflow.signal();
    const _isLocked = Flow.Dataflow.signal();
    const _nodes = Flow.Dataflow.signals();
    const formatMilliseconds = ms => Flow.Util.fromNow(new Date(new Date().getTime() - ms));

    // precision = 3
    const format3f = d3.format('.3f');
    const _sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const prettyPrintBytes = bytes => {
      if (bytes === 0) {
        return '-';
      }
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${ (bytes / Math.pow(1024, i)).toFixed(2) } ${ _sizes[i] }`;
    };
    const formatThreads = fjs => {
      let i;
      let maxLo;
      let s;
      let _i;
      let _j;
      let _k;
      let _ref;
      for (maxLo = _i = 120; _i > 0; maxLo = --_i) {
        if (fjs[maxLo - 1] !== -1) {
          break;
        }
      }
      s = '[';
      for (i = _j = 0; maxLo >= 0 ? _j < maxLo : _j > maxLo; i = maxLo >= 0 ? ++_j : --_j) {
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
    const sum = (nodes, attrOf) => {
      let node;
      let total;
      let _i;
      let _len;
      total = 0;
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        total += attrOf(node);
      }
      return total;
    };
    const avg = (nodes, attrOf) => sum(nodes, attrOf) / nodes.length;
    const _headers = [
    // [ Caption, show_always? ]
    ['&nbsp;', true], ['Name', true], ['Ping', true], ['Cores', true], ['Load', true], ['My CPU %', true], ['Sys CPU %', true], ['GFLOPS', true], ['Memory Bandwidth', true], ['Data (Used/Total)', true], ['Data (% Cached)', true], ['GC (Free / Total / Max)', true], ['Disk (Free / Max)', true], ['Disk (% Free)', true], ['PID', false], ['Keys', false], ['TCP', false], ['FD', false], ['RPCs', false], ['Threads', false], ['Tasks', false]];
    const createNodeRow = node => [node.healthy, node.ip_port, moment(new Date(node.last_ping)).fromNow(), node.num_cpus, format3f(node.sys_load), node.my_cpu_pct, node.sys_cpu_pct, format3f(node.gflops), `${ prettyPrintBytes(node.mem_bw) } / s`, `${ prettyPrintBytes(node.mem_value_size) } / ${ prettyPrintBytes(node.total_value_size) }`, `${ Math.floor(node.mem_value_size * 100 / node.total_value_size) }%`, `${ prettyPrintBytes(node.free_mem) } / ${ prettyPrintBytes(node.tot_mem) } / ${ prettyPrintBytes(node.max_mem) }`, `${ prettyPrintBytes(node.free_disk) } / ${ prettyPrintBytes(node.max_disk) }`, `${ Math.floor(node.free_disk * 100 / node.max_disk) }%`, node.pid, node.num_keys, node.tcps_active, node.open_fds, node.rpcs_active, formatThreads(node.fjthrds), formatThreads(node.fjqueue)];
    const createTotalRow = cloud => {
      const nodes = cloud.nodes;
      return [cloud.cloud_healthy, 'TOTAL', '-', sum(nodes, node => node.num_cpus), format3f(sum(nodes, node => node.sys_load)), '-', '-', `${ format3f(sum(nodes, node => node.gflops)) }`, `${ prettyPrintBytes(sum(nodes, node => node.mem_bw)) } / s`, `${ prettyPrintBytes(sum(nodes, node => node.mem_value_size)) } / ${ prettyPrintBytes(sum(nodes, node => node.total_value_size)) }`, `${ Math.floor(avg(nodes, node => node.mem_value_size * 100 / node.total_value_size)) }%`, `${ prettyPrintBytes(sum(nodes, node => node.free_mem)) } / ${ prettyPrintBytes(sum(nodes, node => node.tot_mem)) } / ${ prettyPrintBytes(sum(nodes, node => node.max_mem)) }`, `${ prettyPrintBytes(sum(nodes, node => node.free_disk)) } / ${ prettyPrintBytes(sum(nodes, node => node.max_disk)) }`, `${ Math.floor(avg(nodes, node => node.free_disk * 100 / node.max_disk)) }%`, '-', sum(nodes, node => node.num_keys), sum(nodes, node => node.tcps_active), sum(nodes, node => node.open_fds), sum(nodes, node => node.rpcs_active), '-', '-'];
    };
    const createGrid = (cloud, isExpanded) => {
      let caption;
      let cell;
      let i;
      let row;
      let showAlways;
      let tds;
      const _ref = Flow.HTML.template('.grid', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'i.fa.fa-check-circle.text-success', 'i.fa.fa-exclamation-circle.text-danger');
      const grid = _ref[0];
      const table = _ref[1];
      const thead = _ref[2];
      const tbody = _ref[3];
      const tr = _ref[4];
      const th = _ref[5];
      const td = _ref[6];
      const success = _ref[7];
      const danger = _ref[8];
      const nodeRows = lodash.map(cloud.nodes, createNodeRow);
      nodeRows.push(createTotalRow(cloud));
      const ths = (() => {
        let _i;
        let _len;
        let _ref1;
        const _results = [];
        for (_i = 0, _len = _headers.length; _i < _len; _i++) {
          _ref1 = _headers[_i];
          caption = _ref1[0];
          showAlways = _ref1[1];
          if (showAlways || isExpanded) {
            _results.push(th(caption));
          }
        }
        return _results;
      })();
      const trs = (() => {
        let _i;
        let _len;
        const _results = [];
        for (_i = 0, _len = nodeRows.length; _i < _len; _i++) {
          row = nodeRows[_i];
          tds = (() => {
            let _j;
            let _len1;
            const _results1 = [];
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
    const updateCloud = (cloud, isExpanded) => {
      _name(cloud.cloud_name);
      _version(cloud.version);
      _hasConsensus(cloud.consensus);
      _uptime(formatMilliseconds(cloud.cloud_uptime_millis));
      _nodeCounts(`${ cloud.cloud_size - cloud.bad_nodes } / ${ cloud.cloud_size }`);
      _isLocked(cloud.locked);
      _isHealthy(cloud.cloud_healthy);
      return _nodes(createGrid(cloud, isExpanded));
    };
    const toggleRefresh = () => _isLive(!_isLive());
    const refresh = () => {
      _isBusy(true);
      return _.requestCloud((error, cloud) => {
        _isBusy(false);
        if (error) {
          _exception(Flow.failure(_, new Flow.Error('Error fetching cloud status', error)));
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
    const toggleExpansion = () => _isExpanded(!_isExpanded());
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

  function extendCloud(_, cloud) {
    return render_(_, cloud, h2oCloudOutput, cloud);
  }

  function h2oTimelineOutput(_, _go, _timeline) {
    const lodash = window._;
    const Flow = window.Flow;
    const _exception = Flow.Dataflow.signal(null);
    const _isLive = Flow.Dataflow.signal(false);
    const _isBusy = Flow.Dataflow.signal(false);
    const _headers = ['HH:MM:SS:MS', 'nanosec', 'Who', 'I/O Type', 'Event', 'Type', 'Bytes'];
    const _data = Flow.Dataflow.signal(null);
    const _timestamp = Flow.Dataflow.signal(Date.now());
    const createEvent = event => {
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
    const updateTimeline = timeline => {
      let cell;
      let event;
      let header;
      const _ref = Flow.HTML.template('.grid', 'table', 'thead', 'tbody', 'tr', 'th', 'td');
      const grid = _ref[0];
      const table = _ref[1];
      const thead = _ref[2];
      const tbody = _ref[3];
      const tr = _ref[4];
      const th = _ref[5];
      const td = _ref[6];
      const ths = (() => {
        let _i;
        let _len;
        const _results = [];
        for (_i = 0, _len = _headers.length; _i < _len; _i++) {
          header = _headers[_i];
          _results.push(th(header));
        }
        return _results;
      })();
      const trs = (() => {
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
    const toggleRefresh = () => _isLive(!_isLive());
    const refresh = () => {
      _isBusy(true);
      return _.requestTimeline((error, timeline) => {
        _isBusy(false);
        if (error) {
          _exception(Flow.failure(_, new Flow.Error('Error fetching timeline', error)));
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

  function extendTimeline(_, timeline) {
    return render_(_, timeline, h2oTimelineOutput, timeline);
  }

  function h2oStackTraceOutput(_, _go, _stackTrace) {
    const lodash = window._;
    const Flow = window.Flow;
    let node;
    const _activeNode = Flow.Dataflow.signal(null);
    const createThread = thread => {
      const lines = thread.split('\n');
      return {
        title: lodash.head(lines),
        stackTrace: lodash.tail(lines).join('\n')
      };
    };
    const createNode = node => {
      let thread;
      const display = () => _activeNode(self);
      const self = {
        name: node.node,
        timestamp: new Date(node.time),
        threads: (() => {
          let _i;
          let _len;
          const _ref = node.thread_traces;
          const _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thread = _ref[_i];
            _results.push(createThread(thread));
          }
          return _results;
        })(),
        display
      };
      return self;
    };
    const _nodes = (() => {
      let _i;
      let _len;
      const _ref = _stackTrace.traces;
      const _results = [];
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

  function extendStackTrace(_, stackTrace) {
    return render_(_, stackTrace, h2oStackTraceOutput, stackTrace);
  }

  function h2oLogFileOutput(_, _go, _cloud, _nodeIndex, _fileType, _logFile) {
    const lodash = window._;
    const Flow = window.Flow;
    // TODO Display in .jade
    const _exception = Flow.Dataflow.signal(null);
    const _contents = Flow.Dataflow.signal('');
    const _nodes = Flow.Dataflow.signal([]);
    const _activeNode = Flow.Dataflow.signal(null);
    const _fileTypes = Flow.Dataflow.signal(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'httpd', 'stdout', 'stderr']);
    const _activeFileType = Flow.Dataflow.signal(null);
    const createNode = (node, index) => ({
      name: node.ip_port,
      index
    });
    const refreshActiveView = (node, fileType) => {
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
    const refresh = () => refreshActiveView(_activeNode(), _activeFileType());
    const initialize = (cloud, nodeIndex, fileType, logFile) => {
      let NODE_INDEX_SELF;
      let clientNode;
      let i;
      let n;
      let _i;
      let _len;
      _activeFileType(fileType);
      _contents(logFile.log);
      const nodes = [];
      if (cloud.is_client) {
        clientNode = { ip_port: 'driver' };
        NODE_INDEX_SELF = -1;
        nodes.push(createNode(clientNode, NODE_INDEX_SELF));
      }
      const _ref = cloud.nodes;
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

  function extendLogFile(_, cloud, nodeIndex, fileType, logFile) {
    return render_(_, logFile, h2oLogFileOutput, cloud, nodeIndex, fileType, logFile);
  }

  function inspectNetworkTestResult(testResult) {
    return function () {
      return convertTableToFrame(testResult.table, testResult.table.name, {
        description: testResult.table.name,
        origin: 'testNetwork'
      });
    };
  }

  function h2oNetworkTestOutput(_, _go, _testResult) {
    const lodash = window._;
    const Flow = window.Flow;
    const _result = Flow.Dataflow.signal(null);
    const render = _.plot(g => g(g.select(), g.from(_.inspect('result', _testResult))));
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

  function extendNetworkTest(_, testResult) {
    inspect_(testResult, { result: inspectNetworkTestResult(testResult) });
    return render_(_, testResult, h2oNetworkTestOutput, testResult);
  }

  function h2oProfileOutput(_, _go, _profile) {
    const lodash = window._;
    const Flow = window.Flow;
    let i;
    let node;
    const _activeNode = Flow.Dataflow.signal(null);
    const createNode = node => {
      let entry;
      const display = () => _activeNode(self);
      const entries = (() => {
        let _i;
        let _len;
        const _ref = node.entries;
        const _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          _results.push({
            stacktrace: entry.stacktrace,
            caption: `Count: ${ entry.count }`
          });
        }
        return _results;
      })();
      const self = {
        name: node.node_name,
        caption: `${ node.node_name } at ${ new Date(node.timestamp) }`,
        entries,
        display
      };
      return self;
    };
    const _nodes = (() => {
      let _i;
      let _len;
      const _ref = _profile.nodes;
      const _results = [];
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

  function extendProfile(_, profile) {
    return render_(_, profile, h2oProfileOutput, profile);
  }

  const flowPrelude$13 = flowPreludeFunction();

  function h2oFramesOutput(_, _go, _frames) {
    const lodash = window._;
    const Flow = window.Flow;
    let _isCheckingAll;
    const _frameViews = Flow.Dataflow.signal([]);
    const _checkAllFrames = Flow.Dataflow.signal(false);
    const _hasSelectedFrames = Flow.Dataflow.signal(false);
    _isCheckingAll = false;
    Flow.Dataflow.react(_checkAllFrames, checkAll => {
      let _i;
      let _len;
      let view;
      _isCheckingAll = true;
      const _ref = _frameViews();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        view.isChecked(checkAll);
      }
      _hasSelectedFrames(checkAll);
      _isCheckingAll = false;
    });
    const createFrameView = frame => {
      const _isChecked = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(_isChecked, () => {
        let view;
        if (_isCheckingAll) {
          return;
        }
        const checkedViews = (() => {
          let _i;
          let _len;
          const _ref = _frameViews();
          const _results = [];
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
      const columnLabels = lodash.head(lodash.map(frame.columns, column => column.label), 15);
      const view = () => {
        if (frame.is_text) {
          return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${ flowPrelude$13.stringify(frame.frame_id.name) } ]`);
        }
        return _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$13.stringify(frame.frame_id.name) }`);
      };
      const predict = () => _.insertAndExecuteCell('cs', `predict frame: ${ flowPrelude$13.stringify(frame.frame_id.name) }`);
      const inspect = () => _.insertAndExecuteCell('cs', `inspect getFrameSummary ${ flowPrelude$13.stringify(frame.frame_id.name) }`);
      const createModel = () => _.insertAndExecuteCell('cs', `assist buildModel, null, training_frame: ${ flowPrelude$13.stringify(frame.frame_id.name) }`);
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
    const importFiles = () => _.insertAndExecuteCell('cs', 'importFiles');
    const collectSelectedKeys = () => {
      let view;
      let _i;
      let _len;
      const _ref = _frameViews();
      const _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        if (view.isChecked()) {
          _results.push(view.key);
        }
      }
      return _results;
    };
    const predictOnFrames = () => _.insertAndExecuteCell('cs', `predict frames: ${ flowPrelude$13.stringify(collectSelectedKeys()) }`);
    const deleteFrames = () => _.confirm('Are you sure you want to delete these frames?', {
      acceptCaption: 'Delete Frames',
      declineCaption: 'Cancel'
    }, accept => {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteFrames ${ flowPrelude$13.stringify(collectSelectedKeys()) }`);
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

  function extendFrames(_, frames) {
    render_(_, frames, h2oFramesOutput, frames);
    return frames;
  }

  function extendJob(_, job) {
    const H2O = window.H2O;
    return render_(_, job, H2O.JobOutput, job);
  }

  const flowPrelude$14 = flowPreludeFunction();

  function h2oJobsOutput(_, _go, jobs) {
    const lodash = window._;
    const Flow = window.Flow;
    const _jobViews = Flow.Dataflow.signals([]);
    const _hasJobViews = Flow.Dataflow.lift(_jobViews, jobViews => jobViews.length > 0);
    const _isLive = Flow.Dataflow.signal(false);
    const _isBusy = Flow.Dataflow.signal(false);
    const _exception = Flow.Dataflow.signal(null);
    const createJobView = job => {
      const view = () => _.insertAndExecuteCell('cs', `getJob ${ flowPrelude$14.stringify(job.key.name) }`);
      const type = (() => {
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
        startTime: Flow.Format.time(new Date(job.start_time)),
        endTime: Flow.Format.time(new Date(job.start_time + job.msec)),
        elapsedTime: Flow.Util.formatMilliseconds(job.msec),
        status: job.status,
        view
      };
    };
    const toggleRefresh = () => _isLive(!_isLive());
    const refresh = () => {
      _isBusy(true);
      return _.requestJobs((error, jobs) => {
        _isBusy(false);
        if (error) {
          _exception(Flow.failure(_, new Flow.Error('Error fetching jobs', error)));
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
    const initialize = () => {
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

  function extendJobs(_, jobs) {
    let job;
    let _i;
    let _len;
    for (_i = 0, _len = jobs.length; _i < _len; _i++) {
      job = jobs[_i];
      extendJob(_, job);
    }
    return render_(_, jobs, h2oJobsOutput, jobs);
  }

  function h2oCancelJobOutput(_, _go, _cancellation) {
    const lodash = window._;
    lodash.defer(_go);
    return { template: 'flow-cancel-job-output' };
  }

  function extendCancelJob(_, cancellation) {
    return render_(_, cancellation, h2oCancelJobOutput, cancellation);
  }

  function h2oDeleteObjectsOutput(_, _go, _keys) {
    const lodash = window._;
    lodash.defer(_go);
    return {
      hasKeys: _keys.length > 0,
      keys: _keys,
      template: 'flow-delete-objects-output'
    };
  }

  function extendDeletedKeys(_, keys) {
    return render_(_, keys, h2oDeleteObjectsOutput, keys);
  }

  const flowPrelude$16 = flowPreludeFunction();

  function inspectModelParameters(model) {
    return function () {
      const lodash = window._;

      const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
      if (lightning.settings) {
        lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
        lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
      }
      const createList = lightning.createList;
      const createDataframe = lightning.createFrame;

      let attr;
      let data;
      let i;
      let parameter;
      const parameters = model.parameters;
      const attrs = ['label', 'type', 'level', 'actual_value', 'default_value'];
      const vectors = (() => {
        let _i;
        let _j;
        let _len;
        let _len1;
        const _results = [];
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
        description: `Parameters for model \'${ model.model_id.name }\'`, // TODO frame model_id
        origin: `getModel ${ flowPrelude$16.stringify(model.model_id.name) }`
      });
    };
  }

  const flowPrelude$17 = flowPreludeFunction();

  function h2oModelOutput(_, _go, _model, refresh) {
    const lodash = window._;
    const Flow = window.Flow;
    const $ = window.jQuery;
    const _output = Flow.Dataflow.signal(null);
    const createOutput = _model => {
      let confusionMatrix;
      let lambdaSearchParameter;
      let output;
      let plotter;
      let table;
      let tableName;
      let _i;
      let _len;
      let _ref;
      let _ref1;
      let _ref10;
      let _ref11;
      let _ref12;
      let _ref13;
      let _ref14;
      let _ref15;
      let _ref16;
      let _ref17;
      let _ref18;
      let _ref19;
      let _ref2;
      let _ref20;
      let _ref21;
      let _ref22;
      let _ref23;
      let _ref25;
      let _ref3;
      let _ref4;
      let _ref5;
      let _ref6;
      let _ref7;let _ref8;
      let _ref9;
      const _isExpanded = Flow.Dataflow.signal(false);
      const _plots = Flow.Dataflow.signals([]);
      const _pojoPreview = Flow.Dataflow.signal(null);
      const _isPojoLoaded = Flow.Dataflow.lift(_pojoPreview, preview => {
        if (preview) {
          return true;
        }
        return false;
      });

      // TODO use _.enumerate()
      const _inputParameters = lodash.map(_model.parameters, parameter => {
        const type = parameter.type;
        const defaultValue = parameter.default_value;
        const actualValue = parameter.actual_value;
        const label = parameter.label;
        const help = parameter.help;
        const value = (() => {
          switch (type) {
            case 'Key<Frame>':
            case 'Key<Model>':
              if (actualValue) {
                return actualValue.name;
              }
              return null;
            // break; // no-unreachable
            case 'VecSpecifier':
              if (actualValue) {
                return actualValue.column_name;
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
              if (actualValue) {
                return actualValue.join(', ');
              }
              return null;
            // break; // no-unreachable
            default:
              return actualValue;
          }
        })();
        return {
          label,
          value,
          help,
          isModified: defaultValue === actualValue
        };
      });

      // TODO copied over from routines.coffee. replace post h2o.js integration.
      const format4f = number => {
        if (number) {
          if (number === 'NaN') {
            return void 0;
          }
          return number.toFixed(4).replace(/\.0+$/, '.0');
        }
        return number;
      };
      const getAucAsLabel = (model, tableName) => {
        const metrics = _.inspect(tableName, model);
        if (metrics) {
          return ` , AUC = ${ metrics.schema.AUC.at(0) }`;
        }
        return '';
      };
      const getThresholdsAndCriteria = (model, tableName) => {
        let criteria;
        let i;
        let idxVector;
        let metricVector;
        let thresholdVector;
        let thresholds;
        const criterionTable = _.inspect(tableName, _model);
        if (criterionTable) {
          // Threshold dropdown items
          thresholdVector = table.schema.threshold;
          thresholds = (() => {
            let _i;
            let _ref;
            const _results = [];
            for (i = _i = 0, _ref = thresholdVector.count(); _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
              _results.push({
                index: i,
                value: thresholdVector.at(i)
              });
            }
            return _results;
          })();

          // Threshold criterion dropdown item
          metricVector = criterionTable.schema.metric;
          idxVector = criterionTable.schema.idx;
          criteria = (() => {
            let _i;
            let _ref;
            const _results = [];
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

      // TODO Mega-hack alert
      // Last arg thresholdsAndCriteria applicable only to
      // ROC charts for binomial models.
      const renderPlot = (title, isCollapsed, render, thresholdsAndCriteria) => {
        let rocPanel;
        const container = Flow.Dataflow.signal(null);
        const linkedFrame = Flow.Dataflow.signal(null);

        // TODO HACK
        if (thresholdsAndCriteria) {
          rocPanel = {
            thresholds: Flow.Dataflow.signals(thresholdsAndCriteria.thresholds),
            threshold: Flow.Dataflow.signal(null),
            criteria: Flow.Dataflow.signals(thresholdsAndCriteria.criteria),
            criterion: Flow.Dataflow.signal(null)
          };
        }
        render((error, vis) => {
          let _autoHighlight;
          if (error) {
            return console.debug(error);
          }
          $('a', vis.element).on('click', e => {
            const $a = $(e.target);
            switch ($a.attr('data-type')) {
              case 'frame':
                return _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$17.stringify($a.attr('data-key')) }`);
              case 'model':
                return _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$17.stringify($a.attr('data-key')) }`);
              default:
              // do nothing
            }
          });
          container(vis.element);
          _autoHighlight = true;
          if (vis.subscribe) {
            vis.subscribe('markselect', _arg => {
              let currentCriterion;
              let selectedIndex;
              const frame = _arg.frame;
              const indices = _arg.indices;
              const subframe = window.plot.createFrame(frame.label, frame.vectors, indices);
              const renderTable = g => g(indices.length > 1 ? g.select() : g.select(lodash.head(indices)), g.from(subframe));
              _.plot(renderTable)((error, table) => {
                if (!error) {
                  return linkedFrame(table.element);
                }
              });

              // TODO HACK
              if (rocPanel) {
                if (indices.length === 1) {
                  selectedIndex = lodash.head(indices);
                  _autoHighlight = false;
                  rocPanel.threshold(lodash.find(rocPanel.thresholds(), threshold => threshold.index === selectedIndex));
                  currentCriterion = rocPanel.criterion();

                  // More than one criterion can point to the same threshold,
                  // so ensure that we're preserving the existing criterion, if any.
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

              // TODO HACK
              if (rocPanel) {
                rocPanel.criterion(null);
                return rocPanel.threshold(null);
              }
            });

            // TODO HACK
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
      const renderMultinomialConfusionMatrix = (title, cm) => {
        let cell;
        let cells;
        let column;
        let i;
        let rowIndex;
        let _i;
        const _ref = Flow.HTML.template('table.flow-confusion-matrix', 'tbody', 'tr', 'td', 'td.strong', 'td.bg-yellow');
        const table = _ref[0];
        const tbody = _ref[1];
        const tr = _ref[2];
        const normal = _ref[3];
        const bold = _ref[4];
        const yellow = _ref[5];
        const columnCount = cm.columns.length;
        const rowCount = cm.rowcount;
        const headers = lodash.map(cm.columns, (column, i) => bold(column.description));

        // NW corner cell
        headers.unshift(normal(' '));
        const rows = [tr(headers)];
        const errorColumnIndex = columnCount - 2;
        const totalRowIndex = rowCount - 1;
        for (rowIndex = _i = 0; rowCount >= 0 ? _i < rowCount : _i > rowCount; rowIndex = rowCount >= 0 ? ++_i : --_i) {
          cells = (() => {
            let _j;
            let _len;
            const _ref1 = cm.data;
            const _results = [];
            for (i = _j = 0, _len = _ref1.length; _j < _len; i = ++_j) {
              column = _ref1[i];

              // Last two columns should be emphasized
              // special-format error column
              cell = i < errorColumnIndex ? i === rowIndex ? yellow : rowIndex < totalRowIndex ? normal : bold : bold;
              _results.push(cell(i === errorColumnIndex ? format4f(column[rowIndex]) : column[rowIndex]));
            }
            return _results;
          })();
          // Add the corresponding column label
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
          table = _.inspect('output - Scoring History', _model);
          if (table) {
            renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('iteration', 'within_cluster_sum_of_squares'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'within_cluster_sum_of_squares'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
          }
          break;
        case 'glm':
          table = _.inspect('output - Scoring History', _model);
          if (table) {
            lambdaSearchParameter = lodash.find(_model.parameters, parameter => parameter.name === 'lambda_search');
            if (lambdaSearchParameter != null ? lambdaSearchParameter.actual_value : void 0) {
              renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
            } else {
              renderPlot('Scoring History', false, _.plot(g => g(g.path(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
            }
          }
          table = _.inspect('output - training_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Training Metrics${ getAucAsLabel(_model, 'output - training_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Validation Metrics${ getAucAsLabel(_model, 'output - validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
            renderPlot(`ROC Curve - Cross Validation Metrics' + ${ getAucAsLabel(_model, 'output - cross_validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - Standardized Coefficient Magnitudes', _model);
          if (table) {
            renderPlot('Standardized Coefficient Magnitudes', false, _.plot(g => g(g.rect(g.position('coefficients', 'names'), g.fillColor('sign')), g.from(table), g.limit(25))));
          }
          output = _model.output;
          if (output) {
            if (output.model_category === 'Multinomial') {
              _ref = output.training_metrics;
              _ref1 = _ref.cm;
              confusionMatrix = _ref != null ? _ref1 != null ? _ref1.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
              }
              _ref2 = output.validation_metrics;
              _ref3 = _ref2.cm;
              confusionMatrix = _ref2 != null ? _ref3 != null ? _ref3.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
              }
              _ref4 = output.cross_validation_metrics;
              _ref5 = _ref4.cm;
              confusionMatrix = _ref4 != null ? _ref5 != null ? _ref5.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
              }
            }
          }
          break;
        case 'deeplearning':
        case 'deepwater':
          table = _.inspect('output - Scoring History', _model);
          if (table) {
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
          table = _.inspect('output - training_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

            // TODO Mega-hack alert.
            // Last arg thresholdsAndCriteria applicable only to
            // ROC charts for binomial models.
            renderPlot(`ROC Curve - Training Metrics${ getAucAsLabel(_model, 'output - training_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

            // TODO Mega-hack alert.
            // Last arg thresholdsAndCriteria applicable only to
            // ROC charts for binomial models.
            renderPlot(`'ROC Curve - Validation Metrics' + ${ getAucAsLabel(_model, 'output - validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

            // TODO Mega-hack alert.
            // Last arg thresholdsAndCriteria applicable only to
            // ROC charts for binomial models.
            renderPlot(`'ROC Curve - Cross Validation Metrics' + ${ getAucAsLabel(_model, 'output - cross_validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - Variable Importances', _model);
          if (table) {
            renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
          }
          output = _model.output;
          if (output) {
            if (output.model_category === 'Multinomial') {
              _ref6 = output.training_metrics;
              _ref7 = _ref6.cm;
              confusionMatrix = _ref6 != null ? _ref7 != null ? _ref7.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
              }
              _ref8 = output.validation_metrics;
              _ref9 = _ref8.cm;
              confusionMatrix = _ref8 != null ? _ref9 != null ? _ref9.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
              }
              _ref10 = output.cross_validation_metrics;
              _ref11 = _ref10.cm;
              confusionMatrix = _ref10 != null ? _ref11 != null ? _ref11.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
              }
            }
          }
          break;
        case 'gbm':
        case 'drf':
        case 'svm':
          table = _.inspect('output - Scoring History', _model);
          if (table) {
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
          table = _.inspect('output - training_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

            // TODO Mega-hack alert.
            // Last arg thresholdsAndCriteria applicable only to
            // ROC charts for binomial models.
            renderPlot(`ROC Curve - Training Metrics${ getAucAsLabel(_model, 'output - training_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

            // TODO Mega-hack alert.
            // Last arg thresholdsAndCriteria applicable only to
            // ROC charts for binomial models.
            renderPlot(`ROC Curve - Validation Metrics${ getAucAsLabel(_model, 'output - validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

            // TODO Mega-hack alert.
            // Last arg thresholdsAndCriteria applicable only to
            // ROC charts for binomial models.
            renderPlot(`ROC Curve - Cross Validation Metrics${ getAucAsLabel(_model, 'output - cross_validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - Variable Importances', _model);
          if (table) {
            renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
          }
          output = _model.output;
          if (output) {
            if (output.model_category === 'Multinomial') {
              _ref12 = output.training_metrics;
              _ref13 = _ref12.cm;
              confusionMatrix = _ref12 != null ? _ref13 != null ? _ref13.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
              }
              _ref14 = output.validation_metrics;
              _ref15 = _ref14.cm;
              confusionMatrix = _ref14 != null ? _ref15 != null ? _ref15.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
              }
              _ref16 = output.cross_validation_metrics;
              _ref17 = _ref16.cm;
              confusionMatrix = _ref16 != null ? _ref17 != null ? _ref17.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
              }
            }
          }
          break;
        // end of when 'gbm', 'drf', 'svm'

        case 'stackedensemble':
          table = _.inspect('output - training_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

            // TODO Mega-hack alert.
            // Last arg thresholdsAndCriteria applicable only to
            // ROC charts for binomial models.
            renderPlot(`ROC Curve - Training Metrics${ getAucAsLabel(_model, 'output - training_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - training_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - validation_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

            // TODO Mega-hack alert.
            // Last arg thresholdsAndCriteria applicable only to
            // ROC charts for binomial models.
            renderPlot(`'ROC Curve - Validation Metrics${ getAucAsLabel(_model, 'output - validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - validation_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _model);
          if (table) {
            plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

            // TODO Mega-hack alert.
            // Last arg thresholdsAndCriteria applicable only to
            // ROC charts for binomial models.
            renderPlot(`ROC Curve - Cross Validation Metrics${ getAucAsLabel(_model, 'output - cross_validation_metrics') }`, false, plotter, getThresholdsAndCriteria(_model, 'output - cross_validation_metrics - Maximum Metrics'));
          }
          table = _.inspect('output - Variable Importances', _model);
          if (table) {
            renderPlot('Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
          }
          output = _model.output;
          if (output) {
            if (output.model_category === 'Multinomial') {
              _ref18 = output.training_metrics;
              _ref19 = _ref18.cm;
              confusionMatrix = _ref18 != null ? _ref19 != null ? _ref19.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Training Metrics - Confusion Matrix', confusionMatrix);
              }
              _ref20 = output.validation_metrics;
              _ref21 = _ref20.cm;
              confusionMatrix = _ref20 != null ? _ref21 != null ? _ref21.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Validation Metrics - Confusion Matrix', confusionMatrix);
              }
              _ref22 = output.cross_validation_metrics;
              _ref23 = _ref22.cm;
              confusionMatrix = _ref22 != null ? _ref23 != null ? _ref23.table : void 0 : void 0;
              if (confusionMatrix) {
                renderMultinomialConfusionMatrix('Cross Validation Metrics - Confusion Matrix', confusionMatrix);
              }
            }
          }
          break;
        default:
        // do nothing
      }
      // end of stackedensemble

      table = _.inspect('output - training_metrics - Gains/Lift Table', _model);
      if (table) {
        renderPlot('Training Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
      }
      table = _.inspect('output - validation_metrics - Gains/Lift Table', _model);
      if (table) {
        renderPlot('Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
      }
      table = _.inspect('output - cross_validation_metrics - Gains/Lift Table', _model);
      if (table) {
        renderPlot('Cross Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
      }
      const _ref24 = _.ls(_model);
      for (_i = 0, _len = _ref24.length; _i < _len; _i++) {
        tableName = _ref24[_i];
        if (!(tableName !== 'parameters')) {
          continue;
        }
        _ref25 = _model.output;

        // Skip confusion matrix tables for multinomial models
        output = (_ref25 != null ? _ref25.model_category : void 0) === 'Multinomial';
        if (output) {
          if (tableName.indexOf('output - training_metrics - cm') === 0) {
            continue;
          } else if (tableName.indexOf('output - validation_metrics - cm') === 0) {
            continue;
          } else if (tableName.indexOf('output - cross_validation_metrics - cm') === 0) {
            continue;
          }
        }
        table = _.inspect(tableName, _model);
        if (table) {
          renderPlot(tableName + (table.metadata.description ? ` (${ table.metadata.description })` : ''), true, _.plot(g => g(table.indices.length > 1 ? g.select() : g.select(0), g.from(table))));
        }
      }
      const toggle = () => _isExpanded(!_isExpanded());

      const cloneModel = () => alert('Not implemented');
      const predict = () => _.insertAndExecuteCell('cs', `predict model: ${ flowPrelude$17.stringify(_model.model_id.name) }`);
      const inspect = () => _.insertAndExecuteCell('cs', `inspect getModel ${ flowPrelude$17.stringify(_model.model_id.name) }`);
      const previewPojo = () => _.requestPojoPreview(_model.model_id.name, (error, result) => {
        if (error) {
          return _pojoPreview(`<pre>${ lodash.escape(error) }</pre>`);
        }
        return _pojoPreview(`<pre>${ Flow.Util.highlight(result, 'java') }</pre>`);
      });
      const downloadPojo = () => window.open(`/3/Models.java/${ encodeURIComponent(_model.model_id.name) }`, '_blank');
      const downloadMojo = () => window.open(`/3/Models/${ encodeURIComponent(_model.model_id.name) }/mojo`, '_blank');
      const exportModel = () => _.insertAndExecuteCell('cs', `exportModel ${ flowPrelude$17.stringify(_model.model_id.name) }`);
      const deleteModel = () => _.confirm('Are you sure you want to delete this model?', {
        acceptCaption: 'Delete Model',
        declineCaption: 'Cancel'
      }, accept => {
        if (accept) {
          return _.insertAndExecuteCell('cs', `deleteModel ${ flowPrelude$17.stringify(_model.model_id.name) }`);
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
    const _isLive = Flow.Dataflow.signal(false);
    Flow.Dataflow.act(_isLive, isLive => {
      if (isLive) {
        return _refresh();
      }
    });
    function _refresh() {
      refresh((error, model) => {
        if (!error) {
          _output(createOutput(model));
          if (_isLive()) {
            return lodash.delay(_refresh, 2000);
          }
        }
      });
    }
    const _toggleRefresh = () => _isLive(!_isLive());
    _output(createOutput(_model));
    lodash.defer(_go);
    return {
      output: _output,
      toggleRefresh: _toggleRefresh,
      isLive: _isLive,
      template: 'flow-model-output'
    };
  }

  const flowPrelude$15 = flowPreludeFunction();

  function extendModel(_, model) {
    const lodash = window._;
    lodash.extend = model => {
      let table;
      let tableName;
      let _i;
      let _len;
      let _ref1;
      const inspections = {};
      inspections.parameters = inspectModelParameters(model);
      const origin = `getModel ${ flowPrelude$15.stringify(model.model_id.name) }`;
      inspectObject(inspections, 'output', origin, model.output);

      // Obviously, an array of 2d tables calls for a megahack.
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
    const refresh = go => _.requestModel(model.model_id.name, (error, model) => {
      if (error) {
        return go(error);
      }
      return go(null, lodash.extend(model));
    });
    lodash.extend(model);
    return render_(_, model, h2oModelOutput, model, refresh);
  }

  const flowPrelude$18 = flowPreludeFunction();

  function inspectParametersAcrossModels(models) {
    return function () {
      const lodash = window._;

      const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
      if (lightning.settings) {
        lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
        lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
      }
      const createVector = lightning.createVector;
      const createFactor = lightning.createFactor;
      const createList = lightning.createList;
      const createDataframe = lightning.createFrame;

      let data;
      let i;
      let model;
      let parameter;
      const leader = lodash.head(models);
      const vectors = (() => {
        let _i;
        let _len;
        const _ref1 = leader.parameters || [];
        const _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          parameter = _ref1[i];
          data = (() => {
            let _j;
            let _len1;
            const _results1 = [];
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
      const modelKeys = (() => {
        let _i;
        let _len;
        const _results = [];
        for (_i = 0, _len = models.length; _i < _len; _i++) {
          model = models[_i];
          _results.push(model.model_id.name);
        }
        return _results;
      })();
      return createDataframe('parameters', vectors, lodash.range(models.length), null, {
        description: `Parameters for models ${ modelKeys.join(', ') }`,
        origin: `getModels ${ flowPrelude$18.stringify(modelKeys) }`
      });
    };
  }

  const flowPrelude$19 = flowPreludeFunction();

  function h2oModelsOutput(_, _go, _models) {
    const lodash = window._;
    const Flow = window.Flow;
    const _modelViews = Flow.Dataflow.signal([]);
    const _checkAllModels = Flow.Dataflow.signal(false);
    const _checkedModelCount = Flow.Dataflow.signal(0);
    const _canCompareModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 1);
    const _hasSelectedModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 0);
    let _isCheckingAll = false;
    Flow.Dataflow.react(_checkAllModels, checkAll => {
      let view;
      let _i;
      let _len;
      _isCheckingAll = true;
      const views = _modelViews();
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        view.isChecked(checkAll);
      }
      _checkedModelCount(checkAll ? views.length : 0);
      _isCheckingAll = false;
    });
    const createModelView = model => {
      const _isChecked = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(_isChecked, () => {
        let view;
        if (_isCheckingAll) {
          return;
        }
        const checkedViews = (() => {
          let _i;
          let _len;
          const _ref = _modelViews();
          const _results = [];
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
      const predict = () => _.insertAndExecuteCell('cs', `predict model: ${ flowPrelude$19.stringify(model.model_id.name) }`);
      const cloneModel = () => // return _.insertAndExecuteCell('cs', `cloneModel ${flowPrelude.stringify(model.model_id.name)}`);
      alert('Not implemented');
      const view = () => _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$19.stringify(model.model_id.name) }`);
      const inspect = () => _.insertAndExecuteCell('cs', `inspect getModel ${ flowPrelude$19.stringify(model.model_id.name) }`);
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
    const buildModel = () => _.insertAndExecuteCell('cs', 'buildModel');
    const collectSelectedKeys = () => {
      let view;
      let _i;
      let _len;
      const _ref = _modelViews();
      const _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        if (view.isChecked()) {
          _results.push(view.key);
        }
      }
      return _results;
    };
    const compareModels = () => _.insertAndExecuteCell('cs', `inspect getModels ${ flowPrelude$19.stringify(collectSelectedKeys()) }`);
    const predictUsingModels = () => _.insertAndExecuteCell('cs', `predict models: ${ flowPrelude$19.stringify(collectSelectedKeys()) }`);
    const deleteModels = () => _.confirm('Are you sure you want to delete these models?', {
      acceptCaption: 'Delete Models',
      declineCaption: 'Cancel'
    }, accept => {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteModels ${ flowPrelude$19.stringify(collectSelectedKeys()) }`);
      }
    });
    const inspectAll = () => {
      let view;
      const allKeys = (() => {
        let _i;
        let _len;
        const _ref = _modelViews();
        const _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          _results.push(view.key);
        }
        return _results;
      })();
      // TODO use table origin
      return _.insertAndExecuteCell('cs', `inspect getModels ${ flowPrelude$19.stringify(allKeys) }`);
    };
    const initialize = models => {
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

  function extendModels(_, models) {
    const lodash = window._;
    let model;
    const inspections = {};
    const algos = lodash.unique((() => {
      let _i;
      let _len;
      const _results = [];
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        _results.push(model.algo);
      }
      return _results;
    })());
    if (algos.length === 1) {
      inspections.parameters = inspectParametersAcrossModels(models);
    }

    // modelCategories = unique (model.output.model_category for model in models)
    //
    // TODO implement model comparision after 2d table cleanup for model metrics
    //
    // if modelCategories.length is 1
    //  inspections.outputs = inspectOutputsAcrossModels (head modelCategories), models

    inspect_(models, inspections);
    return render_(_, models, h2oModelsOutput, models);
  }

  const flowPrelude$21 = flowPreludeFunction();

  function h2oPredictOutput(_, _go, prediction) {
    const lodash = window._;
    const Flow = window.Flow;
    const $ = window.jQuery;
    let frame;
    let model;
    let table;
    let tableName;
    let _i;
    let _len;
    let _ref;
    let _ref1;
    if (prediction) {
      frame = prediction.frame;
      model = prediction.model;
    }
    const _plots = Flow.Dataflow.signals([]);
    const _canInspect = prediction.__meta;
    const renderPlot = (title, prediction, render) => {
      const container = Flow.Dataflow.signal(null);
      const combineWithFrame = () => {
        const predictionsFrameName = prediction.predictions.frame_id.name;
        const targetFrameName = `combined-${ predictionsFrameName }`;
        return _.insertAndExecuteCell('cs', `bindFrames ${ flowPrelude$21.stringify(targetFrameName) }, [ ${ flowPrelude$21.stringify(predictionsFrameName) }, ${ flowPrelude$21.stringify(frame.name) } ]`);
      };
      render((error, vis) => {
        if (error) {
          return console.debug(error);
        }
        $('a', vis.element).on('click', e => {
          const $a = $(e.target);
          switch ($a.attr('data-type')) {
            case 'frame':
              return _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$21.stringify($a.attr('data-key')) }`);
            case 'model':
              return _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$21.stringify($a.attr('data-key')) }`);
            default:
            // do nothing
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
      _ref = prediction.__meta;
      switch (_ref != null ? _ref.schema_type : void 0) {
        case 'ModelMetricsBinomial':
          table = _.inspect('Prediction - Metrics for Thresholds', prediction);
          if (table) {
            renderPlot('ROC Curve', prediction, _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1))));
          }
          break;
        default:
        // do nothing
      }
      _ref1 = _.ls(prediction);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tableName = _ref1[_i];
        table = _.inspect(tableName, prediction);
        if (table) {
          if (table.indices.length > 1) {
            renderPlot(tableName, prediction, _.plot(g => g(g.select(), g.from(table))));
          } else {
            renderPlot(tableName, prediction, _.plot(g => g(g.select(0), g.from(table))));
          }
        }
      }
    }
    const inspect = () => {
      // eslint-disable-line
      // XXX get this from prediction table
      return _.insertAndExecuteCell('cs', `inspect getPrediction model: ${ flowPrelude$21.stringify(model.name) }, frame: ${ flowPrelude$21.stringify(frame.name) }`);
    };
    lodash.defer(_go);
    return {
      plots: _plots,
      inspect,
      canInspect: _canInspect,
      template: 'flow-predict-output'
    };
  }

  const flowPrelude$20 = flowPreludeFunction();

  function extendPrediction(_, result) {
    const lodash = window._;
    let prediction;
    const modelKey = result.model.name;
    const _ref1 = result.frame;
    const frameKey = _ref1 != null ? _ref1.name : void 0;
    prediction = lodash.head(result.model_metrics);
    const predictionFrame = result.predictions_frame;
    const inspections = {};
    if (prediction) {
      inspectObject(inspections, 'Prediction', `getPrediction model: ${ flowPrelude$20.stringify(modelKey) }, frame: ${ flowPrelude$20.stringify(frameKey) }`, prediction);
    } else {
      prediction = {};
      inspectObject(inspections, 'Prediction', `getPrediction model: ${ flowPrelude$20.stringify(modelKey) }, frame: ${ flowPrelude$20.stringify(frameKey) }`, { prediction_frame: predictionFrame });
    }
    inspect_(prediction, inspections);
    return render_(_, prediction, h2oPredictOutput, prediction);
  }

  const flowPrelude$22 = flowPreludeFunction();

  function inspectFrameColumns(tableLabel, frameKey, frame, frameColumns) {
    return function () {
      const lodash = window._;
      const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
      if (lightning.settings) {
        lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
        lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
      }
      const createVector = lightning.createVector;
      const createFactor = lightning.createFactor;
      const createList = lightning.createList;
      const createDataframe = lightning.createFrame;
      let attr;
      let column;
      let i;
      let title;
      const attrs = ['label', 'type', 'missing_count|Missing', 'zero_count|Zeros', 'positive_infinity_count|+Inf', 'negative_infinity_count|-Inf', 'min', 'max', 'mean', 'sigma', 'cardinality'];
      const toColumnSummaryLink = label => `<a href=\'#\' data-type=\'summary-link\' data-key=${ flowPrelude$22.stringify(label) }>${ lodash.escape(label) }</a>`;
      const toConversionLink = value => {
        const _ref1 = value.split('\0');
        const type = _ref1[0];
        const label = _ref1[1];
        switch (type) {
          case 'enum':
            return `<a href=\'#\' data-type=\'as-numeric-link\' data-key=${ flowPrelude$22.stringify(label) }>Convert to numeric</a>`;
          case 'int':
          case 'string':
            return `<a href=\'#\' data-type=\'as-factor-link\' data-key=${ flowPrelude$22.stringify(label) }>Convert to enum</a>'`;
          default:
            return void 0;
        }
      };
      const vectors = (() => {
        // XXX format functions
        let _i;
        let _len;
        let _ref1;
        const _results = [];
        for (_i = 0, _len = attrs.length; _i < _len; _i++) {
          attr = attrs[_i];
          _ref1 = attr.split('|');
          const columnName = _ref1[0];
          title = _ref1[1];
          title = title != null ? title : columnName;
          switch (columnName) {
            case 'min':
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                const _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(lodash.head(column.mins));
                }
                return _results1;
              })(), format4f));
              break;
            case 'max':
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                const _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(lodash.head(column.maxs));
                }
                return _results1;
              })(), format4f));
              break;
            case 'cardinality':
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                const _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column.type === 'enum' ? column.domain_cardinality : void 0);
                }
                return _results1;
              })()));
              break;
            case 'label':
              _results.push(createFactor(title, 'String', (() => {
                let _j;
                let _len1;
                const _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column[columnName]);
                }
                return _results1;
              })(), null, toColumnSummaryLink));
              break;
            case 'type':
              _results.push(createFactor(title, 'String', (() => {
                let _j;
                let _len1;
                const _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column[columnName]);
                }
                return _results1;
              })()));
              break;
            case 'mean':
            case 'sigma':
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                const _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column[columnName]);
                }
                return _results1;
              })(), format4f));
              break;
            default:
              _results.push(createVector(title, 'Number', (() => {
                let _j;
                let _len1;
                const _results1 = [];
                for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                  column = frameColumns[_j];
                  _results1.push(column[columnName]);
                }
                return _results1;
              })()));
          }
        }
        return _results;
      })();
      const labelVector = vectors[0];
      const typeVector = vectors[1];
      const actionsData = (() => {
        let _i;
        let _ref1;
        const _results = [];
        for (i = _i = 0, _ref1 = frameColumns.length; _ref1 >= 0 ? _i < _ref1 : _i > _ref1; i = _ref1 >= 0 ? ++_i : --_i) {
          _results.push(`${ typeVector.valueAt(i) }\0${ labelVector.valueAt(i) }`);
        }
        return _results;
      })();
      vectors.push(createFactor('Actions', 'String', actionsData, null, toConversionLink));
      return createDataframe(tableLabel, vectors, lodash.range(frameColumns.length), null, {
        description: `A list of ${ tableLabel } in the H2O Frame.`,
        origin: `getFrameSummary ${ flowPrelude$22.stringify(frameKey) }`,
        plot: `plot inspect \'${ tableLabel }\', getFrameSummary ${ flowPrelude$22.stringify(frameKey) }`
      });
    };
  }

  function parseNulls(source) {
    let element;
    let i;
    let _i;
    let _len;
    const target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      element = source[i];
      target[i] = element != null ? element : void 0;
    }
    return target;
  }

  function parseNaNs(source) {
    let element;
    let i;
    let _i;
    let _len;
    const target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      element = source[i];
      target[i] = element === 'NaN' ? void 0 : element;
    }
    return target;
  }

  const flowPrelude$23 = flowPreludeFunction();

  function inspectFrameData(frameKey, frame) {
    return function () {
      const lodash = window._;
      const lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
      if (lightning.settings) {
        lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
        lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
      }
      const createVector = lightning.createVector;
      const createFactor = lightning.createFactor;
      const createList = lightning.createList;
      const createDataframe = lightning.createFrame;
      let column;
      let domain;
      let index;
      let rowIndex;
      const frameColumns = frame.columns;
      const vectors = (() => {
        let _i;
        let _len;
        const _results = [];
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
                let _j;
                let _len1;
                const _ref1 = column.data;
                const _results1 = [];
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
        let _i;
        let _ref1;
        let _ref2;
        const _results = [];
        for (rowIndex = _i = _ref1 = frame.row_offset, _ref2 = frame.row_count; _ref1 <= _ref2 ? _i < _ref2 : _i > _ref2; rowIndex = _ref1 <= _ref2 ? ++_i : --_i) {
          _results.push(rowIndex + 1);
        }
        return _results;
      })()));
      return createDataframe('data', vectors, lodash.range(frame.row_count - frame.row_offset), null, {
        description: 'A partial list of rows in the H2O Frame.',
        origin: `getFrameData ${ flowPrelude$23.stringify(frameKey) }`
      });
    };
  }

  const flowPrelude$24 = flowPreludeFunction();

  function extendFrameData(_, frameKey, frame) {
    const inspections = { data: inspectFrameData(frameKey, frame) };
    const origin = `getFrameData ${ flowPrelude$24.stringify(frameKey) }`;
    inspect_(frame, inspections);
    return render_(_, frame, h2oFrameDataOutput, frame);
  }

  const flowPrelude$26 = flowPreludeFunction();

  function h2oFrameOutput(_, _go, _frame) {
    const lodash = window._;
    const Flow = window.Flow;
    const $ = window.jQuery;
    let _lastUsedSearchTerm;
    const MaxItemsPerPage = 20;
    const _grid = Flow.Dataflow.signal(null);
    const _chunkSummary = Flow.Dataflow.signal(null);
    const _distributionSummary = Flow.Dataflow.signal(null);
    const _columnNameSearchTerm = Flow.Dataflow.signal(null);
    const _currentPage = Flow.Dataflow.signal(0);
    const _maxPages = Flow.Dataflow.signal(Math.ceil(_frame.total_column_count / MaxItemsPerPage));
    const _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, index => index > 0);
    const _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, (maxPages, index) => index < maxPages - 1);
    const renderPlot = (container, render) => render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      return container(vis.element);
    });
    const renderGrid = render => render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      $('a', vis.element).on('click', e => {
        const $a = $(e.target);
        switch ($a.attr('data-type')) {
          case 'summary-link':
            return _.insertAndExecuteCell('cs', `getColumnSummary ${ flowPrelude$26.stringify(_frame.frame_id.name) }, ${ flowPrelude$26.stringify($a.attr('data-key')) }`);
          case 'as-factor-link':
            return _.insertAndExecuteCell('cs', `changeColumnType frame: ${ flowPrelude$26.stringify(_frame.frame_id.name) }, column: ${ flowPrelude$26.stringify($a.attr('data-key')) }, type: \'enum\'`);
          case 'as-numeric-link':
            return _.insertAndExecuteCell('cs', `changeColumnType frame: ${ flowPrelude$26.stringify(_frame.frame_id.name) }, column: ${ flowPrelude$26.stringify($a.attr('data-key')) }, type: \'int\'`);
          default:
          // do nothing
        }
      });
      return _grid(vis.element);
    });
    const createModel = () => _.insertAndExecuteCell('cs', `assist buildModel, null, training_frame: ${ flowPrelude$26.stringify(_frame.frame_id.name) }`);
    const inspect = () => _.insertAndExecuteCell('cs', `inspect getFrameSummary ${ flowPrelude$26.stringify(_frame.frame_id.name) }`);
    const inspectData = () => _.insertAndExecuteCell('cs', `getFrameData ${ flowPrelude$26.stringify(_frame.frame_id.name) }`);
    const splitFrame = () => _.insertAndExecuteCell('cs', `assist splitFrame, ${ flowPrelude$26.stringify(_frame.frame_id.name) }`);
    const predict = () => _.insertAndExecuteCell('cs', `predict frame: ${ flowPrelude$26.stringify(_frame.frame_id.name) }`);
    const download = () => window.open(`${ window.Flow.ContextPath }${ `3/DownloadDataset?frame_id=${ encodeURIComponent(_frame.frame_id.name) }` }`, '_blank');
    const exportFrame = () => _.insertAndExecuteCell('cs', `exportFrame ${ flowPrelude$26.stringify(_frame.frame_id.name) }`);
    const deleteFrame = () => _.confirm('Are you sure you want to delete this frame?', {
      acceptCaption: 'Delete Frame',
      declineCaption: 'Cancel'
    }, accept => {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteFrame ${ flowPrelude$26.stringify(_frame.frame_id.name) }`);
      }
    });
    const renderFrame = frame => {
      renderGrid(_.plot(g => g(g.select(), g.from(_.inspect('columns', frame)))));
      renderPlot(_chunkSummary, _.plot(g => g(g.select(), g.from(_.inspect('Chunk compression summary', frame)))));
      return renderPlot(_distributionSummary, _.plot(g => g(g.select(), g.from(_.inspect('Frame distribution summary', frame)))));
    };
    _lastUsedSearchTerm = null;
    const refreshColumns = pageIndex => {
      const searchTerm = _columnNameSearchTerm();
      if (searchTerm !== _lastUsedSearchTerm) {
        pageIndex = 0;
      }
      const startIndex = pageIndex * MaxItemsPerPage;
      const itemCount = startIndex + MaxItemsPerPage < _frame.total_column_count ? MaxItemsPerPage : _frame.total_column_count - startIndex;
      return _.requestFrameSummarySliceE(_frame.frame_id.name, searchTerm, startIndex, itemCount, (error, frame) => {
        if (error) {
          // empty
          // TODO
        } else {
          _lastUsedSearchTerm = searchTerm;
          _currentPage(pageIndex);
          return renderFrame(frame);
        }
      });
    };
    const goToPreviousPage = () => {
      const currentPage = _currentPage();
      if (currentPage > 0) {
        refreshColumns(currentPage - 1);
      }
    };
    const goToNextPage = () => {
      const currentPage = _currentPage();
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

  const flowPrelude$25 = flowPreludeFunction();

  function extendFrame(_, frameKey, frame) {
    let column;
    const inspections = {
      columns: inspectFrameColumns('columns', frameKey, frame, frame.columns),
      data: inspectFrameData(frameKey, frame)
    };
    const enumColumns = (() => {
      let _i;
      let _len;
      const _ref1 = frame.columns;
      const _results = [];
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
    const origin = `getFrameSummary ${ flowPrelude$25.stringify(frameKey) }`;
    inspections[frame.chunk_summary.name] = inspectTwoDimTable_(origin, frame.chunk_summary.name, frame.chunk_summary);
    inspections[frame.distribution_summary.name] = inspectTwoDimTable_(origin, frame.distribution_summary.name, frame.distribution_summary);
    inspect_(frame, inspections);
    return render_(_, frame, h2oFrameOutput, frame);
  }

  const flowPrelude$27 = flowPreludeFunction();

  function extendFrameSummary(_, frameKey, frame) {
    let column;
    let enumColumns;
    let inspections;
    inspections = { columns: inspectFrameColumns('columns', frameKey, frame, frame.columns) };
    enumColumns = (() => {
      let _i;
      let _len;
      const _ref1 = frame.columns;
      const _results = [];
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
    const origin = `getFrameSummary ${ flowPrelude$27.stringify(frameKey) }`;
    inspections[frame.chunk_summary.name] = inspectTwoDimTable_(origin, frame.chunk_summary.name, frame.chunk_summary);
    inspections[frame.distribution_summary.name] = inspectTwoDimTable_(origin, frame.distribution_summary.name, frame.distribution_summary);
    inspect_(frame, inspections);
    return render_(_, frame, h2oFrameOutput, frame);
  }

  const flowPrelude$28 = flowPreludeFunction();

  function h2oPlotInput(_, _go, _frame) {
    const Flow = window.Flow;
    const lodash = window._;
    let vector;
    const _types = ['point', 'path', 'rect'];
    const _vectors = (() => {
      let _i;
      let _len;
      const _ref = _frame.vectors;
      const _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vector = _ref[_i];
        if (vector.type === 'String' || vector.type === 'Number') {
          _results.push(vector.label);
        }
      }
      return _results;
    })();
    const _type = Flow.Dataflow.signal(null);
    const _x = Flow.Dataflow.signal(null);
    const _y = Flow.Dataflow.signal(null);
    const _color = Flow.Dataflow.signal(null);
    const _canPlot = Flow.Dataflow.lift(_type, _x, _y, (type, x, y) => type && x && y);
    const plot = () => {
      const color = _color();
      const command = color ? `plot (g) -> g(\n  g.${ _type() }(\n    g.position ${ flowPrelude$28.stringify(_x()) }, ${ flowPrelude$28.stringify(_y()) }\n    g.color ${ flowPrelude$28.stringify(color) }\n  )\n  g.from inspect ${ flowPrelude$28.stringify(_frame.label) }, ${ _frame.metadata.origin }\n)` : `plot (g) -> g(\n  g.${ _type() }(\n    g.position ${ flowPrelude$28.stringify(_x()) }, ${ flowPrelude$28.stringify(_y()) }\n  )\n  g.from inspect ${ flowPrelude$28.stringify(_frame.label) }, ${ _frame.metadata.origin }\n)`;
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

  const flowPrelude$29 = flowPreludeFunction();

  function h2oGridOutput(_, _go, _grid) {
    const lodash = window._;
    const Flow = window.Flow;
    let _isCheckingAll;
    const _modelViews = Flow.Dataflow.signal([]);
    const _hasModels = _grid.model_ids.length > 0;
    const _errorViews = Flow.Dataflow.signal([]);
    const _hasErrors = _grid.failure_details.length > 0;
    const _checkAllModels = Flow.Dataflow.signal(false);
    const _checkedModelCount = Flow.Dataflow.signal(0);
    const _canCompareModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 1);
    const _hasSelectedModels = Flow.Dataflow.lift(_checkedModelCount, count => count > 0);
    _isCheckingAll = false;
    Flow.Dataflow.react(_checkAllModels, checkAll => {
      let view;
      let _i;
      let _len;
      _isCheckingAll = true;
      const views = _modelViews();
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        view.isChecked(checkAll);
      }
      _checkedModelCount(checkAll ? views.length : 0);
      _isCheckingAll = false;
    });

    // allow a non-camelCase function parameter name for now
    // to avoid an error that breaks getModel
    const createModelView = model_id => {
      // eslint-disable-line
      const _isChecked = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(_isChecked, () => {
        let view;
        if (_isCheckingAll) {
          return;
        }
        const checkedViews = (() => {
          let _i;
          let _len;
          const _ref = _modelViews();
          const _results = [];
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
      const predict = () => _.insertAndExecuteCell('cs', `predict model: ${ flowPrelude$29.stringify(model_id.name) }`);
      const cloneModel = () => // return _.insertAndExecuteCell('cs', `cloneModel ${flowPrelude.stringify(model_id.name)}`);
      alert('Not implemented');
      const view = () => _.insertAndExecuteCell('cs', `getModel ${ flowPrelude$29.stringify(model_id.name) }`);
      const inspect = () => _.insertAndExecuteCell('cs', `inspect getModel ${ flowPrelude$29.stringify(model_id.name) }`);
      return {
        key: model_id.name,
        isChecked: _isChecked,
        predict,
        clone: cloneModel,
        inspect,
        view
      };
    };
    const buildModel = () => _.insertAndExecuteCell('cs', 'buildModel');
    const collectSelectedKeys = () => {
      let view;
      let _i;
      let _len;
      const _ref = _modelViews();
      const _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        if (view.isChecked()) {
          _results.push(view.key);
        }
      }
      return _results;
    };
    const compareModels = () => _.insertAndExecuteCell('cs', `'inspect getModels ${ flowPrelude$29.stringify(collectSelectedKeys()) }`);
    const predictUsingModels = () => _.insertAndExecuteCell('cs', `predict models: ${ flowPrelude$29.stringify(collectSelectedKeys()) }`);
    const deleteModels = () => _.confirm('Are you sure you want to delete these models?', {
      acceptCaption: 'Delete Models',
      declineCaption: 'Cancel'
    }, accept => {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteModels ${ flowPrelude$29.stringify(collectSelectedKeys()) }`);
      }
    });
    const inspect = () => {
      const summary = _.inspect('summary', _grid);
      return _.insertAndExecuteCell('cs', `grid inspect \'summary\', ${ summary.metadata.origin }`);
    };
    const inspectHistory = () => {
      const history = _.inspect('scoring_history', _grid);
      return _.insertAndExecuteCell('cs', `grid inspect \'scoring_history\', ${ history.metadata.origin }`);
    };
    const inspectAll = () => {
      let view;
      const allKeys = (() => {
        let _i;
        let _len;
        const _ref = _modelViews();
        const _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          _results.push(view.key);
        }
        return _results;
      })();
      // TODO use table origin
      return _.insertAndExecuteCell('cs', `inspect getModels ${ flowPrelude$29.stringify(allKeys) }`);
    };
    const initialize = grid => {
      let i;
      _modelViews(lodash.map(grid.model_ids, createModelView));
      const errorViews = (() => {
        let _i;
        let _ref;
        const _results = [];
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

  const flowPrelude$30 = flowPreludeFunction();

  function h2oPredictsOutput(_, _go, opts, _predictions) {
    const lodash = window._;
    const Flow = window.Flow;
    let _isCheckingAll;
    const _predictionViews = Flow.Dataflow.signal([]);
    const _checkAllPredictions = Flow.Dataflow.signal(false);
    const _canComparePredictions = Flow.Dataflow.signal(false);
    const _rocCurve = Flow.Dataflow.signal(null);
    const arePredictionsComparable = views => {
      if (views.length === 0) {
        return false;
      }
      return lodash.every(views, view => view.modelCategory === 'Binomial');
    };
    _isCheckingAll = false;
    Flow.Dataflow.react(_checkAllPredictions, checkAll => {
      let view;
      let _i;
      let _len;
      _isCheckingAll = true;
      const _ref = _predictionViews();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        view.isChecked(checkAll);
      }
      _canComparePredictions(checkAll && arePredictionsComparable(_predictionViews()));
      _isCheckingAll = false;
    });
    const createPredictionView = prediction => {
      const _ref = prediction.frame;
      const _modelKey = prediction.model.name;
      const _frameKey = _ref != null ? _ref.name : void 0;
      const _hasFrame = _frameKey;
      const _isChecked = Flow.Dataflow.signal(false);
      Flow.Dataflow.react(_isChecked, () => {
        let view;
        if (_isCheckingAll) {
          return;
        }
        const checkedViews = (() => {
          let _i;
          let _len;
          const _ref1 = _predictionViews();
          const _results = [];
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
      const view = () => {
        if (_hasFrame) {
          return _.insertAndExecuteCell('cs', `getPrediction model: ${ flowPrelude$30.stringify(_modelKey) }, frame: ${ flowPrelude$30.stringify(_frameKey) }`);
        }
      };
      const inspect = () => {
        if (_hasFrame) {
          return _.insertAndExecuteCell('cs', `inspect getPrediction model: ${ flowPrelude$30.stringify(_modelKey) }, frame: ${ flowPrelude$30.stringify(_frameKey) }`);
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
    const _predictionsTable = _.inspect('predictions', _predictions);
    const _metricsTable = _.inspect('metrics', _predictions);
    const _scoresTable = _.inspect('scores', _predictions);
    const comparePredictions = () => {
      let view;
      const selectedKeys = (() => {
        let _i;
        let _len;
        const _ref = _predictionViews();
        const _results = [];
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
      return _.insertAndExecuteCell('cs', `getPredictions ${ flowPrelude$30.stringify(selectedKeys) }`);
    };
    const plotPredictions = () => _.insertAndExecuteCell('cs', _predictionsTable.metadata.plot);
    const plotScores = () => _.insertAndExecuteCell('cs', _scoresTable.metadata.plot);
    const plotMetrics = () => _.insertAndExecuteCell('cs', _metricsTable.metadata.plot);
    const inspectAll = () => _.insertAndExecuteCell('cs', `inspect ${ _predictionsTable.metadata.origin }`);
    const predict = () => _.insertAndExecuteCell('cs', 'predict');
    const initialize = predictions => {
      _predictionViews(lodash.map(predictions, createPredictionView));

      // TODO handle non-binomial models
      // warning: sample code is CoffeeScript
      // rocCurveConfig =
      //   data: _.inspect 'scores', _predictions
      //   type: 'line'
      //   x: 'FPR'
      //   y: 'TPR'
      //   color: 'key'
      // _.plot rocCurveConfig, (error, el) ->
      //   unless error
      //     _rocCurve el

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

  function h2oH2OFrameOutput(_, _go, _result) {
    const lodash = window._;
    const Flow = window.Flow;
    const _h2oframeView = Flow.Dataflow.signal(null);
    const createH2oFrameView = result => ({
      h2oframe_id: result.h2oframe_id
    });
    _h2oframeView(createH2oFrameView(_result));
    lodash.defer(_go);
    return {
      h2oframeView: _h2oframeView,
      template: 'flow-h2oframe-output'
    };
  }

  const flowPrelude$31 = flowPreludeFunction();

  function h2oColumnSummaryOutput(_, _go, frameKey, frame, columnName) {
    const lodash = window._;
    const Flow = window.Flow;
    let table;
    const column = lodash.head(frame.columns);
    const _characteristicsPlot = Flow.Dataflow.signal(null);
    const _summaryPlot = Flow.Dataflow.signal(null);
    const _distributionPlot = Flow.Dataflow.signal(null);
    const _domainPlot = Flow.Dataflow.signal(null);
    const renderPlot = (target, render) => render((error, vis) => {
      if (error) {
        return console.debug(error);
      }
      return target(vis.element);
    });
    table = _.inspect('characteristics', frame);
    if (table) {
      renderPlot(_characteristicsPlot, _.plot(g => g(g.rect(g.position(g.stack(g.avg('percent'), 0), 'All'), g.fillColor('characteristic')), g.groupBy(g.factor(g.value('All')), 'characteristic'), g.from(table))));
    }
    table = _.inspect('distribution', frame);
    if (table) {
      renderPlot(_distributionPlot, _.plot(g => g(g.rect(g.position('interval', 'count'), g.width(g.value(1))), g.from(table))));
    }
    table = _.inspect('summary', frame);
    if (table) {
      renderPlot(_summaryPlot, _.plot(g => g(g.schema(g.position('min', 'q1', 'q2', 'q3', 'max', 'column')), g.from(table))));
    }
    table = _.inspect('domain', frame);
    if (table) {
      renderPlot(_domainPlot, _.plot(g => g(g.rect(g.position('count', 'label')), g.from(table), g.limit(1000))));
    }
    const impute = () => _.insertAndExecuteCell('cs', `imputeColumn frame: ${ flowPrelude$31.stringify(frameKey) }, column: ${ flowPrelude$31.stringify(columnName) }`);
    const inspect = () => _.insertAndExecuteCell('cs', `inspect getColumnSummary ${ flowPrelude$31.stringify(frameKey) }, ${ flowPrelude$31.stringify(columnName) }`);
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
    const lodash = window._;
    lodash.defer(_go);
    return { template: 'flow-export-frame-output' };
  }

  const flowPrelude$32 = flowPreludeFunction();

  function h2oBindFramesOutput(_, _go, key, result) {
    const lodash = window._;
    const Flow = window.Flow;
    const viewFrame = () => _.insertAndExecuteCell('cs', `getFrameSummary ${ flowPrelude$32.stringify(key) }`);
    lodash.defer(_go);
    return {
      viewFrame,
      template: 'flow-bind-frames-output'
    };
  }

  function h2oExportModelOutput(_, _go, result) {
    const lodash = window._;
    lodash.defer(_go);
    return { template: 'flow-export-model-output' };
  }

  const flowPrelude$33 = flowPreludeFunction();

  function h2oImportFilesOutput(_, _go, _importResults) {
    const lodash = window._;
    const Flow = window.Flow;
    const _allFrames = lodash.flatten(lodash.compact(lodash.map(_importResults, result => result.destination_frames)));
    const _canParse = _allFrames.length > 0;
    const _title = `${ _allFrames.length } / ${ _importResults.length } files imported.`;
    const createImportView = result => ({
      // TODO dels?
      // TODO fails?
      files: result.files,
      template: 'flow-import-file-output'
    });
    const _importViews = lodash.map(_importResults, createImportView);
    const parse = () => {
      const paths = lodash.map(_allFrames, flowPrelude$33.stringify);
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
    const lodash = window._;
    const Flow = window.Flow;
    const _rDDViews = Flow.Dataflow.signal([]);
    const createRDDView = rDD => ({
      id: rDD.rddId,
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
    const lodash = window._;
    const Flow = window.Flow;
    const _dataFramesViews = Flow.Dataflow.signal([]);
    const createDataFrameView = dataFrame => ({
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
    const lodash = window._;
    const Flow = window.Flow;
    const _scalaCodeView = Flow.Dataflow.signal(null);
    const _scalaResponseVisible = Flow.Dataflow.signal(false);
    const _scalaLinkText = Flow.Dataflow.signal('Show Scala Response');
    const createScalaCodeView = result => ({
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
    const lodash = window._;
    const Flow = window.Flow;
    const _scalaIntpView = Flow.Dataflow.signal(null);
    const createScalaIntpView = result => ({
      sessionId: result.sessionId
    });
    _scalaIntpView(createScalaIntpView(_result));
    lodash.defer(_go);
    return {
      scalaIntpView: _scalaIntpView,
      template: 'flow-scala-intp-output'
    };
  }

  function h2oAssist(_, _go, _items) {
    const lodash = window._;
    let item;
    let name;
    const createAssistItem = (name, item) => ({
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
        const _results = [];
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

  const flowPrelude$34 = flowPreludeFunction();

  function h2oImportFilesInput(_, _go) {
    //
    // Search files/directories
    //
    const lodash = window._;
    const Flow = window.Flow;
    const _specifiedPath = Flow.Dataflow.signal('');
    const _exception = Flow.Dataflow.signal('');
    const _hasErrorMessage = Flow.Dataflow.lift(_exception, exception => {
      if (exception) {
        return true;
      }
      return false;
    });
    const tryImportFiles = () => {
      const specifiedPath = _specifiedPath();
      return _.requestFileGlob(specifiedPath, -1, (error, result) => {
        if (error) {
          return _exception(error.stack);
        }
        _exception('');
        // _go 'confirm', result
        return processImportResult(result);
      });
    };

    //
    // File selection
    //
    const _importedFiles = Flow.Dataflow.signals([]);
    const _importedFileCount = Flow.Dataflow.lift(_importedFiles, files => {
      if (files.length) {
        return `Found ${ Flow.Util.describeCount(files.length, 'file') }:`;
      }
      return '';
    });
    const _hasImportedFiles = Flow.Dataflow.lift(_importedFiles, files => files.length > 0);
    const _hasUnselectedFiles = Flow.Dataflow.lift(_importedFiles, files => lodash.some(files, file => !file.isSelected()));
    const _selectedFiles = Flow.Dataflow.signals([]);
    const _selectedFilesDictionary = Flow.Dataflow.lift(_selectedFiles, files => {
      let file;
      let _i;
      let _len;
      const dictionary = {};
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        dictionary[file.path] = true;
      }
      return dictionary;
    });
    const _selectedFileCount = Flow.Dataflow.lift(_selectedFiles, files => {
      if (files.length) {
        return `${ Flow.Util.describeCount(files.length, 'file') } selected:`;
      }
      return '(No files selected)';
    });
    const _hasSelectedFiles = Flow.Dataflow.lift(_selectedFiles, files => files.length > 0);
    const importFiles = files => {
      const paths = lodash.map(files, file => flowPrelude$34.stringify(file.path));
      return _.insertAndExecuteCell('cs', `importFiles [ ${ paths.join(',') } ]`);
    };
    const importSelectedFiles = () => importFiles(_selectedFiles());
    const createSelectedFileItem = path => {
      const self = {
        path,
        deselect() {
          let file;
          let _i;
          let _len;
          _selectedFiles.remove(self);
          const _ref = _importedFiles();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            if (file.path === path) {
              file.isSelected(false);
            }
          }
        }
      };
      return self;
    };
    const createFileItem = (path, isSelected) => {
      const self = {
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
    const createFileItems = result => lodash.map(result.matches, path => createFileItem(path, _selectedFilesDictionary()[path]));
    const listPathHints = (query, process) => _.requestFileGlob(query, 10, (error, result) => {
      if (!error) {
        return process(lodash.map(result.matches, value => ({
          value
        })));
      }
    });
    const selectAllFiles = () => {
      let file;
      let _i;
      let _j;
      let _len;
      let _len1;
      const dict = {};
      const _ref = _selectedFiles();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        dict[file.path] = true;
      }
      const _ref1 = _importedFiles();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        file = _ref1[_j];
        if (!dict[file.path]) {
          file.select();
        }
      }
    };
    const deselectAllFiles = () => {
      let file;
      let _i;
      let _len;
      _selectedFiles([]);
      const _ref = _importedFiles();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        file.isSelected(false);
      }
    };
    function processImportResult(result) {
      const files = createFileItems(result);
      return _importedFiles(files);
    }
    lodash.defer(_go);
    return {
      specifiedPath: _specifiedPath,
      hasErrorMessage: _hasErrorMessage, // XXX obsolete
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
    const lodash = window._;
    const Flow = window.Flow;
    if (opts == null) {
      opts = {};
    }
    const _frames = Flow.Dataflow.signal([]);
    const _frame = Flow.Dataflow.signal(null);
    const _hasFrame = Flow.Dataflow.lift(_frame, frame => {
      if (frame) {
        return true;
      }
      return false;
    });
    const _columns = Flow.Dataflow.signal([]);
    const _column = Flow.Dataflow.signal(null);
    const _canBuildModel = Flow.Dataflow.lift(_frame, _column, (frame, column) => frame && column);
    const defaultMaxRunTime = 3600;
    const _maxRunTime = Flow.Dataflow.signal(defaultMaxRunTime);
    const buildModel = () => {
      let maxRunTime = defaultMaxRunTime;
      const parsed = parseInt(_maxRunTime(), 10);
      if (!lodash.isNaN(parsed)) {
        maxRunTime = parsed;
      }
      const arg = {
        frame: _frame(),
        column: _column(),
        maxRunTime
      };
      return _.insertAndExecuteCell('cs', `buildAutoModel ${ JSON.stringify(arg) }`);
    };
    _.requestFrames((error, frames) => {
      let frame;
      if (error) {
        // empty
        // TODO handle properly
      } else {
        _frames((() => {
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
        if (opts.frame) {
          _frame(opts.frame);
        }
      }
    });
    Flow.Dataflow.react(_frame, frame => {
      if (frame) {
        return _.requestFrameSummaryWithoutData(frame, (error, frame) => {
          let column;
          if (error) {
            // empty
            // TODO handle properly
          } else {
            _columns((() => {
              let _i;
              let _len;
              const _ref = frame.columns;
              const _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                column = _ref[_i];
                _results.push(column.label);
              }
              return _results;
            })());
            if (opts.column) {
              _column(opts.column);
              return delete opts.column; // HACK
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

  const flowPrelude$35 = flowPreludeFunction();

  function h2oPredictInput(_, _go, opt) {
    const lodash = window._;
    const Flow = window.Flow;
    const _ref = opt.predictions_frame;
    const _destinationKey = Flow.Dataflow.signal(_ref != null ? _ref : `prediction-${ Flow.Util.uuid() }`);
    const _selectedModels = opt.models ? opt.models : opt.model ? [opt.model] : [];
    const _selectedFrames = opt.frames ? opt.frames : opt.frame ? [opt.frame] : [];
    const _selectedModelsCaption = _selectedModels.join(', ');
    const _selectedFramesCaption = _selectedFrames.join(', ');
    const _exception = Flow.Dataflow.signal(null);
    const _selectedFrame = Flow.Dataflow.signal(null);
    const _selectedModel = Flow.Dataflow.signal(null);
    const _hasFrames = _selectedFrames.length;
    const _hasModels = _selectedModels.length;
    const _frames = Flow.Dataflow.signals([]);
    const _models = Flow.Dataflow.signals([]);
    const _isDeepLearning = Flow.Dataflow.lift(_selectedModel, model => model && model.algo === 'deeplearning');
    const _hasReconError = Flow.Dataflow.lift(_selectedModel, model => {
      let parameter;
      let _i;
      let _len;
      let _ref1;
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
    const _hasLeafNodeAssignment = Flow.Dataflow.lift(_selectedModel, model => {
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
    const _hasExemplarIndex = Flow.Dataflow.lift(_selectedModel, model => {
      if (model) {
        switch (model.algo) {
          case 'aggregator':
            return true;
          default:
            return false;
        }
      }
    });
    const _computeReconstructionError = Flow.Dataflow.signal(false);
    const _computeDeepFeaturesHiddenLayer = Flow.Dataflow.signal(false);
    const _computeLeafNodeAssignment = Flow.Dataflow.signal(false);
    const _deepFeaturesHiddenLayer = Flow.Dataflow.signal(0);
    const _deepFeaturesHiddenLayerValue = Flow.Dataflow.lift(_deepFeaturesHiddenLayer, text => parseInt(text, 10));
    const _exemplarIndex = Flow.Dataflow.signal(0);
    const _exemplarIndexValue = Flow.Dataflow.lift(_exemplarIndex, text => parseInt(text, 10));
    const _canPredict = Flow.Dataflow.lift(_selectedFrame, _selectedModel, _hasReconError, _computeReconstructionError, _computeDeepFeaturesHiddenLayer, _deepFeaturesHiddenLayerValue, _exemplarIndexValue, _hasExemplarIndex, (frame, model, hasReconError, computeReconstructionError, computeDeepFeaturesHiddenLayer, deepFeaturesHiddenLayerValue, exemplarIndexValue, hasExemplarIndex) => {
      const hasFrameAndModel = frame && model || _hasFrames && model || _hasModels && frame || _hasModels && hasExemplarIndex;
      const hasValidOptions = hasReconError ? computeReconstructionError ? true : computeDeepFeaturesHiddenLayer ? !lodash.isNaN(deepFeaturesHiddenLayerValue) : true : true;
      return hasFrameAndModel && hasValidOptions;
    });
    if (!_hasFrames) {
      _.requestFrames((error, frames) => {
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
    }
    if (!_hasModels) {
      _.requestModels((error, models) => {
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
    }
    if (!_selectedModel()) {
      if (opt.model && lodash.isString(opt.model)) {
        _.requestModel(opt.model, (error, model) => _selectedModel(model));
      }
    }
    const predict = () => {
      let cs;
      let frameArg;
      let modelArg;
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
      const destinationKey = _destinationKey();
      cs = `predict model: ${ flowPrelude$35.stringify(modelArg) }, frame: ${ flowPrelude$35.stringify(frameArg) }`;
      if (destinationKey) {
        cs += `, predictions_frame: ${ flowPrelude$35.stringify(destinationKey) }`;
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

  const flowPrelude$36 = flowPreludeFunction();

  function h2oCreateFrameInput(_, _go) {
    const lodash = window._;
    const Flow = window.Flow;
    const _key = Flow.Dataflow.signal('');
    const _rows = Flow.Dataflow.signal(10000);
    const _columns = Flow.Dataflow.signal(100);
    const _seed = Flow.Dataflow.signal(7595850248774472000);
    const _seedForColumnTypes = Flow.Dataflow.signal(-1);
    const _randomize = Flow.Dataflow.signal(true);
    const _value = Flow.Dataflow.signal(0);
    const _realRange = Flow.Dataflow.signal(100);
    const _categoricalFraction = Flow.Dataflow.signal(0.1);
    const _factors = Flow.Dataflow.signal(5);
    const _integerFraction = Flow.Dataflow.signal(0.5);
    const _binaryFraction = Flow.Dataflow.signal(0.1);
    const _binaryOnesFraction = Flow.Dataflow.signal(0.02);
    const _timeFraction = Flow.Dataflow.signal(0);
    const _stringFraction = Flow.Dataflow.signal(0);
    const _integerRange = Flow.Dataflow.signal(1);
    const _missingFraction = Flow.Dataflow.signal(0.01);
    const _responseFactors = Flow.Dataflow.signal(2);
    const _hasResponse = Flow.Dataflow.signal(false);
    const createFrame = () => {
      const opts = {
        dest: _key(),
        rows: _rows(),
        cols: _columns(),
        seed: _seed(),
        seed_for_column_types: _seedForColumnTypes(),
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
      return _.insertAndExecuteCell('cs', `createFrame ${ flowPrelude$36.stringify(opts) }`);
    };
    lodash.defer(_go);
    return {
      key: _key,
      rows: _rows,
      columns: _columns,
      seed: _seed,
      seed_for_column_types: _seedForColumnTypes,
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

  const flowPrelude$37 = flowPreludeFunction();

  function h2oSplitFrameInput(_, _go, _frameKey) {
    const lodash = window._;
    const Flow = window.Flow;

    const _frames = Flow.Dataflow.signal([]);
    const _frame = Flow.Dataflow.signal(null);
    const _lastSplitRatio = Flow.Dataflow.signal(1);
    const format4f = value => value.toPrecision(4).replace(/0+$/, '0');
    const _lastSplitRatioText = Flow.Dataflow.lift(_lastSplitRatio, ratio => {
      if (lodash.isNaN(ratio)) {
        return ratio;
      }
      return format4f(ratio);
    });
    const _lastSplitKey = Flow.Dataflow.signal('');
    const _splits = Flow.Dataflow.signals([]);
    const _seed = Flow.Dataflow.signal(Math.random() * 1000000 | 0);
    Flow.Dataflow.react(_splits, () => updateSplitRatiosAndNames());
    const _validationMessage = Flow.Dataflow.signal('');
    const collectRatios = () => {
      let entry;
      let _i;
      let _len;
      const _ref = _splits();
      const _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        _results.push(entry.ratio());
      }
      return _results;
    };
    const collectKeys = () => {
      let entry;
      const splitKeys = (() => {
        let _i;
        let _len;
        const _ref = _splits();
        const _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entry = _ref[_i];
          _results.push(entry.key().trim());
        }
        return _results;
      })();
      splitKeys.push(_lastSplitKey().trim());
      return splitKeys;
    };
    const createSplitName = (key, ratio) => `${ key }_${ format4f(ratio) }`;
    function updateSplitRatiosAndNames() {
      let entry;
      const frame = _frame();
      let ratio;
      let totalRatio;
      let _i;
      let _j;
      let _len;
      let _len1;
      totalRatio = 0;
      const _ref = collectRatios();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ratio = _ref[_i];
        totalRatio += ratio;
      }
      const lastSplitRatio = _lastSplitRatio(1 - totalRatio);
      const frameKey = frame || 'frame';
      const _ref1 = _splits();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        entry = _ref1[_j];
        entry.key(createSplitName(frameKey, entry.ratio()));
      }
      _lastSplitKey(createSplitName(frameKey, _lastSplitRatio()));
    }
    const computeSplits = go => {
      let key;
      let ratio;
      let totalRatio;
      let _i;
      let _j;
      let _len;
      let _len1;
      if (!_frame()) {
        return go('Frame not specified.');
      }
      const splitRatios = collectRatios();
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
      const splitKeys = collectKeys();
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
    const createSplit = ratio => {
      const _ratioText = Flow.Dataflow.signal(`${ ratio }`);
      const _key = Flow.Dataflow.signal('');
      const _ratio = Flow.Dataflow.lift(_ratioText, text => parseFloat(text));
      Flow.Dataflow.react(_ratioText, updateSplitRatiosAndNames);
      flowPrelude$37.remove = () => _splits.remove(self);
      const self = {
        key: _key,
        ratioText: _ratioText,
        ratio: _ratio,
        remove: flowPrelude$37.remove
      };
      return self;
    };
    const addSplitRatio = ratio => _splits.push(createSplit(ratio));
    const addSplit = () => addSplitRatio(0);
    const splitFrame = () => computeSplits((error, splitRatios, splitKeys) => {
      if (error) {
        return _validationMessage(error);
      }
      _validationMessage('');
      return _.insertAndExecuteCell('cs', `splitFrame ${ flowPrelude$37.stringify(_frame()) }, ${ flowPrelude$37.stringify(splitRatios) }, ${ flowPrelude$37.stringify(splitKeys) }, ${ _seed() }`); // eslint-disable-line
    });
    const initialize = () => {
      _.requestFrames((error, frames) => {
        let frame;
        let frameKeys;
        if (!error) {
          frameKeys = (() => {
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

  const flowPrelude$38 = flowPreludeFunction();

  function h2oMergeFramesInput(_, _go) {
    const lodash = window._;
    const Flow = window.Flow;
    // TODO display in .jade
    const _exception = Flow.Dataflow.signal(null);
    const _destinationKey = Flow.Dataflow.signal(`merged-${ Flow.Util.uuid() }`);
    const _frames = Flow.Dataflow.signals([]);
    const _selectedLeftFrame = Flow.Dataflow.signal(null);
    const _leftColumns = Flow.Dataflow.signals([]);
    const _selectedLeftColumn = Flow.Dataflow.signal(null);
    const _includeAllLeftRows = Flow.Dataflow.signal(false);
    const _selectedRightFrame = Flow.Dataflow.signal(null);
    const _rightColumns = Flow.Dataflow.signals([]);
    const _selectedRightColumn = Flow.Dataflow.signal(null);
    const _includeAllRightRows = Flow.Dataflow.signal(false);
    const _canMerge = Flow.Dataflow.lift(_selectedLeftFrame, _selectedLeftColumn, _selectedRightFrame, _selectedRightColumn, (lf, lc, rf, rc) => lf && lc && rf && rc);
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
    const _merge = () => {
      if (!_canMerge()) {
        return;
      }
      const cs = `mergeFrames ${ flowPrelude$38.stringify(_destinationKey()) }, ${ flowPrelude$38.stringify(_selectedLeftFrame()) }, ${ _selectedLeftColumn().index }, ${ _includeAllLeftRows() }, ${ flowPrelude$38.stringify(_selectedRightFrame()) }, ${ _selectedRightColumn().index }, ${ _includeAllRightRows() }`;
      return _.insertAndExecuteCell('cs', cs);
    };
    _.requestFrames((error, frames) => {
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

  const flowPrelude$39 = flowPreludeFunction();

  function h2oPartialDependenceInput(_, _go) {
    const lodash = window._;
    const Flow = window.Flow;

    // TODO display in .jade
    const _exception = Flow.Dataflow.signal(null);
    const _destinationKey = Flow.Dataflow.signal(`ppd-${ Flow.Util.uuid() }`);
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
        nbins: _nbins()
      };

      // assemble a string for the h2o Rapids AST
      // this contains the function to call
      // along with the options to pass in
      const cs = `buildPartialDependence ${ flowPrelude$39.stringify(opts) }`;

      // insert a cell with the expression `cs`
      // into the current Flow notebook
      // and run the cell
      return _.insertAndExecuteCell('cs', cs);
    };
    _.requestFrames((error, frames) => {
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
    _.requestModels((error, models) => {
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
      template: 'flow-partial-dependence-input'
    };
  }

  const flowPrelude$40 = flowPreludeFunction();

  function h2oExportFrameInput(_, _go, frameKey, path, opt) {
    const lodash = window._;
    const Flow = window.Flow;
    const _frames = Flow.Dataflow.signal([]);
    const _selectedFrame = Flow.Dataflow.signal(frameKey);
    const _path = Flow.Dataflow.signal(null);
    const _overwrite = Flow.Dataflow.signal(true);
    const _canExportFrame = Flow.Dataflow.lift(_selectedFrame, _path, (frame, path) => frame && path);
    const exportFrame = () => _.insertAndExecuteCell('cs', `exportFrame ${ flowPrelude$40.stringify(_selectedFrame()) }, ${ flowPrelude$40.stringify(_path()) }, overwrite: ${ _overwrite() ? 'true' : 'false' }`);
    _.requestFrames((error, frames) => {
      let frame;
      if (error) {
        // empty
      } else {
        _frames((() => {
          let _i;
          let _len;
          const _results = [];
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

  const flowPrelude$41 = flowPreludeFunction();

  function h2oImportModelInput(_, _go, path, opt) {
    const lodash = window._;
    const Flow = window.Flow;
    if (opt == null) {
      opt = {};
    }
    const _path = Flow.Dataflow.signal(path);
    const _overwrite = Flow.Dataflow.signal(opt.overwrite);
    const _canImportModel = Flow.Dataflow.lift(_path, path => path && path.length);
    const importModel = () => _.insertAndExecuteCell('cs', `importModel ${ flowPrelude$41.stringify(_path()) }, overwrite: ${ _overwrite() ? 'true' : 'false' }`);
    lodash.defer(_go);
    return {
      path: _path,
      overwrite: _overwrite,
      canImportModel: _canImportModel,
      importModel,
      template: 'flow-import-model-input'
    };
  }

  const flowPrelude$42 = flowPreludeFunction();

  function h2oExportModelInput(_, _go, modelKey, path, opt) {
    const lodash = window._;
    const Flow = window.Flow;
    if (opt == null) {
      opt = {};
    }
    const _models = Flow.Dataflow.signal([]);
    const _selectedModelKey = Flow.Dataflow.signal(null);
    const _path = Flow.Dataflow.signal(null);
    const _overwrite = Flow.Dataflow.signal(opt.overwrite);
    const _canExportModel = Flow.Dataflow.lift(_selectedModelKey, _path, (modelKey, path) => modelKey && path);
    const exportModel = () => _.insertAndExecuteCell('cs', `exportModel ${ flowPrelude$42.stringify(_selectedModelKey()) }, ${ flowPrelude$42.stringify(_path()) }, overwrite: ${ _overwrite() ? 'true' : 'false' }`);
    _.requestModels((error, models) => {
      let model;
      if (error) {
        // empty
        // TODO handle properly
      } else {
        _models((() => {
          let _i;
          let _len;
          const _results = [];
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
    const lodash = window._;
    lodash.defer(_go);
    return {
      showAssist() {
        return _.insertAndExecuteCell('cs', 'assist');
      },
      template: 'flow-no-assist'
    };
  }

  const flowPrelude$5 = flowPreludeFunction();

  function routines() {
    const lodash = window._;
    const Flow = window.Flow;
    const H2O = window.H2O;
    let createDataframe;
    let createFactor;
    let createList;
    let createTempKey;
    let createVector;
    let lightning;
    const __slice = [].slice;
    lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
    if (lightning.settings) {
      lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
      lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
    }
    createVector = lightning.createVector;
    createFactor = lightning.createFactor;
    createList = lightning.createList;
    createDataframe = lightning.createFrame;
    H2O.Routines = _ => {
      let asDataFrame;
      let asH2OFrameFromDF;
      let asH2OFrameFromRDD;
      let assist;
      let attrname;
      let bindFrames;
      let buildAutoModel;
      let buildModel;
      let buildPartialDependence;
      let cancelJob;
      let changeColumnType;
      let computeSplits;
      let createFrame;
      let deleteAll;
      let deleteFrame;
      let deleteFrames;
      let deleteModel;
      let deleteModels;
      let dump;
      let dumpFuture;
      let exportFrame;
      let exportModel;
      let extendAsDataFrame;
      let extendAsH2OFrame;
      let extendBindFrames;
      let extendColumnSummary;
      let extendDataFrames;
      let extendExportFrame;
      let extendExportModel;
      let extendGrid;
      let extendImportModel;
      let extendImportResults;
      let extendParseResult;
      let extendParseSetupResults;
      let extendPredictions;
      let extendRDDs;
      let extendScalaCode;
      let extendScalaIntp;
      let f;
      let findColumnIndexByColumnLabel;
      let findColumnIndicesByColumnLabels;
      let getCloud;
      let getColumnSummary;
      let getDataFrames;
      let getFrame;
      let getFrameData;
      let getFrameSummary;
      let getFrames;
      let getGrid;
      let getGrids;
      let getJob;
      let getJobs;
      let getLogFile;
      let getModel;
      let getModels;
      let getPartialDependence;
      let getPrediction;
      let getPredictions;
      let getProfile;
      let getRDDs;
      let getScalaIntp;
      let getStackTrace;
      let getTimeline;
      let grid;
      let importFiles;
      let importModel;
      let imputeColumn;
      let initAssistanceSparklingWater;
      let loadScript;
      let mergeFrames;
      let name;
      let parseFiles;
      let plot;
      let predict;
      let requestAsDataFrame;
      let requestAsH2OFrameFromDF;
      let requestAsH2OFrameFromRDD;
      let requestAutoModelBuild;
      let requestBindFrames;
      let requestCancelJob;
      let requestChangeColumnType;
      let requestCloud;
      let requestColumnSummary;
      let requestCreateFrame;
      let requestDataFrames;
      let requestDeleteFrame;
      let requestDeleteFrames;
      let requestDeleteModel;
      let requestDeleteModels;
      let requestExportFrame;
      let requestExportModel;
      let requestFrame;
      let requestFrameData;
      let requestFrameSummary;
      let requestFrameSummarySlice;
      let requestFrames;
      let requestGrid;
      let requestGrids;
      let requestImportAndParseFiles;
      let requestImportAndParseSetup;
      let requestImportFiles;
      let requestImportModel;
      let requestImputeColumn;
      let requestJob;
      let requestJobs;
      let requestLogFile;
      let requestMergeFrames;
      let requestModel;
      let requestModelBuild;
      let requestModels;
      let requestModelsByKeys;
      let requestNetworkTest;
      let requestParseFiles;
      let requestParseSetup;
      let requestPartialDependence;
      let requestPartialDependenceData;
      let requestPredict;
      let requestPrediction;
      let requestPredictions;
      let requestPredicts;
      let requestProfile;
      let requestRDDs;
      let requestRemoveAll;
      let requestScalaCode;
      let requestScalaIntp;
      let requestSplitFrame;
      let requestStackTrace;
      let requestTimeline;
      let routines;
      let routinesOnSw;
      let runScalaCode;
      let setupParse;
      let splitFrame;
      let testNetwork;
      let unwrapPrediction;

      // TODO move these into Flow.Async
      let _async;
      let _get;
      let _isFuture;
      let _ref;
      let _schemaHacks;
      _isFuture = Flow.Async.isFuture;
      _async = Flow.Async.async;
      _get = Flow.Async.get;

      // depends on `assist`
      plot = f => {
        if (_isFuture(f)) {
          return _fork(proceed, h2oPlotInput, f);
        } else if (lodash.isFunction(f)) {
          return _fork(_, createPlot, f);
        }
        return assist(plot);
      };
      // depends on `plot`
      grid = f => plot(g => g(g.select(), g.from(f)));
      // depends on `grid`
      extendGrid = (grid, opts) => {
        let inspections;
        let origin;
        origin = `getGrid ${ flowPrelude$5.stringify(grid.grid_id.name) }`;
        if (opts) {
          origin += `, ${ flowPrelude$5.stringify(opts) }`;
        }
        inspections = {
          summary: inspectTwoDimTable_(origin, 'summary', grid.summary_table),
          scoring_history: inspectTwoDimTable_(origin, 'scoring_history', grid.scoring_history)
        };
        inspect_(grid, inspections);
        return render_(_, grid, h2oGridOutput, grid);
      };
      // abstracting this out produces an error
      // defer for now
      extendPredictions = (opts, predictions) => {
        render_(_, predictions, h2oPredictsOutput, opts, predictions);
        return predictions;
      };
      //
      //
      //
      extendColumnSummary = (frameKey, frame, columnName) => {
        let column;
        let inspectCharacteristics;
        let inspectDistribution;
        let inspectDomain;
        let inspectPercentiles;
        let inspectSummary;
        let inspections;
        let rowCount;
        column = lodash.head(frame.columns);
        rowCount = frame.rows;
        inspectPercentiles = () => {
          let vectors;
          vectors = [createVector('percentile', 'Number', frame.default_percentiles), createVector('value', 'Number', column.percentiles)];
          return createDataframe('percentiles', vectors, lodash.range(frame.default_percentiles.length), null, {
            description: `Percentiles for column \'${ column.label }\' in frame \'${ frameKey }\'.`,
            origin: `getColumnSummary ${ flowPrelude$5.stringify(frameKey) }, ${ flowPrelude$5.stringify(columnName) }`
          });
        };
        inspectDistribution = () => {
          let base;
          let binCount;
          let binIndex;
          let bins;
          let count;
          let countData;
          let i;
          let interval;
          let intervalData;
          let m;
          let minBinCount;
          let n;
          let rows;
          let stride;
          let vectors;
          let width;
          let widthData;
          let _i;
          let _j;
          let _k;
          let _l;
          let _len;
          let _ref1;
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

            // Trim off empty bins from the end
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
            origin: `getColumnSummary ${ flowPrelude$5.stringify(frameKey) }, ${ flowPrelude$5.stringify(columnName) }`,
            plot: `plot inspect \'distribution\', getColumnSummary ${ flowPrelude$5.stringify(frameKey) }, ${ flowPrelude$5.stringify(columnName) }`
          });
        };
        inspectCharacteristics = () => {
          let characteristicData;
          let count;
          let countData;
          let missing_count;
          let negative_infinity_count;
          let other;
          let percentData;
          let positive_infinity_count;
          let vectors;
          let zero_count;
          missing_count = column.missing_count, zero_count = column.zero_count, positive_infinity_count = column.positive_infinity_count, negative_infinity_count = column.negative_infinity_count;
          other = rowCount - missing_count - zero_count - positive_infinity_count - negative_infinity_count;
          characteristicData = ['Missing', '-Inf', 'Zero', '+Inf', 'Other'];
          countData = [missing_count, negative_infinity_count, zero_count, positive_infinity_count, other];
          percentData = (() => {
            let _i;
            let _len;
            let _results;
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
            origin: `getColumnSummary ${ flowPrelude$5.stringify(frameKey) }, ${ flowPrelude$5.stringify(columnName) }`,
            plot: `plot inspect \'characteristics\', getColumnSummary ${ flowPrelude$5.stringify(frameKey) }, ${ flowPrelude$5.stringify(columnName) }`
          });
        };
        inspectSummary = () => {
          let defaultPercentiles;
          let maximum;
          let mean;
          let minimum;
          let outliers;
          let percentiles;
          let q1;
          let q2;
          let q3;
          let vectors;
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
            origin: `getColumnSummary ${ flowPrelude$5.stringify(frameKey) }, ${ flowPrelude$5.stringify(columnName) }`,
            plot: `plot inspect \'summary\', getColumnSummary ${ flowPrelude$5.stringify(frameKey) }, ${ flowPrelude$5.stringify(columnName) }`
          });
        };
        inspectDomain = () => {
          let counts;
          let i;
          let labels;
          let level;
          let levels;
          let percents;
          let sortedLevels;
          let vectors;
          let _i;
          let _len;
          let _ref1;
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
            origin: `getColumnSummary ${ flowPrelude$5.stringify(frameKey) }, ${ flowPrelude$5.stringify(columnName) }`,
            plot: `plot inspect \'domain\', getColumnSummary ${ flowPrelude$5.stringify(frameKey) }, ${ flowPrelude$5.stringify(columnName) }`
          });
        };
        inspections = { characteristics: inspectCharacteristics };
        switch (column.type) {
          case 'int':
          case 'real':
            // Skip for columns with all NAs
            if (column.histogram_bins.length) {
              inspections.distribution = inspectDistribution;
            }
            // Skip for columns with all NAs
            if (!lodash.some(column.percentiles, a => a === 'NaN')) {
              inspections.summary = inspectSummary;
              inspections.percentiles = inspectPercentiles;
            }
            break;
          case 'enum':
            inspections.domain = inspectDomain;
        }
        inspect_(frame, inspections);
        return render_(_, frame, h2oColumnSummaryOutput, frameKey, frame, columnName);
      };
      requestFrame = (frameKey, go) => _.requestFrameSlice(frameKey, void 0, 0, 20, (error, frame) => {
        if (error) {
          return go(error);
        }
        return go(null, extendFrame(_, frameKey, frame));
      });
      requestFrameData = (frameKey, searchTerm, offset, count, go) => _.requestFrameSlice(frameKey, searchTerm, offset, count, (error, frame) => {
        if (error) {
          return go(error);
        }
        return go(null, extendFrameData(_, frameKey, frame));
      });
      requestFrameSummarySlice = (frameKey, searchTerm, offset, length, go) => _.requestFrameSummarySlice(frameKey, searchTerm, offset, length, (error, frame) => {
        if (error) {
          return go(error);
        }
        return go(null, extendFrameSummary(_, frameKey, frame));
      });
      requestFrameSummary = (frameKey, go) => _.requestFrameSummarySlice(frameKey, void 0, 0, 20, (error, frame) => {
        if (error) {
          return go(error);
        }
        return go(null, extendFrameSummary(_, frameKey, frame));
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
        return go(null, extendFrames(_, frames));
      });
      requestCreateFrame = (opts, go) => _.requestCreateFrame(opts, (error, result) => {
        if (error) {
          return go(error);
        }
        return _.requestJob(result.key.name, (error, job) => {
          if (error) {
            return go(error);
          }
          return go(null, extendJob(_, job));
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
          return go(null, extendJob(_, job));
        });
      });
      requestPartialDependenceData = (key, go) => _.requestPartialDependenceData(key, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendPartialDependence(_, result));
      });
      computeSplits = (ratios, keys) => {
        let i;
        let key;
        let part;
        let parts;
        let ratio;
        let splits;
        let sum;
        let _i;
        let _j;
        let _len;
        let _len1;
        let _ref1;
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
        let g;
        let i;
        let l;
        let part;
        let randomVecKey;
        let sliceExpr;
        let splits;
        let statements;
        let _i;
        let _len;
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
            return go(null, extendSplitFrameResult(_, {
              keys: splitKeys,
              ratios: splitRatios
            }));
          });
        }
        return go(new Flow.Error('The number of split ratios should be one less than the number of split keys'));
      };
      requestMergeFrames = (destinationKey, leftFrameKey, leftColumnIndex, includeAllLeftRows, rightFrameKey, rightColumnIndex, includeAllRightRows, go) => {
        let lr;
        let rr;
        let statement;
        lr = includeAllLeftRows ? 'TRUE' : 'FALSE';
        rr = includeAllRightRows ? 'TRUE' : 'FALSE';
        statement = `(assign ${ destinationKey } (merge ${ leftFrameKey } ${ rightFrameKey } ${ lr } ${ rr } ${ leftColumnIndex } ${ rightColumnIndex } "radix"))`;
        return _.requestExec(statement, (error, result) => {
          if (error) {
            return go(error);
          }
          return go(null, extendMergeFramesResult(_, { key: destinationKey }));
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

      // define the function that is called when 
      // the Partial Dependence plot input form
      // is submitted
      buildPartialDependence = opts => {
        if (opts) {
          return _fork(requestPartialDependence, opts);
        }
        // specify function to call if user
        // provides malformed input
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
        switch (flowPrelude$5.typeOf(frameKey)) {
          case 'String':
            return _fork(requestFrame, frameKey);
          default:
            return assist(getFrame);
        }
      };
      bindFrames = (key, sourceKeys) => _fork(requestBindFrames, key, sourceKeys);
      getFrameSummary = frameKey => {
        switch (flowPrelude$5.typeOf(frameKey)) {
          case 'String':
            return _fork(requestFrameSummary, frameKey);
          default:
            return assist(getFrameSummary);
        }
      };
      getFrameData = frameKey => {
        switch (flowPrelude$5.typeOf(frameKey)) {
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
        return go(null, extendDeletedKeys(_, [frameKey]));
      });
      deleteFrame = frameKey => {
        if (frameKey) {
          return _fork(requestDeleteFrame, frameKey);
        }
        return assist(deleteFrame);
      };
      extendExportFrame = result => render_(_, result, h2oExportFrameOutput, result);
      extendBindFrames = (key, result) => render_(_, result, h2oBindFramesOutput, key, result);
      requestExportFrame = (frameKey, path, opts, go) => _.requestExportFrame(frameKey, path, opts.overwrite, (error, result) => {
        if (error) {
          return go(error);
        }
        return _.requestJob(result.job.key.name, (error, job) => {
          if (error) {
            return go(error);
          }
          return go(null, extendJob(_, job));
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
        let futures;
        futures = lodash.map(frameKeys, frameKey => _fork(_.requestDeleteFrame, frameKey));
        return Flow.Async.join(futures, (error, results) => {
          if (error) {
            return go(error);
          }
          return go(null, extendDeletedKeys(_, frameKeys));
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
        return go(null, extendModels(_, models));
      });
      requestModelsByKeys = (modelKeys, go) => {
        let futures;
        futures = lodash.map(modelKeys, key => _fork(_.requestModel, key));
        return Flow.Async.join(futures, (error, models) => {
          if (error) {
            return go(error);
          }
          return go(null, extendModels(_, models));
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
        return go(null, extendGrids(_, grids));
      });
      getGrids = () => _fork(requestGrids);
      requestModel = (modelKey, go) => _.requestModel(modelKey, (error, model) => {
        if (error) {
          return go(error);
        }
        return go(null, extendModel(_, model));
      });
      getModel = modelKey => {
        switch (flowPrelude$5.typeOf(modelKey)) {
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
        switch (flowPrelude$5.typeOf(gridKey)) {
          case 'String':
            return _fork(requestGrid, gridKey, opts);
          default:
            return assist(getGrid);
        }
      };
      findColumnIndexByColumnLabel = (frame, columnLabel) => {
        let column;
        let i;
        let _i;
        let _len;
        let _ref1;
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
        let columnLabel;
        let _i;
        let _len;
        let _results;
        _results = [];
        for (_i = 0, _len = columnLabels.length; _i < _len; _i++) {
          columnLabel = columnLabels[_i];
          _results.push(findColumnIndexByColumnLabel(frame, columnLabel));
        }
        return _results;
      };
      requestImputeColumn = (opts, go) => {
        let column;
        let combineMethod;
        let frame;
        let groupByColumns;
        let method;
        frame = opts.frame, column = opts.column, method = opts.method, combineMethod = opts.combineMethod, groupByColumns = opts.groupByColumns;
        combineMethod = combineMethod != null ? combineMethod : 'interpolate';
        return _.requestFrameSummaryWithoutData(frame, (error, result) => {
          let columnIndex;
          let columnIndicesError;
          let columnKeyError;
          let groupByArg;
          let groupByColumnIndices;
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
        let column;
        let frame;
        let method;
        let type;
        frame = opts.frame, column = opts.column, type = opts.type;
        method = type === 'enum' ? 'as.factor' : 'as.numeric';
        return _.requestFrameSummaryWithoutData(frame, (error, result) => {
          let columnIndex;
          let columnKeyError;
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
      // depends on `assist`
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
        return go(null, extendDeletedKeys(_, [modelKey]));
      });
      deleteModel = modelKey => {
        if (modelKey) {
          return _fork(requestDeleteModel, modelKey);
        }
        return assist(deleteModel);
      };
      extendImportModel = result => render_(_, result, H2O.ImportModelOutput, result);
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
      extendExportModel = result => render_(_, result, h2oExportModelOutput, result);
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
        let futures;
        futures = lodash.map(modelKeys, modelKey => _fork(_.requestDeleteModel, modelKey));
        return Flow.Async.join(futures, (error, results) => {
          if (error) {
            return go(error);
          }
          return go(null, extendDeletedKeys(_, modelKeys));
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
        return go(null, extendJob(_, job));
      });
      requestJobs = go => _.requestJobs((error, jobs) => {
        if (error) {
          return go(error);
        }
        return go(null, extendJobs(_, jobs));
      });
      getJobs = () => _fork(requestJobs);
      getJob = arg => {
        switch (flowPrelude$5.typeOf(arg)) {
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
        return go(null, extendCancelJob(_, {}));
      });
      cancelJob = arg => {
        switch (flowPrelude$5.typeOf(arg)) {
          case 'String':
            return _fork(requestCancelJob, arg);
          default:
            return assist(cancelJob);
        }
      };
      extendImportResults = importResults => render_(_, importResults, h2oImportFilesOutput, importResults);
      requestImportFiles = (paths, go) => _.requestImportFiles(paths, (error, importResults) => {
        if (error) {
          return go(error);
        }
        return go(null, extendImportResults(importResults));
      });
      importFiles = paths => {
        switch (flowPrelude$5.typeOf(paths)) {
          case 'Array':
            return _fork(requestImportFiles, paths);
          default:
            return assist(importFiles);
        }
      };
      extendParseSetupResults = (args, parseSetupResults) => render_(_, parseSetupResults, H2O.SetupParseOutput, args, parseSetupResults);
      requestImportAndParseSetup = (paths, go) => _.requestImportFiles(paths, (error, importResults) => {
        let sourceKeys;
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
      extendParseResult = parseResult => render_(_, parseResult, H2O.JobOutput, parseResult.job);
      requestImportAndParseFiles = (paths, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, go) => _.requestImportFiles(paths, (error, importResults) => {
        let sourceKeys;
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
        let checkHeader;
        let chunkSize;
        let columnCount;
        let columnNames;
        let columnTypes;
        let deleteOnDone;
        let destinationKey;
        let parseType;
        let separator;
        let useSingleQuotes;
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
        let messages;
        let validation;
        if (error) {
          return go(error);
        }
        if (result.error_count > 0) {
          messages = (() => {
            let _i;
            let _len;
            let _ref1;
            let _results;
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
        return go(null, extendJob(_, result.job));
      });
      requestAutoModelBuild = (opts, go) => {
        let params;
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
          return go(null, extendJob(_, result.job));
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
        return go(null, extendPrediction(_, result));
      };
      requestPredict = (destinationKey, modelKey, frameKey, options, go) => _.requestPredict(destinationKey, modelKey, frameKey, options, unwrapPrediction(go));
      requestPredicts = (opts, go) => {
        let futures;
        futures = lodash.map(opts, opt => {
          let frameKey;
          let modelKey;
          let options;
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
        let combos;
        let deep_features_hidden_layer;
        let exemplar_index;
        let frame;
        let frames;
        let leaf_node_assignment;
        let model;
        let models;
        let predictions_frame;
        let reconstruction_error;
        let _i;
        let _j;
        let _len;
        let _len1;
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
        let frameKey;
        let futures;
        let modelKey;
        if (lodash.isArray(opts)) {
          futures = lodash.map(opts, opt => {
            let frameKey;
            let modelKey;
            modelKey = opt.model, frameKey = opt.frame;
            return _fork(_.requestPredictions, modelKey, frameKey);
          });
          return Flow.Async.join(futures, (error, predictions) => {
            let uniquePredictions;
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
        let frame;
        let model;
        let predictions_frame;
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
        return go(null, extendCloud(_, cloud));
      });
      getCloud = () => _fork(requestCloud);
      requestTimeline = go => _.requestTimeline((error, timeline) => {
        if (error) {
          return go(error);
        }
        return go(null, extendTimeline(_, timeline));
      });
      getTimeline = () => _fork(requestTimeline);
      requestStackTrace = go => _.requestStackTrace((error, stackTrace) => {
        if (error) {
          return go(error);
        }
        return go(null, extendStackTrace(_, stackTrace));
      });
      getStackTrace = () => _fork(requestStackTrace);
      requestLogFile = (nodeIndex, fileType, go) => _.requestCloud((error, cloud) => {
        let NODE_INDEX_SELF;
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
          return go(null, extendLogFile(_, cloud, nodeIndex, fileType, logFile));
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
        return go(null, extendNetworkTest(_, result));
      });
      testNetwork = () => _fork(requestNetworkTest);
      requestRemoveAll = go => _.requestRemoveAll((error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys(_, []));
      });
      deleteAll = () => _fork(requestRemoveAll);
      extendRDDs = rdds => {
        render_(_, rdds, h2oRDDsOutput, rdds);
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
        render_(_, dataframes, h2oDataFramesOutput, dataframes);
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
        render_(_, result, h2oH2OFrameOutput, result);
        return result;
      };
      requestAsH2OFrameFromRDD = (rddId, name, go) => _.requestAsH2OFrameFromRDD(rddId, name, (error, h2oframe_id) => {
        if (error) {
          return go(error);
        }
        return go(null, extendAsH2OFrame(h2oframe_id));
      });
      asH2OFrameFromRDD = (rddId, name) => {
        if (name == null) {
          name = void 0;
        }
        return _fork(requestAsH2OFrameFromRDD, rddId, name);
      };
      requestAsH2OFrameFromDF = (dfId, name, go) => _.requestAsH2OFrameFromDF(dfId, name, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendAsH2OFrame(result));
      });
      asH2OFrameFromDF = (dfId, name) => {
        if (name == null) {
          name = void 0;
        }
        return _fork(requestAsH2OFrameFromDF, dfId, name);
      };
      extendAsDataFrame = result => {
        render_(_, result, h2oDataFrameOutput, result);
        return result;
      };
      requestAsDataFrame = (hfId, name, go) => _.requestAsDataFrame(hfId, name, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendAsDataFrame(result));
      });
      asDataFrame = (hfId, name) => {
        if (name == null) {
          name = void 0;
        }
        return _fork(requestAsDataFrame, hfId, name);
      };
      requestScalaCode = (sessionId, code, go) => _.requestScalaCode(sessionId, code, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendScalaCode(result));
      });
      extendScalaCode = result => {
        render_(_, result, h2oScalaCodeOutput, result);
        return result;
      };
      runScalaCode = (sessionId, code) => _fork(requestScalaCode, sessionId, code);
      requestScalaIntp = go => _.requestScalaIntp((error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, extendScalaIntp(result));
      });
      extendScalaIntp = result => {
        render_(_, result, h2oScalaIntpOutput, result);
        return result;
      };
      getScalaIntp = () => _fork(requestScalaIntp);
      requestProfile = (depth, go) => _.requestProfile(depth, (error, profile) => {
        if (error) {
          return go(error);
        }
        return go(null, extendProfile(_, profile));
      });
      getProfile = opts => {
        if (!opts) {
          opts = { depth: 10 };
        }
        return _fork(requestProfile, opts.depth);
      };
      loadScript = (path, go) => {
        let onDone;
        let onFail;
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
        return go(null, render_(_, result, Flow.objectBrowser, 'dump', result));
      };
      dump = f => {
        if (f != null ? f.isFuture : void 0) {
          return _fork(dumpFuture, f);
        }
        return Flow.Async.async(() => f);
      };
      // abstracting this out produces errors
      // defer for now
      assist = function () {
        let args;
        let func;
        func = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
        if (func === void 0) {
          return _fork(proceed, _, h2oAssist, [_assistance]);
        }
        switch (func) {
          case importFiles:
            return _fork(proceed, _, h2oImportFilesInput, []);
          case buildModel:
            return _fork(proceed, _, H2O.ModelInput, args);
          case buildAutoModel:
            return _fork(proceed, _, h2oAutoModelInput, args);
          case predict:
          case getPrediction:
            return _fork(proceed, _, h2oPredictInput, args);
          case createFrame:
            return _fork(proceed, _, h2oCreateFrameInput, args);
          case splitFrame:
            return _fork(proceed, _, h2oSplitFrameInput, args);
          case mergeFrames:
            return _fork(proceed, _, h2oMergeFramesInput, args);
          case buildPartialDependence:
            return _fork(proceed, _, h2oPartialDependenceInput, args);
          case exportFrame:
            return _fork(proceed, _, h2oExportFrameInput, args);
          case imputeColumn:
            return _fork(proceed, _, H2O.ImputeInput, args);
          case importModel:
            return _fork(proceed, _, h2oImportModelInput, args);
          case exportModel:
            return _fork(proceed, _, h2oExportModelInput, args);
          default:
            return _fork(proceed, _, h2oNoAssist, []);
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
        //
        // fork/join
        //
        fork: _fork,
        join: _join,
        call: _call,
        apply: _apply,
        isFuture: _isFuture,
        //
        // Dataflow
        //
        signal: Flow.Dataflow.signal,
        signals: Flow.Dataflow.signals,
        isSignal: Flow.Dataflow.isSignal,
        act: Flow.Dataflow.act,
        react: Flow.Dataflow.react,
        lift: Flow.Dataflow.lift,
        merge: Flow.Dataflow.merge,
        //
        // Generic
        //
        dump,
        inspect,
        plot,
        grid,
        get: _get,
        //
        // Meta
        //
        assist,
        //
        // GUI
        //
        gui,
        //
        // Util
        //
        loadScript,
        //
        // H2O
        //
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
    const lodash = window._;
    const Flow = window.Flow;
    const moment = window.moment;
    const describeCount = (count, singular, plural) => {
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
    const fromNow = date => moment(date).fromNow();
    const formatBytes = bytes => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) {
        return '0 Byte';
      }
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
      return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
    };
    const padTime = n => `${ n < 10 ? '0' : '' }${ n }`;
    const splitTime = s => {
      const ms = s % 1000;
      s = (s - ms) / 1000;
      const secs = s % 60;
      s = (s - secs) / 60;
      const mins = s % 60;
      const hrs = (s - mins) / 60;
      return [hrs, mins, secs, ms];
    };
    const formatMilliseconds = s => {
      const _ref = splitTime(s);
      const hrs = _ref[0];
      const mins = _ref[1];
      const secs = _ref[2];
      const ms = _ref[3];
      return `${ padTime(hrs) }:${ padTime(mins) }:${ padTime(secs) }.${ ms }`;
    };
    const format1d0 = n => Math.round(n * 10) / 10;
    const formatElapsedTime = s => {
      const _ref = splitTime(s);
      const hrs = _ref[0];
      const mins = _ref[1];
      const secs = _ref[2];
      const ms = _ref[3];
      if (hrs !== 0) {
        return `${ format1d0((hrs * 60 + mins) / 60) }h`;
      } else if (mins !== 0) {
        return `${ format1d0((mins * 60 + secs) / 60) }m`;
      } else if (secs !== 0) {
        return `${ format1d0((secs * 1000 + ms) / 1000) }s`;
      }
      return `${ ms }ms`;
    };
    const formatClockTime = date => moment(date).format('h:mm:ss a');
    const EOL = '\n';
    const multilineTextToHTML = text => lodash.map(text.split(EOL), str => lodash.escape(str)).join('<br/>');
    const sanitizeName = name => name.replace(/[^a-z0-9_ \(\)-]/gi, '-').trim();
    const highlight = (code, lang) => {
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
    const lodash = window._;
    const Flow = window.Flow;
    if (!(typeof window !== 'undefined' && window !== null ? window.localStorage : void 0)) {
      return;
    }
    const _ls = window.localStorage;
    const keyOf = (type, id) => `${ type }:${ id }`;
    const list = type => {
      let i;
      let id;
      let key;
      let t;
      let _i;
      let _ref;
      let _ref1;
      const objs = [];
      for (i = _i = 0, _ref = _ls.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
        key = _ls.key(i);
        _ref1 = key.split(':');
        t = _ref1[0];
        id = _ref1[1];
        if (type === t) {
          objs.push([type, id, JSON.parse(_ls.getItem(key))]);
        }
      }
      return objs;
    };
    const read = (type, id) => {
      const raw = _ls.getobj(keyOf(type, id));
      if (raw) {
        return JSON.parse(raw);
      }
      return null;
    };
    const write = (type, id, obj) => _ls.setItem(keyOf(type, id), JSON.stringify(obj));
    const purge = (type, id) => {
      if (id) {
        return _ls.removeItem(keyOf(type, id));
      }
      return purgeAll(type);
    };
    const purgeAll = type => {
      let i;
      let key;
      let _i;
      let _len;
      const allKeys = (() => {
        let _i;
        let _ref;
        const _results = [];
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

  //
  // Custom Knockout.js binding handlers
  //
  // init:
  //   This will be called when the binding is first applied to an element
  //   Set up any initial state, event handlers, etc. here
  //
  // update:
  //   This will be called once when the binding is first applied to an element,
  //    and again whenever the associated observable changes value.
  //   Update the DOM element based on the supplied values here.
  //
  // Registering a callback on the disposal of an element
  //
  // To register a function to run when a node is removed,
  // you can call ko.utils.domNodeDisposal.addDisposeCallback(node, callback).
  // As an example, suppose you create a custom binding to instantiate a widget.
  // When the element with the binding is removed,
  // you may want to call the destroy method of the widget:
  //
  // ko.bindingHandlers.myWidget = {
  //     init: function(element, valueAccessor) {
  //         var options = ko.unwrap(valueAccessor()),
  //             $el = $(element);
  //
  //         $el.myWidget(options);
  //
  //         ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
  //             // This will be called when the element is removed by Knockout or
  //             // if some other part of your code calls ko.removeNode(element)
  //             $el.myWidget("destroy");
  //         });
  //     }
  // };
  //

  function knockout() {
    const lodash = window._;
    const $ = window.jQuery;
    const CodeMirror = window.CodeMirror;
    const ko = window.ko;
    const marked = window.marked;
    if ((typeof window !== 'undefined' && window !== null ? window.ko : void 0) == null) {
      return;
    }
    ko.bindingHandlers.raw = {
      update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let $element;
        const arg = ko.unwrap(valueAccessor());
        if (arg) {
          $element = $(element);
          $element.empty();
          $element.append(arg);
        }
      }
    };
    ko.bindingHandlers.markdown = {
      update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let error;
        let html;
        const data = ko.unwrap(valueAccessor());
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
        const data = ko.unwrap(valueAccessor());
        return $(element).text(JSON.stringify(data, null, 2));
      }
    };
    ko.bindingHandlers.enterKey = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let $element;
        const action = ko.unwrap(valueAccessor());
        if (action) {
          if (lodash.isFunction(action)) {
            $element = $(element);
            $element.keydown(e => {
              if (e.which === 13) {
                action(viewModel);
              }
            });
          } else {
            throw new Error('Enter key action is not a function');
          }
        }
      }
    };
    ko.bindingHandlers.typeahead = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let $element;
        const action = ko.unwrap(valueAccessor());
        if (action) {
          if (lodash.isFunction(action)) {
            $element = $(element);
            $element.typeahead(null, {
              displayKey: 'value',
              source: action
            });
          } else {
            throw new Error('Typeahead action is not a function');
          }
        }
      }
    };
    ko.bindingHandlers.cursorPosition = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        const arg = ko.unwrap(valueAccessor());
        if (arg) {
          // Bit of a hack.
          // Attaches a method to the bound object that returns the cursor position.
          // Uses dwieeb/jquery-textrange.
          arg.getCursorPosition = () => $(element).textrange('get', 'position');
        }
      }
    };
    ko.bindingHandlers.autoResize = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let $el;
        const arg = ko.unwrap(valueAccessor());
        let resize;
        if (arg) {
          // Bit of a hack.
          // Attaches a method to the bound object that resizes the element to fit its content.
          arg.autoResize = resize = () => lodash.defer(() => $el.css('height', 'auto').height(element.scrollHeight));
          $el = $(element).on('input', resize);
          resize();
        }
      }
    };
    ko.bindingHandlers.scrollIntoView = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let $el;
        let $viewport;
        const arg = ko.unwrap(valueAccessor());
        if (arg) {
          // Bit of a hack.
          // Attaches a method to the bound object that scrolls the cell into view
          $el = $(element);
          $viewport = $el.closest('.flow-box-notebook');
          arg.scrollIntoView = immediate => {
            if (immediate == null) {
              immediate = false;
            }
            const position = $viewport.scrollTop();
            const top = $el.position().top + position;
            const height = $viewport.height();
            // scroll if element is outside the viewport
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
        let isCollapsed;
        const caretDown = 'fa-caret-down';
        const caretRight = 'fa-caret-right';
        isCollapsed = ko.unwrap(valueAccessor());
        const caretEl = document.createElement('i');
        caretEl.className = 'fa';
        caretEl.style.marginRight = '3px';
        element.insertBefore(caretEl, element.firstChild);
        const $el = $(element);
        const $nextEl = $el.next();
        if (!$nextEl.length) {
          throw new Error('No collapsible sibling found');
        }
        const $caretEl = $(caretEl);
        const toggle = () => {
          if (isCollapsed) {
            $caretEl.removeClass(caretDown).addClass(caretRight);
            $nextEl.hide();
          } else {
            $caretEl.removeClass(caretRight).addClass(caretDown);
            $nextEl.show();
          }
          isCollapsed = !isCollapsed;
          return isCollapsed;
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
        let $element;
        const arg = ko.unwrap(valueAccessor());
        if (arg) {
          $element = $(element);
          $element.empty();
          $element.append(arg);
        }
      }
    };
    ko.bindingHandlers.dump = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        const object = ko.unwrap(valueAccessor());
        return object;
      }
    };
    ko.bindingHandlers.element = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return valueAccessor()(element);
      }
    };
    ko.bindingHandlers.file = {
      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        let $file;
        const file = valueAccessor();
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
        // get the code mirror options
        const options = ko.unwrap(valueAccessor());
        // created editor replaces the textarea on which it was created
        const editor = CodeMirror.fromTextArea(element, options);
        editor.on('change', cm => allBindings().value(cm.getValue()));
        element.editor = editor;
        if (allBindings().value()) {
          editor.setValue(allBindings().value());
        }
        const internalTextArea = $(editor.getWrapperElement()).find('div textarea');
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
    const lodash = window._;
    const Flow = window.Flow;
    const diecut = window.diecut;
    if ((typeof window !== 'undefined' && window !== null ? window.diecut : void 0) == null) {
      return;
    }
    Flow.HTML = {
      template: diecut,
      render(name, html) {
        const el = document.createElement(name);
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
    const lodash = window._;
    const Flow = window.Flow;
    const d3 = window.d3;
    let formatTime;
    const significantDigitsBeforeDecimal = value => 1 + Math.floor(Math.log(Math.abs(value)) / Math.LN10);
    const Digits = (digits, value) => {
      if (value === 0) {
        return 0;
      }
      const sd = significantDigitsBeforeDecimal(value);
      if (sd >= digits) {
        return value.toFixed(0);
      }
      const magnitude = Math.pow(10, digits - sd);
      return Math.round(value * magnitude) / magnitude;
    };
    if (typeof exports === 'undefined' || exports === null) {
      formatTime = d3.time.format('%Y-%m-%d %H:%M:%S');
    }
    const formatDate = time => {
      if (time) {
        return formatTime(new Date(time));
      }
      return '-';
    };
    const __formatReal = {};
    const formatReal = precision => {
      const cached = __formatReal[precision];
      //
      // will leave the nested ternary statement commented for now
      // may be useful to confirm later that the translation to an if else block
      // was an accurate translation
      //
      // const format = cached ? cached : __formatReal[precision] = precision === -1 ? lodash.identity : d3.format(`.${precision}f`);
      let format;
      if (cached) {
        format = cached;
      } else {
        __formatReal[precision] = precision;
        // __formatReal[precision] === -1 ? lodash.identity : d3.format(`.${precision}f`);
        if (__formatReal[precision] === -1) {
          format = lodash.identity;
        } else {
          format = d3.format(`.${ precision }f`);
        }
      }
      return value => format(value);
    };
    Flow.Format = {
      Digits,
      Real: formatReal,
      Date: formatDate,
      time: formatTime
    };
  }

  function error() {
    const Flow = window.Flow;
    const printStackTrace = window.printStackTrace;
    const __hasProp = {}.hasOwnProperty;

    const __extends = (child, parent) => {
      let key;
      for (key in parent) {
        if (__hasProp.call(parent, key)) {
          child[key] = parent[key];
        }
      }
      function Ctor() {
        this.constructor = child;
      }
      Ctor.prototype = parent.prototype;
      child.prototype = new Ctor();
      child.__super__ = parent.prototype;
      return child;
    };

    const FlowError = (_super => {
      __extends(FlowError, _super);
      function FlowError(message, cause) {
        let error;
        const _ref = this.cause;
        this.message = message;
        this.cause = cause;
        this.name = 'FlowError';
        if (_ref != null ? _ref.stack : void 0) {
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
    const lodash = window._;
    const Flow = window.Flow;
    if (_opts == null) {
      _opts = {};
    }
    lodash.defaults(_opts, {
      title: 'Confirm',
      acceptCaption: 'Yes',
      declineCaption: 'No'
    });
    const accept = () => _go(true);
    const decline = () => _go(false);
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
    const lodash = window._;
    const Flow = window.Flow;
    if (_opts == null) {
      _opts = {};
    }
    lodash.defaults(_opts, {
      title: 'Alert',
      acceptCaption: 'OK'
    });
    const accept = () => _go(true);
    return {
      title: _opts.title,
      acceptCaption: _opts.acceptCaption,
      message: Flow.Util.multilineTextToHTML(_message),
      accept,
      template: 'alert-dialog'
    };
  }

  function dialogs() {
    const Flow = window.Flow;
    const $ = window.jQuery;
    const __slice = [].slice;
    Flow.dialogs = _ => {
      const _dialog = Flow.Dataflow.signal(null);
      const showDialog = (ctor, args, _go) => {
        let dialog;
        let responded;
        responded = false;
        _dialog(dialog = ctor(...[_].concat(args).concat(go)));
        const $dialog = $(`#${ dialog.template }`);
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
        function go(response) {
          if (!responded) {
            responded = true;
            $dialog.modal('hide');
            if (_go) {
              return _go(response);
            }
          }
        }
      };
      Flow.Dataflow.link(_.dialog, function () {
        let _i;
        const ctor = arguments[0];
        const args = arguments.length >= 3 ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []);
        const go = arguments[_i++];
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

  const flowPrelude$43 = flowPreludeFunction();

  //
  // Reactive programming / Dataflow programming wrapper over ko
  //

  function dataflow() {
    const lodash = window._;
    const Flow = window.Flow;
    const ko = window.ko;
    const __slice = [].slice;
    Flow.Dataflow = (() => {
      let createObservable;
      let createObservableArray;
      let isObservable;
      const createSlot = () => {
        let arrow;
        arrow = null;
        const self = function () {
          const args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
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
            arrow = {
              func,
              dispose() {
                arrow = null;
                return arrow;
              }
            };
            return arrow;
          }
        };
        self.dispose = () => {
          if (arrow) {
            return arrow.dispose();
          }
        };
        return self;
      };
      const createSlots = () => {
        const arrows = [];
        const self = function () {
          const args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
          return lodash.map(arrows, arrow => arrow.func.apply(null, args));
        };
        self.subscribe = func => {
          let arrow;
          console.assert(lodash.isFunction(func));
          arrows.push(arrow = {
            func,
            dispose() {
              return flowPrelude$43.remove(arrows, arrow);
            }
          });
          return arrow;
        };
        self.dispose = () => lodash.forEach(flowPrelude$43.copy(arrows), arrow => arrow.dispose());
        return self;
      };
      if (typeof ko !== 'undefined' && ko !== null) {
        createObservable = ko.observable;
        createObservableArray = ko.observableArray;
        isObservable = ko.isObservable;
      } else {
        createObservable = initialValue => {
          let currentValue;
          const arrows = [];
          currentValue = initialValue;
          const notifySubscribers = (arrows, newValue) => {
            let arrow;
            let _i;
            let _len;
            for (_i = 0, _len = arrows.length; _i < _len; _i++) {
              arrow = arrows[_i];
              arrow.func(newValue);
            }
          };
          const self = function (newValue) {
            if (arguments.length === 0) {
              return currentValue;
            }
            const unchanged = self.equalityComparer ? self.equalityComparer(currentValue, newValue) : currentValue === newValue;
            if (!unchanged) {
              currentValue = newValue;
              return notifySubscribers(arrows, newValue);
            }
          };
          self.subscribe = func => {
            let arrow;
            console.assert(lodash.isFunction(func));
            arrows.push(arrow = {
              func,
              dispose() {
                return flowPrelude$43.remove(arrows, arrow);
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
      const createSignal = function (value, equalityComparer) {
        if (arguments.length === 0) {
          return createSignal(void 0, flowPrelude$43.never);
        }
        const observable = createObservable(value);
        if (lodash.isFunction(equalityComparer)) {
          observable.equalityComparer = equalityComparer;
        }
        return observable;
      };
      const _isSignal = isObservable;
      const createSignals = array => createObservableArray(array || []);
      const _link = (source, func) => {
        console.assert(lodash.isFunction(source, '[signal] is not a function'));
        console.assert(lodash.isFunction(source.subscribe, '[signal] does not have a [dispose] method'));
        console.assert(lodash.isFunction(func, '[func] is not a function'));
        return source.subscribe(func);
      };
      const _unlink = arrows => {
        let arrow;
        let _i;
        let _len;
        let _results;
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
      //
      // Combinators
      //
      const _apply = (sources, func) => func(...lodash.map(sources, source => source()));
      const _act = (...args) => {
        let _i;
        const sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []);
        const func = args[_i++];
        _apply(sources, func);
        return lodash.map(sources, source => _link(source, () => _apply(sources, func)));
      };
      const _react = (...args) => {
        let _i;
        const sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []);
        const func = args[_i++];
        return lodash.map(sources, source => _link(source, () => _apply(sources, func)));
      };
      const _lift = (...args) => {
        let _i;
        const sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []);
        const func = args[_i++];
        const evaluate = () => _apply(sources, func);
        const target = createSignal(evaluate());
        lodash.map(sources, source => _link(source, () => target(evaluate())));
        return target;
      };
      const _merge = (...args) => {
        let _i;
        const sources = args.length >= 3 ? __slice.call(args, 0, _i = args.length - 2) : (_i = 0, []);
        const target = args[_i++];
        const func = args[_i++];
        const evaluate = () => _apply(sources, func);
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

  //
  // Insane hack to compress large 2D data tables.
  // The basis for doing this is described here:
  // http://www.html5rocks.com/en/tutorials/speed/v8/
  // See Tip #1 "Hidden Classes"
  //
  // Applies to IE as well:
  // http://msdn.microsoft.com/en-us/library/windows/apps/hh781219.aspx#optimize_property_access
  //
  // http://jsperf.com/big-data-matrix/3
  // As of 31 Oct 2014, for a 10000 row, 100 column table in Chrome,
  //   retained memory sizes:
  // raw json: 31,165 KB
  // array of objects: 41,840 KB
  // array of arrays: 14,960 KB
  // array of prototyped instances: 14,840 KB
  //
  // Usage:
  // Foo = Flow.Data.createCompiledPrototype [ 'bar', 'baz', 'qux', ... ]
  // foo = new Foo()
  //
  function data() {
    const lodash = window._;
    const Flow = window.Flow;
    let _prototypeId;
    const __slice = [].slice;
    _prototypeId = 0;
    const nextPrototypeName = () => `Map${ ++_prototypeId }`;
    const _prototypeCache = {};
    const createCompiledPrototype = attrs => {
      // Since the prototype depends only on attribute names,
      // return a cached prototype, if any.
      let attr;
      let i;
      const proto = _prototypeCache[cacheKey];
      const cacheKey = attrs.join('\0');
      if (proto) {
        return proto;
      }
      const params = (() => {
        let _i;
        let _ref;
        const _results = [];
        for (i = _i = 0, _ref = attrs.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
          _results.push(`a${ i }`);
        }
        return _results;
      })();
      const inits = (() => {
        let _i;
        let _len;
        const _results = [];
        for (i = _i = 0, _len = attrs.length; _i < _len; i = ++_i) {
          attr = attrs[i];
          _results.push(`this[${ JSON.stringify(attr) }]=a${ i };`);
        }
        return _results;
      })();
      const prototypeName = nextPrototypeName();
      _prototypeCache[cacheKey] = new Function(`function ${ prototypeName }(${ params.join(',') }){${ inits.join('') }} return ${ prototypeName };`)(); // eslint-disable-line
      return _prototypeCache[cacheKey];
    };
    const createRecordConstructor = variables => {
      let variable;
      return createCompiledPrototype((() => {
        let _i;
        let _len;
        const _results = [];
        for (_i = 0, _len = variables.length; _i < _len; _i++) {
          variable = variables[_i];
          _results.push(variable.label);
        }
        return _results;
      })());
    };
    const createTable = opts => {
      let description;
      let label;
      let variable;
      let _i;
      let _len;
      label = opts.label;
      description = opts.description;
      const variables = opts.variables;
      const rows = opts.rows;
      const meta = opts.meta;
      if (!description) {
        description = 'No description available.';
      }
      const schema = {};
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        schema[variable.label] = variable;
      }
      const fill = (i, go) => {
        _fill(i, (error, result) => {
          // eslint-disable-line
          let index;
          let value;
          let _j;
          let _len1;
          if (error) {
            return go(error);
          }
          const startIndex = result.index;
          lodash.values = result.values;
          for (index = _j = 0, _len1 = lodash.values.length; _j < _len1; index = ++_j) {
            value = lodash.values[index];
            rows[startIndex + index] = lodash.values[index];
          }
          return go(null);
        });
      };
      const expand = (...args) => {
        let type;
        let _j;
        let _len1;
        const types = args.length >= 1 ? __slice.call(args, 0) : [];
        const _results = [];
        for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
          type = types[_j];
          // TODO attach to prototype
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
    const includeZeroInRange = range => {
      const lo = range[0];
      const hi = range[1];
      if (lo > 0 && hi > 0) {
        return [0, hi];
      } else if (lo < 0 && hi < 0) {
        return [lo, 0];
      }
      return range;
    };
    const combineRanges = (...args) => {
      let hi;
      let lo;
      let range;
      let value;
      let _i;
      let _len;
      const ranges = args.length >= 1 ? __slice.call(args, 0) : [];
      lo = Number.POSITIVE_INFINITY;
      hi = Number.NEGATIVE_INFINITY;
      for (_i = 0, _len = ranges.length; _i < _len; _i++) {
        range = ranges[_i];
        value = range[0];
        if (lo > value) {
          lo = value;
        }
        value = range[1];
        if (hi < value) {
          hi = value;
        }
      }
      return [lo, hi];
    };
    const computeRange = (rows, attr) => {
      let hi;
      let lo;
      let row;
      let value;
      let _i;
      let _len;
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
    const permute = (array, indices) => {
      let i;
      let index;
      let _i;
      let _len;
      const permuted = new Array(array.length);
      for (i = _i = 0, _len = indices.length; _i < _len; i = ++_i) {
        index = indices[i];
        permuted[i] = array[index];
      }
      return permuted;
    };
    const createAbstractVariable = (_label, _type, _domain, _format, _read) => ({
      label: _label,
      type: _type,
      domain: _domain || [],
      format: _format || lodash.identity,
      read: _read
    });
    function createNumericVariable(_label, _domain, _format, _read) {
      const self = createAbstractVariable(_label, 'Number', _domain || [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY], _format, _read);
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
    }
    const createVariable = (_label, _type, _domain, _format, _read) => {
      if (_type === 'Number') {
        return createNumericVariable(_label, _domain, _format, _read);
      }
      return createAbstractVariable(_label, _type, _domain, _format, _read);
    };
    const createFactor = (_label, _domain, _format, _read) => {
      let level;
      let _i;
      let _id;
      let _len;
      let _ref;
      const self = createAbstractVariable(_label, 'Factor', _domain || [], _format, _read);
      _id = 0;
      const _levels = {};
      if (self.domain.length) {
        _ref = self.domain;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          level = _ref[_i];
          _levels[level] = _id++;
        }
      }
      if (!self.read) {
        self.read = datum => {
          let id;
          level = datum === void 0 || datum === null ? 'null' : datum;
          id = _levels[level];
          if (void 0 === id) {
            _levels[level] = id = _id++;
            self.domain.push(level);
          }
          return id;
        };
      }
      return self;
    };
    const factor = array => {
      let i;
      let id;
      let level;
      let _i;
      let _id;
      let _len;
      _id = 0;
      const levels = {};
      const domain = [];
      const data = new Array(array.length);
      for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
        level = array[i];
        id = levels[level];
        if (void 0 === id) {
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

  const flowPrelude$44 = flowPreludeFunction();

  function async() {
    const lodash = window._;
    const Flow = window.Flow;
    const __slice = [].slice;
    const createBuffer = array => {
      let _go;
      const _array = array || [];
      _go = null;
      const buffer = element => {
        if (element === void 0) {
          return _array;
        }
        _array.push(element);
        if (_go) {
          _go(element);
        }
        return element;
      };
      buffer.subscribe = go => {
        _go = go;
        return _go;
      };
      buffer.buffer = _array;
      buffer.isBuffer = true;
      return buffer;
    };
    const _noop = go => go(null);
    const _applicate = go => (error, args) => {
      if (lodash.isFunction(go)) {
        return go(...[error].concat(args));
      }
    };
    const _fork = (f, args) => {
      if (!lodash.isFunction(f)) {
        throw new Error('Not a function.');
      }
      const self = go => {
        const canGo = lodash.isFunction(go);
        if (self.settled) {
          // proceed with cached error/result
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
                self.pending = false;
                return self.pending;
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
    const _isFuture = a => {
      if (a != null ? a.isFuture : void 0) {
        return true;
      }
      return false;
    };
    function _join(args, go) {
      let arg;
      let i;
      let _actual;
      let _i;
      let _len;
      let _settled;
      if (args.length === 0) {
        return go(null, []);
      }
      const _tasks = [];
      const _results = [];
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
    }
    // Like _.compose, but async.
    // Equivalent to caolan/async.waterfall()
    const pipe = tasks => {
      const _tasks = tasks.slice(0);
      const next = (args, go) => {
        const task = _tasks.shift();
        if (task) {
          return task(...args.concat(function () {
            const error = arguments[0];
            const results = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
            if (error) {
              return go(error);
            }
            return next(results, go);
          }));
        }
        return go(...[null].concat(args));
      };
      return function () {
        let _i;
        const args = arguments.length >= 2 ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []);
        const go = arguments[_i++];
        return next(args, go);
      };
    };
    const iterate = tasks => {
      const _tasks = tasks.slice(0);
      const _results = [];
      const next = go => {
        const task = _tasks.shift();
        if (task) {
          return task((error, result) => {
            if (error) {
              return go(error);
            }
            _results.push(result);
            return next(go);
          });
        }
        // XXX should errors be included in arg #1?
        return go(null, _results);
      };
      return go => next(go);
    };

    //
    // Gives a synchronous operation an asynchronous signature.
    // Used to pass synchronous functions to callers that expect
    // asynchronous signatures.
    //
    const _async = function () {
      const f = arguments[0];
      const args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
      const later = function () {
        let error;
        let result;
        let _i;
        const args = arguments.length >= 2 ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []);
        const go = arguments[_i++];
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

    //
    // Asynchronous find operation.
    //
    // find attr, prop, array
    // find array, attr, prop
    // find attr, obj
    // find obj, attr
    //
    const _find$3 = (attr, prop, obj) => {
      let v;
      let _i;
      let _len;
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
    const _find$2 = (attr, obj) => {
      if (_isFuture(obj)) {
        return _async(_find$2, attr, obj);
      } else if (lodash.isString(attr)) {
        if (lodash.isArray(obj)) {
          return _find$3('name', attr, obj);
        }
        return obj[attr];
      }
    };
    const _find = function () {
      let a;
      let b;
      let c;
      let ta;
      let tb;
      let tc;
      const args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
      switch (args.length) {
        case 3:
          a = args[0];
          b = args[1];
          c = args[2];
          ta = flowPrelude$44.typeOf(a);
          tb = flowPrelude$44.typeOf(b);
          tc = flowPrelude$44.typeOf(c);
          if (ta === 'Array' && tb === 'String') {
            return _find$3(b, c, a);
          } else if (ta === 'String' && tc === 'Array') {
            return _find$3(a, b, c);
          }
          break;
        case 2:
          a = args[0];
          b = args[1];
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
          break;
        default:
        // do nothing
      }
    };

    // Duplicate of _find$2
    const _get = (attr, obj) => {
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
      createBuffer, // XXX rename
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

  const flowPrelude$45 = flowPreludeFunction();

  function objectBrowser() {
    const lodash = window._;
    const Flow = window.Flow;
    const isExpandable = type => {
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
    const previewArray = array => {
      let element;
      const ellipsis = array.length > 5 ? ', ...' : '';
      const previews = (() => {
        let _i;
        let _len;
        const _ref = lodash.head(array, 5);
        const _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          _results.push(preview(element));
        }
        return _results;
      })();
      return `[${ previews.join(', ') }${ ellipsis }]`;
    };
    const previewObject = object => {
      let count;
      let key;
      let value;
      count = 0;
      const previews = [];
      let ellipsis = '';
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
    const preview = (element, recurse) => {
      if (recurse == null) {
        recurse = false;
      }
      const type = flowPrelude$45.typeOf(element);
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
    // TODO slice large arrays
    Flow.objectBrowserElement = (key, object) => {
      const _expansions = Flow.Dataflow.signal(null);
      const _isExpanded = Flow.Dataflow.signal(false);
      const _type = flowPrelude$45.typeOf(object);
      const _canExpand = isExpandable(_type);
      const toggle = () => {
        let expansions;
        let value;
        if (!_canExpand) {
          return;
        }
        if (_expansions() === null) {
          expansions = [];
          for (key in object) {
            if ({}.hasOwnProperty.call(object, key)) {
              value = object[key];
              if (key !== '_flow_') {
                expansions.push(Flow.objectBrowserElement(key, value));
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
    Flow.objectBrowser = (_, _go, key, object) => {
      lodash.defer(_go);
      return {
        object: Flow.objectBrowserElement(key, object),
        template: 'flow-object'
      };
    };
  }

  function help() {
    const lodash = window._;
    const Flow = window.Flow;
    const H2O = window.H2O;
    const marked = window.marked;
    const $ = window.jQuery;
    let _catalog;
    let _homeContent;
    _catalog = null;
    const _index = {};
    _homeContent = null;
    const _homeMarkdown = '<blockquote>\nUsing Flow for the first time?\n<br/>\n<div style=\'margin-top:10px\'>\n  <button type=\'button\' data-action=\'get-flow\' data-pack-name=\'examples\' data-flow-name=\'QuickStartVideos.flow\' class=\'flow-button\'><i class=\'fa fa-file-movie-o\'></i><span>Quickstart Videos</span>\n  </button>\n</div>\n</blockquote>\n\nOr, <a href=\'#\' data-action=\'get-pack\' data-pack-name=\'examples\'>view example Flows</a> to explore and learn H<sub>2</sub>O.\n\n###### Star H2O on Github!\n\n<iframe src="https://ghbtns.com/github-btn.html?user=h2oai&repo=h2o-3&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>\n\n###### General\n\n%HELP_TOPICS%\n\n###### Examples\n\nFlow packs are a great way to explore and learn H<sub>2</sub>O. Try out these Flows and run them in your browser.<br/><a href=\'#\' data-action=\'get-packs\'>Browse installed packs...</a>\n\n###### H<sub>2</sub>O REST API\n\n- <a href=\'#\' data-action=\'endpoints\'>Routes</a>\n- <a href=\'#\' data-action=\'schemas\'>Schemas</a>\n';
    Flow.help = _ => {
      let _historyIndex;
      const _content = Flow.Dataflow.signal(null);
      const _history = [];
      _historyIndex = -1;
      const _canGoBack = Flow.Dataflow.signal(false);
      const _canGoForward = Flow.Dataflow.signal(false);
      const goTo = index => {
        const content = _history[_historyIndex = index];
        $('a, button', $(content)).each(function (i) {
          const $a = $(this);
          const action = $a.attr('data-action');
          if (action) {
            return $a.click(() => performAction(action, $a));
          }
        });
        _content(content);
        _canGoForward(_historyIndex < _history.length - 1);
        _canGoBack(_historyIndex > 0);
      };
      const goBack = () => {
        if (_historyIndex > 0) {
          return goTo(_historyIndex - 1);
        }
      };
      const goForward = () => {
        if (_historyIndex < _history.length - 1) {
          return goTo(_historyIndex + 1);
        }
      };
      const displayHtml = content => {
        if (_historyIndex < _history.length - 1) {
          _history.splice(_historyIndex + 1, _history.length - (_historyIndex + 1), content);
        } else {
          _history.push(content);
        }
        return goTo(_history.length - 1);
      };
      const fixImageSources = html => html.replace(/\s+src\s*=\s*"images\//g, ' src="help/images/');
      function performAction(action, $el) {
        let packName;
        let routeIndex;
        let schemaName;
        let topic;
        switch (action) {
          case 'help':
            topic = _index[$el.attr('data-topic')];
            _.requestHelpContent(topic.name, (error, html) => {
              const _ref = Flow.HTML.template('div', 'mark', 'h5', 'h6');
              const div = _ref[0];
              const mark = _ref[1];
              const h5 = _ref[2];
              const h6 = _ref[3];
              const contents = [mark('Help'), h5(topic.title), fixImageSources(div(html))];
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
              let flowName;
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
            break;
          default:
          // do nothing
        }
      }
      function buildToc(nodes) {
        const _ref = Flow.HTML.template('ul', 'li', 'a href=\'#\' data-action=\'help\' data-topic=\'$1\'');
        const ul = _ref[0];
        const li = _ref[1];
        const a = _ref[2];
        return ul(lodash.map(nodes, node => li(a(node.title, node.name))));
      }
      const buildTopics = (index, topics) => {
        let topic;
        let _i;
        let _len;
        for (_i = 0, _len = topics.length; _i < _len; _i++) {
          topic = topics[_i];
          index[topic.name] = topic;
          if (topic.children.length) {
            buildTopics(index, topic.children);
          }
        }
      };
      function displayPacks(packNames) {
        const _ref = Flow.HTML.template('div', 'mark', 'h5', 'p', 'i.fa.fa-folder-o', 'a href=\'#\' data-action=\'get-pack\' data-pack-name=\'$1\'');
        const div = _ref[0];
        const mark = _ref[1];
        const h5 = _ref[2];
        const p = _ref[3];
        const i = _ref[4];
        const a = _ref[5];
        displayHtml(Flow.HTML.render('div', div([mark('Packs'), h5('Installed Packs'), div(lodash.map(packNames, packName => p([i(), a(packName, packName)])))])));
      }
      function displayFlows(packName, flowNames) {
        const _ref = Flow.HTML.template('div', 'mark', 'h5', 'p', 'i.fa.fa-file-text-o', `a href=\'#\' data-action=\'get-flow\' data-pack-name=\'${ packName }\' data-flow-name=\'$1\'`);
        const div = _ref[0];
        const mark = _ref[1];
        const h5 = _ref[2];
        const p = _ref[3];
        const i = _ref[4];
        const a = _ref[5];
        displayHtml(Flow.HTML.render('div', div([mark('Pack'), h5(packName), div(lodash.map(flowNames, flowName => p([i(), a(flowName, flowName)])))])));
      }
      function displayEndpoints(routes) {
        let route;
        let routeIndex;
        let _i;
        let _len;
        const _ref = Flow.HTML.template('div', 'mark', 'h5', 'p', 'a href=\'#\' data-action=\'endpoint\' data-index=\'$1\'', 'code');
        const div = _ref[0];
        const mark = _ref[1];
        const h5 = _ref[2];
        const p = _ref[3];
        const action = _ref[4];
        const code = _ref[5];
        const els = [mark('API'), h5('List of Routes')];
        for (routeIndex = _i = 0, _len = routes.length; _i < _len; routeIndex = ++_i) {
          route = routes[routeIndex];
          els.push(p(`${ action(code(`${ route.http_method } ${ route.url_pattern }`), routeIndex) }<br/>${ route.summary }`));
        }
        displayHtml(Flow.HTML.render('div', div(els)));
      }
      const goHome = () => displayHtml(Flow.HTML.render('div', _homeContent));
      function displayEndpoint(route) {
        const _ref1 = route.path_params;
        const _ref = Flow.HTML.template('div', 'mark', 'h5', 'h6', 'p', 'a href=\'#\' data-action=\'schema\' data-schema=\'$1\'', 'code');
        const div = _ref[0];
        const mark = _ref[1];
        const h5 = _ref[2];
        const h6 = _ref[3];
        const p = _ref[4];
        const action = _ref[5];
        const code = _ref[6];
        return displayHtml(Flow.HTML.render('div', div([mark('Route'), h5(route.url_pattern), h6('Method'), p(code(route.http_method)), h6('Summary'), p(route.summary), h6('Parameters'), p((_ref1 != null ? _ref1.length : void 0) ? route.path_params.join(', ') : '-'), h6('Input Schema'), p(action(code(route.input_schema), route.input_schema)), h6('Output Schema'), p(action(code(route.output_schema), route.output_schema))])));
      }
      function displaySchemas(schemas) {
        let schema;
        const _ref = Flow.HTML.template('div', 'h5', 'ul', 'li', 'var', 'mark', 'code', 'a href=\'#\' data-action=\'schema\' data-schema=\'$1\'');
        const div = _ref[0];
        const h5 = _ref[1];
        const ul = _ref[2];
        const li = _ref[3];
        const variable = _ref[4];
        const mark = _ref[5];
        const code = _ref[6];
        const action = _ref[7];
        const els = [mark('API'), h5('List of Schemas'), ul((() => {
          let _i;
          let _len;
          const _results = [];
          for (_i = 0, _len = schemas.length; _i < _len; _i++) {
            schema = schemas[_i];
            _results.push(li(`${ action(code(schema.name), schema.name) } ${ variable(lodash.escape(schema.type)) }`));
          }
          return _results;
        })())];
        return displayHtml(Flow.HTML.render('div', div(els)));
      }
      function displaySchema(schema) {
        let field;
        let _i;
        let _len;
        const _ref = Flow.HTML.template('div', 'mark', 'h5', 'h6', 'p', 'code', 'var', 'small');
        const div = _ref[0];
        const mark = _ref[1];
        const h5 = _ref[2];
        const h6 = _ref[3];
        const p = _ref[4];
        const code = _ref[5];
        const variable = _ref[6];
        const small = _ref[7];
        const content = [mark('Schema'), h5(`${ schema.name } (${ lodash.escape(schema.type) })`), h6('Fields')];
        const _ref1 = schema.fields;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          field = _ref1[_i];
          if (field.name !== '__meta') {
            content.push(p(`${ variable(field.name) }${ field.required ? '*' : '' } ${ code(lodash.escape(field.type)) }<br/>${ small(field.help) }`));
          }
        }
        return displayHtml(Flow.HTML.render('div', div(content)));
      }
      const initialize = catalog => {
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
    const render = (input, output) => {
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
    const lodash = window._;
    const Flow = window.Flow;
    const escodegen = window.escodegen;
    const esprima = window.esprima;
    const CoffeeScript = window.CoffeeScript;
    const safetyWrapCoffeescript = guid => (cs, go) => {
      const lines = cs.replace(/[\n\r]/g, '\n') // normalize CR/LF
      .split('\n'); // split into lines

      // indent once
      const block = lodash.map(lines, line => `  ${ line }`);

      // enclose in execute-immediate closure
      block.unshift(`_h2o_results_[\'${ guid }\'].result do ->`);

      // join and proceed
      return go(null, block.join('\n'));
    };
    const compileCoffeescript = (cs, go) => {
      let error;
      try {
        return go(null, CoffeeScript.compile(cs, { bare: true }));
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error compiling coffee-script', error));
      }
    };
    const parseJavascript = (js, go) => {
      let error;
      try {
        return go(null, esprima.parse(js));
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error parsing javascript expression', error));
      }
    };
    const identifyDeclarations = node => {
      let declaration;
      if (!node) {
        return null;
      }
      switch (node.type) {
        case 'VariableDeclaration':
          return (() => {
            let _i;
            let _len;
            const _ref = node.declarations;
            const _results = [];
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
          //
          // XXX Not sure about the semantics here.
          //
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
        default:
        // do nothing
      }
      return null;
    };
    const parseDeclarations = block => {
      let declaration;
      let declarations;
      let node;
      let _i;
      let _j;
      let _len;
      let _len1;
      const identifiers = [];
      const _ref = block.body;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        declarations = identifyDeclarations(node);
        if (declarations) {
          for (_j = 0, _len1 = declarations.length; _j < _len1; _j++) {
            declaration = declarations[_j];
            identifiers.push(declaration);
          }
        }
      }
      return lodash.indexBy(identifiers, identifier => identifier.name);
    };
    const traverseJavascript = (parent, key, node, f) => {
      let child;
      let i;
      if (lodash.isArray(node)) {
        i = node.length;
        // walk backwards to allow callers to delete nodes
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
    const deleteAstNode = (parent, i) => {
      if (lodash.isArray(parent)) {
        return parent.splice(i, 1);
      } else if (lodash.isObject(parent)) {
        return delete parent[i];
      }
    };
    const createLocalScope = node => {
      let param;
      let _i;
      let _len;
      // parse all declarations in this scope
      const localScope = parseDeclarations(node.body);

      // include formal parameters
      const _ref = node.params;
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

    // redefine scope by coalescing down to non-local identifiers
    const coalesceScopes = scopes => {
      let i;
      let identifier;
      let name;
      let scope;
      let _i;
      let _len;
      const currentScope = {};
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
    const traverseJavascriptScoped = (scopes, parentScope, parent, key, node, f) => {
      let child;
      let currentScope;
      const isNewScope = node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration';
      if (isNewScope) {
        // create and push a new local scope onto scope stack
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
        // discard local scope
        scopes.pop();
      }
    };
    const createRootScope = sandbox => function (program, go) {
      let error;
      let name;
      let rootScope;
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

    // TODO DO NOT call this for raw javascript:
    // Require alternate strategy:
    //  Declarations with 'var' need to be local to the cell.
    //  Undeclared identifiers are assumed to be global.
    //  'use strict' should be unsupported.
    const removeHoistedDeclarations = (rootScope, program, go) => {
      let error;
      try {
        traverseJavascript(null, null, program, (parent, key, node) => {
          let declarations;
          if (node.type === 'VariableDeclaration') {
            declarations = node.declarations.filter(declaration => declaration.type === 'VariableDeclarator' && declaration.id.type === 'Identifier' && !rootScope[declaration.id.name]);
            if (declarations.length === 0) {
              // purge this node so that escodegen doesn't fail
              return deleteAstNode(parent, key);
            }
            // replace with cleaned-up declarations
            node.declarations = declarations;
            return node.declarations;
          }
        });
        return go(null, rootScope, program);
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error rewriting javascript', error));
      }
    };
    const createGlobalScope = (rootScope, routines) => {
      let identifier;
      let name;
      const globalScope = {};
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
    const rewriteJavascript = sandbox => (rootScope, program, go) => {
      let error;
      const globalScope = createGlobalScope(rootScope, sandbox.routines);
      try {
        traverseJavascriptScoped([globalScope], globalScope, null, null, program, (globalScope, parent, key, node) => {
          let identifier;
          if (node.type === 'Identifier') {
            // ignore var declarations
            if (parent.type === 'VariableDeclarator' && key === 'id') {
              return;
            }
            // ignore members
            if (key === 'property') {
              return;
            }
            identifier = globalScope[node.name];
            if (!identifier) {
              return;
            }

            // qualify identifier with '_h2o_context_'
            parent[key] = {
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
            return parent[key];
          }
        });
        return go(null, program);
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error rewriting javascript', error));
      }
    };
    const generateJavascript = (program, go) => {
      let error;
      try {
        return go(null, escodegen.generate(program));
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error generating javascript', error));
      }
    };
    const compileJavascript = (js, go) => {
      let closure;
      let error;
      try {
        closure = new Function('h2o', '_h2o_context_', '_h2o_results_', 'print', js); // eslint-disable-line
        return go(null, closure);
      } catch (_error) {
        error = _error;
        return go(new Flow.Error('Error compiling javascript', error));
      }
    };
    const executeJavascript = (sandbox, print) => (closure, go) => {
      let error;
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
    const lodash = window._;
    const Flow = window.Flow;
    const _kernel = flowCoffeescriptKernel();
    const print = arg => {
      if (arg !== print) {
        sandbox.results[guid].outputs(arg);
      }
      return print;
    };
    const isRoutine = f => {
      let name;
      let routine;
      const _ref = sandbox.routines;
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

    // XXX special-case functions so that bodies are not printed with the raw renderer.
    const render = (input, output) => {
      let cellResult;
      let outputBuffer;
      sandbox.results[guid] = cellResult = {
        result: Flow.Dataflow.signal(null),
        outputs: outputBuffer = Flow.Async.createBuffer([])
      };
      const evaluate = ft => {
        if (ft != null ? ft.isFuture : void 0) {
          return ft((error, result) => {
            if (error) {
              output.error(new Flow.Error('Error evaluating cell', error));
              return output.end();
            }
            const _ref = result._flow_;
            if (result != null ? _ref != null ? _ref.render : void 0 : void 0) {
              return output.data(result._flow_.render(() => output.end()));
            }
            return output.data(Flow.objectBrowser(_, (() => output.end())('output', result)));
          });
        }
        return output.data(Flow.objectBrowser(_, () => output.end(), 'output', ft));
      };
      outputBuffer.subscribe(evaluate);
      const tasks = [_kernel.safetyWrapCoffeescript(guid), _kernel.compileCoffeescript, _kernel.parseJavascript, _kernel.createRootScope(sandbox), _kernel.removeHoistedDeclarations, _kernel.rewriteJavascript(sandbox), _kernel.generateJavascript, _kernel.compileJavascript, _kernel.executeJavascript(sandbox, print)];
      return Flow.Async.pipe(tasks)(input, error => {
        if (error) {
          output.error(error);
        }
        const result = cellResult.result();
        if (lodash.isFunction(result)) {
          if (isRoutine(result)) {
            return print(result());
          }
          return evaluate(result);
        }
        return output.close(Flow.objectBrowser(_, () => output.end(), 'result', result));
      });
    };
    render.isCode = true;
    return render;
  }

  function flowRaw(_) {
    const render = (input, output) => {
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
    const lodash = window._;
    const Flow = window.Flow;
    const defaultMessage = 'Ready';
    const _message = Flow.Dataflow.signal(defaultMessage);
    const _connections = Flow.Dataflow.signal(0);
    const _isBusy = Flow.Dataflow.lift(_connections, connections => connections > 0);
    const onStatus = (category, type, data) => {
      let connections;
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
            default:
            // do nothing
          }
          break;
        default:
        // do nothing
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
    const lodash = window._;
    const Flow = window.Flow;
    const _docs = Flow.Dataflow.signals([]);
    const _sortedDocs = Flow.Dataflow.lift(_docs, docs => lodash.sortBy(docs, doc => -doc.date().getTime()));
    const _hasDocs = Flow.Dataflow.lift(_docs, docs => docs.length > 0);
    const createNotebookView = notebook => {
      const _name = notebook.name;
      const _date = Flow.Dataflow.signal(new Date(notebook.timestamp_millis));
      const _fromNow = Flow.Dataflow.lift(_date, Flow.Util.fromNow);
      const load = () => _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
        acceptCaption: 'Load Notebook',
        declineCaption: 'Cancel'
      }, accept => {
        if (accept) {
          return _.load(_name);
        }
      });
      const purge = () => _.confirm(`Are you sure you want to delete this notebook?\n"${ _name }"`, {
        acceptCaption: 'Delete',
        declineCaption: 'Keep'
      }, accept => {
        if (accept) {
          return _.requestDeleteObject('notebook', _name, error => {
            let _ref;
            if (error) {
              _ref = error.message;
              return _.alert(_ref != null ? _ref : error);
            }
            _docs.remove(self);
            return _.growl('Notebook deleted.');
          });
        }
      });
      const self = {
        name: _name,
        date: _date,
        fromNow: _fromNow,
        load,
        purge
      };
      return self;
    };
    const loadNotebooks = () => _.requestObjects('notebook', (error, notebooks) => {
      if (error) {
        return console.debug(error);
      }
      // XXX sort
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
    const Flow = window.Flow;
    const _mode = Flow.Dataflow.signal('help');
    const _outline = flowOutline(_, cells);
    const _isOutlineMode = Flow.Dataflow.lift(_mode, mode => mode === 'outline');
    const switchToOutline = () => _mode('outline');
    const _browser = flowBrowser(_);
    const _isBrowserMode = Flow.Dataflow.lift(_mode, mode => mode === 'browser');
    const switchToBrowser = () => _mode('browser');
    const _clipboard = Flow.clipboard(_);
    const _isClipboardMode = Flow.Dataflow.lift(_mode, mode => mode === 'clipboard');
    const switchToClipboard = () => _mode('clipboard');
    const _help = Flow.help(_);
    const _isHelpMode = Flow.Dataflow.lift(_mode, mode => mode === 'help');
    const switchToHelp = () => _mode('help');
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
    const lodash = window._;
    const Flow = window.Flow;
    if (type == null) {
      type = 'cs';
    }
    if (input == null) {
      input = '';
    }
    const _guid = lodash.uniqueId();
    const _type = Flow.Dataflow.signal(type);
    const _render = Flow.Dataflow.lift(_type, type => _renderers[type](_guid));
    const _isCode = Flow.Dataflow.lift(_render, render => render.isCode);
    const _isSelected = Flow.Dataflow.signal(false);
    const _isActive = Flow.Dataflow.signal(false);
    const _hasError = Flow.Dataflow.signal(false);
    const _isBusy = Flow.Dataflow.signal(false);
    const _isReady = Flow.Dataflow.lift(_isBusy, isBusy => !isBusy);
    const _time = Flow.Dataflow.signal('');
    const _hasInput = Flow.Dataflow.signal(true);
    const _input = Flow.Dataflow.signal(input);
    const _outputs = Flow.Dataflow.signals([]);
    // Only for headless use.
    const _errors = [];
    const _result = Flow.Dataflow.signal(null);
    const _hasOutput = Flow.Dataflow.lift(_outputs, outputs => outputs.length > 0);
    const _isInputVisible = Flow.Dataflow.signal(true);
    const _isOutputHidden = Flow.Dataflow.signal(false);

    // This is a shim for ko binding handlers to attach methods to
    // The ko 'cursorPosition' custom binding attaches a getCursorPosition() method to this.
    // The ko 'autoResize' custom binding attaches an autoResize() method to this.
    const _actions = {};

    // select and display input when activated
    Flow.Dataflow.act(_isActive, isActive => {
      if (isActive) {
        _.selectCell(self);
        _hasInput(true);
        if (!_isCode()) {
          _outputs([]);
        }
      }
    });

    // deactivate when deselected
    Flow.Dataflow.act(_isSelected, isSelected => {
      if (!isSelected) {
        return _isActive(false);
      }
    });

    // tied to mouse-clicks on the cell
    const select = () => {
      // pass scrollIntoView=false,
      // otherwise mouse actions like clicking on a form field will cause scrolling.
      _.selectCell(self, false);
      // Explicitly return true, otherwise ko will prevent the mouseclick event from bubbling up
      return true;
    };

    // tied to mouse-clicks in the outline view
    const navigate = () => {
      _.selectCell(self);
      // Explicitly return true, otherwise ko will prevent the mouseclick event from bubbling up
      return true;
    };

    // tied to mouse-double-clicks on html content
    // TODO
    const activate = () => _isActive(true);
    const clip = () => _.saveClip('user', _type(), _input());
    const toggleInput = () => _isInputVisible(!_isInputVisible());
    const toggleOutput = () => _isOutputHidden(!_isOutputHidden());
    const clear = () => {
      _result(null);
      _outputs([]);
      // Only for headless use
      _errors.length = 0;
      _hasError(false);
      if (!_isCode()) {
        return _hasInput(true);
      }
    };
    const execute = go => {
      const startTime = Date.now();
      _time(`Started at ${ Flow.Util.formatClockTime(startTime) }`);
      input = _input().trim();
      if (!input) {
        if (go) {
          return go(null);
        }
        return void 0;
      }
      const render = _render();
      _isBusy(true);
      clear();
      if (_type() === 'sca') {
        // escape backslashes
        input = input.replace(/\\/g, '\\\\');
        // escape quotes
        input = input.replace(/'/g, '\\\'');
        // escape new-lines
        input = input.replace(/\n/g, '\\n');
        // pass the cell body as an argument, representing the scala code, to the appropriate function
        input = `runScalaCode ${ _.scalaIntpId() }, \'${ input }\'`;
      }
      render(input, {
        data(result) {
          return _outputs.push(result);
        },
        close(result) {
          // XXX push to cell output
          return _result(result);
        },
        error(error) {
          _hasError(true);
          if (error.name === 'FlowError') {
            // XXX review
            _outputs.push(Flow.failure(_, error));
          } else {
            _outputs.push({
              text: JSON.stringify(error, null, 2),
              template: 'flow-raw'
            });
          }
          // Only for headless use
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
    const self = {
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
    return self;
  }

  function flowFileOpenDialog(_, _go) {
    const Flow = window.Flow;
    const H2O = window.H2O;
    const _overwrite = Flow.Dataflow.signal(false);
    const _form = Flow.Dataflow.signal(null);
    const _file = Flow.Dataflow.signal(null);
    const _canAccept = Flow.Dataflow.lift(_file, file => {
      if (file != null ? file.name : void 0) {
        return H2O.Util.validateFileExtension(file.name, '.flow');
      }
      return false;
    });
    const checkIfNameIsInUse = (name, go) => _.requestObjectExists('notebook', name, (error, exists) => go(exists));
    const uploadFile = basename => _.requestUploadObject('notebook', basename, new FormData(_form()), (error, filename) => _go({
      error,
      filename
    }));
    const accept = () => {
      let basename;
      const file = _file();
      if (file) {
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
    const decline = () => _go(null);
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
    const Flow = window.Flow;
    const _form = Flow.Dataflow.signal(null);
    const _file = Flow.Dataflow.signal(null);
    const uploadFile = key => _.requestUploadFile(key, new FormData(_form()), (error, result) => _go({
      error,
      result
    }));
    const accept = () => {
      const file = _file();
      if (file) {
        return uploadFile(file.name);
      }
    };
    const decline = () => _go(null);
    return {
      form: _form,
      file: _file,
      accept,
      decline,
      template: 'file-upload-dialog'
    };
  }

  function flowMarkdown(_) {
    const marked = window.marked;
    const render = (input, output) => {
      let error;
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

  const flowPrelude$46 = flowPreludeFunction();

  function notebook() {
    const lodash = window._;
    const Flow = window.Flow;
    const Mousetrap = window.Mousetrap;
    const $ = window.jQuery;
    const __slice = [].slice;
    Flow.renderers = (_, _sandbox) => ({
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
    Flow.notebook = (_, _renderers) => {
      let menuCell;
      let _clipboardCell;
      let _lastDeletedCell;
      let _selectedCell;
      let _selectedCellIndex;
      const _localName = Flow.Dataflow.signal('Untitled Flow');
      Flow.Dataflow.react(_localName, name => {
        document.title = `H2O${ name && name.trim() ? `- ${ name }` : '' }`;
        return document.title;
      });
      const _remoteName = Flow.Dataflow.signal(null);
      const _isEditingName = Flow.Dataflow.signal(false);
      const editName = () => _isEditingName(true);
      const saveName = () => _isEditingName(false);
      const _cells = Flow.Dataflow.signals([]);
      _selectedCell = null;
      _selectedCellIndex = -1;
      _clipboardCell = null;
      _lastDeletedCell = null;
      const _areInputsHidden = Flow.Dataflow.signal(false);
      const _areOutputsHidden = Flow.Dataflow.signal(false);
      const _isSidebarHidden = Flow.Dataflow.signal(false);
      const _isRunningAll = Flow.Dataflow.signal(false);
      const _runningCaption = Flow.Dataflow.signal('Running');
      const _runningPercent = Flow.Dataflow.signal('0%');
      const _runningCellInput = Flow.Dataflow.signal('');
      const _status = flowStatus(_);
      const _sidebar = flowSidebar(_, _cells);
      const _about = Flow.about(_);
      const _dialogs = Flow.dialogs(_);

      // initialize the interpreter when the notebook is created
      // one interpreter is shared by all scala cells
      const _initializeInterpreter = () => _.requestScalaIntp((error, response) => {
        if (error) {
          // Handle the error
          return _.scalaIntpId(-1);
        }
        return _.scalaIntpId(response.sessionId);
      });
      const serialize = () => {
        let cell;
        const cells = (() => {
          let _i;
          let _len;
          const _ref = _cells();
          const _results = [];
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
      const deserialize = (localName, remoteName, doc) => {
        let cell;
        let _i;
        let _len;
        _localName(localName);
        _remoteName(remoteName);
        const cells = (() => {
          let _i;
          let _len;
          const _ref = doc.cells;
          const _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cell = _ref[_i];
            _results.push(createCell(cell.type, cell.input));
          }
          return _results;
        })();
        _cells(cells);
        selectCell(lodash.head(cells));

        // Execute all non-code cells (headings, markdown, etc.)
        const _ref = _cells();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cell = _ref[_i];
          if (!cell.isCode()) {
            cell.execute();
          }
        }
      };
      function createCell(type, input) {
        if (type == null) {
          type = 'cs';
        }
        if (input == null) {
          input = '';
        }
        return flowCell(_, _renderers, type, input);
      }
      const checkConsistency = () => {
        let cell;
        let i;
        let selectionCount;
        let _i;
        let _len;
        selectionCount = 0;
        const _ref = _cells();
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          cell = _ref[i];
          if (!cell) {
            console.error(`index ${ i } is empty`);
          } else {
            if (cell.isSelected()) {
              selectionCount++;
            }
          }
        }
        if (selectionCount !== 1) {
          console.error(`selected cell count = ${ selectionCount }`);
        }
      };
      function selectCell(target, scrollIntoView, scrollImmediately) {
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
        // TODO also set focus so that tabs don't jump to the first cell
        _selectedCell.isSelected(true);
        _selectedCellIndex = _cells.indexOf(_selectedCell);
        checkConsistency();
        if (scrollIntoView) {
          lodash.defer(() => _selectedCell.scrollIntoView(scrollImmediately));
        }
        return _selectedCell;
      }
      const cloneCell = cell => createCell(cell.type(), cell.input());
      const switchToCommandMode = () => _selectedCell.isActive(false);
      const switchToEditMode = () => {
        _selectedCell.isActive(true);
        return false;
      };
      const convertCellToCode = () => _selectedCell.type('cs');
      const convertCellToHeading = level => () => {
        _selectedCell.type(`h${ level }`);
        return _selectedCell.execute();
      };
      const convertCellToMarkdown = () => {
        _selectedCell.type('md');
        return _selectedCell.execute();
      };
      const convertCellToRaw = () => {
        _selectedCell.type('raw');
        return _selectedCell.execute();
      };
      const convertCellToScala = () => _selectedCell.type('sca');
      const copyCell = () => {
        _clipboardCell = _selectedCell;
        return _clipboardCell;
      };
      const cutCell = () => {
        copyCell();
        return removeCell();
      };
      const deleteCell = () => {
        _lastDeletedCell = _selectedCell;
        return removeCell();
      };
      function removeCell() {
        let removedCell;
        const cells = _cells();
        if (cells.length > 1) {
          if (_selectedCellIndex === cells.length - 1) {
            // TODO call dispose() on this cell
            removedCell = lodash.head(_cells.splice(_selectedCellIndex, 1));
            selectCell(cells[_selectedCellIndex - 1]);
          } else {
            // TODO call dispose() on this cell
            removedCell = lodash.head(_cells.splice(_selectedCellIndex, 1));
            selectCell(cells[_selectedCellIndex]);
          }
          if (removedCell) {
            _.saveClip('trash', removedCell.type(), removedCell.input());
          }
        }
      }
      const insertCell = (index, cell) => {
        _cells.splice(index, 0, cell);
        selectCell(cell);
        return cell;
      };
      const insertAbove = cell => insertCell(_selectedCellIndex, cell);
      const insertBelow = cell => insertCell(_selectedCellIndex + 1, cell);
      const appendCell = cell => insertCell(_cells().length, cell);
      const insertCellAbove = (type, input) => insertAbove(createCell(type, input));
      const insertCellBelow = (type, input) => insertBelow(createCell(type, input));
      const insertNewCellAbove = () => insertAbove(createCell('cs'));
      const insertNewCellBelow = () => insertBelow(createCell('cs'));
      const insertNewScalaCellAbove = () => insertAbove(createCell('sca'));
      const insertNewScalaCellBelow = () => insertBelow(createCell('sca'));
      const insertCellAboveAndRun = (type, input) => {
        const cell = insertAbove(createCell(type, input));
        cell.execute();
        return cell;
      };
      const insertCellBelowAndRun = (type, input) => {
        const cell = insertBelow(createCell(type, input));
        cell.execute();
        return cell;
      };
      const appendCellAndRun = (type, input) => {
        const cell = appendCell(createCell(type, input));
        cell.execute();
        return cell;
      };
      const moveCellDown = () => {
        const cells = _cells();
        if (_selectedCellIndex !== cells.length - 1) {
          _cells.splice(_selectedCellIndex, 1);
          _selectedCellIndex++;
          _cells.splice(_selectedCellIndex, 0, _selectedCell);
        }
      };
      const moveCellUp = () => {
        let cells;
        if (_selectedCellIndex !== 0) {
          cells = _cells();
          _cells.splice(_selectedCellIndex, 1);
          _selectedCellIndex--;
          _cells.splice(_selectedCellIndex, 0, _selectedCell);
        }
      };
      const mergeCellBelow = () => {
        let nextCell;
        const cells = _cells();
        if (_selectedCellIndex !== cells.length - 1) {
          nextCell = cells[_selectedCellIndex + 1];
          if (_selectedCell.type() === nextCell.type()) {
            nextCell.input(`${ _selectedCell.input() }\n${ nextCell.input() }`);
            removeCell();
          }
        }
      };
      const splitCell = () => {
        let cursorPosition;
        let input;
        let left;
        let right;
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
      const pasteCellAbove = () => {
        if (_clipboardCell) {
          return insertCell(_selectedCellIndex, cloneCell(_clipboardCell));
        }
      };
      const pasteCellBelow = () => {
        if (_clipboardCell) {
          return insertCell(_selectedCellIndex + 1, cloneCell(_clipboardCell));
        }
      };
      const undoLastDelete = () => {
        if (_lastDeletedCell) {
          insertCell(_selectedCellIndex + 1, _lastDeletedCell);
        }
        _lastDeletedCell = null;
        return _lastDeletedCell;
      };
      const runCell = () => {
        _selectedCell.execute();
        return false;
      };
      const runCellAndInsertBelow = () => {
        _selectedCell.execute(() => insertNewCellBelow());
        return false;
      };
      // ipython has inconsistent behavior here.
      // seems to be doing runCellAndInsertBelow if executed on the lowermost cell.
      const runCellAndSelectBelow = () => {
        _selectedCell.execute(() => selectNextCell());
        return false;
      };
      const checkIfNameIsInUse = (name, go) => _.requestObjectExists('notebook', name, (error, exists) => go(exists));
      const storeNotebook = (localName, remoteName) => _.requestPutObject('notebook', localName, serialize(), error => {
        if (error) {
          return _.alert(`Error saving notebook: ${ error.message }`);
        }
        _remoteName(localName);
        _localName(localName);

        // renamed document
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
      const saveNotebook = () => {
        const localName = Flow.Util.sanitizeName(_localName());
        if (localName === '') {
          return _.alert('Invalid notebook name.');
        }

        // saved document
        const remoteName = _remoteName();
        if (remoteName) {
          storeNotebook(localName, remoteName);
        }
        // unsaved document
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
      const promptForNotebook = () => _.dialog(flowFileOpenDialog, result => {
        let error;
        let filename;
        let _ref;
        if (result) {
          error = result.error;
          filename = result.filename;
          if (error) {
            _ref = error.message;
            return _.growl(_ref != null ? _ref : error);
          }
          loadNotebook(filename);
          return _.loaded();
        }
      });
      const uploadFile = () => _.dialog(flowFileUploadDialog, result => {
        let error;
        let _ref;
        if (result) {
          error = result.error;
          if (error) {
            _ref = error.message;
            return _.growl(_ref != null ? _ref : error);
          }
          _.growl('File uploaded successfully!');
          return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${ flowPrelude$46.stringify(result.result.destination_frame) }]`);
        }
      });
      const toggleInput = () => _selectedCell.toggleInput();
      const toggleOutput = () => _selectedCell.toggleOutput();
      const toggleAllInputs = () => {
        let cell;
        let _i;
        let _len;
        let _ref;
        const wereHidden = _areInputsHidden();
        _areInputsHidden(!wereHidden);
        //
        // If cells are generated while inputs are hidden, the input boxes
        //   do not resize to fit contents. So explicitly ask all cells
        //   to resize themselves.
        //
        if (wereHidden) {
          _ref = _cells();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cell = _ref[_i];
            cell.autoResize();
          }
        }
      };
      const toggleAllOutputs = () => _areOutputsHidden(!_areOutputsHidden());
      const toggleSidebar = () => _isSidebarHidden(!_isSidebarHidden());
      const showBrowser = () => {
        _isSidebarHidden(false);
        return _.showBrowser();
      };
      const showOutline = () => {
        _isSidebarHidden(false);
        return _.showOutline();
      };
      const showClipboard = () => {
        _isSidebarHidden(false);
        return _.showClipboard();
      };
      function selectNextCell() {
        const cells = _cells();
        if (_selectedCellIndex !== cells.length - 1) {
          selectCell(cells[_selectedCellIndex + 1]);
        }
        // prevent arrow keys from scrolling the page
        return false;
      }
      const selectPreviousCell = () => {
        let cells;
        if (_selectedCellIndex !== 0) {
          cells = _cells();
          selectCell(cells[_selectedCellIndex - 1]);
        }
        // prevent arrow keys from scrolling the page
        return false;
      };
      const displayKeyboardShortcuts = () => $('#keyboardHelpDialog').modal();
      const findBuildProperty = caption => {
        let entry;
        if (Flow.BuildProperties) {
          entry = lodash.find(Flow.BuildProperties, entry => entry.caption === caption);
          if (entry) {
            return entry.value;
          }
          return void 0;
        }
        return void 0;
      };
      const getBuildProperties = () => {
        const projectVersion = findBuildProperty('H2O Build project version');
        return [findBuildProperty('H2O Build git branch'), projectVersion, projectVersion ? lodash.last(projectVersion.split('.')) : void 0, findBuildProperty('H2O Build git hash') || 'master'];
      };
      const displayDocumentation = () => {
        const _ref = getBuildProperties();
        const gitBranch = _ref[0];
        const projectVersion = _ref[1];
        const buildVersion = _ref[2];
        const gitHash = _ref[3];
        if (buildVersion && buildVersion !== '99999') {
          return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${ gitBranch }/${ buildVersion }/docs-website/h2o-docs/index.html`, '_blank');
        }
        return window.open(`https://github.com/h2oai/h2o-3/blob/${ gitHash }/h2o-docs/src/product/flow/README.md`, '_blank');
      };
      const displayFAQ = () => {
        const _ref = getBuildProperties();
        const gitBranch = _ref[0];
        const projectVersion = _ref[1];
        const buildVersion = _ref[2];
        const gitHash = _ref[3];
        if (buildVersion && buildVersion !== '99999') {
          return window.open(`http://h2o-release.s3.amazonaws.com/h2o/${ gitBranch }/${ buildVersion }/docs-website/h2o-docs/index.html`, '_blank');
        }
        return window.open(`https://github.com/h2oai/h2o-3/blob/${ gitHash }/h2o-docs/src/product/howto/FAQ.md`, '_blank');
      };
      const executeCommand = command => () => _.insertAndExecuteCell('cs', command);
      const displayAbout = () => $('#aboutDialog').modal();
      const shutdown = () => _.requestShutdown((error, result) => {
        if (error) {
          return _.growl(`Shutdown failed: ${ error.message }`, 'danger');
        }
        return _.growl('Shutdown complete!', 'warning');
      });
      const showHelp = () => {
        _isSidebarHidden(false);
        return _.showHelp();
      };
      const createNotebook = () => _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
        acceptCaption: 'Create New Notebook',
        declineCaption: 'Cancel'
      }, accept => {
        let currentTime;
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
      const duplicateNotebook = () => deserialize(`Copy of ${ _localName() }`, null, serialize());
      const openNotebook = (name, doc) => deserialize(name, null, doc);
      function loadNotebook(name) {
        return _.requestObject('notebook', name, (error, doc) => {
          let _ref;
          if (error) {
            _ref = error.message;
            return _.alert(_ref != null ? _ref : error);
          }
          return deserialize(name, name, doc);
        });
      }

      const exportNotebook = () => {
        const remoteName = _remoteName();
        if (remoteName) {
          return window.open(`/3/NodePersistentStorage.bin/notebook/${ remoteName }`, '_blank');
        }
        return _.alert('Please save this notebook before exporting.');
      };
      const goToH2OUrl = url => () => window.open(window.Flow.ContextPath + url, '_blank');
      const goToUrl = url => () => window.open(url, '_blank');
      const executeAllCells = (fromBeginning, go) => {
        let cellIndex;
        let cells;
        _isRunningAll(true);
        cells = _cells().slice(0);
        const cellCount = cells.length;
        cellIndex = 0;
        if (!fromBeginning) {
          cells = cells.slice(_selectedCellIndex);
          cellIndex = _selectedCellIndex;
        }
        const executeNextCell = () => {
          let cell;
          // will be false if user-aborted
          if (_isRunningAll()) {
            cell = cells.shift();
            if (cell) {
              // Scroll immediately without affecting selection state.
              cell.scrollIntoView(true);
              cellIndex++;
              _runningCaption(`Running cell ${ cellIndex } of ${ cellCount }`);
              _runningPercent(`${ Math.floor(100 * cellIndex / cellCount) }%`);
              _runningCellInput(cell.input());
              // TODO Continuation should be EFC, and passing an error should abort 'run all'
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
      const runAllCells = fromBeginning => {
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
              // 'done'
              return _.growl('Finished running your flow!', 'success');
          }
        });
      };
      const continueRunningAllCells = () => runAllCells(false);
      const stopRunningAll = () => _isRunningAll(false);
      const clearCell = () => {
        _selectedCell.clear();
        return _selectedCell.autoResize();
      };
      const clearAllCells = () => {
        let cell;
        let _i;
        let _len;
        const _ref = _cells();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cell = _ref[_i];
          cell.clear();
          cell.autoResize();
        }
      };
      // noop
      const notImplemented = () => {};
      const pasteCellandReplace = notImplemented;
      const mergeCellAbove = notImplemented;
      const startTour = notImplemented;

      //
      // Top menu bar
      //
      const createMenu = (label, items) => ({
        label,
        items
      });
      const createMenuHeader = label => ({
        label,
        action: null
      });
      const createShortcutHint = shortcut => `<span style=\'float:right\'>${ lodash.map(shortcut, key => `<kbd>${ key }</kbd>`).join(' ') }</span>`;
      const createMenuItem = (label, action, shortcut) => {
        const kbds = shortcut ? createShortcutHint(shortcut) : '';
        return {
          label: `${ lodash.escape(label) }${ kbds }`,
          action
        };
      };
      const menuDivider = {
        label: null,
        action: null
      };
      const _menus = Flow.Dataflow.signal(null);
      menuCell = [createMenuItem('Run Cell', runCell, ['ctrl', 'enter']), menuDivider, createMenuItem('Cut Cell', cutCell, ['x']), createMenuItem('Copy Cell', copyCell, ['c']), createMenuItem('Paste Cell Above', pasteCellAbove, ['shift', 'v']), createMenuItem('Paste Cell Below', pasteCellBelow, ['v']),
      // TODO createMenuItem('Paste Cell and Replace', pasteCellandReplace, true),
      createMenuItem('Delete Cell', deleteCell, ['d', 'd']), createMenuItem('Undo Delete Cell', undoLastDelete, ['z']), menuDivider, createMenuItem('Move Cell Up', moveCellUp, ['ctrl', 'k']), createMenuItem('Move Cell Down', moveCellDown, ['ctrl', 'j']), menuDivider, createMenuItem('Insert Cell Above', insertNewCellAbove, ['a']), createMenuItem('Insert Cell Below', insertNewCellBelow, ['b']),
      // TODO createMenuItem('Split Cell', splitCell),
      // TODO createMenuItem('Merge Cell Above', mergeCellAbove, true),
      // TODO createMenuItem('Merge Cell Below', mergeCellBelow),
      menuDivider, createMenuItem('Toggle Cell Input', toggleInput), createMenuItem('Toggle Cell Output', toggleOutput, ['o']), createMenuItem('Clear Cell Output', clearCell)];
      const menuCellSW = [menuDivider, createMenuItem('Insert Scala Cell Above', insertNewScalaCellAbove), createMenuItem('Insert Scala Cell Below', insertNewScalaCellBelow)];
      if (_.onSparklingWater) {
        menuCell = __slice.call(menuCell).concat(__slice.call(menuCellSW));
      }
      const initializeMenus = builder => {
        const modelMenuItems = lodash.map(builder, builder => createMenuItem(`${ builder.algo_full_name }...`, executeCommand(`buildModel ${ flowPrelude$46.stringify(builder.algo) }`))).concat([menuDivider, createMenuItem('List All Models', executeCommand('getModels')), createMenuItem('List Grid Search Results', executeCommand('getGrids')), createMenuItem('Import Model...', executeCommand('importModel')), createMenuItem('Export Model...', executeCommand('exportModel'))]);
        return [createMenu('Flow', [createMenuItem('New Flow', createNotebook), createMenuItem('Open Flow...', promptForNotebook), createMenuItem('Save Flow', saveNotebook, ['s']), createMenuItem('Make a Copy...', duplicateNotebook), menuDivider, createMenuItem('Run All Cells', runAllCells), createMenuItem('Run All Cells Below', continueRunningAllCells), menuDivider, createMenuItem('Toggle All Cell Inputs', toggleAllInputs), createMenuItem('Toggle All Cell Outputs', toggleAllOutputs), createMenuItem('Clear All Cell Outputs', clearAllCells), menuDivider, createMenuItem('Download this Flow...', exportNotebook)]), createMenu('Cell', menuCell), createMenu('Data', [createMenuItem('Import Files...', executeCommand('importFiles')), createMenuItem('Upload File...', uploadFile), createMenuItem('Split Frame...', executeCommand('splitFrame')), createMenuItem('Merge Frames...', executeCommand('mergeFrames')), menuDivider, createMenuItem('List All Frames', executeCommand('getFrames')), menuDivider, createMenuItem('Impute...', executeCommand('imputeColumn'))]), createMenu('Model', modelMenuItems), createMenu('Score', [createMenuItem('Predict...', executeCommand('predict')), createMenuItem('Partial Dependence Plots...', executeCommand('buildPartialDependence')), menuDivider, createMenuItem('List All Predictions', executeCommand('getPredictions'))]), createMenu('Admin', [createMenuItem('Jobs', executeCommand('getJobs')), createMenuItem('Cluster Status', executeCommand('getCloud')), createMenuItem('Water Meter (CPU meter)', goToH2OUrl('perfbar.html')), menuDivider, createMenuHeader('Inspect Log'), createMenuItem('View Log', executeCommand('getLogFile')), createMenuItem('Download Logs', goToH2OUrl('3/Logs/download')), menuDivider, createMenuHeader('Advanced'), createMenuItem('Create Synthetic Frame...', executeCommand('createFrame')), createMenuItem('Stack Trace', executeCommand('getStackTrace')), createMenuItem('Network Test', executeCommand('testNetwork')),
        // TODO Cluster I/O
        createMenuItem('Profiler', executeCommand('getProfile depth: 10')), createMenuItem('Timeline', executeCommand('getTimeline')),
        // TODO UDP Drop Test
        // TODO Task Status
        createMenuItem('Shut Down', shutdown)]), createMenu('Help', [
        // TODO createMenuItem('Tour', startTour, true),
        createMenuItem('Assist Me', executeCommand('assist')), menuDivider, createMenuItem('Contents', showHelp), createMenuItem('Keyboard Shortcuts', displayKeyboardShortcuts, ['h']), menuDivider, createMenuItem('Documentation', displayDocumentation), createMenuItem('FAQ', displayFAQ), createMenuItem('H2O.ai', goToUrl('http://h2o.ai/')), createMenuItem('H2O on Github', goToUrl('https://github.com/h2oai/h2o-3')), createMenuItem('Report an issue', goToUrl('http://jira.h2o.ai')), createMenuItem('Forum / Ask a question', goToUrl('https://groups.google.com/d/forum/h2ostream')), menuDivider,
        // TODO Tutorial Flows
        createMenuItem('About', displayAbout)])];
      };
      const setupMenus = () => _.requestModelBuilders((error, builders) => _menus(initializeMenus(error ? [] : builders)));
      const createTool = (icon, label, action, isDisabled) => {
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
      const _toolbar = [[createTool('file-o', 'New', createNotebook), createTool('folder-open-o', 'Open', promptForNotebook), createTool('save', 'Save (s)', saveNotebook)], [createTool('plus', 'Insert Cell Below (b)', insertNewCellBelow), createTool('arrow-up', 'Move Cell Up (ctrl+k)', moveCellUp), createTool('arrow-down', 'Move Cell Down (ctrl+j)', moveCellDown)], [createTool('cut', 'Cut Cell (x)', cutCell), createTool('copy', 'Copy Cell (c)', copyCell), createTool('paste', 'Paste Cell Below (v)', pasteCellBelow), createTool('eraser', 'Clear Cell', clearCell), createTool('trash-o', 'Delete Cell (d d)', deleteCell)], [createTool('step-forward', 'Run and Select Below', runCellAndSelectBelow), createTool('play', 'Run (ctrl+enter)', runCell), createTool('forward', 'Run All', runAllCells)], [createTool('question-circle', 'Assist Me', executeCommand('assist'))]];

      // (From IPython Notebook keyboard shortcuts dialog)
      //
      // The IPython Notebook has two different keyboard input modes.
      // Edit mode allows you to type code/text into a cell
      // and is indicated by a green cell border.
      // Command mode binds the keyboard to notebook level
      // actions and is indicated by a grey cell border.
      //
      // Command Mode (press Esc to enable)
      //
      const normalModeKeyboardShortcuts = [['enter', 'edit mode', switchToEditMode],
      // [ 'shift+enter', 'run cell, select below', runCellAndSelectBelow ]
      // [ 'ctrl+enter', 'run cell', runCell ]
      // [ 'alt+enter', 'run cell, insert below', runCellAndInsertBelow ]
      ['y', 'to code', convertCellToCode], ['m', 'to markdown', convertCellToMarkdown], ['r', 'to raw', convertCellToRaw], ['1', 'to heading 1', convertCellToHeading(1)], ['2', 'to heading 2', convertCellToHeading(2)], ['3', 'to heading 3', convertCellToHeading(3)], ['4', 'to heading 4', convertCellToHeading(4)], ['5', 'to heading 5', convertCellToHeading(5)], ['6', 'to heading 6', convertCellToHeading(6)], ['up', 'select previous cell', selectPreviousCell], ['down', 'select next cell', selectNextCell], ['k', 'select previous cell', selectPreviousCell], ['j', 'select next cell', selectNextCell], ['ctrl+k', 'move cell up', moveCellUp], ['ctrl+j', 'move cell down', moveCellDown], ['a', 'insert cell above', insertNewCellAbove], ['b', 'insert cell below', insertNewCellBelow], ['x', 'cut cell', cutCell], ['c', 'copy cell', copyCell], ['shift+v', 'paste cell above', pasteCellAbove], ['v', 'paste cell below', pasteCellBelow], ['z', 'undo last delete', undoLastDelete], ['d d', 'delete cell (press twice)', deleteCell], ['shift+m', 'merge cell below', mergeCellBelow], ['s', 'save notebook', saveNotebook],
      // [ 'mod+s', 'save notebook', saveNotebook ]
      // [ 'l', 'toggle line numbers' ]
      ['o', 'toggle output', toggleOutput],
      // [ 'shift+o', 'toggle output scrolling' ]
      ['h', 'keyboard shortcuts', displayKeyboardShortcuts]];

      if (_.onSparklingWater) {
        normalModeKeyboardShortcuts.push(['q', 'to Scala', convertCellToScala]);
      }

      //
      // Edit Mode (press Enter to enable)
      //
      const editModeKeyboardShortcuts = [
      // Tab : code completion or indent
      // Shift-Tab : tooltip
      // Cmd-] : indent
      // Cmd-[ : dedent
      // Cmd-a : select all
      // Cmd-z : undo
      // Cmd-Shift-z : redo
      // Cmd-y : redo
      // Cmd-Up : go to cell start
      // Cmd-Down : go to cell end
      // Opt-Left : go one word left
      // Opt-Right : go one word right
      // Opt-Backspace : del word before
      // Opt-Delete : del word after
      ['esc', 'command mode', switchToCommandMode], ['ctrl+m', 'command mode', switchToCommandMode], ['shift+enter', 'run cell, select below', runCellAndSelectBelow], ['ctrl+enter', 'run cell', runCell], ['alt+enter', 'run cell, insert below', runCellAndInsertBelow], ['ctrl+shift+-', 'split cell', splitCell], ['mod+s', 'save notebook', saveNotebook]];
      const toKeyboardHelp = shortcut => {
        const seq = shortcut[0];
        const caption = shortcut[1];
        const keystrokes = lodash.map(seq.split(/\+/g), key => `<kbd>${ key }</kbd>`).join(' ');
        return {
          keystrokes,
          caption
        };
      };
      const normalModeKeyboardShortcutsHelp = lodash.map(normalModeKeyboardShortcuts, toKeyboardHelp);
      const editModeKeyboardShortcutsHelp = lodash.map(editModeKeyboardShortcuts, toKeyboardHelp);
      const setupKeyboardHandling = mode => {
        let caption;
        let f;
        let shortcut;
        let _i;
        let _j;
        let _len;
        let _len1;
        let _ref;
        let _ref1;
        for (_i = 0, _len = normalModeKeyboardShortcuts.length; _i < _len; _i++) {
          _ref = normalModeKeyboardShortcuts[_i];
          shortcut = _ref[0];
          caption = _ref[1];
          f = _ref[2];
          Mousetrap.bind(shortcut, f);
        }
        for (_j = 0, _len1 = editModeKeyboardShortcuts.length; _j < _len1; _j++) {
          _ref1 = editModeKeyboardShortcuts[_j];
          shortcut = _ref1[0];
          caption = _ref1[1];
          f = _ref1[2];
          Mousetrap.bindGlobal(shortcut, f);
        }
      };
      const initialize = () => {
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
        // TODO setPristine() when autosave is implemented.
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
    const Flow = window.Flow;
    const traceCauses = (error, causes) => {
      causes.push(error.message);
      if (error.cause) {
        traceCauses(error.cause, causes);
      }
      return causes;
    };
    Flow.failure = (_, error) => {
      const causes = traceCauses(error, []);
      const message = causes.shift();
      const _isStackVisible = Flow.Dataflow.signal(false);
      const toggleStack = () => _isStackVisible(!_isStackVisible());
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

  const flowPrelude$47 = flowPreludeFunction();

  function clipboard() {
    const lodash = window._;
    const Flow = window.Flow;
    const SystemClips = ['assist', 'importFiles', 'getFrames', 'getModels', 'getPredictions', 'getJobs', 'buildModel', 'predict'];
    Flow.clipboard = _ => {
      const lengthOf = array => {
        if (array.length) {
          return `(${ array.length })`;
        }
        return '';
      };
      const _systemClips = Flow.Dataflow.signals([]);
      const _systemClipCount = Flow.Dataflow.lift(_systemClips, lengthOf);
      const _userClips = Flow.Dataflow.signals([]);
      const _userClipCount = Flow.Dataflow.lift(_userClips, lengthOf);
      const _hasUserClips = Flow.Dataflow.lift(_userClips, clips => clips.length > 0);
      const _trashClips = Flow.Dataflow.signals([]);
      const _trashClipCount = Flow.Dataflow.lift(_trashClips, lengthOf);
      const _hasTrashClips = Flow.Dataflow.lift(_trashClips, clips => clips.length > 0);
      const createClip = (_list, _type, _input, _canRemove) => {
        if (_canRemove == null) {
          _canRemove = true;
        }
        const execute = () => _.insertAndExecuteCell(_type, _input);
        const insert = () => _.insertCell(_type, _input);
        flowPrelude$47.remove = () => {
          if (_canRemove) {
            return removeClip(_list, self);
          }
        };
        const self = {
          type: _type,
          input: _input,
          execute,
          insert,
          remove: flowPrelude$47.remove,
          canRemove: _canRemove
        };
        return self;
      };
      const addClip = (list, type, input) => list.push(createClip(list, type, input));
      function removeClip(list, clip) {
        if (list === _userClips) {
          _userClips.remove(clip);
          saveUserClips();
          return _trashClips.push(createClip(_trashClips, clip.type, clip.input));
        }
        return _trashClips.remove(clip);
      }
      const emptyTrash = () => _trashClips.removeAll();
      const loadUserClips = () => _.requestObjectExists('environment', 'clips', (error, exists) => {
        if (exists) {
          return _.requestObject('environment', 'clips', (error, doc) => {
            if (!error) {
              return _userClips(lodash.map(doc.clips, clip => createClip(_userClips, clip.type, clip.input)));
            }
          });
        }
      });
      const serializeUserClips = () => ({
        version: '1.0.0',

        clips: lodash.map(_userClips(), clip => ({
          type: clip.type,
          input: clip.input
        }))
      });
      function saveUserClips() {
        return _.requestPutObject('environment', 'clips', serializeUserClips(), error => {
          if (error) {
            _.alert(`Error saving clips: ${ error.message }`);
          }
        });
      }
      const initialize = () => {
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
    const Flow = window.Flow;
    Flow.Version = '0.4.54';
    Flow.about = _ => {
      const _properties = Flow.Dataflow.signals([]);
      Flow.Dataflow.link(_.ready, () => {
        if (Flow.BuildProperties) {
          return _properties(Flow.BuildProperties);
        }
        return _.requestAbout((error, response) => {
          let name;
          let value;
          let _i;
          let _len;
          let _ref;
          let _ref1;
          const properties = [];
          if (!error) {
            _ref = response.entries;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              _ref1 = _ref[_i];
              name = _ref1.name;
              value = _ref1.value;
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
          Flow.BuildProperties = properties;
          return _properties(Flow.BuildProperties);
        });
      });
      return { properties: _properties };
    };
  }

  function gui$1() {
    const lodash = window._;
    const Flow = window.Flow;
    const wrapValue = (value, init) => {
      if (value === void 0) {
        return Flow.Dataflow.signal(init);
      }
      if (Flow.Dataflow.isSignal(value)) {
        return value;
      }
      return Flow.Dataflow.signal(value);
    };
    const wrapArray = elements => {
      let element;
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
    const control = (type, opts) => {
      if (!opts) {
        opts = {};
      }
      const guid = `gui_${ lodash.uniqueId() }`;
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
    const content = (type, opts) => {
      const self = control(type, opts);
      self.value = wrapValue(opts.value, '');
      return self;
    };
    const text = opts => content('text', opts);
    const html = opts => content('html', opts);
    const markdown = opts => content('markdown', opts);
    const checkbox = opts => {
      const self = control('checkbox', opts);
      self.value = wrapValue(opts.value, opts.value);
      return self;
    };

    // TODO ko supports array valued args for 'checked' - can provide a checkboxes function
    const dropdown = opts => {
      const self = control('dropdown', opts);
      self.options = opts.options || [];
      self.value = wrapValue(opts.value);
      self.caption = opts.caption || 'Choose...';
      return self;
    };
    const listbox = opts => {
      const self = control('listbox', opts);
      self.options = opts.options || [];
      self.values = wrapArray(opts.values);
      return self;
    };
    const textbox = opts => {
      const self = control('textbox', opts);
      self.value = wrapValue(opts.value, '');
      self.event = lodash.isString(opts.event) ? opts.event : null;
      return self;
    };
    const textarea = opts => {
      const self = control('textarea', opts);
      self.value = wrapValue(opts.value, '');
      self.event = lodash.isString(opts.event) ? opts.event : null;
      self.rows = lodash.isNumber(opts.rows) ? opts.rows : 5;
      return self;
    };
    const button = opts => {
      const self = control('button', opts);
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
    const Flow = window.Flow;
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
    //
    // Sparkling-Water
    //
    _.scalaIntpId = Flow.Dataflow.signal(-1);
    _.requestRDDs = Flow.Dataflow.slot();
    _.requestDataFrames = Flow.Dataflow.slot();
    _.requestScalaIntp = Flow.Dataflow.slot();
    _.requestScalaCode = Flow.Dataflow.slot();
    _.requestAsH2OFrameFromRDD = Flow.Dataflow.slot();
    _.requestAsH2OFrameFromDF = Flow.Dataflow.slot();
    _.requestAsDataFrame = Flow.Dataflow.slot();
    return _.requestAsDataFrame;
  }

  const flowPrelude$48 = flowPreludeFunction();

  function h2oProxy(_) {
    const lodash = window._;
    const Flow = window.Flow;
    const $ = window.jQuery;
    let __gridModelBuilderEndpoints;
    let __modelBuilderEndpoints;
    let __modelBuilders;
    let _storageConfiguration;
    const download = (type, url, go) => {
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
    const optsToString = opts => {
      let str;
      if (opts != null) {
        str = ` with opts ${ JSON.stringify(opts) }`;
        if (str.length > 50) {
          return `${ str.substr(0, 50) }...`;
        }
        return str;
      }
      return '';
    };
    const http = (method, path, opts, go) => {
      if (path.substring(0, 1) === '/') {
        path = window.Flow.ContextPath + path.substring(1);
      }
      _.status('server', 'request', path);
      trackPath(path);
      const req = (() => {
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
          default:
          // do nothing
        }
      })();
      req.done((data, status, xhr) => {
        let error;
        _.status('server', 'response', path);
        try {
          return go(null, data);
        } catch (_error) {
          error = _error;
          return go(new Flow.Error(`Error processing ${ method } ${ path }`, error));
        }
      });
      return req.fail((xhr, status, error) => {
        let serverError;
        _.status('server', 'error', path);
        const response = xhr.responseJSON;
        const meta = response;
        // special-case net::ERR_CONNECTION_REFUSED
        // if status is 'error' and xhr.status is 0
        const cause = (meta != null ? response.__meta : void 0) && (meta.schema_type === 'H2OError' || meta.schema_type === 'H2OModelBuilderError') ? (serverError = new Flow.Error(response.exception_msg), serverError.stack = `${ response.dev_msg } (${ response.exception_type })\n  ${ response.stacktrace.join('\n  ') }`, serverError) : (error != null ? error.message : void 0) ? new Flow.Error(error.message) : status === 'error' && xhr.status === 0 ? new Flow.Error('Could not connect to H2O. Your H2O cloud is currently unresponsive.') : new Flow.Error(`HTTP connection failure: status=${ status }, code=${ xhr.status }, error=${ error || '?' }`);
        return go(new Flow.Error(`Error calling ${ method } ${ path }${ optsToString(opts) }`, cause));
      });
    };
    const doGet = (path, go) => http('GET', path, null, go);
    const doPost = (path, opts, go) => http('POST', path, opts, go);
    const doPostJSON = (path, opts, go) => http('POSTJSON', path, opts, go);
    const doPut = (path, opts, go) => http('PUT', path, opts, go);
    const doUpload = (path, formData, go) => http('UPLOAD', path, formData, go);
    const doDelete = (path, go) => http('DELETE', path, null, go);
    function trackPath(path) {
      let base;
      let e;
      let name;
      let other;
      let root;
      let version;
      let _ref;
      let _ref1;
      try {
        _ref = path.split('/');
        root = _ref[0];
        version = _ref[1];
        name = _ref[2];
        _ref1 = name.split('?');
        base = _ref1[0];
        other = _ref1[1];
        if (base !== 'Typeahead' && base !== 'Jobs') {
          _.trackEvent('api', base, version);
        }
      } catch (_error) {
        e = _error;
      }
    }
    const mapWithKey = (obj, f) => {
      let key;
      let value;
      const result = [];
      for (key in obj) {
        if ({}.hasOwnProperty.call(obj, key)) {
          value = obj[key];
          result.push(f(value, key));
        }
      }
      return result;
    };
    const composePath = (path, opts) => {
      let params;
      if (opts) {
        params = mapWithKey(opts, (v, k) => `${ k }=${ v }`);
        return `${ path }?${ params.join('&') }`;
      }
      return path;
    };
    const requestWithOpts = (path, opts, go) => doGet(composePath(path, opts), go);
    const encodeArrayForPost = array => {
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
    const encodeObject = source => {
      let k;
      let v;
      const target = {};
      for (k in source) {
        if ({}.hasOwnProperty.call(source, k)) {
          v = source[k];
          target[k] = encodeURIComponent(v);
        }
      }
      return target;
    };
    const encodeObjectForPost = source => {
      let k;
      let v;
      const target = {};
      for (k in source) {
        if ({}.hasOwnProperty.call(source, k)) {
          v = source[k];
          target[k] = lodash.isArray(v) ? encodeArrayForPost(v) : v;
        }
      }
      return target;
    };
    const unwrap = (go, transform) => (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, transform(result));
    };
    const requestExec = (ast, go) => doPost('/99/Rapids', { ast }, (error, result) => {
      if (error) {
        return go(error);
      }
      // TODO HACK - this api returns a 200 OK on failures
      if (result.error) {
        return go(new Flow.Error(result.error));
      }
      return go(null, result);
    });
    const requestInspect = (key, go) => {
      const opts = { key: encodeURIComponent(key) };
      return requestWithOpts('/3/Inspect', opts, go);
    };
    const requestCreateFrame = (opts, go) => doPost('/3/CreateFrame', opts, go);
    const requestSplitFrame = (frameKey, splitRatios, splitKeys, go) => {
      const opts = {
        dataset: frameKey,
        ratios: encodeArrayForPost(splitRatios),
        dest_keys: encodeArrayForPost(splitKeys)
      };
      return doPost('/3/SplitFrame', opts, go);
    };
    const requestFrames = go => doGet('/3/Frames', (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, result.frames);
    });
    const requestFrame = (key, go) => doGet(`/3/Frames/${ encodeURIComponent(key) }`, unwrap(go, result => lodash.head(result.frames)));
    const requestFrameSlice = (key, searchTerm, offset, count, go) => {
      // eslint-disable-line
      // TODO send search term
      return doGet(`/3/Frames/${ encodeURIComponent(key) }?column_offset=${ offset }&column_count=${ count }`, unwrap(go, result => lodash.head(result.frames)));
    };
    const requestFrameSummary = (key, go) => doGet(`/3/Frames/${ encodeURIComponent(key) }/summary`, unwrap(go, result => lodash.head(result.frames)));
    const requestFrameSummarySlice = (key, searchTerm, offset, count, go) => doGet(`/3/Frames/${ encodeURIComponent(key) }/summary?column_offset=${ offset }&column_count=${ count }&_exclude_fields=frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, unwrap(go, result => lodash.head(result.frames)));
    const requestFrameSummaryWithoutData = (key, go) => doGet(`/3/Frames/${ encodeURIComponent(key) }/summary?_exclude_fields=frames/chunk_summary,frames/distribution_summary,frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, lodash.head(result.frames));
    });
    const requestDeleteFrame = (key, go) => doDelete(`/3/Frames/${ encodeURIComponent(key) }`, go);
    const requestExportFrame = (key, path, overwrite, go) => {
      const params = {
        path,
        force: overwrite ? 'true' : 'false'
      };
      return doPost(`/3/Frames/${ encodeURIComponent(key) }/export`, params, go);
    };
    const requestColumnSummary = (frameKey, column, go) => doGet(`/3/Frames/${ encodeURIComponent(frameKey) }/columns/${ encodeURIComponent(column) }/summary`, unwrap(go, result => lodash.head(result.frames)));
    const requestJobs = go => doGet('/3/Jobs', (error, result) => {
      if (error) {
        return go(new Flow.Error('Error fetching jobs', error));
      }
      return go(null, result.jobs);
    });
    const requestJob = (key, go) => doGet(`/3/Jobs/${ encodeURIComponent(key) }`, (error, result) => {
      if (error) {
        return go(new Flow.Error(`Error fetching job \'${ key }\'`, error));
      }
      return go(null, lodash.head(result.jobs));
    });
    const requestCancelJob = (key, go) => doPost(`/3/Jobs/${ encodeURIComponent(key) }/cancel`, {}, (error, result) => {
      if (error) {
        return go(new Flow.Error(`Error canceling job \'${ key }\'`, error));
      }
      return go(null);
    });
    const requestFileGlob = (path, limit, go) => {
      const opts = {
        src: encodeURIComponent(path),
        limit
      };
      return requestWithOpts('/3/Typeahead/files', opts, go);
    };
    const requestImportFiles = (paths, go) => {
      const tasks = lodash.map(paths, path => go => requestImportFile(path, go));
      return Flow.Async.iterate(tasks)(go);
    };
    const requestImportFile = (path, go) => {
      const opts = { path: encodeURIComponent(path) };
      return requestWithOpts('/3/ImportFiles', opts, go);
    };
    const requestParseSetup = (sourceKeys, go) => {
      const opts = { source_frames: encodeArrayForPost(sourceKeys) };
      return doPost('/3/ParseSetup', opts, go);
    };
    const requestParseSetupPreview = (sourceKeys, parseType, separator, useSingleQuotes, checkHeader, columnTypes, go) => {
      const opts = {
        source_frames: encodeArrayForPost(sourceKeys),
        parse_type: parseType,
        separator,
        single_quotes: useSingleQuotes,
        check_header: checkHeader,
        column_types: encodeArrayForPost(columnTypes)
      };
      return doPost('/3/ParseSetup', opts, go);
    };
    const requestParseFiles = (sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, go) => {
      const opts = {
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

    // Create data for partial dependence plot(s)
    // for the specified model and frame.
    //
    // make a post request to h2o-3 to request
    // the data about the specified model and frame
    // subject to the other options `opts`
    //
    // returns a job
    const requestPartialDependence = (opts, go) => doPost('/3/PartialDependence/', opts, go);

    // make a post request to h2o-3 to do request
    // the data about the specified model and frame
    // subject to the other options `opts`
    //
    // returns a json response that contains the data
    const requestPartialDependenceData = (key, go) => doGet(`/3/PartialDependence/${ encodeURIComponent(key) }`, (error, result) => {
      if (error) {
        return go(error, result);
      }
      return go(error, result);
    });
    const requestGrids = (go, opts) => doGet('/99/Grids', (error, result) => {
      if (error) {
        return go(error, result);
      }
      return go(error, result.grids);
    });
    const requestModels = (go, opts) => requestWithOpts('/3/Models', opts, (error, result) => {
      if (error) {
        return go(error, result);
      }
      return go(error, result.models);
    });
    const requestGrid = (key, opts, go) => {
      let params;
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
    const requestModel = (key, go) => doGet(`/3/Models/${ encodeURIComponent(key) }`, (error, result) => {
      if (error) {
        return go(error, result);
      }
      return go(error, lodash.head(result.models));
    });
    const requestPojoPreview = (key, go) => download('text', `/3/Models.java/${ encodeURIComponent(key) }/preview`, go);
    const requestDeleteModel = (key, go) => doDelete(`/3/Models/${ encodeURIComponent(key) }`, go);
    const requestImportModel = (path, overwrite, go) => {
      const opts = {
        dir: path,
        force: overwrite
      };
      return doPost('/99/Models.bin/not_in_use', opts, go);
    };
    const requestExportModel = (key, path, overwrite, go) => doGet(`/99/Models.bin/${ encodeURIComponent(key) }?dir=${ encodeURIComponent(path) }&force=${ overwrite }`, go);

    // TODO Obsolete
    const requestModelBuildersVisibility = go => doGet('/3/Configuration/ModelBuilders/visibility', unwrap(go, result => result.value));
    __modelBuilders = null;
    __modelBuilderEndpoints = null;
    __gridModelBuilderEndpoints = null;
    const cacheModelBuilders = modelBuilders => {
      let modelBuilder;
      let _i;
      let _len;
      const modelBuilderEndpoints = {};
      const gridModelBuilderEndpoints = {};
      for (_i = 0, _len = modelBuilders.length; _i < _len; _i++) {
        modelBuilder = modelBuilders[_i];
        modelBuilderEndpoints[modelBuilder.algo] = `/${ modelBuilder.__meta.schema_version }/ModelBuilders/${ modelBuilder.algo }`;
        gridModelBuilderEndpoints[modelBuilder.algo] = `/99/Grid/${ modelBuilder.algo }`;
      }
      __modelBuilderEndpoints = modelBuilderEndpoints;
      __gridModelBuilderEndpoints = gridModelBuilderEndpoints;
      __modelBuilders = modelBuilders;
      return __modelBuilders;
    };
    const getModelBuilders = () => __modelBuilders;
    const getModelBuilderEndpoint = algo => __modelBuilderEndpoints[algo];
    const getGridModelBuilderEndpoint = algo => __gridModelBuilderEndpoints[algo];
    const requestModelBuilders = go => {
      const modelBuilders = getModelBuilders();
      if (modelBuilders) {
        return go(null, modelBuilders);
      }
      const visibility = 'Stable';
      return doGet('/3/ModelBuilders', unwrap(go, result => {
        let algo;
        let builder;
        const builders = (() => {
          const _ref = result.model_builders;
          const _results = [];
          for (algo in _ref) {
            if ({}.hasOwnProperty.call(_ref, algo)) {
              builder = _ref[algo];
              _results.push(builder);
            }
          }
          return _results;
        })();
        const availableBuilders = (() => {
          let _i;
          let _j;
          let _len;
          let _len1;
          let _results;
          let _results1;
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
    const requestModelBuilder = (algo, go) => doGet(getModelBuilderEndpoint(algo), go);
    const requestModelInputValidation = (algo, parameters, go) => doPost(`${ getModelBuilderEndpoint(algo) }/parameters`, encodeObjectForPost(parameters), go);
    const requestModelBuild = (algo, parameters, go) => {
      _.trackEvent('model', algo);
      if (parameters.hyper_parameters) {
        // super-hack: nest this object as stringified json
        parameters.hyper_parameters = flowPrelude$48.stringify(parameters.hyper_parameters);
        if (parameters.search_criteria) {
          parameters.search_criteria = flowPrelude$48.stringify(parameters.search_criteria);
        }
        return doPost(getGridModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
      }
      return doPost(getModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
    };
    const requestAutoModelBuild = (parameters, go) => doPostJSON('/3/AutoMLBuilder', parameters, go);
    const requestPredict = (destinationKey, modelKey, frameKey, options, go) => {
      let opt;
      const opts = {};
      if (destinationKey) {
        opts.predictions_frame = destinationKey;
      }
      opt = options.reconstruction_error;
      if (void 0 !== opt) {
        opts.reconstruction_error = opt;
      }
      opt = options.deep_features_hidden_layer;
      if (void 0 !== opt) {
        opts.deep_features_hidden_layer = opt;
      }
      opt = options.leaf_node_assignment;
      if (void 0 !== opt) {
        opts.leaf_node_assignment = opt;
      }
      opt = options.exemplar_index;
      if (void 0 !== opt) {
        opts.exemplar_index = opt;
      }
      return doPost(`/3/Predictions/models/${ encodeURIComponent(modelKey) }/frames/${ encodeURIComponent(frameKey) }`, opts, (error, result) => {
        if (error) {
          return go(error);
        }
        return go(null, result);
      });
    };
    const requestPrediction = (modelKey, frameKey, go) => doGet(`/3/ModelMetrics/models/${ encodeURIComponent(modelKey) }/frames/${ encodeURIComponent(frameKey) }`, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, result);
    });
    const requestPredictions = (modelKey, frameKey, _go) => {
      const go = (error, result) => {
        let prediction;
        if (error) {
          return _go(error);
        }
        //
        // TODO workaround for a filtering bug in the API
        //
        const predictions = (() => {
          let _i;
          let _len;
          const _ref = result.model_metrics;
          const _results = [];
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
          let _i;
          let _len;
          const _results = [];
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
    const requestIsStorageConfigured = go => {
      if (_storageConfiguration) {
        return go(null, _storageConfiguration.isConfigured);
      }
      return doGet('/3/NodePersistentStorage/configured', (error, result) => {
        _storageConfiguration = { isConfigured: error ? false : result.configured };
        return go(null, _storageConfiguration.isConfigured);
      });
    };
    const requestObjects = (type, go) => doGet(`/3/NodePersistentStorage/${ encodeURIComponent(type) }`, unwrap(go, result => result.entries));
    const requestObjectExists = (type, name, go) => doGet(`/3/NodePersistentStorage/categories/${ encodeURIComponent(type) }/names/${ encodeURIComponent(name) }/exists`, (error, result) => go(null, error ? false : result.exists));
    const requestObject = (type, name, go) => doGet(`/3/NodePersistentStorage/${ encodeURIComponent(type) }/${ encodeURIComponent(name) }`, unwrap(go, result => JSON.parse(result.value)));
    const requestDeleteObject = (type, name, go) => doDelete(`/3/NodePersistentStorage/${ encodeURIComponent(type) }/${ encodeURIComponent(name) }`, go);
    const requestPutObject = (type, name, value, go) => {
      let uri;
      uri = `/3/NodePersistentStorage/${ encodeURIComponent(type) }`;
      if (name) {
        uri += `/${ encodeURIComponent(name) }`;
      }
      return doPost(uri, { value: JSON.stringify(value, null, 2) }, unwrap(go, result => result.name));
    };
    const requestUploadObject = (type, name, formData, go) => {
      let uri;
      uri = `/3/NodePersistentStorage.bin/${ encodeURIComponent(type) }`;
      if (name) {
        uri += `/${ encodeURIComponent(name) }`;
      }
      return doUpload(uri, formData, unwrap(go, result => result.name));
    };
    const requestUploadFile = (key, formData, go) => doUpload(`/3/PostFile?destination_frame=${ encodeURIComponent(key) }`, formData, go);
    const requestCloud = go => doGet('/3/Cloud', go);
    const requestTimeline = go => doGet('/3/Timeline', go);
    const requestProfile = (depth, go) => doGet(`/3/Profiler?depth=${ depth }`, go);
    const requestStackTrace = go => doGet('/3/JStack', go);
    const requestRemoveAll = go => doDelete('/3/DKV', go);
    const requestEcho = (message, go) => doPost('/3/LogAndEcho', { message }, go);
    const requestLogFile = (nodeIndex, fileType, go) => doGet(`/3/Logs/nodes/${ nodeIndex }/files/${ fileType }`, go);
    const requestNetworkTest = go => doGet('/3/NetworkTest', go);
    const requestAbout = go => doGet('/3/About', go);
    const requestShutdown = go => doPost('/3/Shutdown', {}, go);
    const requestEndpoints = go => doGet('/3/Metadata/endpoints', go);
    const requestEndpoint = (index, go) => doGet(`/3/Metadata/endpoints/${ index }`, go);
    const requestSchemas = go => doGet('/3/Metadata/schemas', go);
    const requestSchema = (name, go) => doGet(`/3/Metadata/schemas/${ encodeURIComponent(name) }`, go);
    const getLines = data => lodash.filter(data.split('\n'), line => {
      if (line.trim()) {
        return true;
      }
      return false;
    });
    const requestPacks = go => download('text', '/flow/packs/index.list', unwrap(go, getLines));
    const requestPack = (packName, go) => download('text', `/flow/packs/${ encodeURIComponent(packName) }/index.list`, unwrap(go, getLines));
    const requestFlow = (packName, flowName, go) => download('json', `/flow/packs/${ encodeURIComponent(packName) }/${ encodeURIComponent(flowName) }`, go);
    const requestHelpIndex = go => download('json', '/flow/help/catalog.json', go);
    const requestHelpContent = (name, go) => download('text', `/flow/help/${ name }.html`, go);
    const requestRDDs = go => doGet('/3/RDDs', go);
    const requestDataFrames = go => doGet('/3/dataframes', go);
    const requestScalaIntp = go => doPost('/3/scalaint', {}, go);
    const requestScalaCode = (sessionId, code, go) => doPost(`/3/scalaint/${ sessionId }`, { code }, go);
    const requestAsH2OFrameFromRDD = (rddId, name, go) => {
      if (name === void 0) {
        return doPost(`/3/RDDs/${ rddId }/h2oframe`, {}, go);
      }
      return doPost(`/3/RDDs/${ rddId }/h2oframe`, { h2oframe_id: name }, go);
    };
    const requestAsH2OFrameFromDF = (dfId, name, go) => {
      if (name === void 0) {
        return doPost(`/3/dataframes/${ dfId }/h2oframe`, {}, go);
      }
      return doPost(`/3/dataframes/${ dfId }/h2oframe`, { h2oframe_id: name }, go);
    };
    const requestAsDataFrame = (hfId, name, go) => {
      if (name === void 0) {
        return doPost(`/3/h2oframes/${ hfId }/dataframe`, {}, go);
      }
      return doPost(`/3/h2oframes/${ hfId }/dataframe`, { dataframe_id: name }, go);
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
    //
    // Sparkling-Water
    //
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
    const Flow = window.Flow;
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
    _.dialog = Flow.Dataflow.slot();
    return _.dialog;
  }

  function flowSandbox(_, routines) {
    return {
      routines,
      context: {},
      results: {}
    };
  }

  function flowAnalytics(_) {
    const lodash = window._;
    const Flow = window.Flow;
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
    const Flow = window.Flow;
    const $ = window.jQuery;
    // Type should be one of:
    // undefined = info (blue)
    // success (green)
    // warning (orange)
    // danger (red)
    return Flow.Dataflow.link(_.growl, (message, type) => {
      if (type) {
        return $.bootstrapGrowl(message, { type });
      }
      return $.bootstrapGrowl(message);
    });
  }

  function flowAutosave(_) {
    const Flow = window.Flow;
    const warnOnExit = e => {
      // message = 'You have unsaved changes to this notebook.'
      const message = 'Warning: you are about to exit Flow.';

      // < IE8 and < FF4
      e = e != null ? e : window.event;
      if (e) {
        e.returnValue = message;
      }
      return message;
    };
    const setDirty = () => {
      window.onbeforeunload = warnOnExit;
      return window.onbeforeunload;
    };
    const setPristine = () => {
      window.onbeforeunload = null;
      return window.onbeforeunload;
    };
    return Flow.Dataflow.link(_.ready, () => {
      Flow.Dataflow.link(_.setDirty, setDirty);
      return Flow.Dataflow.link(_.setPristine, setPristine);
    });
  }

  function flowApplication(_, routines) {
    const Flow = window.Flow;
    flowApplicationContext(_);
    const _sandbox = flowSandbox(_, routines(_));
    // TODO support external renderers
    const _renderers = Flow.renderers(_, _sandbox);
    flowAnalytics(_);
    flowGrowl(_);
    flowAutosave(_);
    const _notebook = Flow.notebook(_, _renderers);
    return {
      context: _,
      sandbox: _sandbox,
      view: _notebook
    };
  }

  //
  // TODO
  //
  // XXX how does cell output behave when a widget throws an exception?
  // XXX GLM case is failing badly. Investigate. Should catch/handle gracefully.
  //
  // integrate with groc
  // tooltips on celltype flags
  // arrow keys cause page to scroll - disable those behaviors
  // scrollTo() behavior
  //

  function flow() {
    const Flow = window.Flow;
    const ko = window.ko;
    const H2O = window.H2O;
    const $ = window.jQuery;
    const getContextPath = () => {
      window.Flow.ContextPath = '/';
      return $.ajax({
        url: window.referrer,
        type: 'GET',
        success(data, status, xhr) {
          if (xhr.getAllResponseHeaders().indexOf('X-h2o-context-path') !== -1) {
            window.Flow.ContextPath = xhr.getResponseHeader('X-h2o-context-path');
            return window.Flow.ContextPath;
          }
        },
        async: false
      });
    };
    const checkSparklingWater = context => {
      context.onSparklingWater = false;
      return $.ajax({
        url: `${ window.Flow.ContextPath }3/Metadata/endpoints`,
        type: 'GET',
        dataType: 'json',
        success(response) {
          let route;
          let _i;
          let _len;
          const _ref = response.routes;
          const _results = [];
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
        const context = {};
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

  const flowPrelude = flowPreludeFunction();

  // flow.coffee
  // parent IIFE for the rest of this file
  // defer for now
  (function () {
    const lodash = window._;
    const marked = window.marked;
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
    error();
    format();
    gui$1();
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