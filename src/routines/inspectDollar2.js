import { h2oInspectOutput } from '../h2oInspectOutput';
import { render_ } from './render_';
import { inspect } from './inspect';

export function inspect$2(attr, obj) {
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
  const key = `inspect_${attr}`;
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
