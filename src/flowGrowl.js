export function flowGrowl(_) {
  const Flow = window.Flow;
  return Flow.Dataflow.link(_.growl, (message, type) => {
    if (type) {
      return $.bootstrapGrowl(message, { type });
    }
    return $.bootstrapGrowl(message);
  });
}

