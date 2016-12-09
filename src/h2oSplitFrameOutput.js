import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oSplitFrameOutput(_, _go, _splitFrameResult) {
  const lodash = window._;
  let computeRatios;
  let createFrameView;
  let index;
  let key;
  let _frames;
  let _ratios;
  computeRatios = sourceRatios => {
    let ratio;
    let ratios;
    let total;
    total = 0;
    ratios = ((() => {
      let _i;
      let _len;
      let _results;
      _results = [];
      for (_i = 0, _len = sourceRatios.length; _i < _len; _i++) {
        ratio = sourceRatios[_i];
        total += ratio;
        _results.push(ratio);
      }
      return _results;
    })());
    ratios.push(1 - total);
    return ratios;
  };
  createFrameView = (key, ratio) => {
    let self;
    let view;
    view = () => _.insertAndExecuteCell('cs', `getFrameSummary ${flowPrelude.stringify(key)}`);
    return self = {
      key,
      ratio,
      view
    };
  };
  _ratios = computeRatios(_splitFrameResult.ratios);
  _frames = ((() => {
    let _i;
    let _len;
    let _ref;
    let _results;
    _ref = _splitFrameResult.keys;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      key = _ref[index];
      _results.push(createFrameView(key, _ratios[index]));
    }
    return _results;
  })());
  lodash.defer(_go);
  return {
    frames: _frames,
    template: 'flow-split-frame-output'
  };
}

