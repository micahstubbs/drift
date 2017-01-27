import renderPlot from './renderPlot';
import getAucAsLabel from './getAucAsLabel';
import getThresholdsAndCriteria from './getThresholdsAndCriteria';

import plotTreeAlgoScoringHistory from './plotTreeAlgoScoringHistory';

export default function renderTreeAlgoPlots(_, table) {
  let plotFunction;
  table = _.inspect('output - Scoring History', _.model);
  if (typeof table !== 'undefined') {
    plotTreeAlgoScoringHistory(_, table);
  }
  table = _.inspect('output - training_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotFunction = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
    renderPlot(_, `ROC Curve - Training Metrics${getAucAsLabel(_, _.model, 'output - training_metrics')}`, false, plotFunction, getThresholdsAndCriteria(_, table, 'output - training_metrics - Maximum Metrics'));
  }
  table = _.inspect('output - validation_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotFunction = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
    renderPlot(_, `ROC Curve - Validation Metrics${getAucAsLabel(_, _.model, 'output - validation_metrics')}`, false, plotFunction, getThresholdsAndCriteria(_, table, 'output - validation_metrics - Maximum Metrics'));
  }
  table = _.inspect('output - cross_validation_metrics - Metrics for Thresholds', _.model);
  if (typeof table !== 'undefined') {
    plotFunction = _.plot(g => g(g.path(g.position('fpr', 'tpr')), g.line(g.position(g.value(1), g.value(0)), g.strokeColor(g.value('red'))), g.from(table), g.domainX_HACK(0, 1), g.domainY_HACK(0, 1)));

          // TODO Mega-hack alert.
          // Last arg thresholdsAndCriteria applicable only to
          // ROC charts for binomial models.
    renderPlot(_, `ROC Curve - Cross Validation Metrics${getAucAsLabel(_, _.model, 'output - cross_validation_metrics')}`, false, plotFunction, getThresholdsAndCriteria(_, table, 'output - cross_validation_metrics - Maximum Metrics'));
  }
  table = _.inspect('output - Variable Importances', _.model);
  if (typeof table !== 'undefined') {
    renderPlot(_, 'Variable Importances', false, _.plot(g => g(g.rect(g.position('scaled_importance', 'variable')), g.from(table), g.limit(25))));
  }
}
