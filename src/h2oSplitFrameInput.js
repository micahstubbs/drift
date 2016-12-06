export function h2oSplitFrameInput(_, _go, _frameKey) {
  var lodash = window._;
  var Flow = window.Flow;
  var addSplit;
  var addSplitRatio;
  var collectKeys;
  var collectRatios;
  var computeSplits;
  var createSplit;
  var createSplitName;
  var format4f;
  var initialize;
  var splitFrame;
  var updateSplitRatiosAndNames;
  var _frame;
  var _frames;
  var _lastSplitKey;
  var _lastSplitRatio;
  var _lastSplitRatioText;
  var _seed;
  var _splits;
  var _validationMessage;
  _frames = Flow.Dataflow.signal([]);
  _frame = Flow.Dataflow.signal(null);
  _lastSplitRatio = Flow.Dataflow.signal(1);
  format4f = function (value) {
    return value.toPrecision(4).replace(/0+$/, '0');
  };
  _lastSplitRatioText = Flow.Dataflow.lift(_lastSplitRatio, function (ratio) {
    if (lodash.isNaN(ratio)) {
      return ratio;
    }
    return format4f(ratio);
  });
  _lastSplitKey = Flow.Dataflow.signal('');
  _splits = Flow.Dataflow.signals([]);
  _seed = Flow.Dataflow.signal(Math.random() * 1000000 | 0);
  Flow.Dataflow.react(_splits, function () {
    return updateSplitRatiosAndNames();
  });
  _validationMessage = Flow.Dataflow.signal('');
  collectRatios = function () {
    var entry;
    var _i;
    var _len;
    var _ref;
    var _results;
    _ref = _splits();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      entry = _ref[_i];
      _results.push(entry.ratio());
    }
    return _results;
  };
  collectKeys = function () {
    var entry;
    var splitKeys;
    splitKeys = (function () {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = _splits();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entry = _ref[_i];
        _results.push(entry.key().trim());
      }
      return _results;
    }());
    splitKeys.push(_lastSplitKey().trim());
    return splitKeys;
  };
  createSplitName = function (key, ratio) {
    return `${key}_${format4f(ratio)}`;
  };
  updateSplitRatiosAndNames = function () {
    var entry;
    var frame;
    var frameKey;
    var lastSplitRatio;
    var ratio;
    var totalRatio;
    var _i;
    var _j;
    var _len;
    var _len1;
    var _ref;
    var _ref1;
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
  computeSplits = function (go) {
    var key;
    var ratio;
    var splitKeys;
    var splitRatios;
    var totalRatio;
    var _i;
    var _j;
    var _len;
    var _len1;
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
  createSplit = function (ratio) {
    var self;
    var _key;
    var _ratio;
    var _ratioText;
    _ratioText = Flow.Dataflow.signal(`${ratio}`);
    _key = Flow.Dataflow.signal('');
    _ratio = Flow.Dataflow.lift(_ratioText, function (text) {
      return parseFloat(text);
    });
    Flow.Dataflow.react(_ratioText, updateSplitRatiosAndNames);
    Flow.Prelude.remove = function () {
      return _splits.remove(self);
    };
    return self = {
      key: _key,
      ratioText: _ratioText,
      ratio: _ratio,
      remove: Flow.Prelude.remove
    };
  };
  addSplitRatio = function (ratio) {
    return _splits.push(createSplit(ratio));
  };
  addSplit = function () {
    return addSplitRatio(0);
  };
  splitFrame = function () {
    return computeSplits(function (error, splitRatios, splitKeys) {
      if (error) {
        return _validationMessage(error);
      }
      _validationMessage('');
      return _.insertAndExecuteCell('cs',
        `splitFrame ${Flow.Prelude.stringify(_frame())}, ${Flow.Prelude.stringify(splitRatios)}, ${Flow.Prelude.stringify(splitKeys)}, ${_seed()}`); // eslint-disable-line
    });
  };
  initialize = function () {
    _.requestFrames(function (error, frames) {
      var frame;
      var frameKeys;
      if (!error) {
        frameKeys = (function () {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = frames.length; _i < _len; _i++) {
            frame = frames[_i];
            if (!frame.is_text) {
              _results.push(frame.frame_id.name);
            }
          }
          return _results;
        }());
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
};
  