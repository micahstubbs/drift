export function flowFileUploadDialog(_, _go) {
  const Flow = window.Flow;
  const _form = Flow.Dataflow.signal(null);
  const _file = Flow.Dataflow.signal(null);
  const uploadFile = key => _.requestUploadFile(key, new FormData(_form()), (error, result) => _go({
    error,
    result
  }));
  const accept = () => {
    let file;
    if (file = _file()) {
      return uploadFile(file.name);
    }
  };
  const decline = () => _go(null);
  return {
    form: _form,
    file: _file,
    accept,
    decline,
    template: 'file-upload-dialog'
  };
}

