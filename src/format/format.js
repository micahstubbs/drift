export function format() {
  var lodash = window._;
  var Flow = window.Flow;
  var Digits;
  var formatDate;
  var formatReal;
  var formatTime;
  var significantDigitsBeforeDecimal;
  var __formatReal;
  significantDigitsBeforeDecimal = value => 1 + Math.floor(Math.log(Math.abs(value)) / Math.LN10);
  Digits = (digits, value) => {
    var magnitude;
    var sd;
    if (value === 0) {
      return 0;
    }
    sd = significantDigitsBeforeDecimal(value);
    if (sd >= digits) {
      return value.toFixed(0);
    }
    magnitude = Math.pow(10, digits - sd);
    return Math.round(value * magnitude) / magnitude;
  };
  if (typeof exports === 'undefined' || exports === null) {
    formatTime = d3.time.format('%Y-%m-%d %H:%M:%S');
  }
  formatDate = time => {
    if (time) {
      return formatTime(new Date(time));
    }
    return '-';
  };
  __formatReal = {};
  formatReal = precision => {
    var cached;
    var format;
    format = (cached = __formatReal[precision]) ? cached : __formatReal[precision] = precision === -1 ? lodash.identity : d3.format(`.${precision}f`);
    return value => format(value);
  };
  Flow.Format = {
    Digits,
    Real: formatReal,
    Date: formatDate,
    Time: formatTime
  };
}
