export function flowAutosave(_) {
  const Flow = window.Flow;
  const warnOnExit = e => {
    const message = 'Warning: you are about to exit Flow.';
    if (e = e != null ? e : window.event) {
      e.returnValue = message;
    }
    return message;
  };
  const setDirty = () => window.onbeforeunload = warnOnExit;
  const setPristine = () => window.onbeforeunload = null;
  return Flow.Dataflow.link(_.ready, () => {
    Flow.Dataflow.link(_.setDirty, setDirty);
    return Flow.Dataflow.link(_.setPristine, setPristine);
  });
}

