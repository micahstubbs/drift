import { _fork } from './_fork';
import { createGui } from './createGui';

// not used anywhere beyond src/routines/routines?
// replaced by src/gui/gui?
export function gui(_, controls) {
  const Flow = window.Flow;
  _fork(createGui, _, controls);
  _ref = Flow.Gui;
  for (name in _ref) {
    if ({}.hasOwnProperty.call(_ref, name)) {
      f = _ref[name];
      gui[name] = f;
    }
  }
}
