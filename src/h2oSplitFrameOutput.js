export function h2oSplitFrameOutput(_, _go, _splitFrameResult) {
  var lodash = window._;
  var computeRatios;
  var createFrameView;
  var index;
  var key;
  var _frames;
  var _ratios;
  computeRatios = function (sourceRatios) {
    var ratio;
    var ratios;
    var total;
    total = 0;
    ratios = (function () {
      var _i;
      var _len;
      var _results;
      _results = [];
      for (_i = 0, _len = sourceRatios.length; _i < _len; _i++) {
        ratio = sourceRatios[_i];
        total += ratio;
        _results.push(ratio);
      }
      return _results;
    }());
    ratios.push(1 - total);
    return ratios;
  };
  createFrameView = function (key, ratio) {
    var self;
    var view;
    view = function () {
      return _.insertAndExecuteCell('cs', `getFrameSummary ${Flow.Prelude.stringify(key)}`);
    };
    return self = {
      key,
      ratio,
      view
    };
  };
  _ratios = computeRatios(_splitFrameResult.ratios);
  _frames = (function () {
    var _i;
    var _len;
    var _ref;
    var _results;
    _ref = _splitFrameResult.keys;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      key = _ref[index];
      _results.push(createFrameView(key, _ratios[index]));
    }
    return _results;
  }());
  lodash.defer(_go);
  return {
    frames: _frames,
    template: 'flow-split-frame-output'
  };
};
  