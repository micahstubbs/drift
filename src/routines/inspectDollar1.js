import { render_ } from './render_';
import { inspect$2 } from './inspectDollar2';
import { h2oInspectsOutput } from '../h2oInspectsOutput';
import { inspect } from './inspect';

export function inspect$1(obj) {
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
