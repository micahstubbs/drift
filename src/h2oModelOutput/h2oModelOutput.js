import _refresh from './_refresh';
import createOutput from './createOutput';
import _toggleRefresh from './_toggleRefresh';


export function h2oModelOutput(_, _go, refresh) {
  const lodash = window._;
  const Flow = window.Flow;
  const $ = window.jQuery;
  _.output = Flow.Dataflow.signal(null);
  _.isLive = Flow.Dataflow.signal(false);
  Flow.Dataflow.act(_.isLive, isLive => {
    if (isLive) {
      return _refresh(_, refresh);
    }
  });
  _.output(createOutput(_));
  const downloadSVG = () => {
    console.log('downloadSVG from h2oModelOutput was called');
    const e = document.createElement('script'); 
    e.setAttribute('src', 'svg-crowbar.js');
    e.setAttribute('class', 'svg-crowbar'); 
    document.body.appendChild(e); 
  };
  lodash.defer(_go);
  return {
    output: _.output,
    downloadSVG,
    toggleRefresh: _toggleRefresh.bind(this, _),
    isLive: _.isLive,
    template: 'flow-model-output',
  };
}

