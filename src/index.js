import { h2oImportModelOutput } from './h2oImportModelOutput';
import { h2oFrameDataOutput } from './h2oFrameDataOutput';
import { h2oDataFrameOutput } from './h2oDataFrameOutput';
import { h2oApplicationContext } from './h2oApplicationContext';

import { flowSandbox } from './flowSandbox';
import { flowGrowl } from './flowGrowl';
import { flowApplicationContext } from './flowApplicationContext';
import { flowAnalytics } from './flowAnalytics';
import { flowForm } from './flowForm';
import { flowAutosave } from './flowAutosave';

import { modelInput } from './modelInput/modelInput';
import { parseInput } from './parseInput/parseInput';
import { jobOutput } from './jobOutput/jobOutput';
import { imputeInput } from './imputeInput/imputeInput';
import { util } from './util/util';
import { routines } from './routines/routines';
import { coreUtils } from './coreUtils/coreUtils';
import { types } from './types/types';
import { localStorage } from './localStorage/localStorage';
import { knockout } from './knockout/knockout';
import { html } from './html/html';
import { format } from './format/format';
import { error } from './error/error';
import { dialogs } from './dialogs/dialogs';
import { dataflow } from './dataflow/dataflow';
import { data } from './data/data';
import { async } from './async/async';
import { objectBrowser } from './objectBrowser/objectBrowser';
import { help } from './help/help';
import { notebook } from './notebook/notebook';
import { failure } from './failure/failure';
import { clipboard } from './clipboard/clipboard';
import { about } from './about/about';

