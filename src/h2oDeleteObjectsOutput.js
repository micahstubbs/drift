export function h2oDeleteObjectsOutput(_, _go, _keys) {
  var lodash = window._;
  lodash.defer(_go);
  return {
    hasKeys: _keys.length > 0,
    keys: _keys,
    template: 'flow-delete-objects-output'
  };
}

