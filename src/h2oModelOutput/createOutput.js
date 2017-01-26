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
  switch (_.model.algo) {
    case 'kmeans':
      table = _.inspect('output - Scoring History', _.model);
      if (table) {
        const plotFunction = _.plot(
            g => g(
              g.path(g.position('iteration', 'within_cluster_sum_of_squares'),
              g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'within_cluster_sum_of_squares'),
              g.strokeColor(g.value('#1f77b4'))), g.from(table)
            )
          );
        renderPlot(
          _,
          'Scoring History',
          false,
          plotFunction
        );
      }
      break;
    case 'glm':
      table = _.inspect('output - Scoring History', _.model);
      if (table) {
        lambdaSearchParameter = lodash.find(_.model.parameters, parameter => parameter.name === 'lambda_search');
        if (lambdaSearchParameter != null ? lambdaSearchParameter.actual_value : void 0) {
          renderPlot(_, 'Scoring History', false, _.plot(g => g(g.path(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('lambda', 'explained_deviance_train'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('lambda', 'explained_deviance_test'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
        } else {
          renderPlot(_, 'Scoring History', false, _.plot(g => g(g.path(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('iteration', 'objective'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
        }
      }
      table = _.inspect('output - training_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
        renderPlot(_, `ROC Curve - Training Metrics${getAucAsLabel(_, _.model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - training_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - validation_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
        renderPlot(_, `ROC Curve - Validation Metrics${getAucAsLabel(_, _.model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - validation_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));
        renderPlot(_, `ROC Curve - Cross Validation Metrics' + ${getAucAsLabel(_, _.model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - cross_validation_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - Standardized Coefficient Magnitudes', _.model);
      if (table) {
        renderPlot(_, 'Standardized Coefficient Magnitudes', false, _.plot(g => g(g.rect(g.position('coefficients', 'names'), g.fillColor('sign')), g.from(table), g.limit(25))));
      }
      renderConfusionMatrices(_);
      break;
    case 'deeplearning':
    case 'deepwater':
      table = _.inspect('output - Scoring History', _.model);
      if (table) {
        if (table.schema.validation_logloss && table.schema.training_logloss) {
          renderPlot(_, 'Scoring History - logloss', false, _.plot(g => g(g.path(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('epochs', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
        } else if (table.schema.training_logloss) {
          renderPlot(_, 'Scoring History - logloss', false, _.plot(g => g(g.path(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
        }
        if (table.schema.training_deviance) {
          if (table.schema.validation_deviance) {
            renderPlot(_, 'Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('epochs', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
          } else {
            renderPlot(_, 'Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
          }
        } else if (table.schema.training_mse) {
          if (table.schema.validation_mse) {
            renderPlot(_, 'Scoring History - MSE', false, _.plot(g => g(g.path(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('epochs', 'validation_mse'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'validation_mse'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
          } else {
            renderPlot(_, 'Scoring History - MSE', false, _.plot(g => g(g.path(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('epochs', 'training_mse'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
          }
        }
      }
      table = _.inspect('output - training_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
        renderPlot(_, `ROC Curve - Training Metrics${getAucAsLabel(_, _.model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - training_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - validation_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
        renderPlot(_, `'ROC Curve - Validation Metrics' + ${getAucAsLabel(_, _.model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - validation_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
        renderPlot(_, `'ROC Curve - Cross Validation Metrics' + ${getAucAsLabel(_, _.model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - cross_validation_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - Variable Importances', _.model);
      if (table) {
        renderPlot(_, 'Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
      }
      renderConfusionMatrices(_);
      break;
    case 'gbm':
    case 'drf':
    case 'svm':
    case 'xgboost':
      table = _.inspect('output - Scoring History', _.model);
      if (table) {
        if (table.schema.validation_logloss && table.schema.training_logloss) {
          renderPlot(_, 'Scoring History - logloss', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('number_of_trees', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'validation_logloss'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
        } else if (table.schema.training_logloss) {
          renderPlot(_, 'Scoring History - logloss', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'training_logloss'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
        }
        if (table.schema.training_deviance) {
          if (table.schema.validation_deviance) {
            renderPlot(_, 'Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.path(g.position('number_of_trees', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.point(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'validation_deviance'), g.strokeColor(g.value('#ff7f0e'))), g.from(table))));
          } else {
            renderPlot(_, 'Scoring History - Deviance', false, _.plot(g => g(g.path(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.point(g.position('number_of_trees', 'training_deviance'), g.strokeColor(g.value('#1f77b4'))), g.from(table))));
          }
        }
      }
      table = _.inspect('output - training_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
        renderPlot(_, `ROC Curve - Training Metrics${getAucAsLabel(_, _.model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - training_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - validation_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
        renderPlot(_, `ROC Curve - Validation Metrics${getAucAsLabel(_, _.model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - validation_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
        renderPlot(_, `ROC Curve - Cross Validation Metrics${getAucAsLabel(_, _.model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - cross_validation_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - Variable Importances', _.model);
      if (table) {
        renderPlot(_, 'Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
      }
      renderConfusionMatrices(_);
      break;

    case 'stackedensemble':
      table = _.inspect('output - training_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
        renderPlot(_, `ROC Curve - Training Metrics${getAucAsLabel(_, _.model, 'output - training_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - training_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - validation_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
        renderPlot(_, `'ROC Curve - Validation Metrics${getAucAsLabel(_, _.model, 'output - validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - validation_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _.model);
      if (table) {
        plotter = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
        renderPlot(_, `ROC Curve - Cross Validation Metrics${getAucAsLabel(_, _.model, 'output - cross_validation_metrics')}`, false, plotter, getThresholdsAndCriteria(_, table, 'output - cross_validation_metrics - Maximum Metrics'));
      }
      table = _.inspect('output - Variable Importances', _.model);
      if (table) {
        renderPlot(_, 'Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
      }
      renderConfusionMatrices(_);
      break;
    default:
        // do nothing
  }
    // end of stackedensemble

  table = _.inspect('output - training_metrics - Gains/Lift Table', _.model);
  if (table) {
    renderPlot(_, 'Training Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
  }
  table = _.inspect('output - validation_metrics - Gains/Lift Table', _.model);
  if (table) {
    renderPlot(_, 'Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
  }
  table = _.inspect('output - cross_validation_metrics - Gains/Lift Table', _.model);
  if (table) {
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
    if (table) {
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
