export function flowPreludeFunction() {
  const Flow = window.Flow;
  let _always;
  let _copy;
  let _deepClone;
  let _isDefined;
  let _isFalsy;
  let _isTruthy;
  let _negative;
  let _never;
  let _remove;
  let _repeat;
  let _typeOf;
  let _words;
  _isDefined = value => !lodash.isUndefined(value);
  _isTruthy = value => {
    if (value) {
      return true;
    }
    return false;
  };
  _isFalsy = value => {
    if (value) {
      return false;
    }
    return true;
  };
  _negative = value => !value;
  _always = () => true;
  _never = () => false;
  _copy = array => array.slice(0);
  _remove = (array, element) => {
    let index;
    if ((index = lodash.indexOf(array, element)) > -1) {
      return lodash.head(array.splice(index, 1));
    }
    return void 0;
  };
  _words = text => text.split(/\s+/);
  _repeat = (count, value) => {
    let array;
    let i;
    let _i;
    array = [];
    for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
      array.push(value);
    }
    return array;
  };
  _typeOf = a => {
    let type;
    type = Object.prototype.toString.call(a);
    if (a === null) {
      return 'null';
    } else if (a === void 0) {
      return 'undefined';
    } else if (a === true || a === false || type === '[object Boolean]') {
      return 'Boolean';
    }
    switch (type) {
      case '[object String]':
        return 'String';
      case '[object Number]':
        return 'Number';
      case '[object Function]':
        return 'Function';
      case '[object Object]':
        return 'Object';
      case '[object Array]':
        return 'Array';
      case '[object Arguments]':
        return 'Arguments';
      case '[object Date]':
        return 'Date';
      case '[object RegExp]':
        return 'RegExp';
      case '[object Error]':
        return 'Error';
      default:
        return type;
    }
  };
  _deepClone = obj => JSON.parse(JSON.stringify(obj));
  return {
    isDefined: _isDefined,
    isTruthy: _isTruthy,
    isFalsy: _isFalsy,
    negative: _negative,
    always: _always,
    never: _never,
    copy: _copy,
    remove: _remove,
    words: _words,
    repeat: _repeat,
    typeOf: _typeOf,
    deepClone: _deepClone,
    stringify: JSON.stringify
  };
}

