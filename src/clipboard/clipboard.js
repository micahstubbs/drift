import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function clipboard() {
  var lodash = window._;
  var Flow = window.Flow;
  var SystemClips;
  SystemClips = [
    'assist',
    'importFiles',
    'getFrames',
    'getModels',
    'getPredictions',
    'getJobs',
    'buildModel',
    'predict'
  ];
  Flow.Clipboard = function (_) {
    var addClip;
    var createClip;
    var emptyTrash;
    var initialize;
    var lengthOf;
    var loadUserClips;
    var removeClip;
    var saveUserClips;
    var serializeUserClips;
    var _hasTrashClips;
    var _hasUserClips;
    var _systemClipCount;
    var _systemClips;
    var _trashClipCount;
    var _trashClips;
    var _userClipCount;
    var _userClips;
    lengthOf = function (array) {
      if (array.length) {
        return `(${array.length})`;
      }
      return '';
    };
    _systemClips = Flow.Dataflow.signals([]);
    _systemClipCount = Flow.Dataflow.lift(_systemClips, lengthOf);
    _userClips = Flow.Dataflow.signals([]);
    _userClipCount = Flow.Dataflow.lift(_userClips, lengthOf);
    _hasUserClips = Flow.Dataflow.lift(_userClips, function (clips) {
      return clips.length > 0;
    });
    _trashClips = Flow.Dataflow.signals([]);
    _trashClipCount = Flow.Dataflow.lift(_trashClips, lengthOf);
    _hasTrashClips = Flow.Dataflow.lift(_trashClips, function (clips) {
      return clips.length > 0;
    });
    createClip = function (_list, _type, _input, _canRemove) {
      var execute;
      var insert;
      var self;
      if (_canRemove == null) {
        _canRemove = true;
      }
      execute = function () {
        return _.insertAndExecuteCell(_type, _input);
      };
      insert = function () {
        return _.insertCell(_type, _input);
      };
      flowPrelude.remove = function () {
        if (_canRemove) {
          return removeClip(_list, self);
        }
      };
      return self = {
        type: _type,
        input: _input,
        execute,
        insert,
        remove: flowPrelude.remove,
        canRemove: _canRemove
      };
    };
    addClip = function (list, type, input) {
      return list.push(createClip(list, type, input));
    };
    removeClip = function (list, clip) {
      if (list === _userClips) {
        _userClips.remove(clip);
        saveUserClips();
        return _trashClips.push(createClip(_trashClips, clip.type, clip.input));
      }
      return _trashClips.remove(clip);
    };
    emptyTrash = function () {
      return _trashClips.removeAll();
    };
    loadUserClips = function () {
      return _.requestObjectExists('environment', 'clips', function (error, exists) {
        if (exists) {
          return _.requestObject('environment', 'clips', function (error, doc) {
            if (!error) {
              return _userClips(lodash.map(doc.clips, function (clip) {
                return createClip(_userClips, clip.type, clip.input);
              }));
            }
          });
        }
      });
    };
    serializeUserClips = function () {
      return {
        version: '1.0.0',
        clips: lodash.map(_userClips(), function (clip) {
          return {
            type: clip.type,
            input: clip.input
          };
        })
      };
    };
    saveUserClips = function () {
      return _.requestPutObject('environment', 'clips', serializeUserClips(), function (error) {
        if (error) {
          _.alert(`Error saving clips: ${error.message}`);
        }
      });
    };
    initialize = function () {
      _systemClips(lodash.map(SystemClips, function (input) {
        return createClip(_systemClips, 'cs', input, false);
      }));
      return Flow.Dataflow.link(_.ready, function () {
        loadUserClips();
        return Flow.Dataflow.link(_.saveClip, function (category, type, input) {
          input = input.trim();
          if (input) {
            if (category === 'user') {
              addClip(_userClips, type, input);
              return saveUserClips();
            }
            return addClip(_trashClips, type, input);
          }
        });
      });
    };
    initialize();
    return {
      systemClips: _systemClips,
      systemClipCount: _systemClipCount,
      userClips: _userClips,
      hasUserClips: _hasUserClips,
      userClipCount: _userClipCount,
      trashClips: _trashClips,
      trashClipCount: _trashClipCount,
      hasTrashClips: _hasTrashClips,
      emptyTrash
    };
  };
}
