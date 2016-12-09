import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function objectBrowser() {
  var lodash = window._;
  var Flow = window.Flow;
  var isExpandable;
  var preview;
  var previewArray;
  var previewObject;
  isExpandable = function (type) {
    switch (type) {
      case 'null':
      case 'undefined':
      case 'Boolean':
      case 'String':
      case 'Number':
      case 'Date':
      case 'RegExp':
      case 'Arguments':
      case 'Function':
        return false;
      default:
        return true;
    }
  };
  previewArray = function (array) {
    var element;
    var ellipsis;
    var previews;
    ellipsis = array.length > 5 ? ', ...' : '';
    previews = function () {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = lodash.head(array, 5);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push(preview(element));
      }
      return _results;
    }();
    return `[${previews.join(', ')}${ellipsis}]`;
  };
  previewObject = function (object) {
    var count;
    var ellipsis;
    var key;
    var previews;
    var value;
    count = 0;
    previews = [];
    ellipsis = '';
    for (key in object) {
      if ({}.hasOwnProperty.call(object, key)) {
        value = object[key];
        if (!(key !== '_flow_')) {
          continue;
        }
        previews.push(`${key}: ${preview(value)}`);
        if (++count === 5) {
          ellipsis = ', ...';
          break;
        }
      }
    }
    return `{${previews.join(', ')}${ellipsis}}`;
  };
  preview = function (element, recurse) {
    var type;
    if (recurse == null) {
      recurse = false;
    }
    type = flowPrelude.typeOf(element);
    switch (type) {
      case 'Boolean':
      case 'String':
      case 'Number':
      case 'Date':
      case 'RegExp':
        return element;
      case 'undefined':
      case 'null':
      case 'Function':
      case 'Arguments':
        return type;
      case 'Array':
        if (recurse) {
          return previewArray(element);
        }
        return type;
        // break; // no-unreachable
      default:
        if (recurse) {
          return previewObject(element);
        }
        return type;
    }
  };
  Flow.ObjectBrowserElement = function (key, object) {
    var toggle;
    var _canExpand;
    var _expansions;
    var _isExpanded;
    var _type;
    _expansions = Flow.Dataflow.signal(null);
    _isExpanded = Flow.Dataflow.signal(false);
    _type = flowPrelude.typeOf(object);
    _canExpand = isExpandable(_type);
    toggle = function () {
      var expansions;
      var value;
      if (!_canExpand) {
        return;
      }
      if (_expansions() === null) {
        expansions = [];
        for (key in object) {
          if ({}.hasOwnProperty.call(object, key)) {
            value = object[key];
            if (key !== '_flow_') {
              expansions.push(Flow.ObjectBrowserElement(key, value));
            }
          }
        }
        _expansions(expansions);
      }
      return _isExpanded(!_isExpanded());
    };
    return {
      key,
      preview: preview(object, true),
      toggle,
      expansions: _expansions,
      isExpanded: _isExpanded,
      canExpand: _canExpand
    };
  };
  Flow.ObjectBrowser = function (_, _go, key, object) {
    lodash.defer(_go);
    return {
      object: Flow.ObjectBrowserElement(key, object),
      template: 'flow-object'
    };
  };
}
