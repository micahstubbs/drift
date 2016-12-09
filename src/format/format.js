export function format() {
  const lodash = window._;
  const Flow = window.Flow;
  let Digits;
  let formatDate;
  let formatReal;
  let formatTime;
  let significantDigitsBeforeDecimal;
  let __formatReal;
  significantDigitsBeforeDecimal = value => 1 + Math.floor(Math.log(Math.abs(value)) / Math.LN10);
  Digits = (digits, value) => {
    let magnitude;
    let sd;
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
    let cached;
    let format;
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
