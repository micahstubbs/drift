import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function dataflow() {
  var lodash = window._;
  var Flow = window.Flow;
  var __slice = [].slice;
  Flow.Dataflow = function () {
    var createObservable;
    var createObservableArray;
    var createSignal;
    var createSignals;
    var createSlot;
    var createSlots;
    var isObservable;
    var _act;
    var _apply;
    var _isSignal;
    var _lift;
    var _link;
    var _merge;
    var _react;
    var _unlink;
    createSlot = function () {
      var arrow;
      var self;
      arrow = null;
      self = function () {
        var args;
        args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
        if (arrow) {
          return arrow.func.apply(null, args);
        }
        return void 0;
      };
      self.subscribe = function (func) {
        console.assert(lodash.isFunction(func));
        if (arrow) {
          throw new Error('Cannot re-attach slot');
        } else {
          return arrow = {
            func,
            dispose() {
              return arrow = null;
            }
          };
        }
      };
      self.dispose = function () {
        if (arrow) {
          return arrow.dispose();
        }
      };
      return self;
    };
    createSlots = function () {
      var arrows;
      var self;
      arrows = [];
      self = function () {
        var args;
        args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
        return lodash.map(arrows, function (arrow) {
          return arrow.func.apply(null, args);
        });
      };
      self.subscribe = function (func) {
        var arrow;
        console.assert(lodash.isFunction(func));
        arrows.push(arrow = {
          func,
          dispose() {
            return flowPrelude.remove(arrows, arrow);
          }
        });
        return arrow;
      };
      self.dispose = function () {
        return lodash.forEach(flowPrelude.copy(arrows), function (arrow) {
          return arrow.dispose();
        });
      };
      return self;
    };
    if (typeof ko !== 'undefined' && ko !== null) {
      createObservable = ko.observable;
      createObservableArray = ko.observableArray;
      isObservable = ko.isObservable;
    } else {
      createObservable = function (initialValue) {
        var arrows;
        var currentValue;
        var notifySubscribers;
        var self;
        arrows = [];
        currentValue = initialValue;
        notifySubscribers = function (arrows, newValue) {
          var arrow;
          var _i;
          var _len;
          for (_i = 0, _len = arrows.length; _i < _len; _i++) {
            arrow = arrows[_i];
            arrow.func(newValue);
          }
        };
        self = function (newValue) {
          var unchanged;
          if (arguments.length === 0) {
            return currentValue;
          }
          unchanged = self.equalityComparer ? self.equalityComparer(currentValue, newValue) : currentValue === newValue;
          if (!unchanged) {
            currentValue = newValue;
            return notifySubscribers(arrows, newValue);
          }
        };
        self.subscribe = function (func) {
          var arrow;
          console.assert(lodash.isFunction(func));
          arrows.push(arrow = {
            func,
            dispose() {
              return flowPrelude.remove(arrows, arrow);
            }
          });
          return arrow;
        };
        self.__observable__ = true;
        return self;
      };
      createObservableArray = createObservable;
      isObservable = function (obj) {
        if (obj.__observable__) {
          return true;
        }
        return false;
      };
    }
    createSignal = function (value, equalityComparer) {
      var observable;
      if (arguments.length === 0) {
        return createSignal(void 0, flowPrelude.never);
      }
      observable = createObservable(value);
      if (lodash.isFunction(equalityComparer)) {
        observable.equalityComparer = equalityComparer;
      }
      return observable;
    };
    _isSignal = isObservable;
    createSignals = function (array) {
      return createObservableArray(array || []);
    };
    _link = function (source, func) {
      console.assert(lodash.isFunction(source, '[signal] is not a function'));
      console.assert(lodash.isFunction(source.subscribe, '[signal] does not have a [dispose] method'));
      console.assert(lodash.isFunction(func, '[func] is not a function'));
      return source.subscribe(func);
    };
    _unlink = function (arrows) {
      var arrow;
      var _i;
      var _len;
      var _results;
      if (lodash.isArray(arrows)) {
        _results = [];
        for (_i = 0, _len = arrows.length; _i < _len; _i++) {
          arrow = arrows[_i];
          console.assert(lodash.isFunction(arrow.dispose, '[arrow] does not have a [dispose] method'));
          _results.push(arrow.dispose());
        }
        return _results;
      }
      console.assert(lodash.isFunction(arrows.dispose, '[arrow] does not have a [dispose] method'));
      return arrows.dispose();
    };
    _apply = function (sources, func) {
      return func(...lodash.map(sources, function (source) {
        return source();
      }));
    };
    _act = function (...args) {
      var func;
      var sources;
      var _i;
      sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []), func = args[_i++];
      _apply(sources, func);
      return lodash.map(sources, function (source) {
        return _link(source, function () {
          return _apply(sources, func);
        });
      });
    };
    _react = function (...args) {
      var func;
      var sources;
      var _i;
      sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []), func = args[_i++];
      return lodash.map(sources, function (source) {
        return _link(source, function () {
          return _apply(sources, func);
        });
      });
    };
    _lift = function (...args) {
      var evaluate;
      var func;
      var sources;
      var target;
      var _i;
      sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []), func = args[_i++];
      evaluate = function () {
        return _apply(sources, func);
      };
      target = createSignal(evaluate());
      lodash.map(sources, function (source) {
        return _link(source, function () {
          return target(evaluate());
        });
      });
      return target;
    };
    _merge = function (...args) {
      var evaluate;
      var func;
      var sources;
      var target;
      var _i;
      sources = args.length >= 3 ? __slice.call(args, 0, _i = args.length - 2) : (_i = 0, []), target = args[_i++], func = args[_i++];
      evaluate = function () {
        return _apply(sources, func);
      };
      target(evaluate());
      return lodash.map(sources, function (source) {
        return _link(source, function () {
          return target(evaluate());
        });
      });
    };
    return {
      slot: createSlot,
      slots: createSlots,
      signal: createSignal,
      signals: createSignals,
      isSignal: _isSignal,
      link: _link,
      unlink: _unlink,
      act: _act,
      react: _react,
      lift: _lift,
      merge: _merge
    };
  }();
}
