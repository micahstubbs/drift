export function failure() {
  const Flow = window.Flow;
  let traceCauses;
  traceCauses = (error, causes) => {
    causes.push(error.message);
    if (error.cause) {
      traceCauses(error.cause, causes);
    }
    return causes;
  };
  Flow.Failure = (_, error) => {
    let causes;
    let message;
    let toggleStack;
    let _isStackVisible;
    causes = traceCauses(error, []);
    message = causes.shift();
    _isStackVisible = Flow.Dataflow.signal(false);
    toggleStack = () => _isStackVisible(!_isStackVisible());
    _.trackException(`${message}; ${causes.join('; ')}`);
    return {
      message,
      stack: error.stack,
      causes,
      isStackVisible: _isStackVisible,
      toggleStack,
      template: 'flow-failure'
    };
  };
}
