import renderPlot from './renderPlot';
import getAucAsLabel from './getAucAsLabel';
import getThresholdsAndCriteria from './getThresholdsAndCriteria';

import plotDeepNetScoringHistory from './plotDeepNetScoringHistory';
import plotDeepNetThresholdsTrainingMetrics from './plotDeepNetThresholdsTrainingMetrics';
import plotDeepNetThresholdsValidationMetrics from './plotDeepNetThresholdsValidationMetrics';
import plotDeepNetThresholdsCrossValidationMetrics from './plotDeepNetThresholdsCrossValidationMetrics';

export default function renderDeepNetPlots(_, table) {
  let plotFunction;
  table = _.inspect('output - Scoring History', _.model);
  if (typeof table !== 'undefined') {
    plotDeepNetScoringHistory(_, table);
  }
  table = _.inspect('output - training_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotDeepNetThresholdsTrainingMetrics(_, table);
  }
  table = _.inspect('output - validation_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotDeepNetThresholdsValidationMetrics(_, table);
  }
  table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotDeepNetThresholdsCrossValidationMetrics(_, table);
  }
  table = _.inspect('output - Variable Importances', _.model);
  if (typeof table !== 'undefined') {
    renderPlot(_, 'Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
  }
}
