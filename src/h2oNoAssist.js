export function h2oNoAssist(_, _go) {
  var lodash = window._;
  lodash.defer(_go);
  return {
    showAssist() {
      return _.insertAndExecuteCell('cs', 'assist');
    },
    template: 'flow-no-assist'
  };
}

