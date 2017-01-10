import { padTime } from './padTime';

export function coreUtils() {
  const lodash = window._;
  const Flow = window.Flow;
  const moment = window.moment;
  const splitTime = s => {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;
    return [
      hrs,
      mins,
      secs,
      ms,
    ];
  };
  const formatMilliseconds = s => {
    const _ref = splitTime(s);
    const hrs = _ref[0];
    const mins = _ref[1];
    const secs = _ref[2];
    const ms = _ref[3];
    return `${padTime(hrs)}:${padTime(mins)}:${padTime(secs)}.${ms}`;
  };
  const format1d0 = n => Math.round(n * 10) / 10;
  const formatElapsedTime = s => {
    const _ref = splitTime(s);
    const hrs = _ref[0];
    const mins = _ref[1];
    const secs = _ref[2];
    const ms = _ref[3];
    if (hrs !== 0) {
      return `${format1d0((hrs * 60 + mins) / 60)}h`;
    } else if (mins !== 0) {
      return `${format1d0((mins * 60 + secs) / 60)}m`;
    } else if (secs !== 0) {
      return `${format1d0((secs * 1000 + ms) / 1000)}s`;
    }
    return `${ms}ms`;
  };
  const formatClockTime = date => moment(date).format('h:mm:ss a');
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
    formatMilliseconds,
    formatElapsedTime,
    formatClockTime,
    multilineTextToHTML,
    uuid: (typeof window !== 'undefined' && window !== null ? window.uuid : void 0) ? window.uuid : null,
    sanitizeName,
    highlight,
  };
}
