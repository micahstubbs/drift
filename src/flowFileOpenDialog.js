export function flowFileOpenDialog(_, _go) {
  const Flow = window.Flow;
  const H2O = window.H2O;
  let accept;
  let checkIfNameIsInUse;
  let decline;
  let uploadFile;
  let _canAccept;
  let _file;
  let _form;
  let _overwrite;
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
    let basename;
    let file;
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

