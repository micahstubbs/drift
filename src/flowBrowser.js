export function flowBrowser(_) {
  const lodash = window._;
  const Flow = window.Flow;
  const _docs = Flow.Dataflow.signals([]);
  const _sortedDocs = Flow.Dataflow.lift(_docs, docs => lodash.sortBy(docs, doc => -doc.date().getTime()));
  const _hasDocs = Flow.Dataflow.lift(_docs, docs => docs.length > 0);
  const createNotebookView = notebook => {
    let self;
    const _name = notebook.name;
    const _date = Flow.Dataflow.signal(new Date(notebook.timestamp_millis));
    const _fromNow = Flow.Dataflow.lift(_date, Flow.Util.fromNow);
    const load = () => _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
      acceptCaption: 'Load Notebook',
      declineCaption: 'Cancel',
    }, accept => {
      if (accept) {
        return _.load(_name);
      }
    });
    const purge = () => _.confirm(`Are you sure you want to delete this notebook?\n"${_name}"`, {
      acceptCaption: 'Delete',
      declineCaption: 'Keep',
    }, accept => {
      if (accept) {
        return _.requestDeleteObject('notebook', _name, error => {
          let _ref;
          if (error) {
            _ref = error.message;
            return _.alert(_ref != null ? _ref : error);
          }
          _docs.remove(self);
          return _.growl('Notebook deleted.');
        });
      }
    });
    return self = {
      name: _name,
      date: _date,
      fromNow: _fromNow,
      load,
      purge,
    };
  };
  const loadNotebooks = () => _.requestObjects('notebook', (error, notebooks) => {
    if (error) {
      return console.debug(error);
    }
    return _docs(lodash.map(notebooks, notebook => createNotebookView(notebook)));
  });
  Flow.Dataflow.link(_.ready, () => {
    loadNotebooks();
    Flow.Dataflow.link(_.saved, () => loadNotebooks());
    return Flow.Dataflow.link(_.loaded, () => loadNotebooks());
  });
  return {
    docs: _sortedDocs,
    hasDocs: _hasDocs,
    loadNotebooks,
  };
}

