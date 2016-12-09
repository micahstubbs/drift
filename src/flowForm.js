export function flowForm(_, _form, _go) {
  var lodash = window._;
  lodash.defer(_go);
  return {
    form: _form,
    template: 'flow-form',
    templateOf(control) {
      return control.template;
    }
  };
}

