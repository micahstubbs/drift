import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oPredictInput(_, _go, opt) {
  var lodash = window._;
  var Flow = window.Flow;
  var predict;
  var _canPredict;
  var _computeDeepFeaturesHiddenLayer;
  var _computeLeafNodeAssignment;
  var _computeReconstructionError;
  var _deepFeaturesHiddenLayer;
  var _deepFeaturesHiddenLayerValue;
  var _destinationKey;
  var _exception;
  var _exemplarIndex;
  var _exemplarIndexValue;
  var _frames;
  var _hasExemplarIndex;
  var _hasFrames;
  var _hasLeafNodeAssignment;
  var _hasModels;
  var _hasReconError;
  var _isDeepLearning;
  var _models;
  var _ref;
  var _selectedFrame;
  var _selectedFrames;
  var _selectedFramesCaption;
  var _selectedModel;
  var _selectedModels;
  var _selectedModelsCaption;
  _destinationKey = Flow.Dataflow.signal((_ref = opt.predictions_frame) != null ? _ref : `prediction-${Flow.Util.uuid()}`);
  _selectedModels = opt.models ? opt.models : opt.model ? [opt.model] : [];
  _selectedFrames = opt.frames ? opt.frames : opt.frame ? [opt.frame] : [];
  _selectedModelsCaption = _selectedModels.join(', ');
  _selectedFramesCaption = _selectedFrames.join(', ');
  _exception = Flow.Dataflow.signal(null);
  _selectedFrame = Flow.Dataflow.signal(null);
  _selectedModel = Flow.Dataflow.signal(null);
  _hasFrames = _selectedFrames.length;
  _hasModels = _selectedModels.length;
  _frames = Flow.Dataflow.signals([]);
  _models = Flow.Dataflow.signals([]);
  _isDeepLearning = Flow.Dataflow.lift(_selectedModel, function (model) {
    return model && model.algo === 'deeplearning';
  });
  _hasReconError = Flow.Dataflow.lift(_selectedModel, function (model) {
    var parameter;
    var _i;
    var _len;
    var _ref1;
    if (model) {
      if (model.algo === 'deeplearning') {
        _ref1 = model.parameters;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          parameter = _ref1[_i];
          if (parameter.name === 'autoencoder' && parameter.actual_value === true) {
            return true;
          }
        }
      }
    }
    return false;
  });
  _hasLeafNodeAssignment = Flow.Dataflow.lift(_selectedModel, function (model) {
    if (model) {
      switch (model.algo) {
        case 'gbm':
        case 'drf':
          return true;
        default:
          return false;
      }
    }
  });
  _hasExemplarIndex = Flow.Dataflow.lift(_selectedModel, function (model) {
    if (model) {
      switch (model.algo) {
        case 'aggregator':
          return true;
        default:
          return false;
      }
    }
  });
  _computeReconstructionError = Flow.Dataflow.signal(false);
  _computeDeepFeaturesHiddenLayer = Flow.Dataflow.signal(false);
  _computeLeafNodeAssignment = Flow.Dataflow.signal(false);
  _deepFeaturesHiddenLayer = Flow.Dataflow.signal(0);
  _deepFeaturesHiddenLayerValue = Flow.Dataflow.lift(_deepFeaturesHiddenLayer, function (text) {
    return parseInt(text, 10);
  });
  _exemplarIndex = Flow.Dataflow.signal(0);
  _exemplarIndexValue = Flow.Dataflow.lift(_exemplarIndex, function (text) {
    return parseInt(text, 10);
  });
  _canPredict = Flow.Dataflow.lift(_selectedFrame, _selectedModel, _hasReconError, _computeReconstructionError, _computeDeepFeaturesHiddenLayer, _deepFeaturesHiddenLayerValue, _exemplarIndexValue, _hasExemplarIndex, function (frame, model, hasReconError, computeReconstructionError, computeDeepFeaturesHiddenLayer, deepFeaturesHiddenLayerValue, exemplarIndexValue, hasExemplarIndex) {
    var hasFrameAndModel;
    var hasValidOptions;
    hasFrameAndModel = frame && model || _hasFrames && model || _hasModels && frame || _hasModels && hasExemplarIndex;
    hasValidOptions = hasReconError ? computeReconstructionError ? true : computeDeepFeaturesHiddenLayer ? !lodash.isNaN(deepFeaturesHiddenLayerValue) : true : true;
    return hasFrameAndModel && hasValidOptions;
  });
  if (!_hasFrames) {
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
  }
  if (!_hasModels) {
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
  }
  if (!_selectedModel()) {
    if (opt.model && lodash.isString(opt.model)) {
      _.requestModel(opt.model, function (error, model) {
        return _selectedModel(model);
      });
    }
  }
  predict = function () {
    var cs;
    var destinationKey;
    var frameArg;
    var modelArg;
    if (_hasFrames) {
      frameArg = _selectedFrames.length > 1 ? _selectedFrames : lodash.head(_selectedFrames);
      modelArg = _selectedModel();
    } else if (_hasModels) {
      modelArg = _selectedModels.length > 1 ? _selectedModels : lodash.head(_selectedModels);
      frameArg = _selectedFrame();
    } else {
      modelArg = _selectedModel();
      frameArg = _selectedFrame();
    }
    destinationKey = _destinationKey();
    cs = `predict model: ${flowPrelude.stringify(modelArg)}, frame: ${flowPrelude.stringify(frameArg)}`;
    if (destinationKey) {
      cs += `, predictions_frame: ${flowPrelude.stringify(destinationKey)}`;
    }
    if (_hasReconError()) {
      if (_computeReconstructionError()) {
        cs += ', reconstruction_error: true';
      }
    }
    if (_computeDeepFeaturesHiddenLayer()) {
      cs += `, deep_features_hidden_layer: ${_deepFeaturesHiddenLayerValue()}`;
    }
    if (_hasLeafNodeAssignment()) {
      if (_computeLeafNodeAssignment()) {
        cs += ', leaf_node_assignment: true';
      }
    }
    if (_hasExemplarIndex()) {
      cs += `, exemplar_index: ${_exemplarIndexValue()}`;
    }
    return _.insertAndExecuteCell('cs', cs);
  };
  lodash.defer(_go);
  return {
    destinationKey: _destinationKey,
    exception: _exception,
    hasModels: _hasModels,
    hasFrames: _hasFrames,
    canPredict: _canPredict,
    selectedFramesCaption: _selectedFramesCaption,
    selectedModelsCaption: _selectedModelsCaption,
    selectedFrame: _selectedFrame,
    selectedModel: _selectedModel,
    frames: _frames,
    models: _models,
    predict,
    isDeepLearning: _isDeepLearning,
    hasReconError: _hasReconError,
    hasLeafNodeAssignment: _hasLeafNodeAssignment,
    hasExemplarIndex: _hasExemplarIndex,
    computeReconstructionError: _computeReconstructionError,
    computeDeepFeaturesHiddenLayer: _computeDeepFeaturesHiddenLayer,
    computeLeafNodeAssignment: _computeLeafNodeAssignment,
    deepFeaturesHiddenLayer: _deepFeaturesHiddenLayer,
    exemplarIndex: _exemplarIndex,
    template: 'flow-predict-input'
  };
};
  