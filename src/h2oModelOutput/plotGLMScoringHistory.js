import renderPlot from './renderPlot';

export default function plotGLMScoringHistory(_, table) {
  const lodash = window._;
  const lambdaSearchParameter = lodash.find(_.model.parameters, parameter => parameter.name === 'lambda_search');
  let plotFunction;
  if (lambdaSearchParameter != null ? lambdaSearchParameter.actual_value : void 0) {
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
    plotFunction = _.plot(gFunction);
  } else {
    const gFunction = g => g(
      g.path(
        g.position('iteration', 'objective'),
        g.strokeColor(
          g.value('#1f77b4')
        )
      ),
      g.point(
        g.position('iteration', 'objective'),
        g.strokeColor(
          g.value('#1f77b4')
        )
      ),
      g.from(table)
    );
    plotFunction = _.plot(gFunction);
  }
  renderPlot(
    _,
    'Scoring History',
    false,
    plotFunction
  );
}
