import renderPlot from './renderPlot';

export default function plotGLMScoringHistory(_, table) {
  const gFunction = g => g(
      g.path(
        g.position('lambda', 'explained_deviance_train'),
        g.strokeColor(g.value('#1f77b4'))
      ),
      g.path(
        g.position('lambda', 'explained_deviance_test'),
        g.strokeColor(g.value('#ff7f0e'))
      ),
      g.point(
        g.position('lambda', 'explained_deviance_train'),
        g.strokeColor(g.value('#1f77b4'))
      ),
      g.point(
        g.position('lambda', 'explained_deviance_test'),
        g.strokeColor(g.value('#ff7f0e'))
      ),
      g.from(table)
    );
  const plotFunction = _.plot(gFunction);
  renderPlot(
    _,
    'Scoring History',
    false,
    plotFunction
  );
}
