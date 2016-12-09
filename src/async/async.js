import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function async() {
  var lodash = window._;
  var Flow = window.Flow;
  var createBuffer;
  var iterate;
  var pipe;
  var _applicate;
  var _async;
  var _find;
  var _find$2;
  var _find$3;
  var _fork;
  var _get;
  var _isFuture;
  var _join;
  var _noop;
  var __slice = [].slice;
  createBuffer = array => {
    var buffer;
    var _array;
    var _go;
    _array = array || [];
    _go = null;
    buffer = element => {
      if (element === void 0) {
        return _array;
      }
      _array.push(element);
      if (_go) {
        _go(element);
      }
      return element;
    };
    buffer.subscribe = go => _go = go;
    buffer.buffer = _array;
    buffer.isBuffer = true;
    return buffer;
  };
  _noop = go => go(null);
  _applicate = go => (error, args) => {
    if (lodash.isFunction(go)) {
      return go(...[error].concat(args));
    }
  };
  _fork = (f, args) => {
    var self;
    if (!lodash.isFunction(f)) {
      throw new Error('Not a function.');
    }
    self = go => {
      var canGo;
      canGo = lodash.isFunction(go);
      if (self.settled) {
        if (self.rejected) {
          if (canGo) {
            return go(self.error);
          }
        } else {
          if (canGo) {
            return go(null, self.result);
          }
        }
      } else {
        return _join(args, (error, args) => {
          if (error) {
            self.error = error;
            self.fulfilled = false;
            self.rejected = true;
            if (canGo) {
              return go(error);
            }
          } else {
            return f(...args.concat((error, result) => {
              if (error) {
                self.error = error;
                self.fulfilled = false;
                self.rejected = true;
                if (canGo) {
                  go(error);
                }
              } else {
                self.result = result;
                self.fulfilled = true;
                self.rejected = false;
                if (canGo) {
                  go(null, result);
                }
              }
              self.settled = true;
              return self.pending = false;
            }));
          }
        });
      }
    };
    self.method = f;
    self.args = args;
    self.fulfilled = false;
    self.rejected = false;
    self.settled = false;
    self.pending = true;
    self.isFuture = true;
    return self;
  };
  _isFuture = a => {
    if (a != null ? a.isFuture : void 0) {
      return true;
    }
    return false;
  };
  _join = (args, go) => {
    var arg;
    var i;
    var _actual;
    var _i;
    var _len;
    var _results;
    var _settled;
    var _tasks;
    if (args.length === 0) {
      return go(null, []);
    }
    _tasks = [];
    _results = [];
    for (i = _i = 0, _len = args.length; _i < _len; i = ++_i) {
      arg = args[i];
      if (arg != null ? arg.isFuture : void 0) {
        _tasks.push({
          future: arg,
          resultIndex: i
        });
      } else {
        _results[i] = arg;
      }
    }
    if (_tasks.length === 0) {
      return go(null, _results);
    }
    _actual = 0;
    _settled = false;
    lodash.forEach(_tasks, task => task.future.call(null, (error, result) => {
      if (_settled) {
        return;
      }
      if (error) {
        _settled = true;
        go(new Flow.Error(`Error evaluating future[${task.resultIndex}]`, error));
      } else {
        _results[task.resultIndex] = result;
        _actual++;
        if (_actual === _tasks.length) {
          _settled = true;
          go(null, _results);
        }
      }
    }));
  };
  pipe = tasks => {
    var next;
    var _tasks;
    _tasks = tasks.slice(0);
    next = (args, go) => {
      var task;
      task = _tasks.shift();
      if (task) {
        return task(...args.concat(function () {
          var error;
          var results;
          error = arguments[0], results = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
          if (error) {
            return go(error);
          }
          return next(results, go);
        }));
      }
      return go(...[null].concat(args));
    };
    return function () {
      var args;
      var go;
      var _i;
      args = arguments.length >= 2 ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), go = arguments[_i++];
      return next(args, go);
    };
  };
  iterate = tasks => {
    var next;
    var _results;
    var _tasks;
    _tasks = tasks.slice(0);
    _results = [];
    next = go => {
      var task;
      task = _tasks.shift();
      if (task) {
        return task((error, result) => {
          if (error) {
            return go(error);
          }
          _results.push(result);
          return next(go);
        });
      }
      return go(null, _results);
    };
    return go => next(go);
  };
  _async = function () {
    var args;
    var f;
    var later;
    f = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
    later = function () {
      var args;
      var error;
      var go;
      var result;
      var _i;
      args = arguments.length >= 2 ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), go = arguments[_i++];
      try {
        result = f(...args);
        return go(null, result);
      } catch (_error) {
        error = _error;
        return go(error);
      }
    };
    return _fork(later, args);
  };
  _find$3 = (attr, prop, obj) => {
    var v;
    var _i;
    var _len;
    if (_isFuture(obj)) {
      return _async(_find$3, attr, prop, obj);
    } else if (lodash.isArray(obj)) {
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        v = obj[_i];
        if (v[attr] === prop) {
          return v;
        }
      }
      return;
    }
  };
  _find$2 = (attr, obj) => {
    if (_isFuture(obj)) {
      return _async(_find$2, attr, obj);
    } else if (lodash.isString(attr)) {
      if (lodash.isArray(obj)) {
        return _find$3('name', attr, obj);
      }
      return obj[attr];
    }
  };
  _find = function () {
    var a;
    var args;
    var b;
    var c;
    var ta;
    var tb;
    var tc;
    args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
    switch (args.length) {
      case 3:
        a = args[0], b = args[1], c = args[2];
        ta = flowPrelude.typeOf(a);
        tb = flowPrelude.typeOf(b);
        tc = flowPrelude.typeOf(c);
        if (ta === 'Array' && tb === 'String') {
          return _find$3(b, c, a);
        } else if (ta === 'String' && (tc = 'Array')) {
          return _find$3(a, b, c);
        }
        break;
      case 2:
        a = args[0], b = args[1];
        if (!a) {
          return;
        }
        if (!b) {
          return;
        }
        if (lodash.isString(b)) {
          return _find$2(b, a);
        } else if (lodash.isString(a)) {
          return _find$2(a, b);
        }
    }
  };
  _get = (attr, obj) => {
    if (_isFuture(obj)) {
      return _async(_get, attr, obj);
    } else if (lodash.isString(attr)) {
      if (lodash.isArray(obj)) {
        return _find$3('name', attr, obj);
      }
      return obj[attr];
    }
  };
  Flow.Async = {
    createBuffer,
    noop: _noop,
    applicate: _applicate,
    isFuture: _isFuture,
    fork: _fork,
    join: _join,
    pipe,
    iterate,
    async: _async,
    find: _find,
    get: _get
  };
}
