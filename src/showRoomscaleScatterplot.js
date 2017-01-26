import goToH2OUrl from './notebook/goToUrl';

export default function showRoomscaleScatterplot(options) {
  console.log('showRoomscaleScatterplot was called');
  const selectedFrame = options.frameID;
  console.log('selectedFrame from showModelDeviancesPlot', selectedFrame);

  const xVariable = options.xVariable;
  const yVariable = options.yVariable;
  const zVariable = options.zVariable;
  const colorVariable = options.colorVariable;
  goToH2OUrl(`/roomscale-scatterplot.html?frame_id=${selectedFrame}&x_variable=${xVariable}&y_variable=${yVariable}&z_variable=${zVariable}&color_variable=${colorVariable}`)();
  return {};
}
