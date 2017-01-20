import _refresh from './_refresh';
import createOutput from './createOutput';


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
  const _toggleRefresh = () => _.isLive(!_.isLive());
  _.output(createOutput(_));
  lodash.defer(_go);
  return {
    output: _.output,
    toggleRefresh: _toggleRefresh,
    isLive: _.isLive,
    template: 'flow-model-output',
  };
}

