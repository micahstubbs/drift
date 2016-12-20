import { _fork } from './_fork';
import { createGui } from './createGui';

export function gui(controls) {
  const Flow = window.Flow;
  _fork(createGui, controls);
    _ref = Flow.Gui;
    for (name in _ref) {
      if ({}.hasOwnProperty.call(_ref, name)) {
        f = _ref[name];
        gui[name] = f;
      }
    }
}
