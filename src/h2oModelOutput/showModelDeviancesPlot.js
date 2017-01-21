import goToUrl from '../notebook/goToUrl';

export default function showModelDeviancesPlot() {
  console.log('showModelDeviancesPlot was called');
  goToUrl('http://residuals.h2o.ai:8080')();
}
