import goToH2OUrl from '../notebook/goToUrl';

export default function showModelDeviancesPlot(_) {
  console.log('showModelDeviancesPlot was called');
  const modelID = _.model.model_id.name;
  console.log('modelID from showModelDeviancesPlot', modelID);
  goToH2OUrl(`/vis-parameters.html?model_id=${modelID}`)();
}
