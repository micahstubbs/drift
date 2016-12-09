export function flowCell(_, _renderers, type, input) {
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
  _render = Flow.Dataflow.lift(_type, function (type) {
    return _renderers[type](_guid);
  });
  _isCode = Flow.Dataflow.lift(_render, function (render) {
    return render.isCode;
  });
  _isSelected = Flow.Dataflow.signal(false);
  _isActive = Flow.Dataflow.signal(false);
  _hasError = Flow.Dataflow.signal(false);
  _isBusy = Flow.Dataflow.signal(false);
  _isReady = Flow.Dataflow.lift(_isBusy, function (isBusy) {
    return !isBusy;
  });
  _time = Flow.Dataflow.signal('');
  _hasInput = Flow.Dataflow.signal(true);
  _input = Flow.Dataflow.signal(input);
  _outputs = Flow.Dataflow.signals([]);
  _errors = [];
  _result = Flow.Dataflow.signal(null);
  _hasOutput = Flow.Dataflow.lift(_outputs, function (outputs) {
    return outputs.length > 0;
  });
  _isInputVisible = Flow.Dataflow.signal(true);
  _isOutputHidden = Flow.Dataflow.signal(false);
  _actions = {};
  Flow.Dataflow.act(_isActive, function (isActive) {
    if (isActive) {
      _.selectCell(self);
      _hasInput(true);
      if (!_isCode()) {
        _outputs([]);
      }
    }
  });
  Flow.Dataflow.act(_isSelected, function (isSelected) {
    if (!isSelected) {
      return _isActive(false);
    }
  });
  select = function () {
    _.selectCell(self, false);
    return true;
  };
  navigate = function () {
    _.selectCell(self);
    return true;
  };
  activate = function () {
    return _isActive(true);
  };
  clip = function () {
    return _.saveClip('user', _type(), _input());
  };
  toggleInput = function () {
    return _isInputVisible(!_isInputVisible());
  };
  toggleOutput = function () {
    return _isOutputHidden(!_isOutputHidden());
  };
  clear = function () {
    _result(null);
    _outputs([]);
    _errors.length = 0;
    _hasError(false);
    if (!_isCode()) {
      return _hasInput(true);
    }
  };
  execute = function (go) {
    var render;
    var startTime;
    startTime = Date.now();
    _time(`Started at ${Flow.Util.formatClockTime(startTime)}`);
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
      input = `runScalaCode ${_.scalaIntpId()}, \'${input}\'`;
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

