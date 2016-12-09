import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function dataflow() {
  const lodash = window._;
  const Flow = window.Flow;
  const __slice = [].slice;
  Flow.Dataflow = (() => {
    let createObservable;
    let createObservableArray;
    let createSignal;
    let createSignals;
    let createSlot;
    let createSlots;
    let isObservable;
    let _act;
    let _apply;
    let _isSignal;
    let _lift;
    let _link;
    let _merge;
    let _react;
    let _unlink;
    createSlot = () => {
      let arrow;
      let self;
      arrow = null;
      self = function () {
        let args;
        args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
        if (arrow) {
          return arrow.func.apply(null, args);
        }
        return void 0;
      };
      self.subscribe = func => {
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
      self.dispose = () => {
        if (arrow) {
          return arrow.dispose();
        }
      };
      return self;
    };
    createSlots = () => {
      let arrows;
      let self;
      arrows = [];
      self = function () {
        let args;
        args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
        return lodash.map(arrows, arrow => arrow.func.apply(null, args));
      };
      self.subscribe = func => {
        let arrow;
        console.assert(lodash.isFunction(func));
        arrows.push(arrow = {
          func,
          dispose() {
            return flowPrelude.remove(arrows, arrow);
          }
        });
        return arrow;
      };
      self.dispose = () => lodash.forEach(flowPrelude.copy(arrows), arrow => arrow.dispose());
      return self;
    };
    if (typeof ko !== 'undefined' && ko !== null) {
      createObservable = ko.observable;
      createObservableArray = ko.observableArray;
      isObservable = ko.isObservable;
    } else {
      createObservable = initialValue => {
        let arrows;
        let currentValue;
        let notifySubscribers;
        let self;
        arrows = [];
        currentValue = initialValue;
        notifySubscribers = (arrows, newValue) => {
          let arrow;
          let _i;
          let _len;
          for (_i = 0, _len = arrows.length; _i < _len; _i++) {
            arrow = arrows[_i];
            arrow.func(newValue);
          }
        };
        self = function (newValue) {
          let unchanged;
          if (arguments.length === 0) {
            return currentValue;
          }
          unchanged = self.equalityComparer ? self.equalityComparer(currentValue, newValue) : currentValue === newValue;
          if (!unchanged) {
            currentValue = newValue;
            return notifySubscribers(arrows, newValue);
          }
        };
        self.subscribe = func => {
          let arrow;
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
      isObservable = obj => {
        if (obj.__observable__) {
          return true;
        }
        return false;
      };
    }
    createSignal = function (value, equalityComparer) {
      let observable;
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
    createSignals = array => createObservableArray(array || []);
    _link = (source, func) => {
      console.assert(lodash.isFunction(source, '[signal] is not a function'));
      console.assert(lodash.isFunction(source.subscribe, '[signal] does not have a [dispose] method'));
      console.assert(lodash.isFunction(func, '[func] is not a function'));
      return source.subscribe(func);
    };
    _unlink = arrows => {
      let arrow;
      let _i;
      let _len;
      let _results;
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
    _apply = (sources, func) => func(...lodash.map(sources, source => source()));
    _act = (...args) => {
      let func;
      let sources;
      let _i;
      sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []), func = args[_i++];
      _apply(sources, func);
      return lodash.map(sources, source => _link(source, () => _apply(sources, func)));
    };
    _react = (...args) => {
      let func;
      let sources;
      let _i;
      sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []), func = args[_i++];
      return lodash.map(sources, source => _link(source, () => _apply(sources, func)));
    };
    _lift = (...args) => {
      let evaluate;
      let func;
      let sources;
      let target;
      let _i;
      sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []), func = args[_i++];
      evaluate = () => _apply(sources, func);
      target = createSignal(evaluate());
      lodash.map(sources, source => _link(source, () => target(evaluate())));
      return target;
    };
    _merge = (...args) => {
      let evaluate;
      let func;
      let sources;
      let target;
      let _i;
      sources = args.length >= 3 ? __slice.call(args, 0, _i = args.length - 2) : (_i = 0, []), target = args[_i++], func = args[_i++];
      evaluate = () => _apply(sources, func);
      target(evaluate());
      return lodash.map(sources, source => _link(source, () => target(evaluate())));
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
  })();
}
