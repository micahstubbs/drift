import { createObservableFunction } from './createObservableFunction';
import { isObservableFunction } from './isObservableFunction';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function createSignal(value, equalityComparer) {
  const lodash = window._;
  const ko = window.ko;

  // decide if we use knockout observables
  // or Flow custom observables
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
    isObservable = isObservableFunction;
  }

  // create the signal
  if (arguments.length === 0) {
    return createSignal(void 0, flowPrelude.never);
  }
  const observable = createObservable(value);
  if (lodash.isFunction(equalityComparer)) {
    observable.equalityComparer = equalityComparer;
  }
  return observable;
}
