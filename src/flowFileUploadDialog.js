export function flowFileUploadDialog(_, _go) {
  const Flow = window.Flow;
  let accept;
  let decline;
  let uploadFile;
  let _file;
  let _form;
  _form = Flow.Dataflow.signal(null);
  _file = Flow.Dataflow.signal(null);
  uploadFile = key => _.requestUploadFile(key, new FormData(_form()), (error, result) => _go({
    error,
    result
  }));
  accept = () => {
    let file;
    if (file = _file()) {
      return uploadFile(file.name);
    }
  };
  decline = () => _go(null);
  return {
    form: _form,
    file: _file,
    accept,
    decline,
    template: 'file-upload-dialog'
  };
}

