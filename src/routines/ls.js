export function ls(obj) {
  const lodash = window._;
  const Flow = window.Flow;
  const _isFuture = Flow.Async.isFuture;
  const _async = Flow.Async.async;
  if (_isFuture(obj)) {
    return _async(ls, obj);
  }
  const inspectors = obj;
  const _ref1 = obj._flow_;
  if (inspectors != null ? _ref1 != null ? _ref1.inspect : void 0 : void 0) {
    return lodash.keys(inspectors);
  }
  return [];
}
