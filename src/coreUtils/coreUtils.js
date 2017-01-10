export function coreUtils() {
  const lodash = window._;
  const Flow = window.Flow;
  const highlight = (code, lang) => {
    if (window.hljs) {
      return window.hljs.highlightAuto(code, [lang]).value;
    }
    return code;
  };
  Flow.Util = {
    uuid: (typeof window !== 'undefined' && window !== null ? window.uuid : void 0) ? window.uuid : null,
    highlight,
  };
}
