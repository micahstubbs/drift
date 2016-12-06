export function flowFileUploadDialog(_, _go) {
  var Flow = window.Flow;
  var accept;
  var decline;
  var uploadFile;
  var _file;
  var _form;
  _form = Flow.Dataflow.signal(null);
  _file = Flow.Dataflow.signal(null);
  uploadFile = function (key) {
    return _.requestUploadFile(key, new FormData(_form()), function (error, result) {
      return _go({
        error,
        result
      });
    });
  };
  accept = function () {
    var file;
    if (file = _file()) {
      return uploadFile(file.name);
    }
  };
  decline = function () {
    return _go(null);
  };
  return {
    form: _form,
    file: _file,
    accept,
    decline,
    template: 'file-upload-dialog'
  };
};
  