export function h2oPartialDependenceInput(_, _go) {
  var lodash = window._;
  var Flow = window.Flow;
  var _canCompute;
  var _compute;
  var _destinationKey;
  var _exception;
  var _frames;
  var _models;
  var _nbins;
  var _selectedFrame;
  var _selectedModel;
  _exception = Flow.Dataflow.signal(null);
  _destinationKey = Flow.Dataflow.signal(`ppd-${Flow.Util.uuid()}`);
  _frames = Flow.Dataflow.signals([]);
  _models = Flow.Dataflow.signals([]);
  _selectedModel = Flow.Dataflow.signals(null);
  _selectedFrame = Flow.Dataflow.signal(null);
  _nbins = Flow.Dataflow.signal(20);
  _canCompute = Flow.Dataflow.lift(_destinationKey, _selectedFrame, _selectedModel, _nbins, function (dk, sf, sm, nb) {
    return dk && sf && sm && nb;
  });
  _compute = function () {
    var cs;
    var opts;
    if (!_canCompute()) {
      return;
    }
    opts = {
      destination_key: _destinationKey(),
      model_id: _selectedModel(),
      frame_id: _selectedFrame(),
      nbins: _nbins()
    };
    cs = `buildPartialDependence ${Flow.Prelude.stringify(opts)}`;
    return _.insertAndExecuteCell('cs', cs);
  };
  _.requestFrames(function (error, frames) {
    var frame;
    if (error) {
      return _exception(new Flow.Error('Error fetching frame list.', error));
    }
    return _frames(function () {
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
  });
  _.requestModels(function (error, models) {
    var model;
    if (error) {
      return _exception(new Flow.Error('Error fetching model list.', error));
    }
    return _models(function () {
      var _i;
      var _len;
      var _results;
      _results = [];
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        _results.push(model.model_id.name);
      }
      return _results;
    }());
  });
  lodash.defer(_go);
  return {
    destinationKey: _destinationKey,
    frames: _frames,
    models: _models,
    selectedModel: _selectedModel,
    selectedFrame: _selectedFrame,
    nbins: _nbins,
    compute: _compute,
    canCompute: _canCompute,
    template: 'flow-partial-dependence-input'
  };
};
  