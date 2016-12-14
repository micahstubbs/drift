export function flowAutosave(_) {
  const Flow = window.Flow;
  const warnOnExit = e => {
    const message = 'Warning: you are about to exit Flow.';
    e = e != null ? e : window.event;
    if (e) {
      e.returnValue = message;
    }
    return message;
  };
  const setDirty = () => {
    window.onbeforeunload = warnOnExit;
    return window.onbeforeunload;
  };
  const setPristine = () => {
    window.onbeforeunload = null;
    return window.onbeforeunload;
  };
  return Flow.Dataflow.link(_.ready, () => {
    Flow.Dataflow.link(_.setDirty, setDirty);
    return Flow.Dataflow.link(_.setPristine, setPristine);
  });
}

