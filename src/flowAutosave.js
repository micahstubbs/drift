export function flowAutosave(_) {
  const Flow = window.Flow;
  let setDirty;
  let setPristine;
  let warnOnExit;
  warnOnExit = e => {
    let message;
    message = 'Warning: you are about to exit Flow.';
    if (e = e != null ? e : window.event) {
      e.returnValue = message;
    }
    return message;
  };
  setDirty = () => window.onbeforeunload = warnOnExit;
  setPristine = () => window.onbeforeunload = null;
  return Flow.Dataflow.link(_.ready, () => {
    Flow.Dataflow.link(_.setDirty, setDirty);
    return Flow.Dataflow.link(_.setPristine, setPristine);
  });
}

