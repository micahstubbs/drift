import { _fork } from './_fork';
import { proceed } from './proceed';
import { h2oPlotInput } from '../h2oPlotInput';
import { createPlot } from './createPlot';
import { assist } from './assist';

export function plot(f) {
  const lodash = window._;
  const Flow = window.Flow;
  const _isFuture = Flow.Async.isFuture;
  if (_isFuture(f)) {
    return _fork(proceed, h2oPlotInput, f);
  } else if (lodash.isFunction(f)) {
    return _fork(createPlot, f);
  }
  return assist(plot);
}
