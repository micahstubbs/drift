import { createSlot } from './createSlot';
import { createSlots } from './createSlots';
import { createObservableFunction } from './createObservableFunction';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

//
// Reactive programming / Dataflow programming wrapper over ko
//

export function dataflow() {
  const lodash = window._;
  const Flow = window.Flow;
  const ko = window.ko;
  const __slice = [].slice;
  Flow.Dataflow = (() => {
    let createObservable;
    let createObservableArray;
    let isObservable;
    if (typeof ko !== 'undefined' && ko !== null) {
      createObservable = ko.observable;
      createObservableArray = ko.observableArray;
      isObservable = ko.isObservable;
    } else {
      createObservable = createObservableFunction;
      createObservableArray = createObservable;
      isObservable = obj => {
        if (obj.__observable__) {
          return true;
        }
        return false;
      };
    }
    const createSignal = function (value, equalityComparer) {
      if (arguments.length === 0) {
        return createSignal(void 0, flowPrelude.never);
      }
      const observable = createObservable(value);
      if (lodash.isFunction(equalityComparer)) {
        observable.equalityComparer = equalityComparer;
      }
      return observable;
    };
    const _isSignal = isObservable;
    const createSignals = array => createObservableArray(array || []);
    const _link = (source, func) => {
      console.assert(lodash.isFunction(source, '[signal] is not a function'));
      console.assert(lodash.isFunction(source.subscribe, '[signal] does not have a [dispose] method'));
      console.assert(lodash.isFunction(func, '[func] is not a function'));
      return source.subscribe(func);
    };
    const _unlink = arrows => {
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
    //
    // Combinators
    //
    const _apply = (sources, func) => func(...lodash.map(sources, source => source()));
    const _act = (...args) => {
      let _i;
      const sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []);
      const func = args[_i++];
      _apply(sources, func);
      return lodash.map(sources, source => _link(source, () => _apply(sources, func)));
    };
    const _react = (...args) => {
      let _i;
      const sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []);
      const func = args[_i++];
      return lodash.map(sources, source => _link(source, () => _apply(sources, func)));
    };
    const _lift = (...args) => {
      let _i;
      const sources = args.length >= 2 ? __slice.call(args, 0, _i = args.length - 1) : (_i = 0, []);
      const func = args[_i++];
      const evaluate = () => _apply(sources, func);
      const target = createSignal(evaluate());
      lodash.map(sources, source => _link(source, () => target(evaluate())));
      return target;
    };
    const _merge = (...args) => {
      let _i;
      const sources = args.length >= 3 ? __slice.call(args, 0, _i = args.length - 2) : (_i = 0, []);
      const target = args[_i++];
      const func = args[_i++];
      const evaluate = () => _apply(sources, func);
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
      merge: _merge,
    };
  })();
}
