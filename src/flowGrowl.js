export function flowGrowl(_) {
  var Flow = window.Flow;
  return Flow.Dataflow.link(_.growl, function (message, type) {
    if (type) {
      return $.bootstrapGrowl(message, { type });
    }
    return $.bootstrapGrowl(message);
  });
};
  