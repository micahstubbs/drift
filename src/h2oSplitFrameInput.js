import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oSplitFrameInput(_, _go, _frameKey) {
  const lodash = window._;
  const Flow = window.Flow;
  let addSplit;
  let addSplitRatio;
  let collectKeys;
  let collectRatios;
  let computeSplits;
  let createSplit;
  let createSplitName;
  let format4f;
  let initialize;
  let splitFrame;
  let updateSplitRatiosAndNames;
  let _frame;
  let _frames;
  let _lastSplitKey;
  let _lastSplitRatio;
  let _lastSplitRatioText;
  let _seed;
  let _splits;
  let _validationMessage;
  _frames = Flow.Dataflow.signal([]);
  _frame = Flow.Dataflow.signal(null);
  _lastSplitRatio = Flow.Dataflow.signal(1);
  format4f = value => value.toPrecision(4).replace(/0+$/, '0');
  _lastSplitRatioText = Flow.Dataflow.lift(_lastSplitRatio, ratio => {
    if (lodash.isNaN(ratio)) {
      return ratio;
    }
    return format4f(ratio);
  });
  _lastSplitKey = Flow.Dataflow.signal('');
  _splits = Flow.Dataflow.signals([]);
  _seed = Flow.Dataflow.signal(Math.random() * 1000000 | 0);
  Flow.Dataflow.react(_splits, () => updateSplitRatiosAndNames());
  _validationMessage = Flow.Dataflow.signal('');
  collectRatios = () => {
    let entry;
    let _i;
    let _len;
    let _ref;
    let _results;
    _ref = _splits();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entry = _ref[_i];
      _results.push(entry.ratio());
    }
    return _results;
  };
  collectKeys = () => {
    let entry;
    let splitKeys;
    splitKeys = ((() => {
      let _i;
      let _len;
      let _ref;
      let _results;
      _ref = _splits();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        _results.push(entry.key().trim());
      }
      return _results;
    })());
    splitKeys.push(_lastSplitKey().trim());
    return splitKeys;
  };
  createSplitName = (key, ratio) => `${key}_${format4f(ratio)}`;
  updateSplitRatiosAndNames = () => {
    let entry;
    let frame;
    let frameKey;
    let lastSplitRatio;
    let ratio;
    let totalRatio;
    let _i;
    let _j;
    let _len;
    let _len1;
    let _ref;
    let _ref1;
    totalRatio = 0;
    _ref = collectRatios();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ratio = _ref[_i];
      totalRatio += ratio;
    }
    lastSplitRatio = _lastSplitRatio(1 - totalRatio);
    frameKey = (frame = _frame()) ? frame : 'frame';
    _ref1 = _splits();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      entry = _ref1[_j];
      entry.key(createSplitName(frameKey, entry.ratio()));
    }
    _lastSplitKey(createSplitName(frameKey, _lastSplitRatio()));
  };
  computeSplits = go => {
    let key;
    let ratio;
    let splitKeys;
    let splitRatios;
    let totalRatio;
    let _i;
    let _j;
    let _len;
    let _len1;
    if (!_frame()) {
      return go('Frame not specified.');
    }
    splitRatios = collectRatios();
    totalRatio = 0;
    for (_i = 0, _len = splitRatios.length; _i < _len; _i++) {
      ratio = splitRatios[_i];
      if (
        ratio > 0 &&
        ratio < 1
      ) {
        totalRatio += ratio;
      } else {
        return go('One or more split ratios are invalid. Ratios should between 0 and 1.');
      }
    }
    if (totalRatio >= 1) {
      return go('Sum of ratios is >= 1.');
    }
    splitKeys = collectKeys();
    for (_j = 0, _len1 = splitKeys.length; _j < _len1; _j++) {
      key = splitKeys[_j];
      if (key === '') {
        return go('One or more keys are empty or invalid.');
      }
    }
    if (splitKeys.length < 2) {
      return go('Please specify at least two splits.');
    }
    if (splitKeys.length !== lodash.unique(splitKeys).length) {
      return go('Duplicate keys specified.');
    }
    return go(null, splitRatios, splitKeys);
  };
  createSplit = ratio => {
    let self;
    let _key;
    let _ratio;
    let _ratioText;
    _ratioText = Flow.Dataflow.signal(`${ratio}`);
    _key = Flow.Dataflow.signal('');
    _ratio = Flow.Dataflow.lift(_ratioText, text => parseFloat(text));
    Flow.Dataflow.react(_ratioText, updateSplitRatiosAndNames);
    flowPrelude.remove = () => _splits.remove(self);
    return self = {
      key: _key,
      ratioText: _ratioText,
      ratio: _ratio,
      remove: flowPrelude.remove
    };
  };
  addSplitRatio = ratio => _splits.push(createSplit(ratio));
  addSplit = () => addSplitRatio(0);
  splitFrame = () => computeSplits((error, splitRatios, splitKeys) => {
    if (error) {
      return _validationMessage(error);
    }
    _validationMessage('');
    return _.insertAndExecuteCell('cs',
      `splitFrame ${flowPrelude.stringify(_frame())}, ${flowPrelude.stringify(splitRatios)}, ${flowPrelude.stringify(splitKeys)}, ${_seed()}`); // eslint-disable-line
  });
  initialize = () => {
    _.requestFrames((error, frames) => {
      let frame;
      let frameKeys;
      if (!error) {
        frameKeys = ((() => {
          let _i;
          let _len;
          let _results;
          _results = [];
          for (_i = 0, _len = frames.length; _i < _len; _i++) {
            frame = frames[_i];
            if (!frame.is_text) {
              _results.push(frame.frame_id.name);
            }
          }
          return _results;
        })());
        frameKeys.sort();
        _frames(frameKeys);
        return _frame(_frameKey);
      }
    });
    addSplitRatio(0.75);
    return lodash.defer(_go);
  };
  initialize();
  return {
    frames: _frames,
    frame: _frame,
    lastSplitRatio: _lastSplitRatio,
    lastSplitRatioText: _lastSplitRatioText,
    lastSplitKey: _lastSplitKey,
    splits: _splits,
    seed: _seed,
    addSplit,
    splitFrame,
    validationMessage: _validationMessage,
    template: 'flow-split-frame-input'
  };
}

