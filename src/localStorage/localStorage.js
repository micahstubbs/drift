export function localStorage() {
  const lodash = window._;
  const Flow = window.Flow;
  let keyOf;
  let list;
  let purge;
  let purgeAll;
  let read;
  let write;
  let _ls;
  if (!(typeof window !== 'undefined' && window !== null ? window.localStorage : void 0)) {
    return;
  }
  _ls = window.localStorage;
  keyOf = (type, id) => `${type}:${id}`;
  list = type => {
    let i;
    let id;
    let key;
    let objs;
    let t;
    let _i;
    let _ref;
    let _ref1;
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
  read = (type, id) => {
    let raw;
    if (raw = _ls.getobj(keyOf(type, id))) {
      return JSON.parse(raw);
    }
    return null;
  };
  write = (type, id, obj) => _ls.setItem(keyOf(type, id), JSON.stringify(obj));
  purge = (type, id) => {
    if (id) {
      return _ls.removeItem(keyOf(type, id));
    }
    return purgeAll(type);
  };
  purgeAll = type => {
    let allKeys;
    let i;
    let key;
    let _i;
    let _len;
    allKeys = (() => {
      let _i;
      let _ref;
      let _results;
      _results = [];
      for (i = _i = 0, _ref = _ls.length; _ref >= 0 ? _i < _ref : _i > _ref; i = _ref >= 0 ? ++_i : --_i) {
        _results.push(_ls.key(i));
      }
      return _results;
    })();
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
