export function flowAutosave(_) {
  var Flow = window.Flow;
  var setDirty;
  var setPristine;
  var warnOnExit;
  warnOnExit = e => {
    var message;
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

