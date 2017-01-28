export function h2oPlotOutput(_, _go, _plot) {
  const lodash = window._;
  lodash.defer(_go);
  const downloadSVG = (() => { 
    const e = document.createElement('script'); 
    e.setAttribute('src', 'svg-crowbar.js');
    e.setAttribute('class', 'svg-crowbar'); 
    document.body.appendChild(e); 
  })();
  return {
    plot: _plot,
    downloadSVG,
    template: 'flow-plot-output',
  };
}
