export function h2oNoAssist(_, _go) {
  const lodash = window._;
  lodash.defer(_go);
  return {
    showAssist() {
      return _.insertAndExecuteCell('cs', `assist ${_}`);
    },
    template: 'flow-no-assist',
  };
}

