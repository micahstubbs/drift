import goToH2OUrl from './notebook/goToUrl';

export default function showRoomscaleScatterplot(options) {
  console.log('showRoomscaleScatterplot was called');
  const selectedFrame = options.frame_id;
  console.log('selectedFrame from showModelDeviancesPlot', selectedFrame);

  // hard code values for `small-synth-data` for now
  // add proper form input soon
  const xVariable = 'C4';
  const yVariable = 'C5';
  const zVariable = 'C6';
  const colorVariable = 'C2';
  goToH2OUrl(`/roomscale-scatterplot.html?frame_id=${selectedFrame}&x_variable=${xVariable}&y_variable=${yVariable}&z_variable=${zVariable}&color_variable=${colorVariable}`)();
}
