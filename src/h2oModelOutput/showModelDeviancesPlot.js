import goToH2OUrl from '../notebook/goToUrl';

export default function showModelDeviancesPlot(_) {
  console.log('showModelDeviancesPlot was called');
  const modelID = _.model.model_id.name;
  const selectedFrame = _.selectedFrame();
  console.log('modelID from showModelDeviancesPlot', modelID);
  console.log('selectedFrame from showModelDeviancesPlot', selectedFrame);
  goToH2OUrl(`/vis-parameters.html?model_id=${modelID}&selected_frame=${selectedFrame}`)();
}
