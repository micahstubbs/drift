import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function clipboard() {
  const lodash = window._;
  const Flow = window.Flow;
  let SystemClips;
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
  Flow.Clipboard = _ => {
    let addClip;
    let createClip;
    let emptyTrash;
    let initialize;
    let lengthOf;
    let loadUserClips;
    let removeClip;
    let saveUserClips;
    let serializeUserClips;
    let _hasTrashClips;
    let _hasUserClips;
    let _systemClipCount;
    let _systemClips;
    let _trashClipCount;
    let _trashClips;
    let _userClipCount;
    let _userClips;
    lengthOf = array => {
      if (array.length) {
        return `(${array.length})`;
      }
      return '';
    };
    _systemClips = Flow.Dataflow.signals([]);
    _systemClipCount = Flow.Dataflow.lift(_systemClips, lengthOf);
    _userClips = Flow.Dataflow.signals([]);
    _userClipCount = Flow.Dataflow.lift(_userClips, lengthOf);
    _hasUserClips = Flow.Dataflow.lift(_userClips, clips => clips.length > 0);
    _trashClips = Flow.Dataflow.signals([]);
    _trashClipCount = Flow.Dataflow.lift(_trashClips, lengthOf);
    _hasTrashClips = Flow.Dataflow.lift(_trashClips, clips => clips.length > 0);
    createClip = (_list, _type, _input, _canRemove) => {
      let execute;
      let insert;
      let self;
      if (_canRemove == null) {
        _canRemove = true;
      }
      execute = () => _.insertAndExecuteCell(_type, _input);
      insert = () => _.insertCell(_type, _input);
      flowPrelude.remove = () => {
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
    addClip = (list, type, input) => list.push(createClip(list, type, input));
    removeClip = (list, clip) => {
      if (list === _userClips) {
        _userClips.remove(clip);
        saveUserClips();
        return _trashClips.push(createClip(_trashClips, clip.type, clip.input));
      }
      return _trashClips.remove(clip);
    };
    emptyTrash = () => _trashClips.removeAll();
    loadUserClips = () => _.requestObjectExists('environment', 'clips', (error, exists) => {
      if (exists) {
        return _.requestObject('environment', 'clips', (error, doc) => {
          if (!error) {
            return _userClips(lodash.map(doc.clips, clip => createClip(_userClips, clip.type, clip.input)));
          }
        });
      }
    });
    serializeUserClips = () => ({
      version: '1.0.0',

      clips: lodash.map(_userClips(), clip => ({
        type: clip.type,
        input: clip.input
      }))
    });
    saveUserClips = () => _.requestPutObject('environment', 'clips', serializeUserClips(), error => {
      if (error) {
        _.alert(`Error saving clips: ${error.message}`);
      }
    });
    initialize = () => {
      _systemClips(lodash.map(SystemClips, input => createClip(_systemClips, 'cs', input, false)));
      return Flow.Dataflow.link(_.ready, () => {
        loadUserClips();
        return Flow.Dataflow.link(_.saveClip, (category, type, input) => {
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
