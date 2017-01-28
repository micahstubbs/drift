import getAucAsLabel from './getAucAsLabel';
import getThresholdsAndCriteria from './getThresholdsAndCriteria';
import renderPlot from './renderPlot';
import renderConfusionMatrices from './renderConfusionMatrices';
import toggle from './toggle';
import cloneModel from './cloneModel';
import predict from './predict';
import inspect from './inspect';
import previewPojo from './previewPojo';
import downloadPojo from './downloadPojo';
import downloadMojo from './downloadMojo';
import exportModel from './exportModel';
import deleteModel from './deleteModel';
import plotKMeansScoringHistory from './plotKMeansScoringHistory';
import plotGainsLiftTrainingMetrics from './plotGainsLiftTrainingMetrics';

import renderGLMPlots from './renderGLMPlots';
import renderDeepNetPlots from './renderDeepNetPlots';
import renderTreeAlgoPlots from './renderTreeAlgoPlots';
import renderStackedEnsemblePlots from './renderStackedEnsemblePlots';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export default function createOutput(_) {
  const lodash = window._;
  const Flow = window.Flow;
  let confusionMatrix;
  let lambdaSearchParameter;
  let output;
  let plotter;
  let table;
  let tableName;
  let _i;
  let _len;
  let _ref;
  let _ref1;
  let _ref10;
  let _ref11;
  let _ref12;
  let _ref13;
  let _ref14;
  let _ref15;
  let _ref16;
  let _ref17;
  let _ref18;
  let _ref19;
  let _ref2;
  let _ref20;
  let _ref21;
  let _ref22;
  let _ref23;
  let _ref25;
  let _ref3;
  let _ref4;
  let _ref5;
  let _ref6;
  let _ref7; let _ref8;
  let _ref9;
  _.modelOutputIsExpanded = Flow.Dataflow.signal(false);
  _.plots = Flow.Dataflow.signals([]);
  _.pojoPreview = Flow.Dataflow.signal(null);
  const _isPojoLoaded = Flow.Dataflow.lift(_.pojoPreview, preview => {
    if (preview) {
      return true;
    }
    return false;
  });

    // TODO use _.enumerate()
  const _inputParameters = lodash.map(_.model.parameters, parameter => {
    const type = parameter.type;
    const defaultValue = parameter.default_value;
    const actualValue = parameter.actual_value;
    const label = parameter.label;
    const help = parameter.help;
    const value = (() => {
      switch (type) {
        case 'Key<Frame>':
        case 'Key<Model>':
          if (actualValue) {
            return actualValue.name;
          }
          return null;
            // break; // no-unreachable
        case 'VecSpecifier':
          if (actualValue) {
            return actualValue.column_name;
          }
          return null;
            // break; // no-unreachable
        case 'string[]':
        case 'byte[]':
        case 'short[]':
        case 'int[]':
        case 'long[]':
        case 'float[]':
        case 'double[]':
          if (actualValue) {
            return actualValue.join(', ');
          }
          return null;
            // break; // no-unreachable
        default:
          return actualValue;
      }
    })();
    return {
      label,
      value,
      help,
      isModified: defaultValue === actualValue,
    };
  });
  console.log('_.model.algo from createOutput', _.model.algo);
  switch (_.model.algo) {
    case 'kmeans':
      table = _.inspect('output - Scoring History', _.model);
      if (typeof table !== 'undefined') {
        plotKMeansScoringHistory(_, table);
      }
      break;
    case 'glm':
      renderGLMPlots(_, table);
      renderConfusionMatrices(_);
      break;
    case 'deeplearning':
    case 'deepwater':
      renderDeepNetPlots(_, table);
      renderConfusionMatrices(_);
      break;
    case 'gbm':
    case 'drf':
    case 'svm':
    case 'xgboost':
      renderTreeAlgoPlots(_, table);
      renderConfusionMatrices(_);
      break;
    case 'stackedensemble':
      renderStackedEnsemblePlots(_, table);
      renderConfusionMatrices(_);
      break;
    default:
        // do nothing
  }

  table = _.inspect('output - training_metrics - Gains/Lift Table', _.model);
  if (typeof table !== 'undefined') {
    plotGainsLiftTrainingMetrics(_, table);
  }
  table = _.inspect('output - validation_metrics - Gains/Lift Table', _.model);
  if (typeof table !== 'undefined') {
    renderPlot(_, 'Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
  }
  table = _.inspect('output - cross_validation_metrics - Gains/Lift Table', _.model);
  if (typeof table !== 'undefined') {
    renderPlot(_, 'Cross Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
  }
  const _ref24 = _.ls(_.model);
  for (_i = 0, _len = _ref24.length; _i < _len; _i++) {
    tableName = _ref24[_i];
    if (!(tableName !== 'parameters')) {
      continue;
    }
    _ref25 = _.model.output;

      // Skip confusion matrix tables for multinomial models
    output = (_ref25 != null ? _ref25.model_category : void 0) === 'Multinomial';
    if (output) {
      if (tableName.indexOf('output - training_metrics - cm') === 0) {
        continue;
      } else if (tableName.indexOf('output - validation_metrics - cm') === 0) {
        continue;
      } else if (tableName.indexOf('output - cross_validation_metrics - cm') === 0) {
        continue;
      }
    }
    table = _.inspect(tableName, _.model);
    if (typeof table !== 'undefined') {
      renderPlot(_, tableName + (table.metadata.description ? ` (${table.metadata.description})` : ''), true, _.plot(g => g(table.indices.length > 1 ? g.select() : g.select(0), g.from(table))));
    }
  }
  return {
    key: _.model.model_id,
    algo: _.model.algo_full_name,
    plots: _.plots,
    inputParameters: _inputParameters,
    isExpanded: _.modelOutputIsExpanded,
    toggle: toggle.bind(this, _),
    cloneModel,
    predict: predict.bind(this, _),
    inspect: inspect.bind(this, _),
    previewPojo: previewPojo.bind(this, _),
    downloadPojo: downloadPojo.bind(this, _),
    downloadMojo: downloadMojo.bind(this, _),
    pojoPreview: _.pojoPreview,
    isPojoLoaded: _isPojoLoaded,
    exportModel: exportModel.bind(this, _),
    deleteModel: deleteModel.bind(this, _),
  };
}