// anonymous IIFE
(function () {
  var lodash = window._; window.Flow = {}; window.H2O = {}; (function () {
    var checkSparklingWater;
    var getContextPath;
    getContextPath = function () {
      window.Flow.ContextPath = '/';
      return $.ajax({
        url: window.referrer,
        type: 'GET',
        success(data, status, xhr) {
          if (xhr.getAllResponseHeaders().indexOf('X-h2o-context-path') !== -1) {
            return window.Flow.ContextPath = xhr.getResponseHeader('X-h2o-context-path');
          }
        },
        async: false
      });
    };
    checkSparklingWater = function (context) {
      context.onSparklingWater = false;
      return $.ajax({
        url: `${window.Flow.ContextPath}3/Metadata/endpoints`,
        type: 'GET',
        dataType: 'json',
        success(response) {
          var route;
          var _i;
          var _len;
          var _ref;
          var _results;
          _ref = response.routes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            route = _ref[_i];
            if (route.url_pattern === '/3/scalaint') {
              _results.push(context.onSparklingWater = true);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        },
        async: false
      });
    };
    if ((typeof window !== 'undefined' && window !== null ? window.$ : void 0) != null) {
      $(function () {
        var context;
        context = {};
        getContextPath();
        checkSparklingWater(context);
        window.flow = Flow.Application(context, H2O.Routines);
        H2O.Application(context);
        ko.applyBindings(window.flow);
        context.ready();
        return context.initialized();
      });
    }
  }.call(this));
  about();
  clipboard();
  failure();
  help();
  notebook();
  objectBrowser(); 
  (function () {}.call(this));
  // defer this for now
  (function () {
    Flow.Application = function (_, routines) {
      var _notebook;
      var _renderers;
      var _sandbox;
      flowApplicationContext(_);
      _sandbox = flowSandbox(_, routines(_));
      _renderers = Flow.Renderers(_, _sandbox);
      flowAnalytics(_);
      flowGrowl(_);
      flowAutosave(_);
      _notebook = Flow.Notebook(_, _renderers);
      return {
        context: _,
        sandbox: _sandbox,
        view: _notebook
      };
    };
  }.call(this));
  // anonymous IIFE
  async();
  data();
  dataflow();
  dialogs();
  error();
  format();
  // anonymous IIFE
  // includes
  // src/core/modules/gui.coffee
  // and more 
  (function () {
    var button;
    var checkbox;
    var content;
    var control;
    var dropdown;
    var html;
    var listbox;
    var markdown;
    var text;
    var textarea;
    var textbox;
    var wrapArray;
    var wrapValue;
    wrapValue = function (value, init) {
      if (value === void 0) {
        return Flow.Dataflow.signal(init);
      }
      if (Flow.Dataflow.isSignal(value)) {
        return value;
      }
      return Flow.Dataflow.signal(value);
    };
    wrapArray = function (elements) {
      var element;
      if (elements) {
        if (Flow.Dataflow.isSignal(elements)) {
          element = elements();
          if (lodash.isArray(element)) {
            return elements;
          }
          return Flow.Dataflow.signal([element]);
        }
        return Flow.Dataflow.signals(lodash.isArray(elements) ? elements : [elements]);
      }
      return Flow.Dataflow.signals([]);
    };
    control = function (type, opts) {
      var guid;
      if (!opts) {
        opts = {};
      }
      guid = `gui_${lodash.uniqueId()}`;
      return {
        type,
        id: opts.id || guid,
        label: Flow.Dataflow.signal(opts.label || ' '),
        description: Flow.Dataflow.signal(opts.description || ' '),
        visible: Flow.Dataflow.signal(opts.visible !== false),
        disable: Flow.Dataflow.signal(opts.disable === true),
        template: `flow-form-${type}`,
        templateOf(control) {
          return control.template;
        }
      };
    };
    content = function (type, opts) {
      var self;
      self = control(type, opts);
      self.value = wrapValue(opts.value, '');
      return self;
    };
    text = function (opts) {
      return content('text', opts);
    };
    html = function (opts) {
      return content('html', opts);
    };
    markdown = function (opts) {
      return content('markdown', opts);
    };
    checkbox = function (opts) {
      var self;
      self = control('checkbox', opts);
      self.value = wrapValue(opts.value, opts.value);
      return self;
    };
    dropdown = function (opts) {
      var self;
      self = control('dropdown', opts);
      self.options = opts.options || [];
      self.value = wrapValue(opts.value);
      self.caption = opts.caption || 'Choose...';
      return self;
    };
    listbox = function (opts) {
      var self;
      self = control('listbox', opts);
      self.options = opts.options || [];
      self.values = wrapArray(opts.values);
      return self;
    };
    textbox = function (opts) {
      var self;
      self = control('textbox', opts);
      self.value = wrapValue(opts.value, '');
      self.event = lodash.isString(opts.event) ? opts.event : null;
      return self;
    };
    textarea = function (opts) {
      var self;
      self = control('textarea', opts);
      self.value = wrapValue(opts.value, '');
      self.event = lodash.isString(opts.event) ? opts.event : null;
      self.rows = lodash.isNumber(opts.rows) ? opts.rows : 5;
      return self;
    };
    button = function (opts) {
      var self;
      self = control('button', opts);
      self.click = lodash.isFunction(opts.click) ? opts.click : lodash.noop;
      return self;
    };
    Flow.Gui = {
      text,
      html,
      markdown,
      checkbox,
      dropdown,
      listbox,
      textbox,
      textarea,
      button
    };
  }.call(this));
  html();
  knockout();
  localStorage();
  // src/core/modules/marked.coffee IIFE
  // experience errors on first abstraction attempt
  // defer for now
  (function () {
    if ((typeof window !== 'undefined' && window !== null ? window.marked : void 0) == null) {
      return;
    }
    marked.setOptions({
      smartypants: true,
      highlight(code, lang) {
        if (window.hljs) {
          return window.hljs.highlightAuto(code, [lang]).value;
        }
        return code;
      }
    });
  }.call(this));
  // this is used many places
  // 179 matches across 29 files, in fact
  // defer for now
  (function () {
    Flow.Prelude = function () {
      var _always;
      var _copy;
      var _deepClone;
      var _isDefined;
      var _isFalsy;
      var _isTruthy;
      var _negative;
      var _never;
      var _remove;
      var _repeat;
      var _typeOf;
      var _words;
      _isDefined = function (value) {
        return !lodash.isUndefined(value);
      };
      _isTruthy = function (value) {
        if (value) {
          return true;
        }
        return false;
      };
      _isFalsy = function (value) {
        if (value) {
          return false;
        }
        return true;
      };
      _negative = function (value) {
        return !value;
      };
      _always = function () {
        return true;
      };
      _never = function () {
        return false;
      };
      _copy = function (array) {
        return array.slice(0);
      };
      _remove = function (array, element) {
        var index;
        if ((index = lodash.indexOf(array, element)) > -1) {
          return lodash.head(array.splice(index, 1));
        }
        return void 0;
      };
      _words = function (text) {
        return text.split(/\s+/);
      };
      _repeat = function (count, value) {
        var array;
        var i;
        var _i;
        array = [];
        for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
          array.push(value);
        }
        return array;
      };
      _typeOf = function (a) {
        var type;
        type = Object.prototype.toString.call(a);
        if (a === null) {
          return Flow.TNull;
        } else if (a === void 0) {
          return Flow.TUndefined;
        } else if (a === true || a === false || type === '[object Boolean]') {
          return Flow.TBoolean;
        }
        switch (type) {
          case '[object String]':
            return Flow.TString;
          case '[object Number]':
            return Flow.TNumber;
          case '[object Function]':
            return Flow.TFunction;
          case '[object Object]':
            return Flow.TObject;
          case '[object Array]':
            return Flow.TArray;
          case '[object Arguments]':
            return Flow.TArguments;
          case '[object Date]':
            return Flow.TDate;
          case '[object RegExp]':
            return Flow.TRegExp;
          case '[object Error]':
            return Flow.TError;
          default:
            return type;
        }
      };
      _deepClone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
      };
      return {
        isDefined: _isDefined,
        isTruthy: _isTruthy,
        isFalsy: _isFalsy,
        negative: _negative,
        always: _always,
        never: _never,
        copy: _copy,
        remove: _remove,
        words: _words,
        repeat: _repeat,
        typeOf: _typeOf,
        deepClone: _deepClone,
        stringify: JSON.stringify
      };
    }();
  }.call(this));
  types();
  coreUtils();
  // defer for now 
  (function () {
    H2O.Application = function (_) {
      h2oApplicationContext(_);
      return H2O.Proxy(_);
    };
  }.call(this));
  // abstracting out this IIFE produces an error
  // defer for now 
  (function () {
    H2O.Proxy = function (_) {
      var cacheModelBuilders;
      var composePath;
      var doDelete;
      var doGet;
      var doPost;
      var doPostJSON;
      var doPut;
      var doUpload;
      var download;
      var encodeArrayForPost;
      var encodeObject;
      var encodeObjectForPost;
      var getGridModelBuilderEndpoint;
      var getLines;
      var getModelBuilderEndpoint;
      var getModelBuilders;
      var http;
      var mapWithKey;
      var optsToString;
      var requestAbout;
      var requestAsDataFrame;
      var requestAsH2OFrameFromDF;
      var requestAsH2OFrameFromRDD;
      var requestAutoModelBuild;
      var requestCancelJob;
      var requestCloud;
      var requestColumnSummary;
      var requestCreateFrame;
      var requestDataFrames;
      var requestDeleteFrame;
      var requestDeleteModel;
      var requestDeleteObject;
      var requestEcho;
      var requestEndpoint;
      var requestEndpoints;
      var requestExec;
      var requestExportFrame;
      var requestExportModel;
      var requestFileGlob;
      var requestFlow;
      var requestFrame;
      var requestFrameSlice;
      var requestFrameSummary;
      var requestFrameSummarySlice;
      var requestFrameSummaryWithoutData;
      var requestFrames;
      var requestGrid;
      var requestGrids;
      var requestHelpContent;
      var requestHelpIndex;
      var requestImportFile;
      var requestImportFiles;
      var requestImportModel;
      var requestInspect;
      var requestIsStorageConfigured;
      var requestJob;
      var requestJobs;
      var requestLogFile;
      var requestModel;
      var requestModelBuild;
      var requestModelBuilder;
      var requestModelBuilders;
      var requestModelBuildersVisibility;
      var requestModelInputValidation;
      var requestModels;
      var requestNetworkTest;
      var requestObject;
      var requestObjectExists;
      var requestObjects;
      var requestPack;
      var requestPacks;
      var requestParseFiles;
      var requestParseSetup;
      var requestParseSetupPreview;
      var requestPartialDependence;
      var requestPartialDependenceData;
      var requestPojoPreview;
      var requestPredict;
      var requestPrediction;
      var requestPredictions;
      var requestProfile;
      var requestPutObject;
      var requestRDDs;
      var requestRemoveAll;
      var requestScalaCode;
      var requestScalaIntp;
      var requestSchema;
      var requestSchemas;
      var requestShutdown;
      var requestSplitFrame;
      var requestStackTrace;
      var requestTimeline;
      var requestUploadFile;
      var requestUploadObject;
      var requestWithOpts;
      var trackPath;
      var unwrap;
      var __gridModelBuilderEndpoints;
      var __modelBuilderEndpoints;
      var __modelBuilders;
      var _storageConfiguration;
      download = function (type, url, go) {
        if (url.substring(0, 1) === '/') {
          url = window.Flow.ContextPath + url.substring(1);
        }
        return $.ajax({
          dataType: type,
          url,
          success(data, status, xhr) {
            return go(null, data);
          },
          error(xhr, status, error) {
            return go(new Flow.Error(error));
          }
        });
      };
      optsToString = function (opts) {
        var str;
        if (opts != null) {
          str = ` with opts ${JSON.stringify(opts)}`;
          if (str.length > 50) {
            return `${str.substr(0, 50)}...`;
          }
          return str;
        }
        return '';
      };
      http = function (method, path, opts, go) {
        var req;
        if (path.substring(0, 1) === '/') {
          path = window.Flow.ContextPath + path.substring(1);
        }
        _.status('server', 'request', path);
        trackPath(path);
        req = function () {
          switch (method) {
            case 'GET':
              return $.getJSON(path);
            case 'POST':
              return $.post(path, opts);
            case 'POSTJSON':
              return $.ajax({
                url: path,
                type: 'POST',
                contentType: 'application/json',
                cache: false,
                data: JSON.stringify(opts)
              });
            case 'PUT':
              return $.ajax({
                url: path,
                type: method,
                data: opts
              });
            case 'DELETE':
              return $.ajax({
                url: path,
                type: method
              });
            case 'UPLOAD':
              return $.ajax({
                url: path,
                type: 'POST',
                data: opts,
                cache: false,
                contentType: false,
                processData: false
              });
          }
        }();
        req.done(function (data, status, xhr) {
          var error;
          _.status('server', 'response', path);
          try {
            return go(null, data);
          } catch (_error) {
            error = _error;
            return go(new Flow.Error(`Error processing ${method} ${path}`, error));
          }
        });
        return req.fail(function (xhr, status, error) {
          var cause;
          var meta;
          var response;
          var serverError;
          _.status('server', 'error', path);
          response = xhr.responseJSON;
          cause = (meta = response != null ? response.__meta : void 0) && (meta.schema_type === 'H2OError' || meta.schema_type === 'H2OModelBuilderError') ? (serverError = new Flow.Error(response.exception_msg), serverError.stack = `${response.dev_msg} (${response.exception_type})\n  ${response.stacktrace.join('\n  ')}`, serverError) : (error != null ? error.message : void 0) ? new Flow.Error(error.message) : status === 'error' && xhr.status === 0 ? new Flow.Error('Could not connect to H2O. Your H2O cloud is currently unresponsive.') : new Flow.Error(`HTTP connection failure: status=${status}, code=${xhr.status}, error=${(error || '?')}`);
          return go(new Flow.Error(`Error calling ${method} ${path}${optsToString(opts)}`, cause));
        });
      };
      doGet = function (path, go) {
        return http('GET', path, null, go);
      };
      doPost = function (path, opts, go) {
        return http('POST', path, opts, go);
      };
      doPostJSON = function (path, opts, go) {
        return http('POSTJSON', path, opts, go);
      };
      doPut = function (path, opts, go) {
        return http('PUT', path, opts, go);
      };
      doUpload = function (path, formData, go) {
        return http('UPLOAD', path, formData, go);
      };
      doDelete = function (path, go) {
        return http('DELETE', path, null, go);
      };
      trackPath = function (path) {
        var base;
        var e;
        var name;
        var other;
        var root;
        var version;
        var _ref;
        var _ref1;
        try {
          _ref = path.split('/'), root = _ref[0], version = _ref[1], name = _ref[2];
          _ref1 = name.split('?'), base = _ref1[0], other = _ref1[1];
          if (base !== 'Typeahead' && base !== 'Jobs') {
            _.trackEvent('api', base, version);
          }
        } catch (_error) {
          e = _error;
        }
      };
      mapWithKey = function (obj, f) {
        var key;
        var result;
        var value;
        result = [];
        for (key in obj) {
          if ({}.hasOwnProperty.call(obj, key)) {
            value = obj[key];
            result.push(f(value, key));
          }
        }
        return result;
      };
      composePath = function (path, opts) {
        var params;
        if (opts) {
          params = mapWithKey(opts, function (v, k) {
            return `${k}=${v}`;
          });
          return `${path}?${params.join('&')}`;
        }
        return path;
      };
      requestWithOpts = function (path, opts, go) {
        return doGet(composePath(path, opts), go);
      };
      encodeArrayForPost = function (array) {
        if (array) {
          if (array.length === 0) {
            return null;
          }
          return `[${lodash.map(array, element => { if (lodash.isNumber(element)) { return element; } return `"${element}"`; }).join(',')} ]`;
        }
        return null;
      };
      encodeObject = function (source) {
        var k;
        var target;
        var v;
        target = {};
        for (k in source) {
          if ({}.hasOwnProperty.call(source, k)) {
            v = source[k];
            target[k] = encodeURIComponent(v);
          }
        }
        return target;
      };
      encodeObjectForPost = function (source) {
        var k;
        var target;
        var v;
        target = {};
        for (k in source) {
          if ({}.hasOwnProperty.call(source, k)) {
            v = source[k];
            target[k] = lodash.isArray(v) ? encodeArrayForPost(v) : v;
          }
        }
        return target;
      };
      unwrap = function (go, transform) {
        return function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, transform(result));
        };
      };
      requestExec = function (ast, go) {
        return doPost('/99/Rapids', { ast }, function (error, result) {
          if (error) {
            return go(error);
          }
          if (result.error) {
            return go(new Flow.Error(result.error));
          }
          return go(null, result);
        });
      };
      requestInspect = function (key, go) {
        var opts;
        opts = { key: encodeURIComponent(key) };
        return requestWithOpts('/3/Inspect', opts, go);
      };
      requestCreateFrame = function (opts, go) {
        return doPost('/3/CreateFrame', opts, go);
      };
      requestSplitFrame = function (frameKey, splitRatios, splitKeys, go) {
        var opts;
        opts = {
          dataset: frameKey,
          ratios: encodeArrayForPost(splitRatios),
          dest_keys: encodeArrayForPost(splitKeys)
        };
        return doPost('/3/SplitFrame', opts, go);
      };
      requestFrames = function (go) {
        return doGet('/3/Frames', function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, result.frames);
        });
      };
      requestFrame = function (key, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestFrameSlice = function (key, searchTerm, offset, count, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}?column_offset=${offset}&column_count=${count}`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestFrameSummary = function (key, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}/summary`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestFrameSummarySlice = function (key, searchTerm, offset, count, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}/summary?column_offset=${offset}&column_count=${count}&_exclude_fields=frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestFrameSummaryWithoutData = function (key, go) {
        return doGet(`/3/Frames/${encodeURIComponent(key)}/summary?_exclude_fields=frames/chunk_summary,frames/distribution_summary,frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, lodash.head(result.frames));
        });
      };
      requestDeleteFrame = function (key, go) {
        return doDelete(`/3/Frames/${encodeURIComponent(key)}`, go);
      };
      requestExportFrame = function (key, path, overwrite, go) {
        var params;
        params = {
          path,
          force: overwrite ? 'true' : 'false'
        };
        return doPost(`/3/Frames/${encodeURIComponent(key)}/export`, params, go);
      };
      requestColumnSummary = function (frameKey, column, go) {
        return doGet(`/3/Frames/${encodeURIComponent(frameKey)}/columns/${encodeURIComponent(column)}/summary`, unwrap(go, function (result) {
          return lodash.head(result.frames);
        }));
      };
      requestJobs = function (go) {
        return doGet('/3/Jobs', function (error, result) {
          if (error) {
            return go(new Flow.Error('Error fetching jobs', error));
          }
          return go(null, result.jobs);
        });
      };
      requestJob = function (key, go) {
        return doGet(`/3/Jobs/${encodeURIComponent(key)}`, function (error, result) {
          if (error) {
            return go(new Flow.Error(`Error fetching job \'${key}\'`, error));
          }
          return go(null, lodash.head(result.jobs));
        });
      };
      requestCancelJob = function (key, go) {
        return doPost(`/3/Jobs/${encodeURIComponent(key)}/cancel`, {}, function (error, result) {
          if (error) {
            return go(new Flow.Error(`Error canceling job \'${key}\'`, error));
          }
          return go(null);
        });
      };
      requestFileGlob = function (path, limit, go) {
        var opts;
        opts = {
          src: encodeURIComponent(path),
          limit
        };
        return requestWithOpts('/3/Typeahead/files', opts, go);
      };
      requestImportFiles = function (paths, go) {
        var tasks;
        tasks = lodash.map(paths, function (path) {
          return function (go) {
            return requestImportFile(path, go);
          };
        });
        return Flow.Async.iterate(tasks)(go);
      };
      requestImportFile = function (path, go) {
        var opts;
        opts = { path: encodeURIComponent(path) };
        return requestWithOpts('/3/ImportFiles', opts, go);
      };
      requestParseSetup = function (sourceKeys, go) {
        var opts;
        opts = { source_frames: encodeArrayForPost(sourceKeys) };
        return doPost('/3/ParseSetup', opts, go);
      };
      requestParseSetupPreview = function (sourceKeys, parseType, separator, useSingleQuotes, checkHeader, columnTypes, go) {
        var opts;
        opts = {
          source_frames: encodeArrayForPost(sourceKeys),
          parse_type: parseType,
          separator,
          single_quotes: useSingleQuotes,
          check_header: checkHeader,
          column_types: encodeArrayForPost(columnTypes)
        };
        return doPost('/3/ParseSetup', opts, go);
      };
      requestParseFiles = function (sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, go) {
        var opts;
        opts = {
          destination_frame: destinationKey,
          source_frames: encodeArrayForPost(sourceKeys),
          parse_type: parseType,
          separator,
          number_columns: columnCount,
          single_quotes: useSingleQuotes,
          column_names: encodeArrayForPost(columnNames),
          column_types: encodeArrayForPost(columnTypes),
          check_header: checkHeader,
          delete_on_done: deleteOnDone,
          chunk_size: chunkSize
        };
        return doPost('/3/Parse', opts, go);
      };
      requestPartialDependence = function (opts, go) {
        return doPost('/3/PartialDependence/', opts, go);
      };
      requestPartialDependenceData = function (key, go) {
        return doGet(`/3/PartialDependence/${encodeURIComponent(key)}`, function (error, result) {
          if (error) {
            return go(error, result);
          }
          return go(error, result);
        });
      };
      requestGrids = function (go, opts) {
        return doGet('/99/Grids', function (error, result) {
          if (error) {
            return go(error, result);
          }
          return go(error, result.grids);
        });
      };
      requestModels = function (go, opts) {
        return requestWithOpts('/3/Models', opts, function (error, result) {
          if (error) {
            return go(error, result);
          }
          return go(error, result.models);
        });
      };
      requestGrid = function (key, opts, go) {
        var params;
        params = void 0;
        if (opts) {
          params = {};
          if (opts.sort_by) {
            params.sort_by = encodeURIComponent(opts.sort_by);
          }
          if (opts.decreasing === true || opts.decreasing === false) {
            params.decreasing = opts.decreasing;
          }
        }
        return doGet(composePath(`/99/Grids/' + ${encodeURIComponent(key)}`, params), go);
      };
      requestModel = function (key, go) {
        return doGet(`/3/Models/${encodeURIComponent(key)}`, function (error, result) {
          if (error) {
            return go(error, result);
          }
          return go(error, lodash.head(result.models));
        });
      };
      requestPojoPreview = function (key, go) {
        return download('text', `/3/Models.java/${encodeURIComponent(key)}/preview`, go);
      };
      requestDeleteModel = function (key, go) {
        return doDelete(`/3/Models/${encodeURIComponent(key)}`, go);
      };
      requestImportModel = function (path, overwrite, go) {
        var opts;
        opts = {
          dir: path,
          force: overwrite
        };
        return doPost('/99/Models.bin/not_in_use', opts, go);
      };
      requestExportModel = function (key, path, overwrite, go) {
        return doGet(`/99/Models.bin/${encodeURIComponent(key)}?dir=${encodeURIComponent(path)}&force=${overwrite}`, go);
      };
      requestModelBuildersVisibility = function (go) {
        return doGet('/3/Configuration/ModelBuilders/visibility', unwrap(go, function (result) {
          return result.value;
        }));
      };
      __modelBuilders = null;
      __modelBuilderEndpoints = null;
      __gridModelBuilderEndpoints = null;
      cacheModelBuilders = function (modelBuilders) {
        var gridModelBuilderEndpoints;
        var modelBuilder;
        var modelBuilderEndpoints;
        var _i;
        var _len;
        modelBuilderEndpoints = {};
        gridModelBuilderEndpoints = {};
        for (_i = 0, _len = modelBuilders.length; _i < _len; _i++) {
          modelBuilder = modelBuilders[_i];
          modelBuilderEndpoints[modelBuilder.algo] = `/${modelBuilder.__meta.schema_version}/ModelBuilders/${modelBuilder.algo}`;
          gridModelBuilderEndpoints[modelBuilder.algo] = `/99/Grid/${modelBuilder.algo}`;
        }
        __modelBuilderEndpoints = modelBuilderEndpoints;
        __gridModelBuilderEndpoints = gridModelBuilderEndpoints;
        return __modelBuilders = modelBuilders;
      };
      getModelBuilders = function () {
        return __modelBuilders;
      };
      getModelBuilderEndpoint = function (algo) {
        return __modelBuilderEndpoints[algo];
      };
      getGridModelBuilderEndpoint = function (algo) {
        return __gridModelBuilderEndpoints[algo];
      };
      requestModelBuilders = function (go) {
        var modelBuilders;
        var visibility;
        if (modelBuilders = getModelBuilders()) {
          return go(null, modelBuilders);
        }
        visibility = 'Stable';
        return doGet('/3/ModelBuilders', unwrap(go, function (result) {
          var algo;
          var availableBuilders;
          var builder;
          var builders;
          builders = function () {
            var _ref;
            var _results;
            _ref = result.model_builders;
            _results = [];
            for (algo in _ref) {
              if ({}.hasOwnProperty.call(_ref, algo)) {
                builder = _ref[algo];
                _results.push(builder);
              }
            }
            return _results;
          }();
          availableBuilders = function () {
            var _i;
            var _j;
            var _len;
            var _len1;
            var _results;
            var _results1;
            switch (visibility) {
              case 'Stable':
                _results = [];
                for (_i = 0, _len = builders.length; _i < _len; _i++) {
                  builder = builders[_i];
                  if (builder.visibility === visibility) {
                    _results.push(builder);
                  }
                }
                return _results;
                // break; // no-unreachable
              case 'Beta':
                _results1 = [];
                for (_j = 0, _len1 = builders.length; _j < _len1; _j++) {
                  builder = builders[_j];
                  if (builder.visibility === visibility || builder.visibility === 'Stable') {
                    _results1.push(builder);
                  }
                }
                return _results1;
                // break; // no-unreachable
              default:
                return builders;
            }
          }();
          return cacheModelBuilders(availableBuilders);
        }));
      };
      requestModelBuilder = function (algo, go) {
        return doGet(getModelBuilderEndpoint(algo), go);
      };
      requestModelInputValidation = function (algo, parameters, go) {
        return doPost(`${getModelBuilderEndpoint(algo)}/parameters`, encodeObjectForPost(parameters), go);
      };
      requestModelBuild = function (algo, parameters, go) {
        _.trackEvent('model', algo);
        if (parameters.hyper_parameters) {
          parameters.hyper_parameters = Flow.Prelude.stringify(parameters.hyper_parameters);
          if (parameters.search_criteria) {
            parameters.search_criteria = Flow.Prelude.stringify(parameters.search_criteria);
          }
          return doPost(getGridModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
        }
        return doPost(getModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
      };
      requestAutoModelBuild = function (parameters, go) {
        return doPostJSON('/3/AutoMLBuilder', parameters, go);
      };
      requestPredict = function (destinationKey, modelKey, frameKey, options, go) {
        var opt;
        var opts;
        opts = {};
        if (destinationKey) {
          opts.predictions_frame = destinationKey;
        }
        if (void 0 !== (opt = options.reconstruction_error)) {
          opts.reconstruction_error = opt;
        }
        if (void 0 !== (opt = options.deep_features_hidden_layer)) {
          opts.deep_features_hidden_layer = opt;
        }
        if (void 0 !== (opt = options.leaf_node_assignment)) {
          opts.leaf_node_assignment = opt;
        }
        if (void 0 !== (opt = options.exemplar_index)) {
          opts.exemplar_index = opt;
        }
        return doPost(`/3/Predictions/models/${encodeURIComponent(modelKey)}/frames/${encodeURIComponent(frameKey)}`, opts, function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, result);
        });
      };
      requestPrediction = function (modelKey, frameKey, go) {
        return doGet(`/3/ModelMetrics/models/${encodeURIComponent(modelKey)}/frames/${encodeURIComponent(frameKey)}`, function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, result);
        });
      };
      requestPredictions = function (modelKey, frameKey, _go) {
        var go;
        go = function (error, result) {
          var prediction;
          var predictions;
          if (error) {
            return _go(error);
          }
          predictions = function () {
            var _i;
            var _len;
            var _ref;
            var _results;
            _ref = result.model_metrics;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              prediction = _ref[_i];
              if (modelKey && prediction.model.name !== modelKey) {
                _results.push(null);
              } else if (frameKey && prediction.frame.name !== frameKey) {
                _results.push(null);
              } else {
                _results.push(prediction);
              }
            }
            return _results;
          }();
          return _go(null, function () {
            var _i;
            var _len;
            var _results;
            _results = [];
            for (_i = 0, _len = predictions.length; _i < _len; _i++) {
              prediction = predictions[_i];
              if (prediction) {
                _results.push(prediction);
              }
            }
            return _results;
          }());
        };
        if (modelKey && frameKey) {
          return doGet(`/3/ModelMetrics/models/${encodeURIComponent(modelKey)}/frames/'${encodeURIComponent(frameKey)}`, go);
        } else if (modelKey) {
          return doGet(`/3/ModelMetrics/models/${encodeURIComponent(modelKey)}`, go);
        } else if (frameKey) {
          return doGet(`/3/ModelMetrics/frames/${encodeURIComponent(frameKey)}`, go);
        }
        return doGet('/3/ModelMetrics', go);
      };
      _storageConfiguration = null;
      requestIsStorageConfigured = function (go) {
        if (_storageConfiguration) {
          return go(null, _storageConfiguration.isConfigured);
        }
        return doGet('/3/NodePersistentStorage/configured', function (error, result) {
          _storageConfiguration = { isConfigured: error ? false : result.configured };
          return go(null, _storageConfiguration.isConfigured);
        });
      };
      requestObjects = function (type, go) {
        return doGet(`/3/NodePersistentStorage/${encodeURIComponent(type)}`, unwrap(go, function (result) {
          return result.entries;
        }));
      };
      requestObjectExists = function (type, name, go) {
        return doGet(`/3/NodePersistentStorage/categories/${encodeURIComponent(type)}/names/${encodeURIComponent(name)}/exists`, function (error, result) {
          return go(null, error ? false : result.exists);
        });
      };
      requestObject = function (type, name, go) {
        return doGet(`/3/NodePersistentStorage/${encodeURIComponent(type)}/${encodeURIComponent(name)}`, unwrap(go, function (result) {
          return JSON.parse(result.value);
        }));
      };
      requestDeleteObject = function (type, name, go) {
        return doDelete(`/3/NodePersistentStorage/${encodeURIComponent(type)}/${encodeURIComponent(name)}`, go);
      };
      requestPutObject = function (type, name, value, go) {
        var uri;
        uri = `/3/NodePersistentStorage/${encodeURIComponent(type)}`;
        if (name) {
          uri += `/${encodeURIComponent(name)}`;
        }
        return doPost(uri, { value: JSON.stringify(value, null, 2) }, unwrap(go, function (result) {
          return result.name;
        }));
      };
      requestUploadObject = function (type, name, formData, go) {
        var uri;
        uri = `/3/NodePersistentStorage.bin/${encodeURIComponent(type)}`;
        if (name) {
          uri += `/${encodeURIComponent(name)}`;
        }
        return doUpload(uri, formData, unwrap(go, function (result) {
          return result.name;
        }));
      };
      requestUploadFile = function (key, formData, go) {
        return doUpload(`/3/PostFile?destination_frame=${encodeURIComponent(key)}`, formData, go);
      };
      requestCloud = function (go) {
        return doGet('/3/Cloud', go);
      };
      requestTimeline = function (go) {
        return doGet('/3/Timeline', go);
      };
      requestProfile = function (depth, go) {
        return doGet(`/3/Profiler?depth=${depth}`, go);
      };
      requestStackTrace = function (go) {
        return doGet('/3/JStack', go);
      };
      requestRemoveAll = function (go) {
        return doDelete('/3/DKV', go);
      };
      requestEcho = function (message, go) {
        return doPost('/3/LogAndEcho', { message }, go);
      };
      requestLogFile = function (nodeIndex, fileType, go) {
        return doGet(`/3/Logs/nodes/${nodeIndex}/files/${fileType}`, go);
      };
      requestNetworkTest = function (go) {
        return doGet('/3/NetworkTest', go);
      };
      requestAbout = function (go) {
        return doGet('/3/About', go);
      };
      requestShutdown = function (go) {
        return doPost('/3/Shutdown', {}, go);
      };
      requestEndpoints = function (go) {
        return doGet('/3/Metadata/endpoints', go);
      };
      requestEndpoint = function (index, go) {
        return doGet(`/3/Metadata/endpoints/${index}`, go);
      };
      requestSchemas = function (go) {
        return doGet('/3/Metadata/schemas', go);
      };
      requestSchema = function (name, go) {
        return doGet(`/3/Metadata/schemas/${encodeURIComponent(name)}`, go);
      };
      getLines = function (data) {
        return lodash.filter(data.split('\n'), function (line) {
          if (line.trim()) {
            return true;
          }
          return false;
        });
      };
      requestPacks = function (go) {
        return download('text', '/flow/packs/index.list', unwrap(go, getLines));
      };
      requestPack = function (packName, go) {
        return download('text', `/flow/packs/${encodeURIComponent(packName)}/index.list`, unwrap(go, getLines));
      };
      requestFlow = function (packName, flowName, go) {
        return download('json', `/flow/packs/${encodeURIComponent(packName)}/${encodeURIComponent(flowName)}`, go);
      };
      requestHelpIndex = function (go) {
        return download('json', '/flow/help/catalog.json', go);
      };
      requestHelpContent = function (name, go) {
        return download('text', `/flow/help/${name}.html`, go);
      };
      requestRDDs = function (go) {
        return doGet('/3/RDDs', go);
      };
      requestDataFrames = function (go) {
        return doGet('/3/dataframes', go);
      };
      requestScalaIntp = function (go) {
        return doPost('/3/scalaint', {}, go);
      };
      requestScalaCode = function (session_id, code, go) {
        return doPost(`/3/scalaint/${session_id}`, { code }, go);
      };
      requestAsH2OFrameFromRDD = function (rdd_id, name, go) {
        if (name === void 0) {
          return doPost(`/3/RDDs/${rdd_id}/h2oframe`, {}, go);
        }
        return doPost(`/3/RDDs/${rdd_id}/h2oframe`, { h2oframe_id: name }, go);
      };
      requestAsH2OFrameFromDF = function (df_id, name, go) {
        if (name === void 0) {
          return doPost(`/3/dataframes/${df_id}/h2oframe`, {}, go);
        }
        return doPost(`/3/dataframes/${df_id}/h2oframe`, { h2oframe_id: name }, go);
      };
      requestAsDataFrame = function (hf_id, name, go) {
        if (name === void 0) {
          return doPost(`/3/h2oframes/${hf_id}/dataframe`, {}, go);
        }
        return doPost(`/3/h2oframes/${hf_id}/dataframe`, { dataframe_id: name }, go);
      };
      Flow.Dataflow.link(_.requestInspect, requestInspect);
      Flow.Dataflow.link(_.requestCreateFrame, requestCreateFrame);
      Flow.Dataflow.link(_.requestSplitFrame, requestSplitFrame);
      Flow.Dataflow.link(_.requestFrames, requestFrames);
      Flow.Dataflow.link(_.requestFrame, requestFrame);
      Flow.Dataflow.link(_.requestFrameSlice, requestFrameSlice);
      Flow.Dataflow.link(_.requestFrameSummary, requestFrameSummary);
      Flow.Dataflow.link(_.requestFrameSummaryWithoutData, requestFrameSummaryWithoutData);
      Flow.Dataflow.link(_.requestFrameSummarySlice, requestFrameSummarySlice);
      Flow.Dataflow.link(_.requestDeleteFrame, requestDeleteFrame);
      Flow.Dataflow.link(_.requestExportFrame, requestExportFrame);
      Flow.Dataflow.link(_.requestColumnSummary, requestColumnSummary);
      Flow.Dataflow.link(_.requestJobs, requestJobs);
      Flow.Dataflow.link(_.requestJob, requestJob);
      Flow.Dataflow.link(_.requestCancelJob, requestCancelJob);
      Flow.Dataflow.link(_.requestFileGlob, requestFileGlob);
      Flow.Dataflow.link(_.requestImportFiles, requestImportFiles);
      Flow.Dataflow.link(_.requestImportFile, requestImportFile);
      Flow.Dataflow.link(_.requestParseSetup, requestParseSetup);
      Flow.Dataflow.link(_.requestParseSetupPreview, requestParseSetupPreview);
      Flow.Dataflow.link(_.requestParseFiles, requestParseFiles);
      Flow.Dataflow.link(_.requestPartialDependence, requestPartialDependence);
      Flow.Dataflow.link(_.requestPartialDependenceData, requestPartialDependenceData);
      Flow.Dataflow.link(_.requestGrids, requestGrids);
      Flow.Dataflow.link(_.requestModels, requestModels);
      Flow.Dataflow.link(_.requestGrid, requestGrid);
      Flow.Dataflow.link(_.requestModel, requestModel);
      Flow.Dataflow.link(_.requestPojoPreview, requestPojoPreview);
      Flow.Dataflow.link(_.requestDeleteModel, requestDeleteModel);
      Flow.Dataflow.link(_.requestImportModel, requestImportModel);
      Flow.Dataflow.link(_.requestExportModel, requestExportModel);
      Flow.Dataflow.link(_.requestModelBuilder, requestModelBuilder);
      Flow.Dataflow.link(_.requestModelBuilders, requestModelBuilders);
      Flow.Dataflow.link(_.requestModelBuild, requestModelBuild);
      Flow.Dataflow.link(_.requestModelInputValidation, requestModelInputValidation);
      Flow.Dataflow.link(_.requestAutoModelBuild, requestAutoModelBuild);
      Flow.Dataflow.link(_.requestPredict, requestPredict);
      Flow.Dataflow.link(_.requestPrediction, requestPrediction);
      Flow.Dataflow.link(_.requestPredictions, requestPredictions);
      Flow.Dataflow.link(_.requestObjects, requestObjects);
      Flow.Dataflow.link(_.requestObject, requestObject);
      Flow.Dataflow.link(_.requestObjectExists, requestObjectExists);
      Flow.Dataflow.link(_.requestDeleteObject, requestDeleteObject);
      Flow.Dataflow.link(_.requestPutObject, requestPutObject);
      Flow.Dataflow.link(_.requestUploadObject, requestUploadObject);
      Flow.Dataflow.link(_.requestUploadFile, requestUploadFile);
      Flow.Dataflow.link(_.requestCloud, requestCloud);
      Flow.Dataflow.link(_.requestTimeline, requestTimeline);
      Flow.Dataflow.link(_.requestProfile, requestProfile);
      Flow.Dataflow.link(_.requestStackTrace, requestStackTrace);
      Flow.Dataflow.link(_.requestRemoveAll, requestRemoveAll);
      Flow.Dataflow.link(_.requestEcho, requestEcho);
      Flow.Dataflow.link(_.requestLogFile, requestLogFile);
      Flow.Dataflow.link(_.requestNetworkTest, requestNetworkTest);
      Flow.Dataflow.link(_.requestAbout, requestAbout);
      Flow.Dataflow.link(_.requestShutdown, requestShutdown);
      Flow.Dataflow.link(_.requestEndpoints, requestEndpoints);
      Flow.Dataflow.link(_.requestEndpoint, requestEndpoint);
      Flow.Dataflow.link(_.requestSchemas, requestSchemas);
      Flow.Dataflow.link(_.requestSchema, requestSchema);
      Flow.Dataflow.link(_.requestPacks, requestPacks);
      Flow.Dataflow.link(_.requestPack, requestPack);
      Flow.Dataflow.link(_.requestFlow, requestFlow);
      Flow.Dataflow.link(_.requestHelpIndex, requestHelpIndex);
      Flow.Dataflow.link(_.requestHelpContent, requestHelpContent);
      Flow.Dataflow.link(_.requestExec, requestExec);
      Flow.Dataflow.link(_.requestRDDs, requestRDDs);
      Flow.Dataflow.link(_.requestDataFrames, requestDataFrames);
      Flow.Dataflow.link(_.requestScalaIntp, requestScalaIntp);
      Flow.Dataflow.link(_.requestScalaCode, requestScalaCode);
      Flow.Dataflow.link(_.requestAsH2OFrameFromDF, requestAsH2OFrameFromDF);
      Flow.Dataflow.link(_.requestAsH2OFrameFromRDD, requestAsH2OFrameFromRDD);
      return Flow.Dataflow.link(_.requestAsDataFrame, requestAsDataFrame);
    };
  }.call(this));
  routines();
  util();
  imputeInput();
  jobOutput();
  modelInput();
  parseInput();
}).call(this);
