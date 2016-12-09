import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

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
  _hasErrorMessage = Flow.Dataflow.lift(_exception, exception => {
    if (exception) {
      return true;
    }
    return false;
  });
  tryImportFiles = () => {
    var specifiedPath;
    specifiedPath = _specifiedPath();
    return _.requestFileGlob(specifiedPath, -1, (error, result) => {
      if (error) {
        return _exception(error.stack);
      }
      _exception('');
      return processImportResult(result);
    });
  };
  _importedFiles = Flow.Dataflow.signals([]);
  _importedFileCount = Flow.Dataflow.lift(_importedFiles, files => {
    if (files.length) {
      return `Found ${Flow.Util.describeCount(files.length, 'file')}:`;
    }
    return '';
  });
  _hasImportedFiles = Flow.Dataflow.lift(_importedFiles, files => files.length > 0);
  _hasUnselectedFiles = Flow.Dataflow.lift(_importedFiles, files => lodash.some(files, file => !file.isSelected()));
  _selectedFiles = Flow.Dataflow.signals([]);
  _selectedFilesDictionary = Flow.Dataflow.lift(_selectedFiles, files => {
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
  _selectedFileCount = Flow.Dataflow.lift(_selectedFiles, files => {
    if (files.length) {
      return `${Flow.Util.describeCount(files.length, 'file')} selected:`;
    }
    return '(No files selected)';
  });
  _hasSelectedFiles = Flow.Dataflow.lift(_selectedFiles, files => files.length > 0);
  importFiles = files => {
    var paths;
    paths = lodash.map(files, file => flowPrelude.stringify(file.path));
    return _.insertAndExecuteCell('cs', `importFiles [ ${paths.join(',')} ]`);
  };
  importSelectedFiles = () => importFiles(_selectedFiles());
  createSelectedFileItem = path => {
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
  createFileItem = (path, isSelected) => {
    var self;
    self = {
      path,
      isSelected: Flow.Dataflow.signal(isSelected),
      select() {
        _selectedFiles.push(createSelectedFileItem(self.path));
        return self.isSelected(true);
      }
    };
    Flow.Dataflow.act(self.isSelected, isSelected => _hasUnselectedFiles(lodash.some(_importedFiles(), file => !file.isSelected())));
    return self;
  };
  createFileItems = result => lodash.map(result.matches, path => createFileItem(path, _selectedFilesDictionary()[path]));
  listPathHints = (query, process) => _.requestFileGlob(query, 10, (error, result) => {
    if (!error) {
      return process(lodash.map(result.matches, value => ({
        value
      })));
    }
  });
  selectAllFiles = () => {
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
  deselectAllFiles = () => {
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
  processImportResult = result => {
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
}

