export function h2oRDDsOutput(_, _go, _rDDs) {
  var lodash = window._;
  var Flow = window.Flow;
  var createRDDView;
  var _rDDViews;
  _rDDViews = Flow.Dataflow.signal([]);
  createRDDView = function (rDD) {
    return {
      id: rDD.rdd_id,
      name: rDD.name,
      partitions: rDD.partitions
    };
  };
  _rDDViews(lodash.map(_rDDs, createRDDView));
  lodash.defer(_go);
  return {
    rDDViews: _rDDViews,
    hasRDDs: _rDDs.length > 0,
    template: 'flow-rdds-output'
  };
}

