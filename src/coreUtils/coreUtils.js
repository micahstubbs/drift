export function coreUtils() {
  var lodash = window._;
  var Flow = window.Flow;
  var EOL;
  var describeCount;
  var format1d0;
  var formatBytes;
  var formatClockTime;
  var formatElapsedTime;
  var formatMilliseconds;
  var fromNow;
  var highlight;
  var multilineTextToHTML;
  var padTime;
  var sanitizeName;
  var splitTime;
  describeCount = function (count, singular, plural) {
    if (!plural) {
      plural = `${singular}s`;
    }
    switch (count) {
      case 0:
        return `No ${plural}`;
      case 1:
        return `1 ${singular}`;
      default:
        return `${count} ${plural}`;
    }
  };
  fromNow = function (date) {
    return moment(date).fromNow();
  };
  formatBytes = function (bytes) {
    var i;
    var sizes;
    sizes = [
      'Bytes',
      'KB',
      'MB',
      'GB',
      'TB'
    ];
    if (bytes === 0) {
      return '0 Byte';
    }
    i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
  };
  padTime = function (n) {
    return `${(n < 10 ? '0' : '')}${n}`;
  };
  splitTime = function (s) {
    var hrs;
    var mins;
    var ms;
    var secs;
    ms = s % 1000;
    s = (s - ms) / 1000;
    secs = s % 60;
    s = (s - secs) / 60;
    mins = s % 60;
    hrs = (s - mins) / 60;
    return [
      hrs,
      mins,
      secs,
      ms
    ];
  };
  formatMilliseconds = function (s) {
    var hrs;
    var mins;
    var ms;
    var secs;
    var _ref;
    _ref = splitTime(s), hrs = _ref[0], mins = _ref[1], secs = _ref[2], ms = _ref[3];
    return `${padTime(hrs)}:${padTime(mins)}:${padTime(secs)}.${ms}`;
  };
  format1d0 = function (n) {
    return Math.round(n * 10) / 10;
  };
  formatElapsedTime = function (s) {
    var hrs;
    var mins;
    var ms;
    var secs;
    var _ref;
    _ref = splitTime(s), hrs = _ref[0], mins = _ref[1], secs = _ref[2], ms = _ref[3];
    if (hrs !== 0) {
      return `${format1d0((hrs * 60 + mins) / 60)}h`;
    } else if (mins !== 0) {
      return `${format1d0((mins * 60 + secs) / 60)}m`;
    } else if (secs !== 0) {
      return `${format1d0((secs * 1000 + ms) / 1000)}s`;
    }
    return `${ms}ms`;
  };
  formatClockTime = function (date) {
    return moment(date).format('h:mm:ss a');
  };
  EOL = '\n';
  multilineTextToHTML = function (text) {
    return lodash.map(text.split(EOL), function (str) {
      return lodash.escape(str);
    }).join('<br/>');
  };
  sanitizeName = function (name) {
    return name.replace(/[^a-z0-9_ \(\)-]/gi, '-').trim();
  };
  highlight = function (code, lang) {
    if (window.hljs) {
      return window.hljs.highlightAuto(code, [lang]).value;
    }
    return code;
  };
  Flow.Util = {
    describeCount,
    fromNow,
    formatBytes,
    formatMilliseconds,
    formatElapsedTime,
    formatClockTime,
    multilineTextToHTML,
    uuid: (typeof window !== 'undefined' && window !== null ? window.uuid : void 0) ? window.uuid : null,
    sanitizeName,
    highlight
  };
}
