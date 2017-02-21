import { formatElapsedTime } from '../utils/formatElapsedTime';
import { formatClockTime } from '../utils/formatClockTime';
import templateOf from './templateOf';
import scrollIntoView from './scrollIntoView';
import autoResize from './autoResize';
import getCursorPosition from './getCursorPosition';
import endFunction from './endFunction';
import errorFunction from './errorFunction';

export function flowCell(_, type, input) {
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
  const _render = Flow.Dataflow.lift(_type, type => _.renderers[type](_guid));
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
    _time(`Started at ${formatClockTime(startTime)}`);
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
      input = `runScalaCode ${_.scalaIntpId()}, \'${input}\'`;
    }
    render(
      input,
      {
        data(result) {
          return _outputs.push(result);
        },
        close(result) {
          // XXX push to cell output
          return _result(result);
        },
        error: errorFunction.bind(
          this,
          _,
          _hasError,
          _outputs,
          _errors
        ),
        end: endFunction.bind(
          this,
          _hasInput,
          _isCode,
          _isBusy,
          _time,
          _hasError,
          _errors,
          startTime,
          go
        ),
      }
    );
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
    getCursorPosition: getCursorPosition.bind(this, _actions),
    autoResize: autoResize.bind(this, _actions),
    scrollIntoView: scrollIntoView.bind(this, _actions),
    templateOf,
    template: 'flow-cell',
  };
  return self;
}

