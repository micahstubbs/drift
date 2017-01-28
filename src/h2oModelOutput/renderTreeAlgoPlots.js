import renderPlot from './renderPlot';
import getAucAsLabel from './getAucAsLabel';
import getThresholdsAndCriteria from './getThresholdsAndCriteria';

import plotTreeAlgoScoringHistory from './plotTreeAlgoScoringHistory';
import plotTreeAlgoThresholdsTrainingMetrics from './plotTreeAlgoThresholdsTrainingMetrics';
import plotTreeAlgoThresholdsValidationMetrics from './plotTreeAlgoThresholdsValidationMetrics';
import plotTreeAlgoThresholdsCrossValidationMetrics from './plotTreeAlgoThresholdsCrossValidationMetrics';

export default function renderTreeAlgoPlots(_, table) {
  let plotFunction;
  table = _.inspect('output - Scoring History', _.model);
  if (typeof table !== 'undefined') {
    plotTreeAlgoScoringHistory(_, table);
  }
  table = _.inspect('output - training_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotTreeAlgoThresholdsTrainingMetrics(_, table);
  }
  table = _.inspect('output - validation_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotTreeAlgoThresholdsValidationMetrics(_, table);
  }
  table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotTreeAlgoThresholdsCrossValidationMetrics(_, table);
  }
  table = _.inspect('output - Variable Importances', _.model);
  if (typeof table !== 'undefined') {
    renderPlot(_, 'Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
  }
}
