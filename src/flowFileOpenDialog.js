export function flowFileOpenDialog(_, _go) {
  const Flow = window.Flow;
  const H2O = window.H2O;
  const _overwrite = Flow.Dataflow.signal(false);
  const _form = Flow.Dataflow.signal(null);
  const _file = Flow.Dataflow.signal(null);
  const _canAccept = Flow.Dataflow.lift(_file, file => {
    if (file != null ? file.name : void 0) {
      return H2O.Util.validateFileExtension(file.name, '.flow');
    }
    return false;
  });
  const checkIfNameIsInUse = (name, go) => _.requestObjectExists('notebook', name, (error, exists) => go(exists));
  const uploadFile = basename => _.requestUploadObject('notebook', basename, new FormData(_form()), (error, filename) => _go({
    error,
    filename
  }));
  const accept = () => {
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
  const decline = () => _go(null);
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

