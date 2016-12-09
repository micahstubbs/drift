export function flowAlertDialog(_, _message, _opts, _go) {
  var lodash = window._;
  var Flow = window.Flow;
  var accept;
  if (_opts == null) {
    _opts = {};
  }
  lodash.defaults(_opts, {
    title: 'Alert',
    acceptCaption: 'OK'
  });
  accept = () => _go(true);
  return {
    title: _opts.title,
    acceptCaption: _opts.acceptCaption,
    message: Flow.Util.multilineTextToHTML(_message),
    accept,
    template: 'alert-dialog'
  };
}

