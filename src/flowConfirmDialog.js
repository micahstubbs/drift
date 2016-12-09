export function flowConfirmDialog(_, _message, _opts, _go) {
  var lodash = window._;
  var Flow = window.Flow;
  var accept;
  var decline;
  if (_opts == null) {
    _opts = {};
  }
  lodash.defaults(_opts, {
    title: 'Confirm',
    acceptCaption: 'Yes',
    declineCaption: 'No'
  });
  accept = function () {
    return _go(true);
  };
  decline = function () {
    return _go(false);
  };
  return {
    title: _opts.title,
    acceptCaption: _opts.acceptCaption,
    declineCaption: _opts.declineCaption,
    message: Flow.Util.multilineTextToHTML(_message),
    accept,
    decline,
    template: 'confirm-dialog'
  };
}

