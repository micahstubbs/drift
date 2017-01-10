import { createSlot } from './createSlot';
import { createSlots } from './createSlots';
import { isObservableFunction } from './isObservableFunction';
import { _link } from './_link';
import { _unlink } from './_unlink';
import { createSignal } from './createSignal';
import { createSignals } from './createSignals';

//
// Combinators
//
import { _apply } from './_apply';
import { _act } from './_act';
import { _react } from './_react';
import { _lift } from './_lift';
import { _merge } from './_merge';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

//
// Reactive programming / Dataflow programming wrapper over knockout
//
export function dataflow() {
  const lodash = window._;
  const Flow = window.Flow;
  const ko = window.ko;
  const __slice = [].slice;
  Flow.Dataflow = (() => {
    let isObservable;
    if (typeof ko !== 'undefined' && ko !== null) {
      isObservable = ko.isObservable;
    } else {
      isObservable = isObservableFunction;
    }
    const _isSignal = isObservable;
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
