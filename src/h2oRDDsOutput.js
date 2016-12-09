export function h2oRDDsOutput(_, _go, _rDDs) {
  const lodash = window._;
  const Flow = window.Flow;
  let createRDDView;
  let _rDDViews;
  _rDDViews = Flow.Dataflow.signal([]);
  createRDDView = rDD => ({
    id: rDD.rdd_id,
    name: rDD.name,
    partitions: rDD.partitions
  });
  _rDDViews(lodash.map(_rDDs, createRDDView));
  lodash.defer(_go);
  return {
    rDDViews: _rDDViews,
    hasRDDs: _rDDs.length > 0,
    template: 'flow-rdds-output'
  };
}

