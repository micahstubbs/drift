export function format() {
  const lodash = window._;
  const Flow = window.Flow;
  const d3 = window.d3;
  let formatTime;
  const significantDigitsBeforeDecimal = value => 1 + Math.floor(Math.log(Math.abs(value)) / Math.LN10);
  const Digits = (digits, value) => {
    if (value === 0) {
      return 0;
    }
    const sd = significantDigitsBeforeDecimal(value);
    if (sd >= digits) {
      return value.toFixed(0);
    }
    const magnitude = Math.pow(10, digits - sd);
    return Math.round(value * magnitude) / magnitude;
  };
  if (typeof exports === 'undefined' || exports === null) {
    formatTime = d3.time.format('%Y-%m-%d %H:%M:%S');
  }
  const formatDate = time => {
    if (time) {
      return formatTime(new Date(time));
    }
    return '-';
  };
  const __formatReal = {};
  const formatReal = precision => {
    let cached;
    const format = (cached = __formatReal[precision]) ? cached : __formatReal[precision] = precision === -1 ? lodash.identity : d3.format(`.${precision}f`);
    return value => format(value);
  };
  Flow.Format = {
    Digits,
    Real: formatReal,
    Date: formatDate,
    Time: formatTime
  };
}
