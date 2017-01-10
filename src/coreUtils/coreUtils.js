export function coreUtils() {
  const lodash = window._;
  const Flow = window.Flow;
  Flow.Util = {
    uuid: (typeof window !== 'undefined' && window !== null ? window.uuid : void 0) ? window.uuid : null,
  };
}
