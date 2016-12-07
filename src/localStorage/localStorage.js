export function localStorage() {
  var lodash = window._;
  var Flow = window.Flow;
  var keyOf;
  var list;
  var purge;
  var purgeAll;
  var read;
  var write;
  var _ls;
  if (!(typeof window !== 'undefined' && window !== null ? window.localStorage : void 0)) {
    return;
  }
  _ls = window.localStorage;
  keyOf = function (type, id) {
    return `${type}:${id}`;
  };
  list = function (type) {
    var i;
    var id;
    var key;
    var objs;
    var t;
    var _i;
    var _ref;
    var _ref1;
    objs = [];
    for (i = _i = 0, _ref = _ls.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
      key = _ls.key(i);
      _ref1 = key.split(':'), t = _ref1[0], id = _ref1[1];
      if (type === t) {
        objs.push([
          type,
          id,
          JSON.parse(_ls.getItem(key))
        ]);
      }
    }
    return objs;
  };
  read = function (type, id) {
    var raw;
    if (raw = _ls.getobj(keyOf(type, id))) {
      return JSON.parse(raw);
    }
    return null;
  };
  write = function (type, id, obj) {
    return _ls.setItem(keyOf(type, id), JSON.stringify(obj));
  };
  purge = function (type, id) {
    if (id) {
      return _ls.removeItem(keyOf(type, id));
    }
    return purgeAll(type);
  };
  purgeAll = function (type) {
    var allKeys;
    var i;
    var key;
    var _i;
    var _len;
    allKeys = function () {
      var _i;
      var _ref;
      var _results;
      _results = [];
      for (i = _i = 0, _ref = _ls.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
        _results.push(_ls.key(i));
      }
      return _results;
    }();
    for (_i = 0, _len = allKeys.length; _i < _len; _i++) {
      key = allKeys[_i];
      if (type === lodash.head(key.split(':'))) {
        _ls.removeItem(key);
      }
    }
  };
  Flow.LocalStorage = {
    list,
    read,
    write,
    purge
  };
}
