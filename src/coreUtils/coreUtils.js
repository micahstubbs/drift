export function coreUtils() {
  const lodash = window._;
  const Flow = window.Flow;
  const EOL = '\n';
  const multilineTextToHTML = text => lodash.map(text.split(EOL), str => lodash.escape(str)).join('<br/>');
  const sanitizeName = name => name.replace(/[^a-z0-9_ \(\)-]/gi, '-').trim();
  const highlight = (code, lang) => {
    if (window.hljs) {
      return window.hljs.highlightAuto(code, [lang]).value;
    }
    return code;
  };
  Flow.Util = {
    multilineTextToHTML,
    uuid: (typeof window !== 'undefined' && window !== null ? window.uuid : void 0) ? window.uuid : null,
    sanitizeName,
    highlight,
  };
}
