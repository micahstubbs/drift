export function h2oImportFilesInput(_, _go) {
  var lodash = window._;
  var Flow = window.Flow;
  var createFileItem;
  var createFileItems;
  var createSelectedFileItem;
  var deselectAllFiles;
  var importFiles;
  var importSelectedFiles;
  var listPathHints;
  var processImportResult;
  var selectAllFiles;
  var tryImportFiles;
  var _exception;
  var _hasErrorMessage;
  var _hasImportedFiles;
  var _hasSelectedFiles;
  var _hasUnselectedFiles;
  var _importedFileCount;
  var _importedFiles;
  var _selectedFileCount;
  var _selectedFiles;
  var _selectedFilesDictionary;
  var _specifiedPath;
  _specifiedPath = Flow.Dataflow.signal('');
  _exception = Flow.Dataflow.signal('');
  _hasErrorMessage = Flow.Dataflow.lift(_exception, function (exception) {
    if (exception) {
      return true;
    }
    return false;
  });
  tryImportFiles = function () {
    var specifiedPath;
    specifiedPath = _specifiedPath();
    return _.requestFileGlob(specifiedPath, -1, function (error, result) {
      if (error) {
        return _exception(error.stack);
      }
      _exception('');
      return processImportResult(result);
    });
  };
  _importedFiles = Flow.Dataflow.signals([]);
  _importedFileCount = Flow.Dataflow.lift(_importedFiles, function (files) {
    if (files.length) {
      return `Found ${Flow.Util.describeCount(files.length, 'file')}:`;
    }
    return '';
  });
  _hasImportedFiles = Flow.Dataflow.lift(_importedFiles, function (files) {
    return files.length > 0;
  });
  _hasUnselectedFiles = Flow.Dataflow.lift(_importedFiles, function (files) {
    return lodash.some(files, function (file) {
      return !file.isSelected();
    });
  });
  _selectedFiles = Flow.Dataflow.signals([]);
  _selectedFilesDictionary = Flow.Dataflow.lift(_selectedFiles, function (files) {
    var dictionary;
    var file;
    var _i;
    var _len;
    dictionary = {};
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      dictionary[file.path] = true;
    }
    return dictionary;
  });
  _selectedFileCount = Flow.Dataflow.lift(_selectedFiles, function (files) {
    if (files.length) {
      return `${Flow.Util.describeCount(files.length, 'file')} selected:`;
    }
    return '(No files selected)';
  });
  _hasSelectedFiles = Flow.Dataflow.lift(_selectedFiles, function (files) {
    return files.length > 0;
  });
  importFiles = function (files) {
    var paths;
    paths = lodash.map(files, function (file) {
      return Flow.Prelude.stringify(file.path);
    });
    return _.insertAndExecuteCell('cs', `importFiles [ ${paths.join(',')} ]`);
  };
  importSelectedFiles = function () {
    return importFiles(_selectedFiles());
  };
  createSelectedFileItem = function (path) {
    var self;
    return self = {
      path,
      deselect() {
        var file;
        var _i;
        var _len;
        var _ref;
        _selectedFiles.remove(self);
        _ref = _importedFiles();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (file.path === path) {
            file.isSelected(false);
          }
        }
      }
    };
  };
  createFileItem = function (path, isSelected) {
    var self;
    self = {
      path,
      isSelected: Flow.Dataflow.signal(isSelected),
      select() {
        _selectedFiles.push(createSelectedFileItem(self.path));
        return self.isSelected(true);
      }
    };
    Flow.Dataflow.act(self.isSelected, function (isSelected) {
      return _hasUnselectedFiles(lodash.some(_importedFiles(), function (file) {
        return !file.isSelected();
      }));
    });
    return self;
  };
  createFileItems = function (result) {
    return lodash.map(result.matches, function (path) {
      return createFileItem(path, _selectedFilesDictionary()[path]);
    });
  };
  listPathHints = function (query, process) {
    return _.requestFileGlob(query, 10, function (error, result) {
      if (!error) {
        return process(lodash.map(result.matches, function (value) {
          return { value };
        }));
      }
    });
  };
  selectAllFiles = function () {
    var dict;
    var file;
    var _i;
    var _j;
    var _len;
    var _len1;
    var _ref;
    var _ref1;
    dict = {};
    _ref = _selectedFiles();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      file = _ref[_i];
      dict[file.path] = true;
    }
    _ref1 = _importedFiles();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      file = _ref1[_j];
      if (!dict[file.path]) {
        file.select();
      }
    }
  };
  deselectAllFiles = function () {
    var file;
    var _i;
    var _len;
    var _ref;
    _selectedFiles([]);
    _ref = _importedFiles();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      file = _ref[_i];
      file.isSelected(false);
    }
  };
  processImportResult = function (result) {
    var files;
    files = createFileItems(result);
    return _importedFiles(files);
  };
  lodash.defer(_go);
  return {
    specifiedPath: _specifiedPath,
    hasErrorMessage: _hasErrorMessage,
    exception: _exception,
    tryImportFiles,
    listPathHints: lodash.throttle(listPathHints, 100),
    hasImportedFiles: _hasImportedFiles,
    importedFiles: _importedFiles,
    importedFileCount: _importedFileCount,
    selectedFiles: _selectedFiles,
    selectAllFiles,
    deselectAllFiles,
    hasUnselectedFiles: _hasUnselectedFiles,
    hasSelectedFiles: _hasSelectedFiles,
    selectedFileCount: _selectedFileCount,
    importSelectedFiles,
    template: 'flow-import-files'
  };
};
  