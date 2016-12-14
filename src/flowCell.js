export function flowCell(_, _renderers, type, input) {
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
  const _errors = [];
  const _result = Flow.Dataflow.signal(null);
  const _hasOutput = Flow.Dataflow.lift(_outputs, outputs => outputs.length > 0);
  const _isInputVisible = Flow.Dataflow.signal(true);
  const _isOutputHidden = Flow.Dataflow.signal(false);
  const _actions = {};
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
  const select = () => {
    _.selectCell(self, false);
    return true;
  };
  const navigate = () => {
    _.selectCell(self);
    return true;
  };
  const activate = () => _isActive(true);
  const clip = () => _.saveClip('user', _type(), _input());
  const toggleInput = () => _isInputVisible(!_isInputVisible());
  const toggleOutput = () => _isOutputHidden(!_isOutputHidden());
  const clear = () => {
    _result(null);
    _outputs([]);
    _errors.length = 0;
    _hasError(false);
    if (!_isCode()) {
      return _hasInput(true);
    }
  };
  const execute = go => {
    const startTime = Date.now();
    _time(`Started at ${Flow.Util.formatClockTime(startTime)}`);
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
          _outputs.push(Flow.failure(_, error));
        } else {
          _outputs.push({
            text: JSON.stringify(error, null, 2),
            template: 'flow-raw',
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
      },
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
    template: 'flow-cell',
  };
  return self;
}

