import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oImportFilesOutput(_, _go, _importResults) {
  var lodash = window._;
  var Flow = window.Flow;
  var createImportView;
  var parse;
  var _allFrames;
  var _canParse;
  var _importViews;
  var _title;
  _allFrames = lodash.flatten(lodash.compact(lodash.map(_importResults, function (result) {
    return result.destination_frames;
  })));
  _canParse = _allFrames.length > 0;
  _title = `${_allFrames.length} / ${_importResults.length} files imported.`;
  createImportView = function (result) {
    return {
      files: result.files,
      template: 'flow-import-file-output'
    };
  };
  _importViews = lodash.map(_importResults, createImportView);
  parse = function () {
    var paths;
    paths = lodash.map(_allFrames, flowPrelude.stringify);
    return _.insertAndExecuteCell('cs', `setupParse source_frames: [ ${paths.join(',')} ]`);
  };
  lodash.defer(_go);
  return {
    title: _title,
    importViews: _importViews,
    canParse: _canParse,
    parse,
    template: 'flow-import-files-output',
    templateOf(view) {
      return view.template;
    }
  };
}

