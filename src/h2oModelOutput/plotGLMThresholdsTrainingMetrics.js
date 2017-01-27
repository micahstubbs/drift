export default function plotGLMThresholdsTrainingMetrics(_, table) {
  const plotFunction = _.plot(
    g => g(
      g.path(
        g.position('fpr', 'tpr')
      ),
      g.line(
        g.position(
          g.value(1),
          g.value(0)),
          g.strokeColor(
            g.value('red')
          )
        ),
        g.from(table),
        g.domainX_HACK(0, 1),
        g.domainY_HACK(0, 1)
      )
    );
  const thresholdFunction = getThresholdsAndCriteria(
    _, 
    table, 
    'output - training_metrics - Maximum Metrics'
  );
  const plotTitle = `ROC Curve - Training Metrics${getAucAsLabel(_, _.model, 'output - training_metrics')}`;
  renderPlot(
    _,
    plotTitle,
    false,
    plotFunction,
    thresholdFunction
  );
}