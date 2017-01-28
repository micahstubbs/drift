import renderPlot from './renderPlot';

import plotGainsLiftTrainingMetrics from './plotGainsLiftTrainingMetrics';
import plotGainsLiftValidationMetrics from './plotGainsLiftValidationMetrics';

export default function renderGainsLiftPlots(_, table) {
  table = _.inspect('output - training_metrics - Gains/Lift Table', _.model);
  if (typeof table !== 'undefined') {
    plotGainsLiftTrainingMetrics(_, table);
  }
  table = _.inspect('output - validation_metrics - Gains/Lift Table', _.model);
  if (typeof table !== 'undefined') {
    plotGainsLiftValidationMetrics(_, table);
  }
  table = _.inspect('output - cross_validation_metrics - Gains/Lift Table', _.model);
  if (typeof table !== 'undefined') {
    renderPlot(_, 'Cross Validation Metrics - Gains/Lift Table', false, _.plot(g => g(g.path(g.position('cumulative_data_fraction', 'cumulative_capture_rate'), g.strokeColor(g.value('black'))), g.path(g.position('cumulative_data_fraction', 'cumulative_lift'), g.strokeColor(g.value('green'))), g.from(table))));
  }
}
