import renderPlot from './renderPlot';
import getAucAsLabel from './getAucAsLabel';
import getThresholdsAndCriteria from './getThresholdsAndCriteria';

import plotDeepNetScoringHistory from './plotDeepNetScoringHistory';
import plotDeepNetThresholdsTrainingMetrics from './plotDeepNetThresholdsTrainingMetrics';
import plotDeepNetThresholdsValidationMetrics from './plotDeepNetThresholdsValidationMetrics';

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
    plotFunction = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
    renderPlot(_, `'ROC Curve - Cross Validation Metrics' + ${getAucAsLabel(_, _.model, 'output - cross_validation_metrics')}`, false, plotFunction, getThresholdsAndCriteria(_, table, 'output - cross_validation_metrics - Maximum Metrics'));
  }
  table = _.inspect('output - Variable Importances', _.model);
  if (typeof table !== 'undefined') {
    renderPlot(_, 'Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
  }
}
