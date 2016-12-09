export function flowFileOpenDialog(_, _go) {
  var Flow = window.Flow;
  var accept;
  var checkIfNameIsInUse;
  var decline;
  var uploadFile;
  var _canAccept;
  var _file;
  var _form;
  var _overwrite;
  _overwrite = Flow.Dataflow.signal(false);
  _form = Flow.Dataflow.signal(null);
  _file = Flow.Dataflow.signal(null);
  _canAccept = Flow.Dataflow.lift(_file, file => {
    if (file != null ? file.name : void 0) {
      return H2O.Util.validateFileExtension(file.name, '.flow');
    }
    return false;
  });
  checkIfNameIsInUse = (name, go) => _.requestObjectExists('notebook', name, (error, exists) => go(exists));
  uploadFile = basename => _.requestUploadObject('notebook', basename, new FormData(_form()), (error, filename) => _go({
    error,
    filename
  }));
  accept = () => {
    var basename;
    var file;
    if (file = _file()) {
      basename = H2O.Util.getFileBaseName(file.name, '.flow');
      if (_overwrite()) {
        return uploadFile(basename);
      }
      return checkIfNameIsInUse(basename, isNameInUse => {
        if (isNameInUse) {
          return _overwrite(true);
        }
        return uploadFile(basename);
      });
    }
  };
  decline = () => _go(null);
  return {
    form: _form,
    file: _file,
    overwrite: _overwrite,
    canAccept: _canAccept,
    accept,
    decline,
    template: 'file-open-dialog'
  };
}

