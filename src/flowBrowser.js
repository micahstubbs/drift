export function flowBrowser(_) {
  var lodash = window._;
  var Flow = window.Flow;
  var createNotebookView;
  var loadNotebooks;
  var _docs;
  var _hasDocs;
  var _sortedDocs;
  _docs = Flow.Dataflow.signals([]);
  _sortedDocs = Flow.Dataflow.lift(_docs, function (docs) {
    return lodash.sortBy(docs, function (doc) {
      return -doc.date().getTime();
    });
  });
  _hasDocs = Flow.Dataflow.lift(_docs, function (docs) {
    return docs.length > 0;
  });
  createNotebookView = function (notebook) {
    var load;
    var purge;
    var self;
    var _date;
    var _fromNow;
    var _name;
    _name = notebook.name;
    _date = Flow.Dataflow.signal(new Date(notebook.timestamp_millis));
    _fromNow = Flow.Dataflow.lift(_date, Flow.Util.fromNow);
    load = function () {
      return _.confirm('This action will replace your active notebook.\nAre you sure you want to continue?', {
        acceptCaption: 'Load Notebook',
        declineCaption: 'Cancel'
      }, function (accept) {
        if (accept) {
          return _.load(_name);
        }
      });
    };
    purge = function () {
      return _.confirm(`Are you sure you want to delete this notebook?\n"${_name}"`, {
        acceptCaption: 'Delete',
        declineCaption: 'Keep'
      }, function (accept) {
        if (accept) {
          return _.requestDeleteObject('notebook', _name, function (error) {
            var _ref;
            if (error) {
              return _alert((_ref = error.message) != null ? _ref : error);
            }
            _docs.remove(self);
            return _.growl('Notebook deleted.');
          });
        }
      });
    };
    return self = {
      name: _name,
      date: _date,
      fromNow: _fromNow,
      load,
      purge
    };
  };
  loadNotebooks = function () {
    return _.requestObjects('notebook', function (error, notebooks) {
      if (error) {
        return console.debug(error);
      }
      return _docs(lodash.map(notebooks, function (notebook) {
        return createNotebookView(notebook);
      }));
    });
  };
  Flow.Dataflow.link(_.ready, function () {
    loadNotebooks();
    Flow.Dataflow.link(_.saved, function () {
      return loadNotebooks();
    });
    return Flow.Dataflow.link(_.loaded, function () {
      return loadNotebooks();
    });
  });
  return {
    docs: _sortedDocs,
    hasDocs: _hasDocs,
    loadNotebooks
  };
}

