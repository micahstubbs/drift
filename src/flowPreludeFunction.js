export function flowPreludeFunction() {
  var Flow = window.Flow;
  var _always;
  var _copy;
  var _deepClone;
  var _isDefined;
  var _isFalsy;
  var _isTruthy;
  var _negative;
  var _never;
  var _remove;
  var _repeat;
  var _typeOf;
  var _words;
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
    var index;
    if ((index = lodash.indexOf(array, element)) > -1) {
      return lodash.head(array.splice(index, 1));
    }
    return void 0;
  };
  _words = text => text.split(/\s+/);
  _repeat = (count, value) => {
    var array;
    var i;
    var _i;
    array = [];
    for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
      array.push(value);
    }
    return array;
  };
  _typeOf = a => {
    var type;
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

