import renderPlot from './renderPlot';
import getAucAsLabel from './getAucAsLabel';
import getThresholdsAndCriteria from './getThresholdsAndCriteria';

import plotStackedEnsembleThresholdsTrainingMetrics from './plotStackedEnsembleThresholdsTrainingMetrics';
import plotStackedEnsemblesThresholdsValidationMetrics from './plotStackedEnsemblesThresholdsValidationMetrics';
import plotStackedEnsembleThresholdsCrossValidationMetrics from './plotStackedEnsembleThresholdsCrossValidationMetrics';

export default function renderStackedEnsemblePlots(_, table) {
  let plotFunction;
  table = _.inspect('output - training_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotStackedEnsembleThresholdsTrainingMetrics(_, table);
  }
  table = _.inspect('output - validation_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotStackedEnsemblesThresholdsValidationMetrics(_, table);
  }
  table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotStackedEnsembleThresholdsCrossValidationMetrics(_, table);
  }
  table = _.inspect('output - Variable Importances', _.model);
  if (typeof table !== 'undefined') {
    renderPlot(_, 'Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
  }
}
