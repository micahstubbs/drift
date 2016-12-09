import { h2oInspectsOutput } from '../h2oInspectsOutput';
import { h2oInspectOutput } from '../h2oInspectOutput';
import { h2oPlotOutput } from '../h2oPlotOutput';
import { h2oPlotInput } from '../h2oPlotInput';
import { h2oCloudOutput } from '../h2oCloudOutput';
import { h2oTimelineOutput } from '../h2oTimelineOutput';
import { h2oStackTraceOutput } from '../h2oStackTraceOutput';
import { h2oLogFileOutput } from '../h2oLogFileOutput';
import { h2oNetworkTestOutput } from '../h2oNetworkTestOutput';
import { h2oProfileOutput } from '../h2oProfileOutput';
import { h2oFramesOutput } from '../h2oFramesOutput';
import { h2oSplitFrameOutput } from '../h2oSplitFrameOutput';
import { h2oMergeFramesOutput } from '../h2oMergeFramesOutput';
import { h2oPartialDependenceOutput } from '../h2oPartialDependenceOutput';
import { h2oJobsOutput } from '../h2oJobsOutput';
import { h2oCancelJobOutput } from '../h2oCancelJobOutput';
import { h2oDeleteObjectsOutput } from '../h2oDeleteObjectsOutput';
import { h2oModelOutput } from '../h2oModelOutput';
import { h2oGridOutput } from '../h2oGridOutput';
import { h2oGridsOutput } from '../h2oGridsOutput';
import { h2oModelsOutput } from '../h2oModelsOutput';
import { h2oPredictsOutput } from '../h2oPredictsOutput';
import { h2oPredictOutput } from '../h2oPredictOutput';
import { h2oH2OFrameOutput } from '../h2oH2OFrameOutput';
import { h2oFrameOutput } from '../h2oFrameOutput';
import { h2oColumnSummaryOutput } from '../h2oColumnSummaryOutput';
import { h2oExportFrameOutput } from '../h2oExportFrameOutput';
import { h2oBindFramesOutput } from '../h2oBindFramesOutput';
import { h2oExportModelOutput } from '../h2oExportModelOutput';
import { h2oImportFilesOutput } from '../h2oImportFilesOutput';
import { h2oRDDsOutput } from '../h2oRDDsOutput';
import { h2oDataFramesOutput } from '../h2oDataFramesOutput';
import { h2oScalaCodeOutput } from '../h2oScalaCodeOutput';
import { h2oScalaIntpOutput } from '../h2oScalaIntpOutput';
import { h2oAssist } from '../h2oAssist';
import { h2oImportFilesInput } from '../h2oImportFilesInput';
import { h2oAutoModelInput } from '../h2oAutoModelInput';
import { h2oPredictInput } from '../h2oPredictInput';
import { h2oCreateFrameInput } from '../h2oCreateFrameInput';
import { h2oSplitFrameInput } from '../h2oSplitFrameInput';
import { h2oMergeFramesInput } from '../h2oMergeFramesInput';
import { h2oPartialDependenceInput } from '../h2oPartialDependenceInput';
import { h2oExportFrameInput } from '../h2oExportFrameInput';
import { h2oImportModelInput } from '../h2oImportModelInput';
import { h2oExportModelInput } from '../h2oExportModelInput';
import { h2oNoAssist } from '../h2oNoAssist';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function routines() {
  var lodash = window._;
  var Flow = window.Flow;
  var combineTables;
  var computeFalsePositiveRate;
  var computeTruePositiveRate;
  var concatArrays;
  var convertColumnToVector;
  var convertTableToFrame;
  var createArrays;
  var createDataframe;
  var createFactor;
  var createList;
  var createTempKey;
  var createVector;
  var format4f;
  var format6fi;
  var formatConfusionMatrix;
  var formulateGetPredictionsOrigin;
  var getTwoDimData;
  var lightning;
  var parseAndFormatArray;
  var parseAndFormatObjectArray;
  var parseNaNs;
  var parseNulls;
  var parseNumbers;
  var repeatValues;
  var _assistance;
  var __slice = [].slice;
  lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
  if (lightning.settings) {
    lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
    lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
  }
  createTempKey = function () {
    return `flow_${Flow.Util.uuid().replace(/\-/g, '')}`;
  };
  createVector = lightning.createVector;
  createFactor = lightning.createFactor;
  createList = lightning.createList;
  createDataframe = lightning.createFrame;
  _assistance = {
    importFiles: {
      description: 'Import file(s) into H<sub>2</sub>O',
      icon: 'files-o'
    },
    getFrames: {
      description: 'Get a list of frames in H<sub>2</sub>O',
      icon: 'table'
    },
    splitFrame: {
      description: 'Split a frame into two or more frames',
      icon: 'scissors'
    },
    mergeFrames: {
      description: 'Merge two frames into one',
      icon: 'link'
    },
    getModels: {
      description: 'Get a list of models in H<sub>2</sub>O',
      icon: 'cubes'
    },
    getGrids: {
      description: 'Get a list of grid search results in H<sub>2</sub>O',
      icon: 'th'
    },
    getPredictions: {
      description: 'Get a list of predictions in H<sub>2</sub>O',
      icon: 'bolt'
    },
    getJobs: {
      description: 'Get a list of jobs running in H<sub>2</sub>O',
      icon: 'tasks'
    },
    buildModel: {
      description: 'Build a model',
      icon: 'cube'
    },
    importModel: {
      description: 'Import a saved model',
      icon: 'cube'
    },
    predict: {
      description: 'Make a prediction',
      icon: 'bolt'
    }
  };
  parseNumbers = function (source) {
    var i;
    var target;
    var value;
    var _i;
    var _len;
    target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      value = source[i];
      target[i] = value === 'NaN' ? void 0 : value === 'Infinity' ? Number.POSITIVE_INFINITY : value === '-Infinity' ? Number.NEGATIVE_INFINITY : value;
    }
    return target;
  };
  convertColumnToVector = function (column, data) {
    switch (column.type) {
      case 'byte':
      case 'short':
      case 'int':
      case 'integer':
      case 'long':
        return createVector(column.name, 'Number', parseNumbers(data));
      case 'float':
      case 'double':
        return createVector(column.name, 'Number', parseNumbers(data), format4f);
      case 'string':
        return createFactor(column.name, 'String', data);
      case 'matrix':
        return createList(column.name, data, formatConfusionMatrix);
      default:
        return createList(column.name, data);
    }
  };
  convertTableToFrame = function (table, tableName, metadata) {
    var column;
    var i;
    var vectors;
    vectors = function () {
      var _i;
      var _len;
      var _ref;
      var _results;
      _ref = table.columns;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        column = _ref[i];
        _results.push(convertColumnToVector(column, table.data[i]));
      }
      return _results;
    }();
    return createDataframe(tableName, vectors, lodash.range(table.rowcount), null, metadata);
  };
  getTwoDimData = function (table, columnName) {
    var columnIndex;
    columnIndex = lodash.findIndex(table.columns, function (column) {
      return column.name === columnName;
    });
    if (columnIndex >= 0) {
      return table.data[columnIndex];
    }
    return void 0;
  };
  format4f = function (number) {
    if (number) {
      if (number === 'NaN') {
        return void 0;
      }
      return number.toFixed(4).replace(/\.0+$/, '.0');
    }
    return number;
  };
  format6fi = function (number) {
    if (number) {
      if (number === 'NaN') {
        return void 0;
      }
      return number.toFixed(6).replace(/\.0+$/, '');
    }
    return number;
  };
  combineTables = function (tables) {
    var columnCount;
    var columnData;
    var data;
    var element;
    var i;
    var index;
    var leader;
    var rowCount;
    var table;
    var _i;
    var _j;
    var _k;
    var _l;
    var _len;
    var _len1;
    var _len2;
    var _ref;
    leader = lodash.head(tables);
    rowCount = 0;
    columnCount = leader.data.length;
    data = new Array(columnCount);
    for (_i = 0, _len = tables.length; _i < _len; _i++) {
      table = tables[_i];
      rowCount += table.rowcount;
    }
    for (i = _j = 0; columnCount >= 0 ? _j < columnCount : _j > columnCount; i = columnCount >= 0 ? ++_j : --_j) {
      data[i] = columnData = new Array(rowCount);
      index = 0;
      for (_k = 0, _len1 = tables.length; _k < _len1; _k++) {
        table = tables[_k];
        _ref = table.data[i];
        for (_l = 0, _len2 = _ref.length; _l < _len2; _l++) {
          element = _ref[_l];
          columnData[index++] = element;
        }
      }
    }
    return {
      name: leader.name,
      columns: leader.columns,
      data,
      rowcount: rowCount
    };
  };
  createArrays = function (count, length) {
    var i;
    var _i;
    var _results;
    _results = [];
    for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
      _results.push(new Array(length));
    }
    return _results;
  };
  parseNaNs = function (source) {
    var element;
    var i;
    var target;
    var _i;
    var _len;
    target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      element = source[i];
      target[i] = element === 'NaN' ? void 0 : element;
    }
    return target;
  };
  parseNulls = function (source) {
    var element;
    var i;
    var target;
    var _i;
    var _len;
    target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      element = source[i];
      target[i] = element != null ? element : void 0;
    }
    return target;
  };
  parseAndFormatArray = function (source) {
    var element;
    var i;
    var target;
    var _i;
    var _len;
    target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      element = source[i];
      target[i] = element != null ? lodash.isNumber(element) ? format6fi(element) : element : void 0;
    }
    return target;
  };
  parseAndFormatObjectArray = function (source) {
    var element;
    var i;
    var target;
    var _i;
    var _len;
    var _ref;
    var _ref1;
    target = new Array(source.length);
    for (i = _i = 0, _len = source.length; _i < _len; i = ++_i) {
      element = source[i];
      target[i] = element != null ? ((_ref = element.__meta) != null ? _ref.schema_type : void 0) === 'Key<Model>' ? `<a href=\'#\' data-type=\'model\' data-key=${flowPrelude.stringify(element.name)}>${lodash.escape(element.name)}</a>` : ((_ref1 = element.__meta) != null ? _ref1.schema_type : void 0) === 'Key<Frame>' ? `<a href=\'#\' data-type=\'frame\' data-key=${flowPrelude.stringify(element.name)}>${lodash.escape(element.name)}</a>` : element : void 0;
    }
    return target;
  };
  repeatValues = function (count, value) {
    var i;
    var target;
    var _i;
    target = new Array(count);
    for (i = _i = 0; count >= 0 ? _i < count : _i > count; i = count >= 0 ? ++_i : --_i) {
      target[i] = value;
    }
    return target;
  };
  concatArrays = function (arrays) {
    var a;
    switch (arrays.length) {
      case 0:
        return [];
      case 1:
        return lodash.head(arrays);
      default:
        a = lodash.head(arrays);
        return a.concat(...lodash.tail(arrays));
    }
  };
  computeTruePositiveRate = function (cm) {
    var fn;
    var fp;
    var tn;
    var tp;
    var _ref;
    var _ref1;
    (_ref = cm[0], tn = _ref[0], fp = _ref[1]), (_ref1 = cm[1], fn = _ref1[0], tp = _ref1[1]);
    return tp / (tp + fn);
  };
  computeFalsePositiveRate = function (cm) {
    var fn;
    var fp;
    var tn;
    var tp;
    var _ref;
    var _ref1;
    (_ref = cm[0], tn = _ref[0], fp = _ref[1]), (_ref1 = cm[1], fn = _ref1[0], tp = _ref1[1]);
    return fp / (fp + tn);
  };
  formatConfusionMatrix = function (cm) {
    var domain;
    var fn;
    var fnr;
    var fp;
    var fpr;
    var normal;
    var strong;
    var table;
    var tbody;
    var tn;
    var tp;
    var tr;
    var yellow;
    var _ref;
    var _ref1;
    var _ref2;
    var _ref3;
    _ref = cm.matrix, (_ref1 = _ref[0], tn = _ref1[0], fp = _ref1[1]), (_ref2 = _ref[1], fn = _ref2[0], tp = _ref2[1]);
    fnr = fn / (tp + fn);
    fpr = fp / (fp + tn);
    domain = cm.domain;
    _ref3 = Flow.HTML.template('table.flow-matrix', 'tbody', 'tr', 'td.strong.flow-center', 'td', 'td.bg-yellow'), table = _ref3[0], tbody = _ref3[1], tr = _ref3[2], strong = _ref3[3], normal = _ref3[4], yellow = _ref3[5];
    return table([tbody([
      tr([
        strong('Actual/Predicted'),
        strong(domain[0]),
        strong(domain[1]),
        strong('Error'),
        strong('Rate')
      ]),
      tr([
        strong(domain[0]),
        yellow(tn),
        normal(fp),
        normal(format4f(fpr)),
        normal(`${fp} / ${(fp + tn)}`)
      ]),
      tr([
        strong(domain[1]),
        normal(fn),
        yellow(tp),
        normal(format4f(fnr)),
        normal(`${fn} / ${(tp + fn)}`)
      ]),
      tr([
        strong('Total'),
        strong(tn + fn),
        strong(tp + fp),
        strong(format4f((fn + fp) / (fp + tn + tp + fn))),
        strong(`${fn}${fp} / ${(fp + tn + tp + fn)}`)
      ])
    ])]);
  };
  formulateGetPredictionsOrigin = function (opts) {
    var frameKey;
    var modelKey;
    var opt;
    var sanitizedOpt;
    var sanitizedOpts;
    if (lodash.isArray(opts)) {
      sanitizedOpts = function () {
        var _i;
        var _len;
        var _results;
        _results = [];
        for (_i = 0, _len = opts.length; _i < _len; _i++) {
          opt = opts[_i];
          sanitizedOpt = {};
          if (opt.model) {
            sanitizedOpt.model = opt.model;
          }
          if (opt.frame) {
            sanitizedOpt.frame = opt.frame;
          }
          _results.push(sanitizedOpt);
        }
        return _results;
      }();
      return `getPredictions ${flowPrelude.stringify(sanitizedOpts)}`;
    }
    modelKey = opts.model, frameKey = opts.frame;
    if (modelKey && frameKey) {
      return `getPredictions model: ${flowPrelude.stringify(modelKey)}, frame: ${flowPrelude.stringify(frameKey)}`;
    } else if (modelKey) {
      return `getPredictions model: ${flowPrelude.stringify(modelKey)}`;
    } else if (frameKey) {
      return `getPredictions frame: ${flowPrelude.stringify(frameKey)}`;
    }
    return 'getPredictions()';
  };
  H2O.Routines = function (_) {
    var asDataFrame;
    var asH2OFrameFromDF;
    var asH2OFrameFromRDD;
    var assist;
    var attrname;
    var bindFrames;
    var blacklistedAttributesBySchema;
    var buildAutoModel;
    var buildModel;
    var buildPartialDependence;
    var cancelJob;
    var changeColumnType;
    var computeSplits;
    var createFrame;
    var createGui;
    var createPlot;
    var deleteAll;
    var deleteFrame;
    var deleteFrames;
    var deleteModel;
    var deleteModels;
    var dump;
    var dumpFuture;
    var exportFrame;
    var exportModel;
    var extendAsDataFrame;
    var extendAsH2OFrame;
    var extendBindFrames;
    var extendCancelJob;
    var extendCloud;
    var extendColumnSummary;
    var extendDataFrames;
    var extendDeletedKeys;
    var extendExportFrame;
    var extendExportModel;
    var extendFrame;
    var extendFrameData;
    var extendFrameSummary;
    var extendFrames;
    var extendGrid;
    var extendGrids;
    var extendGuiForm;
    var extendImportModel;
    var extendImportResults;
    var extendJob;
    var extendJobs;
    var extendLogFile;
    var extendMergeFramesResult;
    var extendModel;
    var extendModels;
    var extendNetworkTest;
    var extendParseResult;
    var extendParseSetupResults;
    var extendPartialDependence;
    var extendPlot;
    var extendPrediction;
    var extendPredictions;
    var extendProfile;
    var extendRDDs;
    var extendScalaCode;
    var extendScalaIntp;
    var extendSplitFrameResult;
    var extendStackTrace;
    var extendTimeline;
    var f;
    var findColumnIndexByColumnLabel;
    var findColumnIndicesByColumnLabels;
    var flow_;
    var getCloud;
    var getColumnSummary;
    var getDataFrames;
    var getFrame;
    var getFrameData;
    var getFrameSummary;
    var getFrames;
    var getGrid;
    var getGrids;
    var getJob;
    var getJobs;
    var getLogFile;
    var getModel;
    var getModelParameterValue;
    var getModels;
    var getPartialDependence;
    var getPrediction;
    var getPredictions;
    var getProfile;
    var getRDDs;
    var getScalaIntp;
    var getStackTrace;
    var getTimeline;
    var grid;
    var gui;
    var importFiles;
    var importModel;
    var imputeColumn;
    var initAssistanceSparklingWater;
    var inspect;
    var inspect$1;
    var inspect$2;
    var inspectFrameColumns;
    var inspectFrameData;
    var inspectModelParameters;
    var inspectNetworkTestResult;
    var inspectObject;
    var inspectObjectArray_;
    var inspectParametersAcrossModels;
    var inspectRawArray_;
    var inspectRawObject_;
    var inspectTwoDimTable_;
    var inspect_;
    var loadScript;
    var ls;
    var mergeFrames;
    var name;
    var parseFiles;
    var plot;
    var predict;
    var proceed;
    var read;
    var render_;
    var requestAsDataFrame;
    var requestAsH2OFrameFromDF;
    var requestAsH2OFrameFromRDD;
    var requestAutoModelBuild;
    var requestBindFrames;
    var requestCancelJob;
    var requestChangeColumnType;
    var requestCloud;
    var requestColumnSummary;
    var requestCreateFrame;
    var requestDataFrames;
    var requestDeleteFrame;
    var requestDeleteFrames;
    var requestDeleteModel;
    var requestDeleteModels;
    var requestExportFrame;
    var requestExportModel;
    var requestFrame;
    var requestFrameData;
    var requestFrameSummary;
    var requestFrameSummarySlice;
    var requestFrames;
    var requestGrid;
    var requestGrids;
    var requestImportAndParseFiles;
    var requestImportAndParseSetup;
    var requestImportFiles;
    var requestImportModel;
    var requestImputeColumn;
    var requestJob;
    var requestJobs;
    var requestLogFile;
    var requestMergeFrames;
    var requestModel;
    var requestModelBuild;
    var requestModels;
    var requestModelsByKeys;
    var requestNetworkTest;
    var requestParseFiles;
    var requestParseSetup;
    var requestPartialDependence;
    var requestPartialDependenceData;
    var requestPredict;
    var requestPrediction;
    var requestPredictions;
    var requestPredicts;
    var requestProfile;
    var requestRDDs;
    var requestRemoveAll;
    var requestScalaCode;
    var requestScalaIntp;
    var requestSplitFrame;
    var requestStackTrace;
    var requestTimeline;
    var routines;
    var routinesOnSw;
    var runScalaCode;
    var schemaTransforms;
    var setupParse;
    var splitFrame;
    var testNetwork;
    var transformBinomialMetrics;
    var unwrapPrediction;
    var _apply;
    var _async;
    var _call;
    var _fork;
    var _get;
    var _isFuture;
    var _join;
    var _plot;
    var _ref;
    var _schemaHacks;
    _fork = function () {
      var args;
      var f;
      f = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
      return Flow.Async.fork(f, args);
    };
    _join = function () {
      var args;
      var go;
      var _i;
      args = arguments.length >= 2 ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), go = arguments[_i++];
      return Flow.Async.join(args, Flow.Async.applicate(go));
    };
    _call = function () {
      var args;
      var go;
      go = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
      return Flow.Async.join(args, Flow.Async.applicate(go));
    };
    _apply = function (go, args) {
      return Flow.Async.join(args, go);
    };
    _isFuture = Flow.Async.isFuture;
    _async = Flow.Async.async;
    _get = Flow.Async.get;
    proceed = function (func, args, go) {
      return go(null, render_({}, function () {
        return func(...[_].concat(args || []));
      }));
    };
    proceed = function (func, args, go) {
      return go(null, render_(...[
              {},
        func
      ].concat(args || [])));
    };
    extendGuiForm = function (form) {
      return render_(form, flowForm, form);
    };
    createGui = function (controls, go) {
      return go(null, extendGuiForm(Flow.Dataflow.signals(controls || [])));
    };
    gui = function (controls) {
      return _fork(createGui, controls);
    };
    _ref = Flow.Gui;
    for (name in _ref) {
      if ({}.hasOwnProperty.call(_ref, name)) {
        f = _ref[name];
        gui[name] = f;
      }
    }
    flow_ = function (raw) {
      return raw._flow_ || (raw._flow_ = { _cache_: {} });
    };
    render_ = function (raw, render) {
      flow_(raw).render = render;
      return raw;
    };
    render_ = function () {
      var args;
      var raw;
      var render;
      raw = arguments[0], render = arguments[1], args = arguments.length >= 3 ? __slice.call(arguments, 2) : [];
      flow_(raw).render = function (go) {
        return render(...[
          _,
          go
        ].concat(args));
      };
      return raw;
    };
    inspect_ = function (raw, inspectors) {
      var attr;
      var root;
      root = flow_(raw);
      if (root.inspect == null) {
        root.inspect = {};
      }
      for (attr in inspectors) {
        if ({}.hasOwnProperty.call(inspectors, attr)) {
          f = inspectors[attr];
          root.inspect[attr] = f;
        }
      }
      return raw;
    };
    inspect = function (a, b) {
      if (arguments.length === 1) {
        return inspect$1(a);
      }
      return inspect$2(a, b);
    };
    inspect$1 = function (obj) {
      var attr;
      var inspections;
      var inspectors;
      var _ref1;
      if (_isFuture(obj)) {
        return _async(inspect, obj);
      }
      if (inspectors = obj != null ? (_ref1 = obj._flow_) != null ? _ref1.inspect : void 0 : void 0) {
        inspections = [];
        for (attr in inspectors) {
          if ({}.hasOwnProperty.call(inspectors, attr)) {
            f = inspectors[attr];
            inspections.push(inspect$2(attr, obj));
          }
        }
        render_(inspections, h2oInspectsOutput, inspections);
        return inspections;
      }
      return {};
    };
    ls = function (obj) {
      var inspectors;
      var _ref1;
      if (_isFuture(obj)) {
        return _async(ls, obj);
      }
      if (inspectors = obj != null ? (_ref1 = obj._flow_) != null ? _ref1.inspect : void 0 : void 0) {
        return lodash.keys(inspectors);
      }
      return [];
    };
    inspect$2 = function (attr, obj) {
      var cached;
      var inspection;
      var inspectors;
      var key;
      var root;
      if (!attr) {
        return;
      }
      if (_isFuture(obj)) {
        return _async(inspect, attr, obj);
      }
      if (!obj) {
        return;
      }
      if (!(root = obj._flow_)) {
        return;
      }
      if (!(inspectors = root.inspect)) {
        return;
      }
      if (cached = root._cache_[key = `inspect_${attr}`]) {
        return cached;
      }
      if (!(f = inspectors[attr])) {
        return;
      }
      if (!lodash.isFunction(f)) {
        return;
      }
      root._cache_[key] = inspection = f();
      render_(inspection, h2oInspectOutput, inspection);
      return inspection;
    };
    _plot = function (render, go) {
      return render(function (error, vis) {
        if (error) {
          return go(new Flow.Error('Error rendering vis.', error));
        }
        return go(null, vis);
      });
    };
    extendPlot = function (vis) {
      return render_(vis, h2oPlotOutput, vis.element);
    };
    createPlot = function (f, go) {
      return _plot(f(lightning), function (error, vis) {
        if (error) {
          return go(error);
        }
        return go(null, extendPlot(vis));
      });
    };
    plot = function (f) {
      if (_isFuture(f)) {
        return _fork(proceed, h2oPlotInput, f);
      } else if (lodash.isFunction(f)) {
        return _fork(createPlot, f);
      }
      return assist(plot);
    };
    grid = function (f) {
      return plot(function (g) {
        return g(g.select(), g.from(f));
      });
    };
    transformBinomialMetrics = function (metrics) {
      var cms;
      var domain;
      var fns;
      var fps;
      var i;
      var scores;
      var tns;
      var tp;
      var tps;
      if (scores = metrics.thresholds_and_metric_scores) {
        domain = metrics.domain;
        tps = getTwoDimData(scores, 'tps');
        tns = getTwoDimData(scores, 'tns');
        fps = getTwoDimData(scores, 'fps');
        fns = getTwoDimData(scores, 'fns');
        cms = function () {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (i = _i = 0, _len = tps.length; _i < _len; i = ++_i) {
            tp = tps[i];
            _results.push({
              domain,
              matrix: [
                [
                  tns[i],
                  fps[i]
                ],
                [
                  fns[i],
                  tp
                ]
              ]
            });
          }
          return _results;
        }();
        scores.columns.push({
          name: 'CM',
          description: 'CM',
          format: 'matrix',
          type: 'matrix'
        });
        scores.data.push(cms);
      }
      return metrics;
    };
    extendCloud = function (cloud) {
      return render_(cloud, h2oCloudOutput, cloud);
    };
    extendTimeline = function (timeline) {
      return render_(timeline, h2oTimelineOutput, timeline);
    };
    extendStackTrace = function (stackTrace) {
      return render_(stackTrace, h2oStackTraceOutput, stackTrace);
    };
    extendLogFile = function (cloud, nodeIndex, fileType, logFile) {
      return render_(logFile, h2oLogFileOutput, cloud, nodeIndex, fileType, logFile);
    };
    inspectNetworkTestResult = function (testResult) {
      return function () {
        return convertTableToFrame(testResult.table, testResult.table.name, {
          description: testResult.table.name,
          origin: 'testNetwork'
        });
      };
    };
    extendNetworkTest = function (testResult) {
      inspect_(testResult, { result: inspectNetworkTestResult(testResult) });
      return render_(testResult, h2oNetworkTestOutput, testResult);
    };
    extendProfile = function (profile) {
      return render_(profile, h2oProfileOutput, profile);
    };
    extendFrames = function (frames) {
      render_(frames, h2oFramesOutput, frames);
      return frames;
    };
    extendSplitFrameResult = function (result) {
      render_(result, h2oSplitFrameOutput, result);
      return result;
    };
    extendMergeFramesResult = function (result) {
      render_(result, h2oMergeFramesOutput, result);
      return result;
    };
    extendPartialDependence = function (result) {
      var data;
      var i;
      var inspections;
      var origin;
      var _i;
      var _len;
      var _ref1;
      inspections = {};
      _ref1 = result.partial_dependence_data;
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        data = _ref1[i];
        origin = `getPartialDependence ${flowPrelude.stringify(result.destination_key)}`;
        inspections[`plot${(i + 1)}`] = inspectTwoDimTable_(origin, `plot${(i + 1)}`, data);
      }
      inspect_(result, inspections);
      render_(result, h2oPartialDependenceOutput, result);
      return result;
    };
    getModelParameterValue = function (type, value) {
      switch (type) {
        case 'Key<Frame>':
        case 'Key<Model>':
          if (value != null) {
            return value.name;
          }
          return void 0;
          // break; // no-unreachable
        case 'VecSpecifier':
          if (value != null) {
            return value.column_name;
          }
          return void 0;
          // break; // no-unreachable
        default:
          if (value != null) {
            return value;
          }
          return void 0;
      }
    };
    inspectParametersAcrossModels = function (models) {
      return function () {
        var data;
        var i;
        var leader;
        var model;
        var modelKeys;
        var parameter;
        var vectors;
        leader = lodash.head(models);
        vectors = function () {
          var _i;
          var _len;
          var _ref1;
          var _results;
          _ref1 = leader.parameters;
          _results = [];
          for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
            parameter = _ref1[i];
            data = function () {
              var _j;
              var _len1;
              var _results1;
              _results1 = [];
              for (_j = 0, _len1 = models.length; _j < _len1; _j++) {
                model = models[_j];
                _results1.push(getModelParameterValue(parameter.type, model.parameters[i].actual_value));
              }
              return _results1;
            }();
            switch (parameter.type) {
              case 'enum':
              case 'Frame':
              case 'string':
                _results.push(createFactor(parameter.label, 'String', data));
                break;
              case 'byte':
              case 'short':
              case 'int':
              case 'long':
              case 'float':
              case 'double':
                _results.push(createVector(parameter.label, 'Number', data));
                break;
              case 'string[]':
              case 'byte[]':
              case 'short[]':
              case 'int[]':
              case 'long[]':
              case 'float[]':
              case 'double[]':
                _results.push(createList(parameter.label, data, function (a) {
                  if (a) {
                    return a;
                  }
                  return void 0;
                }));
                break;
              case 'boolean':
                _results.push(createList(parameter.label, data, function (a) {
                  if (a) {
                    return 'true';
                  }
                  return 'false';
                }));
                break;
              default:
                _results.push(createList(parameter.label, data));
            }
          }
          return _results;
        }();
        modelKeys = function () {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = models.length; _i < _len; _i++) {
            model = models[_i];
            _results.push(model.model_id.name);
          }
          return _results;
        }();
        return createDataframe('parameters', vectors, lodash.range(models.length), null, {
          description: `Parameters for models ${modelKeys.join(', ')}`,
          origin: `getModels ${flowPrelude.stringify(modelKeys)}`
        });
      };
    };
    inspectModelParameters = function (model) {
      return function () {
        var attr;
        var attrs;
        var data;
        var i;
        var parameter;
        var parameters;
        var vectors;
        parameters = model.parameters;
        attrs = [
          'label',
          'type',
          'level',
          'actual_value',
          'default_value'
        ];
        vectors = function () {
          var _i;
          var _j;
          var _len;
          var _len1;
          var _results;
          _results = [];
          for (_i = 0, _len = attrs.length; _i < _len; _i++) {
            attr = attrs[_i];
            data = new Array(parameters.length);
            for (i = _j = 0, _len1 = parameters.length; _j < _len1; i = ++_j) {
              parameter = parameters[i];
              data[i] = attr === 'actual_value' ? getModelParameterValue(parameter.type, parameter[attr]) : parameter[attr];
            }
            _results.push(createList(attr, data));
          }
          return _results;
        }();
        return createDataframe('parameters', vectors, lodash.range(parameters.length), null, {
          description: `Parameters for model \'${model.model_id.name}\'`,
          origin: `getModel ${flowPrelude.stringify(model.model_id.name)}`
        });
      };
    };
    extendJob = function (job) {
      return render_(job, H2O.JobOutput, job);
    };
    extendJobs = function (jobs) {
      var job;
      var _i;
      var _len;
      for (_i = 0, _len = jobs.length; _i < _len; _i++) {
        job = jobs[_i];
        extendJob(job);
      }
      return render_(jobs, h2oJobsOutput, jobs);
    };
    extendCancelJob = function (cancellation) {
      return render_(cancellation, h2oCancelJobOutput, cancellation);
    };
    extendDeletedKeys = function (keys) {
      return render_(keys, h2oDeleteObjectsOutput, keys);
    };
    inspectTwoDimTable_ = function (origin, tableName, table) {
      return function () {
        return convertTableToFrame(table, tableName, {
          description: table.description || '',
          origin
        });
      };
    };
    inspectRawArray_ = function (name, origin, description, array) {
      return function () {
        return createDataframe(name, [createList(name, parseAndFormatArray(array))], lodash.range(array.length), null, {
          description: '',
          origin
        });
      };
    };
    inspectObjectArray_ = function (name, origin, description, array) {
      return function () {
        return createDataframe(name, [createList(name, parseAndFormatObjectArray(array))], lodash.range(array.length), null, {
          description: '',
          origin
        });
      };
    };
    inspectRawObject_ = function (name, origin, description, obj) {
      return function () {
        var k;
        var v;
        var vectors;
        vectors = function () {
          var _results;
          _results = [];
          for (k in obj) {
            if ({}.hasOwnProperty.call(obj, k)) {
              v = obj[k];
              _results.push(createList(k, [v === null ? void 0 : lodash.isNumber(v) ? format6fi(v) : v]));
            }
          }
          return _results;
        }();
        return createDataframe(name, vectors, lodash.range(1), null, {
          description: '',
          origin
        });
      };
    };
    _schemaHacks = {
      KMeansOutput: { fields: 'names domains help' },
      GBMOutput: { fields: 'names domains help' },
      GLMOutput: { fields: 'names domains help' },
      DRFOutput: { fields: 'names domains help' },
      DeepLearningModelOutput: { fields: 'names domains help' },
      NaiveBayesOutput: { fields: 'names domains help pcond' },
      PCAOutput: { fields: 'names domains help' },
      ModelMetricsBinomialGLM: {
        fields: null,
        transform: transformBinomialMetrics
      },
      ModelMetricsBinomial: {
        fields: null,
        transform: transformBinomialMetrics
      },
      ModelMetricsMultinomialGLM: { fields: null },
      ModelMetricsMultinomial: { fields: null },
      ModelMetricsRegressionGLM: { fields: null },
      ModelMetricsRegression: { fields: null },
      ModelMetricsClustering: { fields: null },
      ModelMetricsAutoEncoder: { fields: null },
      ConfusionMatrix: { fields: null }
    };
    blacklistedAttributesBySchema = function () {
      var attrs;
      var dict;
      var dicts;
      var field;
      var schema;
      var _i;
      var _len;
      var _ref1;
      dicts = {};
      console.log('flowPrelude', flowPrelude);
      for (schema in _schemaHacks) {
        if ({}.hasOwnProperty.call(_schemaHacks, schema)) {
          attrs = _schemaHacks[schema];
          dicts[schema] = dict = { __meta: true };
          if (attrs.fields) {
            _ref1 = flowPrelude.words(attrs.fields);
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              field = _ref1[_i];
              dict[field] = true;
            }
          }
        }
      }
      return dicts;
    }();
    schemaTransforms = function () {
      var attrs;
      var schema;
      var transform;
      var transforms;
      transforms = {};
      for (schema in _schemaHacks) {
        if ({}.hasOwnProperty.call(_schemaHacks, schema)) {
          attrs = _schemaHacks[schema];
          if (transform = attrs.transform) {
            transforms[schema] = transform;
          }
        }
      }
      return transforms;
    }();
    inspectObject = function (inspections, name, origin, obj) {
      var attrs;
      var blacklistedAttributes;
      var k;
      var meta;
      var record;
      var schemaType;
      var transform;
      var v;
      var _ref1;
      var _ref2;
      schemaType = (_ref1 = obj.__meta) != null ? _ref1.schema_type : void 0;
      blacklistedAttributes = schemaType ? (attrs = blacklistedAttributesBySchema[schemaType]) ? attrs : {} : {};
      if (transform = schemaTransforms[schemaType]) {
        obj = transform(obj);
      }
      record = {};
      inspections[name] = inspectRawObject_(name, origin, name, record);
      for (k in obj) {
        if ({}.hasOwnProperty.call(obj, k)) {
          v = obj[k];
          if (!blacklistedAttributes[k]) {
            if (v === null) {
              record[k] = null;
            } else {
              if (((_ref2 = v.__meta) != null ? _ref2.schema_type : void 0) === 'TwoDimTable') {
                inspections[`${name} - ${v.name}`] = inspectTwoDimTable_(origin, `${name} - ${v.name}`, v);
              } else {
                if (lodash.isArray(v)) {
                  if (k === 'cross_validation_models' || k === 'cross_validation_predictions' || name === 'output' && (k === 'weights' || k === 'biases')) {
                    inspections[k] = inspectObjectArray_(k, origin, k, v);
                  } else {
                    inspections[k] = inspectRawArray_(k, origin, k, v);
                  }
                } else if (lodash.isObject(v)) {
                  if (meta = v.__meta) {
                    if (meta.schema_type === 'Key<Frame>') {
                      record[k] = `<a href=\'#\' data-type=\'frame\' data-key=${flowPrelude.stringify(v.name)}>${lodash.escape(v.name)}</a>`;
                    } else if (meta.schema_type === 'Key<Model>') {
                      record[k] = `<a href=\'#\' data-type=\'model\' data-key=${flowPrelude.stringify(v.name)}>${lodash.escape(v.name)}</a>`;
                    } else if (meta.schema_type === 'Frame') {
                      record[k] = `<a href=\'#\' data-type=\'frame\' data-key=${flowPrelude.stringify(v.frame_id.name)}>${lodash.escape(v.frame_id.name)}</a>`;
                    } else {
                      inspectObject(inspections, `${name} - ${k}`, origin, v);
                    }
                  } else {
                    console.log(`WARNING: dropping [${k}] from inspection:`, v);
                  }
                } else {
                  record[k] = lodash.isNumber(v) ? format6fi(v) : v;
                }
              }
            }
          }
        }
      }
    };
    extendModel = function (model) {
      var refresh;
      lodash.extend = function (model) {
        var inspections;
        var origin;
        var table;
        var tableName;
        var _i;
        var _len;
        var _ref1;
        inspections = {};
        inspections.parameters = inspectModelParameters(model);
        origin = `getModel ${flowPrelude.stringify(model.model_id.name)}`;
        inspectObject(inspections, 'output', origin, model.output);
        if (model.__meta.schema_type === 'NaiveBayesModel') {
          if (lodash.isArray(model.output.pcond)) {
            _ref1 = model.output.pcond;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              table = _ref1[_i];
              tableName = `output - pcond - ${table.name}`;
              inspections[tableName] = inspectTwoDimTable_(origin, tableName, table);
            }
          }
        }
        inspect_(model, inspections);
        return model;
      };
      refresh = function (go) {
        return _.requestModel(model.model_id.name, function (error, model) {
          if (error) {
            return go(error);
          }
          return go(null, lodash.extend(model));
        });
      };
      lodash.extend(model);
      return render_(model, h2oModelOutput, model, refresh);
    };
    extendGrid = function (grid, opts) {
      var inspections;
      var origin;
      origin = `getGrid ${flowPrelude.stringify(grid.grid_id.name)}`;
      if (opts) {
        origin += `, ${flowPrelude.stringify(opts)}`;
      }
      inspections = {
        summary: inspectTwoDimTable_(origin, 'summary', grid.summary_table),
        scoring_history: inspectTwoDimTable_(origin, 'scoring_history', grid.scoring_history)
      };
      inspect_(grid, inspections);
      return render_(grid, h2oGridOutput, grid);
    };
    extendGrids = function (grids) {
      return render_(grids, h2oGridsOutput, grids);
    };
    extendModels = function (models) {
      var algos;
      var inspections;
      var model;
      inspections = {};
      algos = lodash.unique(function () {
        var _i;
        var _len;
        var _results;
        _results = [];
        for (_i = 0, _len = models.length; _i < _len; _i++) {
          model = models[_i];
          _results.push(model.algo);
        }
        return _results;
      }());
      if (algos.length === 1) {
        inspections.parameters = inspectParametersAcrossModels(models);
      }
      inspect_(models, inspections);
      return render_(models, h2oModelsOutput, models);
    };
    read = function (value) {
      if (value === 'NaN') {
        return null;
      }
      return value;
    };
    extendPredictions = function (opts, predictions) {
      render_(predictions, h2oPredictsOutput, opts, predictions);
      return predictions;
    };
    extendPrediction = function (result) {
      var frameKey;
      var inspections;
      var modelKey;
      var prediction;
      var predictionFrame;
      var _ref1;
      modelKey = result.model.name;
      frameKey = (_ref1 = result.frame) != null ? _ref1.name : void 0;
      prediction = lodash.head(result.model_metrics);
      predictionFrame = result.predictions_frame;
      inspections = {};
      if (prediction) {
        inspectObject(inspections, 'Prediction', `getPrediction model: ${flowPrelude.stringify(modelKey)}, frame: ${flowPrelude.stringify(frameKey)}`, prediction);
      } else {
        prediction = {};
        inspectObject(inspections, 'Prediction', `getPrediction model: ${flowPrelude.stringify(modelKey)}, frame: ${flowPrelude.stringify(frameKey)}`, { prediction_frame: predictionFrame });
      }
      inspect_(prediction, inspections);
      return render_(prediction, h2oPredictOutput, prediction);
    };
    inspectFrameColumns = function (tableLabel, frameKey, frame, frameColumns) {
      return function () {
        var actionsData;
        var attr;
        var attrs;
        var column;
        var i;
        var labelVector;
        var title;
        var toColumnSummaryLink;
        var toConversionLink;
        var typeVector;
        var vectors;
        attrs = [
          'label',
          'type',
          'missing_count|Missing',
          'zero_count|Zeros',
          'positive_infinity_count|+Inf',
          'negative_infinity_count|-Inf',
          'min',
          'max',
          'mean',
          'sigma',
          'cardinality'
        ];
        toColumnSummaryLink = function (label) {
          return `<a href=\'#\' data-type=\'summary-link\' data-key=${flowPrelude.stringify(label)}>${lodash.escape(label)}</a>`;
        };
        toConversionLink = function (value) {
          var label;
          var type;
          var _ref1;
          _ref1 = value.split('\0'), type = _ref1[0], label = _ref1[1];
          switch (type) {
            case 'enum':
              return `<a href=\'#\' data-type=\'as-numeric-link\' data-key=${flowPrelude.stringify(label)}>Convert to numeric</a>`;
            case 'int':
            case 'string':
              return `<a href=\'#\' data-type=\'as-factor-link\' data-key=${flowPrelude.stringify(label)}>Convert to enum</a>'`;
            default:
              return void 0;
          }
        };
        vectors = function () {
          var _i;
          var _len;
          var _ref1;
          var _results;
          _results = [];
          for (_i = 0, _len = attrs.length; _i < _len; _i++) {
            attr = attrs[_i];
            _ref1 = attr.split('|'), name = _ref1[0], title = _ref1[1];
            title = title != null ? title : name;
            switch (name) {
              case 'min':
                _results.push(createVector(title, 'Number', function () {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(lodash.head(column.mins));
                  }
                  return _results1;
                }(), format4f));
                break;
              case 'max':
                _results.push(createVector(title, 'Number', function () {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(lodash.head(column.maxs));
                  }
                  return _results1;
                }(), format4f));
                break;
              case 'cardinality':
                _results.push(createVector(title, 'Number', function () {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column.type === 'enum' ? column.domain_cardinality : void 0);
                  }
                  return _results1;
                }()));
                break;
              case 'label':
                _results.push(createFactor(title, 'String', function () {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column[name]);
                  }
                  return _results1;
                }(), null, toColumnSummaryLink));
                break;
              case 'type':
                _results.push(createFactor(title, 'String', function () {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column[name]);
                  }
                  return _results1;
                }()));
                break;
              case 'mean':
              case 'sigma':
                _results.push(createVector(title, 'Number', function () {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column[name]);
                  }
                  return _results1;
                }(), format4f));
                break;
              default:
                _results.push(createVector(title, 'Number', function () {
                  var _j;
                  var _len1;
                  var _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = frameColumns.length; _j < _len1; _j++) {
                    column = frameColumns[_j];
                    _results1.push(column[name]);
                  }
                  return _results1;
                }()));
            }
          }
          return _results;
        }();
        labelVector = vectors[0], typeVector = vectors[1];
        actionsData = function () {
          var _i;
          var _ref1;
          var _results;
          _results = [];
          for (i = _i = 0, _ref1 = frameColumns.length; _ref1 >= 0 ? _i < _ref1 : _i > _ref1; i = _ref1 >= 0 ? ++_i : --_i) {
            _results.push(`${typeVector.valueAt(i)}\0${labelVector.valueAt(i)}`);
          }
          return _results;
        }();
        vectors.push(createFactor('Actions', 'String', actionsData, null, toConversionLink));
        return createDataframe(tableLabel, vectors, lodash.range(frameColumns.length), null, {
          description: `A list of ${tableLabel} in the H2O Frame.`,
          origin: `getFrameSummary ${flowPrelude.stringify(frameKey)}`,
          plot: `plot inspect \'${tableLabel}\', getFrameSummary ${flowPrelude.stringify(frameKey)}`
        });
      };
    };
    inspectFrameData = function (frameKey, frame) {
      return function () {
        var column;
        var domain;
        var frameColumns;
        var index;
        var rowIndex;
        var vectors;
        frameColumns = frame.columns;
        vectors = function () {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = frameColumns.length; _i < _len; _i++) {
            column = frameColumns[_i];
            switch (column.type) {
              case 'int':
              case 'real':
                _results.push(createVector(column.label, 'Number', parseNaNs(column.data), format4f));
                break;
              case 'enum':
                domain = column.domain;
                _results.push(createFactor(column.label, 'String', function () {
                  var _j;
                  var _len1;
                  var _ref1;
                  var _results1;
                  _ref1 = column.data;
                  _results1 = [];
                  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    index = _ref1[_j];
                    _results1.push(index != null ? domain[index] : void 0);
                  }
                  return _results1;
                }()));
                break;
              case 'time':
                _results.push(createVector(column.label, 'Number', parseNaNs(column.data)));
                break;
              case 'string':
              case 'uuid':
                _results.push(createList(column.label, parseNulls(column.string_data)));
                break;
              default:
                _results.push(createList(column.label, parseNulls(column.data)));
            }
          }
          return _results;
        }();
        vectors.unshift(createVector('Row', 'Number', function () {
          var _i;
          var _ref1;
          var _ref2;
          var _results;
          _results = [];
          for (rowIndex = _i = _ref1 = frame.row_offset, _ref2 = frame.row_count; _ref1 <= _ref2 ? _i < _ref2 : _i > _ref2; rowIndex = _ref1 <= _ref2 ? ++_i : --_i) {
            _results.push(rowIndex + 1);
          }
          return _results;
        }()));
        return createDataframe('data', vectors, lodash.range(frame.row_count - frame.row_offset), null, {
          description: 'A partial list of rows in the H2O Frame.',
          origin: `getFrameData ${flowPrelude.stringify(frameKey)}`
        });
      };
    };
    extendFrameData = function (frameKey, frame) {
      var inspections;
      var origin;
      inspections = { data: inspectFrameData(frameKey, frame) };
      origin = `getFrameData ${flowPrelude.stringify(frameKey)}`;
      inspect_(frame, inspections);
      return render_(frame, h2oFrameDataOutput, frame);
    };
    extendFrame = function (frameKey, frame) {
      var column;
      var enumColumns;
      var inspections;
      var origin;
      inspections = {
        columns: inspectFrameColumns('columns', frameKey, frame, frame.columns),
        data: inspectFrameData(frameKey, frame)
      };
      enumColumns = function () {
        var _i;
        var _len;
        var _ref1;
        var _results;
        _ref1 = frame.columns;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          column = _ref1[_i];
          if (column.type === 'enum') {
            _results.push(column);
          }
        }
        return _results;
      }();
      if (enumColumns.length > 0) {
        inspections.factors = inspectFrameColumns('factors', frameKey, frame, enumColumns);
      }
      origin = `getFrameSummary ${flowPrelude.stringify(frameKey)}`;
      inspections[frame.chunk_summary.name] = inspectTwoDimTable_(origin, frame.chunk_summary.name, frame.chunk_summary);
      inspections[frame.distribution_summary.name] = inspectTwoDimTable_(origin, frame.distribution_summary.name, frame.distribution_summary);
      inspect_(frame, inspections);
      return render_(frame, h2oFrameOutput, frame);
    };
    extendFrameSummary = function (frameKey, frame) {
      var column;
      var enumColumns;
      var inspections;
      var origin;
      inspections = { columns: inspectFrameColumns('columns', frameKey, frame, frame.columns) };
      enumColumns = function () {
        var _i;
        var _len;
        var _ref1;
        var _results;
        _ref1 = frame.columns;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          column = _ref1[_i];
          if (column.type === 'enum') {
            _results.push(column);
          }
        }
        return _results;
      }();
      if (enumColumns.length > 0) {
        inspections.factors = inspectFrameColumns('factors', frameKey, frame, enumColumns);
      }
      origin = `getFrameSummary ${flowPrelude.stringify(frameKey)}`;
      inspections[frame.chunk_summary.name] = inspectTwoDimTable_(origin, frame.chunk_summary.name, frame.chunk_summary);
      inspections[frame.distribution_summary.name] = inspectTwoDimTable_(origin, frame.distribution_summary.name, frame.distribution_summary);
      inspect_(frame, inspections);
      return render_(frame, h2oFrameOutput, frame);
    };
    extendColumnSummary = function (frameKey, frame, columnName) {
      var column;
      var inspectCharacteristics;
      var inspectDistribution;
      var inspectDomain;
      var inspectPercentiles;
      var inspectSummary;
      var inspections;
      var rowCount;
      column = lodash.head(frame.columns);
      rowCount = frame.rows;
      inspectPercentiles = function () {
        var vectors;
        vectors = [
          createVector('percentile', 'Number', frame.default_percentiles),
          createVector('value', 'Number', column.percentiles)
        ];
        return createDataframe('percentiles', vectors, lodash.range(frame.default_percentiles.length), null, {
          description: `Percentiles for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspectDistribution = function () {
        var base;
        var binCount;
        var binIndex;
        var bins;
        var count;
        var countData;
        var i;
        var interval;
        var intervalData;
        var m;
        var minBinCount;
        var n;
        var rows;
        var stride;
        var vectors;
        var width;
        var widthData;
        var _i;
        var _j;
        var _k;
        var _l;
        var _len;
        var _ref1;
        minBinCount = 32;
        base = column.histogram_base, stride = column.histogram_stride, bins = column.histogram_bins;
        width = Math.ceil(bins.length / minBinCount);
        interval = stride * width;
        rows = [];
        if (width > 0) {
          binCount = minBinCount + (bins.length % width > 0 ? 1 : 0);
          intervalData = new Array(binCount);
          widthData = new Array(binCount);
          countData = new Array(binCount);
          for (i = _i = 0; binCount >= 0 ? _i < binCount : _i > binCount; i = binCount >= 0 ? ++_i : --_i) {
            m = i * width;
            n = m + width;
            count = 0;
            for (binIndex = _j = m; m <= n ? _j < n : _j > n; binIndex = m <= n ? ++_j : --_j) {
              if (binIndex < bins.length) {
                count += bins[binIndex];
              }
            }
            intervalData[i] = base + i * interval;
            widthData[i] = interval;
            countData[i] = count;
          }
        } else {
          binCount = bins.length;
          intervalData = new Array(binCount);
          widthData = new Array(binCount);
          countData = new Array(binCount);
          for (i = _k = 0, _len = bins.length; _k < _len; i = ++_k) {
            count = bins[i];
            intervalData[i] = base + i * stride;
            widthData[i] = stride;
            countData[i] = count;
          }
        }
        for (i = _l = _ref1 = binCount - 1; _ref1 <= 0 ? _l <= 0 : _l >= 0; i = _ref1 <= 0 ? ++_l : --_l) {
          if (countData[i] !== 0) {
            binCount = i + 1;
            intervalData = intervalData.slice(0, binCount);
            widthData = widthData.slice(0, binCount);
            countData = countData.slice(0, binCount);
            break;
          }
        }
        vectors = [
          createFactor('interval', 'String', intervalData),
          createVector('width', 'Number', widthData),
          createVector('count', 'Number', countData)
        ];
        return createDataframe('distribution', vectors, lodash.range(binCount), null, {
          description: `Distribution for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
          plot: `plot inspect \'distribution\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspectCharacteristics = function () {
        var characteristicData;
        var count;
        var countData;
        var missing_count;
        var negative_infinity_count;
        var other;
        var percentData;
        var positive_infinity_count;
        var vectors;
        var zero_count;
        missing_count = column.missing_count, zero_count = column.zero_count, positive_infinity_count = column.positive_infinity_count, negative_infinity_count = column.negative_infinity_count;
        other = rowCount - missing_count - zero_count - positive_infinity_count - negative_infinity_count;
        characteristicData = [
          'Missing',
          '-Inf',
          'Zero',
          '+Inf',
          'Other'
        ];
        countData = [
          missing_count,
          negative_infinity_count,
          zero_count,
          positive_infinity_count,
          other
        ];
        percentData = function () {
          var _i;
          var _len;
          var _results;
          _results = [];
          for (_i = 0, _len = countData.length; _i < _len; _i++) {
            count = countData[_i];
            _results.push(100 * count / rowCount);
          }
          return _results;
        }();
        vectors = [
          createFactor('characteristic', 'String', characteristicData),
          createVector('count', 'Number', countData),
          createVector('percent', 'Number', percentData)
        ];
        return createDataframe('characteristics', vectors, lodash.range(characteristicData.length), null, {
          description: `Characteristics for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
          plot: `plot inspect \'characteristics\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspectSummary = function () {
        var defaultPercentiles;
        var maximum;
        var mean;
        var minimum;
        var outliers;
        var percentiles;
        var q1;
        var q2;
        var q3;
        var vectors;
        defaultPercentiles = frame.default_percentiles;
        percentiles = column.percentiles;
        mean = column.mean;
        q1 = percentiles[defaultPercentiles.indexOf(0.25)];
        q2 = percentiles[defaultPercentiles.indexOf(0.5)];
        q3 = percentiles[defaultPercentiles.indexOf(0.75)];
        outliers = lodash.unique(column.mins.concat(column.maxs));
        minimum = lodash.head(column.mins);
        maximum = lodash.head(column.maxs);
        vectors = [
          createFactor('column', 'String', [columnName]),
          createVector('mean', 'Number', [mean]),
          createVector('q1', 'Number', [q1]),
          createVector('q2', 'Number', [q2]),
          createVector('q3', 'Number', [q3]),
          createVector('min', 'Number', [minimum]),
          createVector('max', 'Number', [maximum])
        ];
        return createDataframe('summary', vectors, lodash.range(1), null, {
          description: `Summary for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
          plot: `plot inspect \'summary\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspectDomain = function () {
        var counts;
        var i;
        var labels;
        var level;
        var levels;
        var percents;
        var sortedLevels;
        var vectors;
        var _i;
        var _len;
        var _ref1;
        levels = lodash.map(column.histogram_bins, function (count, index) {
          return {
            count,
            index
          };
        });
        sortedLevels = lodash.sortBy(levels, function (level) {
          return -level.count;
        });
        _ref1 = createArrays(3, sortedLevels.length), labels = _ref1[0], counts = _ref1[1], percents = _ref1[2];
        for (i = _i = 0, _len = sortedLevels.length; _i < _len; i = ++_i) {
          level = sortedLevels[i];
          labels[i] = column.domain[level.index];
          counts[i] = level.count;
          percents[i] = 100 * level.count / rowCount;
        }
        vectors = [
          createFactor('label', 'String', labels),
          createVector('count', 'Number', counts),
          createVector('percent', 'Number', percents)
        ];
        return createDataframe('domain', vectors, lodash.range(sortedLevels.length), null, {
          description: `Domain for column \'${column.label}\' in frame \'${frameKey}\'.`,
          origin: `getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`,
          plot: `plot inspect \'domain\', getColumnSummary ${flowPrelude.stringify(frameKey)}, ${flowPrelude.stringify(columnName)}`
        });
      };
      inspections = { characteristics: inspectCharacteristics };
      switch (column.type) {
        case 'int':
        case 'real':
          if (column.histogram_bins.length) {
            inspections.distribution = inspectDistribution;
          }
          if (!lodash.some(column.percentiles, function (a) {
            return a === 'NaN';
          })) {
            inspections.summary = inspectSummary;
            inspections.percentiles = inspectPercentiles;
          }
          break;
        case 'enum':
          inspections.domain = inspectDomain;
      }
      inspect_(frame, inspections);
      return render_(frame, h2oColumnSummaryOutput, frameKey, frame, columnName);
    };
    requestFrame = function (frameKey, go) {
      return _.requestFrameSlice(frameKey, void 0, 0, 20, function (error, frame) {
        if (error) {
          return go(error);
        }
        return go(null, extendFrame(frameKey, frame));
      });
    };
    requestFrameData = function (frameKey, searchTerm, offset, count, go) {
      return _.requestFrameSlice(frameKey, searchTerm, offset, count, function (error, frame) {
        if (error) {
          return go(error);
        }
        return go(null, extendFrameData(frameKey, frame));
      });
    };
    requestFrameSummarySlice = function (frameKey, searchTerm, offset, length, go) {
      return _.requestFrameSummarySlice(frameKey, searchTerm, offset, length, function (error, frame) {
        if (error) {
          return go(error);
        }
        return go(null, extendFrameSummary(frameKey, frame));
      });
    };
    requestFrameSummary = function (frameKey, go) {
      return _.requestFrameSummarySlice(frameKey, void 0, 0, 20, function (error, frame) {
        if (error) {
          return go(error);
        }
        return go(null, extendFrameSummary(frameKey, frame));
      });
    };
    requestColumnSummary = function (frameKey, columnName, go) {
      return _.requestColumnSummary(frameKey, columnName, function (error, frame) {
        if (error) {
          return go(error);
        }
        return go(null, extendColumnSummary(frameKey, frame, columnName));
      });
    };
    requestFrames = function (go) {
      return _.requestFrames(function (error, frames) {
        if (error) {
          return go(error);
        }
        return go(null, extendFrames(frames));
      });
    };
    requestCreateFrame = function (opts, go) {
      return _.requestCreateFrame(opts, function (error, result) {
        if (error) {
          return go(error);
        }
        return _.requestJob(result.key.name, function (error, job) {
          if (error) {
            return go(error);
          }
          return go(null, extendJob(job));
        });
      });
    };
    requestPartialDependence = function (opts, go) {
      return _.requestPartialDependence(opts, function (error, result) {
        if (error) {
          return go(error);
        }
        return _.requestJob(result.key.name, function (error, job) {
          if (error) {
            return go(error);
          }
          return go(null, extendJob(job));
        });
      });
    };
    requestPartialDependenceData = function (key, go) {
      return _.requestPartialDependenceData(key, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendPartialDependence(result));
      });
    };
    computeSplits = function (ratios, keys) {
      var i;
      var key;
      var part;
      var parts;
      var ratio;
      var splits;
      var sum;
      var _i;
      var _j;
      var _len;
      var _len1;
      var _ref1;
      parts = [];
      sum = 0;
      _ref1 = keys.slice(0, ratios.length);
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        key = _ref1[i];
        sum += ratio = ratios[i];
        parts.push({
          key,
          ratio
        });
      }
      parts.push({
        key: keys[keys.length - 1],
        ratio: 1 - sum
      });
      splits = [];
      sum = 0;
      for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
        part = parts[_j];
        splits.push({
          min: sum,
          max: sum + part.ratio,
          key: part.key
        });
        sum += part.ratio;
      }
      return splits;
    };
    requestBindFrames = function (key, sourceKeys, go) {
      return _.requestExec(`(assign ${key} (cbind ${sourceKeys.join(' ')}))`, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendBindFrames(key, result));
      });
    };
    requestSplitFrame = function (frameKey, splitRatios, splitKeys, seed, go) {
      var g;
      var i;
      var l;
      var part;
      var randomVecKey;
      var sliceExpr;
      var splits;
      var statements;
      var _i;
      var _len;
      if (splitRatios.length === splitKeys.length - 1) {
        splits = computeSplits(splitRatios, splitKeys);
        randomVecKey = createTempKey();
        statements = [];
        statements.push(`(tmp= ${randomVecKey} (h2o.runif ${frameKey} ${seed}))`);
        for (i = _i = 0, _len = splits.length; _i < _len; i = ++_i) {
          part = splits[i];
          g = i !== 0 ? `(> ${randomVecKey} ${part.min})` : null;
          l = i !== splits.length - 1 ? `(<= ${randomVecKey} ${part.max})` : null;
          if (g && l) {
            sliceExpr = `(& ${g} ${l})`;
          } else {
            if (l) {
              sliceExpr = l;
            } else {
              sliceExpr = g;
            }
          }
          statements.push(`(assign ${part.key} (rows ${frameKey} ${sliceExpr}))`);
        }
        statements.push(`(rm ${randomVecKey})`);
        return _.requestExec(`(, ${statements.join(' ')})`, function (error, result) {
          if (error) {
            return go(error);
          }
          return go(null, extendSplitFrameResult({
            keys: splitKeys,
            ratios: splitRatios
          }));
        });
      }
      return go(new Flow.Error('The number of split ratios should be one less than the number of split keys'));
    };
    requestMergeFrames = function (destinationKey, leftFrameKey, leftColumnIndex, includeAllLeftRows, rightFrameKey, rightColumnIndex, includeAllRightRows, go) {
      var lr;
      var rr;
      var statement;
      lr = includeAllLeftRows ? 'TRUE' : 'FALSE';
      rr = includeAllRightRows ? 'TRUE' : 'FALSE';
      statement = `(assign ${destinationKey} (merge ${leftFrameKey} ${rightFrameKey} ${lr} ${rr} ${leftColumnIndex} ${rightColumnIndex} "radix"))`;
      return _.requestExec(statement, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendMergeFramesResult({ key: destinationKey }));
      });
    };
    createFrame = function (opts) {
      if (opts) {
        return _fork(requestCreateFrame, opts);
      }
      return assist(createFrame);
    };
    splitFrame = function (frameKey, splitRatios, splitKeys, seed) {
      if (seed == null) {
        seed = -1;
      }
      if (frameKey && splitRatios && splitKeys) {
        return _fork(requestSplitFrame, frameKey, splitRatios, splitKeys, seed);
      }
      return assist(splitFrame);
    };
    mergeFrames = function (destinationKey, leftFrameKey, leftColumnIndex, includeAllLeftRows, rightFrameKey, rightColumnIndex, includeAllRightRows) {
      if (destinationKey && leftFrameKey && rightFrameKey) {
        return _fork(requestMergeFrames, destinationKey, leftFrameKey, leftColumnIndex, includeAllLeftRows, rightFrameKey, rightColumnIndex, includeAllRightRows);
      }
      return assist(mergeFrames);
    };
    buildPartialDependence = function (opts) {
      if (opts) {
        return _fork(requestPartialDependence, opts);
      }
      return assist(buildPartialDependence);
    };
    getPartialDependence = function (destinationKey) {
      if (destinationKey) {
        return _fork(requestPartialDependenceData, destinationKey);
      }
      return assist(getPartialDependence);
    };
    getFrames = function () {
      return _fork(requestFrames);
    };
    getFrame = function (frameKey) {
      switch (flowPrelude.typeOf(frameKey)) {
        case 'String':
          return _fork(requestFrame, frameKey);
        default:
          return assist(getFrame);
      }
    };
    bindFrames = function (key, sourceKeys) {
      return _fork(requestBindFrames, key, sourceKeys);
    };
    getFrameSummary = function (frameKey) {
      switch (flowPrelude.typeOf(frameKey)) {
        case 'String':
          return _fork(requestFrameSummary, frameKey);
        default:
          return assist(getFrameSummary);
      }
    };
    getFrameData = function (frameKey) {
      switch (flowPrelude.typeOf(frameKey)) {
        case 'String':
          return _fork(requestFrameData, frameKey, void 0, 0, 20);
        default:
          return assist(getFrameSummary);
      }
    };
    requestDeleteFrame = function (frameKey, go) {
      return _.requestDeleteFrame(frameKey, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys([frameKey]));
      });
    };
    deleteFrame = function (frameKey) {
      if (frameKey) {
        return _fork(requestDeleteFrame, frameKey);
      }
      return assist(deleteFrame);
    };
    extendExportFrame = function (result) {
      return render_(result, h2oExportFrameOutput, result);
    };
    extendBindFrames = function (key, result) {
      return render_(result, h2oBindFramesOutput, key, result);
    };
    requestExportFrame = function (frameKey, path, opts, go) {
      return _.requestExportFrame(frameKey, path, opts.overwrite, function (error, result) {
        if (error) {
          return go(error);
        }
        return _.requestJob(result.job.key.name, function (error, job) {
          if (error) {
            return go(error);
          }
          return go(null, extendJob(job));
        });
      });
    };
    exportFrame = function (frameKey, path, opts) {
      if (opts == null) {
        opts = {};
      }
      if (frameKey && path) {
        return _fork(requestExportFrame, frameKey, path, opts);
      }
      return assist(exportFrame, frameKey, path, opts);
    };
    requestDeleteFrames = function (frameKeys, go) {
      var futures;
      futures = lodash.map(frameKeys, function (frameKey) {
        return _fork(_.requestDeleteFrame, frameKey);
      });
      return Flow.Async.join(futures, function (error, results) {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys(frameKeys));
      });
    };
    deleteFrames = function (frameKeys) {
      switch (frameKeys.length) {
        case 0:
          return assist(deleteFrames);
        case 1:
          return deleteFrame(lodash.head(frameKeys));
        default:
          return _fork(requestDeleteFrames, frameKeys);
      }
    };
    getColumnSummary = function (frameKey, columnName) {
      return _fork(requestColumnSummary, frameKey, columnName);
    };
    requestModels = function (go) {
      return _.requestModels(function (error, models) {
        if (error) {
          return go(error);
        }
        return go(null, extendModels(models));
      });
    };
    requestModelsByKeys = function (modelKeys, go) {
      var futures;
      futures = lodash.map(modelKeys, function (key) {
        return _fork(_.requestModel, key);
      });
      return Flow.Async.join(futures, function (error, models) {
        if (error) {
          return go(error);
        }
        return go(null, extendModels(models));
      });
    };
    getModels = function (modelKeys) {
      if (lodash.isArray(modelKeys)) {
        if (modelKeys.length) {
          return _fork(requestModelsByKeys, modelKeys);
        }
        return _fork(requestModels);
      }
      return _fork(requestModels);
    };
    requestGrids = function (go) {
      return _.requestGrids(function (error, grids) {
        if (error) {
          return go(error);
        }
        return go(null, extendGrids(grids));
      });
    };
    getGrids = function () {
      return _fork(requestGrids);
    };
    requestModel = function (modelKey, go) {
      return _.requestModel(modelKey, function (error, model) {
        if (error) {
          return go(error);
        }
        return go(null, extendModel(model));
      });
    };
    getModel = function (modelKey) {
      switch (flowPrelude.typeOf(modelKey)) {
        case 'String':
          return _fork(requestModel, modelKey);
        default:
          return assist(getModel);
      }
    };
    requestGrid = function (gridKey, opts, go) {
      return _.requestGrid(gridKey, opts, function (error, grid) {
        if (error) {
          return go(error);
        }
        return go(null, extendGrid(grid, opts));
      });
    };
    getGrid = function (gridKey, opts) {
      switch (flowPrelude.typeOf(gridKey)) {
        case 'String':
          return _fork(requestGrid, gridKey, opts);
        default:
          return assist(getGrid);
      }
    };
    findColumnIndexByColumnLabel = function (frame, columnLabel) {
      var column;
      var i;
      var _i;
      var _len;
      var _ref1;
      _ref1 = frame.columns;
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        column = _ref1[i];
        if (column.label === columnLabel) {
          return i;
        }
      }
      throw new Flow.Error(`Column [${columnLabel}] not found in frame`);
    };
    findColumnIndicesByColumnLabels = function (frame, columnLabels) {
      var columnLabel;
      var _i;
      var _len;
      var _results;
      _results = [];
      for (_i = 0, _len = columnLabels.length; _i < _len; _i++) {
        columnLabel = columnLabels[_i];
        _results.push(findColumnIndexByColumnLabel(frame, columnLabel));
      }
      return _results;
    };
    requestImputeColumn = function (opts, go) {
      var column;
      var combineMethod;
      var frame;
      var groupByColumns;
      var method;
      frame = opts.frame, column = opts.column, method = opts.method, combineMethod = opts.combineMethod, groupByColumns = opts.groupByColumns;
      combineMethod = combineMethod != null ? combineMethod : 'interpolate';
      return _.requestFrameSummaryWithoutData(frame, function (error, result) {
        var columnIndex;
        var columnIndicesError;
        var columnKeyError;
        var groupByArg;
        var groupByColumnIndices;
        if (error) {
          return go(error);
        }
        try {
          columnIndex = findColumnIndexByColumnLabel(result, column);
        } catch (_error) {
          columnKeyError = _error;
          return go(columnKeyError);
        }
        if (groupByColumns && groupByColumns.length) {
          try {
            groupByColumnIndices = findColumnIndicesByColumnLabels(result, groupByColumns);
          } catch (_error) {
            columnIndicesError = _error;
            return go(columnIndicesError);
          }
        } else {
          groupByColumnIndices = null;
        }
        groupByArg = groupByColumnIndices ? `[${groupByColumnIndices.join(' ')}]` : '[]';
        return _.requestExec(`(h2o.impute ${frame} ${columnIndex} ${JSON.stringify(method)} ${JSON.stringify(combineMethod)} ${groupByArg} _ _)`, function (error, result) {
          if (error) {
            return go(error);
          }
          return requestColumnSummary(frame, column, go);
        });
      });
    };
    requestChangeColumnType = function (opts, go) {
      var column;
      var frame;
      var method;
      var type;
      frame = opts.frame, column = opts.column, type = opts.type;
      method = type === 'enum' ? 'as.factor' : 'as.numeric';
      return _.requestFrameSummaryWithoutData(frame, function (error, result) {
        var columnIndex;
        var columnKeyError;
        try {
          columnIndex = findColumnIndexByColumnLabel(result, column);
        } catch (_error) {
          columnKeyError = _error;
          return go(columnKeyError);
        }
        return _.requestExec(`(assign ${frame} (:= ${frame} (${method} (cols ${frame} ${columnIndex})) ${columnIndex} [0:${result.rows}]))`, function (error, result) {
          if (error) {
            return go(error);
          }
          return requestColumnSummary(frame, column, go);
        });
      });
    };
    imputeColumn = function (opts) {
      if (opts && opts.frame && opts.column && opts.method) {
        return _fork(requestImputeColumn, opts);
      }
      return assist(imputeColumn, opts);
    };
    changeColumnType = function (opts) {
      if (opts && opts.frame && opts.column && opts.type) {
        return _fork(requestChangeColumnType, opts);
      }
      return assist(changeColumnType, opts);
    };
    requestDeleteModel = function (modelKey, go) {
      return _.requestDeleteModel(modelKey, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys([modelKey]));
      });
    };
    deleteModel = function (modelKey) {
      if (modelKey) {
        return _fork(requestDeleteModel, modelKey);
      }
      return assist(deleteModel);
    };
    extendImportModel = function (result) {
      return render_(result, H2O.ImportModelOutput, result);
    };
    requestImportModel = function (path, opts, go) {
      return _.requestImportModel(path, opts.overwrite, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendImportModel(result));
      });
    };
    importModel = function (path, opts) {
      if (path && path.length) {
        return _fork(requestImportModel, path, opts);
      }
      return assist(importModel, path, opts);
    };
    extendExportModel = function (result) {
      return render_(result, h2oExportModelOutput, result);
    };
    requestExportModel = function (modelKey, path, opts, go) {
      return _.requestExportModel(modelKey, path, opts.overwrite, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendExportModel(result));
      });
    };
    exportModel = function (modelKey, path, opts) {
      if (modelKey && path) {
        return _fork(requestExportModel, modelKey, path, opts);
      }
      return assist(exportModel, modelKey, path, opts);
    };
    requestDeleteModels = function (modelKeys, go) {
      var futures;
      futures = lodash.map(modelKeys, function (modelKey) {
        return _fork(_.requestDeleteModel, modelKey);
      });
      return Flow.Async.join(futures, function (error, results) {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys(modelKeys));
      });
    };
    deleteModels = function (modelKeys) {
      switch (modelKeys.length) {
        case 0:
          return assist(deleteModels);
        case 1:
          return deleteModel(lodash.head(modelKeys));
        default:
          return _fork(requestDeleteModels, modelKeys);
      }
    };
    requestJob = function (key, go) {
      return _.requestJob(key, function (error, job) {
        if (error) {
          return go(error);
        }
        return go(null, extendJob(job));
      });
    };
    requestJobs = function (go) {
      return _.requestJobs(function (error, jobs) {
        if (error) {
          return go(error);
        }
        return go(null, extendJobs(jobs));
      });
    };
    getJobs = function () {
      return _fork(requestJobs);
    };
    getJob = function (arg) {
      switch (flowPrelude.typeOf(arg)) {
        case 'String':
          return _fork(requestJob, arg);
        case 'Object':
          if (arg.key != null) {
            return getJob(arg.key);
          }
          return assist(getJob);
          // break; // no-unreachable
        default:
          return assist(getJob);
      }
    };
    requestCancelJob = function (key, go) {
      return _.requestCancelJob(key, function (error) {
        if (error) {
          return go(error);
        }
        return go(null, extendCancelJob({}));
      });
    };
    cancelJob = function (arg) {
      switch (flowPrelude.typeOf(arg)) {
        case 'String':
          return _fork(requestCancelJob, arg);
        default:
          return assist(cancelJob);
      }
    };
    extendImportResults = function (importResults) {
      return render_(importResults, h2oImportFilesOutput, importResults);
    };
    requestImportFiles = function (paths, go) {
      return _.requestImportFiles(paths, function (error, importResults) {
        if (error) {
          return go(error);
        }
        return go(null, extendImportResults(importResults));
      });
    };
    importFiles = function (paths) {
      switch (flowPrelude.typeOf(paths)) {
        case 'Array':
          return _fork(requestImportFiles, paths);
        default:
          return assist(importFiles);
      }
    };
    extendParseSetupResults = function (args, parseSetupResults) {
      return render_(parseSetupResults, H2O.SetupParseOutput, args, parseSetupResults);
    };
    requestImportAndParseSetup = function (paths, go) {
      return _.requestImportFiles(paths, function (error, importResults) {
        var sourceKeys;
        if (error) {
          return go(error);
        }
        sourceKeys = lodash.flatten(lodash.compact(lodash.map(importResults, function (result) {
          return result.destination_frames;
        })));
        return _.requestParseSetup(sourceKeys, function (error, parseSetupResults) {
          if (error) {
            return go(error);
          }
          return go(null, extendParseSetupResults({ paths }, parseSetupResults));
        });
      });
    };
    requestParseSetup = function (sourceKeys, go) {
      return _.requestParseSetup(sourceKeys, function (error, parseSetupResults) {
        if (error) {
          return go(error);
        }
        return go(null, extendParseSetupResults({ source_frames: sourceKeys }, parseSetupResults));
      });
    };
    setupParse = function (args) {
      if (args.paths && lodash.isArray(args.paths)) {
        return _fork(requestImportAndParseSetup, args.paths);
      } else if (args.source_frames && lodash.isArray(args.source_frames)) {
        return _fork(requestParseSetup, args.source_frames);
      }
      return assist(setupParse);
    };
    extendParseResult = function (parseResult) {
      return render_(parseResult, H2O.JobOutput, parseResult.job);
    };
    requestImportAndParseFiles = function (paths, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, go) {
      return _.requestImportFiles(paths, function (error, importResults) {
        var sourceKeys;
        if (error) {
          return go(error);
        }
        sourceKeys = lodash.flatten(lodash.compact(lodash.map(importResults, function (result) {
          return result.destination_frames;
        })));
        return _.requestParseFiles(sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, function (error, parseResult) {
          if (error) {
            return go(error);
          }
          return go(null, extendParseResult(parseResult));
        });
      });
    };
    requestParseFiles = function (sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, go) {
      return _.requestParseFiles(sourceKeys, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize, function (error, parseResult) {
        if (error) {
          return go(error);
        }
        return go(null, extendParseResult(parseResult));
      });
    };
    parseFiles = function (opts) {
      var checkHeader;
      var chunkSize;
      var columnCount;
      var columnNames;
      var columnTypes;
      var deleteOnDone;
      var destinationKey;
      var parseType;
      var separator;
      var useSingleQuotes;
      destinationKey = opts.destination_frame;
      parseType = opts.parse_type;
      separator = opts.separator;
      columnCount = opts.number_columns;
      useSingleQuotes = opts.single_quotes;
      columnNames = opts.column_names;
      columnTypes = opts.column_types;
      deleteOnDone = opts.delete_on_done;
      checkHeader = opts.check_header;
      chunkSize = opts.chunk_size;
      if (opts.paths) {
        return _fork(requestImportAndParseFiles, opts.paths, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize);
      }
      return _fork(requestParseFiles, opts.source_frames, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize);
    };
    requestModelBuild = function (algo, opts, go) {
      return _.requestModelBuild(algo, opts, function (error, result) {
        var messages;
        var validation;
        if (error) {
          return go(error);
        }
        if (result.error_count > 0) {
          messages = function () {
            var _i;
            var _len;
            var _ref1;
            var _results;
            _ref1 = result.messages;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              validation = _ref1[_i];
              _results.push(validation.message);
            }
            return _results;
          }();
          return go(new Flow.Error(`Model build failure: ${messages.join('; ')}`));
        }
        return go(null, extendJob(result.job));
      });
    };
    requestAutoModelBuild = function (opts, go) {
      var params;
      params = {
        input_spec: {
          training_frame: opts.frame,
          response_column: opts.column
        },
        build_control: { stopping_criteria: { max_runtime_secs: opts.maxRunTime } }
      };
      return _.requestAutoModelBuild(params, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendJob(result.job));
      });
    };
    buildAutoModel = function (opts) {
      if (opts && lodash.keys(opts).length > 1) {
        return _fork(requestAutoModelBuild, opts);
      }
      return assist(buildAutoModel, opts);
    };
    buildModel = function (algo, opts) {
      if (algo && opts && lodash.keys(opts).length > 1) {
        return _fork(requestModelBuild, algo, opts);
      }
      return assist(buildModel, algo, opts);
    };
    unwrapPrediction = function (go) {
      return function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendPrediction(result));
      };
    };
    requestPredict = function (destinationKey, modelKey, frameKey, options, go) {
      return _.requestPredict(destinationKey, modelKey, frameKey, options, unwrapPrediction(go));
    };
    requestPredicts = function (opts, go) {
      var futures;
      futures = lodash.map(opts, function (opt) {
        var frameKey;
        var modelKey;
        var options;
        modelKey = opt.model, frameKey = opt.frame, options = opt.options;
        return _fork(_.requestPredict, null, modelKey, frameKey, options || {});
      });
      return Flow.Async.join(futures, function (error, predictions) {
        if (error) {
          return go(error);
        }
        return go(null, extendPredictions(opts, predictions));
      });
    };
    predict = function (opts) {
      var combos;
      var deep_features_hidden_layer;
      var exemplar_index;
      var frame;
      var frames;
      var leaf_node_assignment;
      var model;
      var models;
      var predictions_frame;
      var reconstruction_error;
      var _i;
      var _j;
      var _len;
      var _len1;
      if (opts == null) {
        opts = {};
      }
      predictions_frame = opts.predictions_frame, model = opts.model, models = opts.models, frame = opts.frame, frames = opts.frames, reconstruction_error = opts.reconstruction_error, deep_features_hidden_layer = opts.deep_features_hidden_layer, leaf_node_assignment = opts.leaf_node_assignment, exemplar_index = opts.exemplar_index;
      if (models || frames) {
        if (!models) {
          if (model) {
            models = [model];
          }
        }
        if (!frames) {
          if (frame) {
            frames = [frame];
          }
        }
        if (frames && models) {
          combos = [];
          for (_i = 0, _len = models.length; _i < _len; _i++) {
            model = models[_i];
            for (_j = 0, _len1 = frames.length; _j < _len1; _j++) {
              frame = frames[_j];
              combos.push({
                model,
                frame
              });
            }
          }
          return _fork(requestPredicts, combos);
        }
        return assist(predict, {
          predictions_frame,
          models,
          frames
        });
      }
      if (model && frame) {
        return _fork(requestPredict, predictions_frame, model, frame, {
          reconstruction_error,
          deep_features_hidden_layer,
          leaf_node_assignment
        });
      } else if (model && exemplar_index !== void 0) {
        return _fork(requestPredict, predictions_frame, model, null, { exemplar_index });
      }
      return assist(predict, {
        predictions_frame,
        model,
        frame
      });
    };
    requestPrediction = function (modelKey, frameKey, go) {
      return _.requestPrediction(modelKey, frameKey, unwrapPrediction(go));
    };
    requestPredictions = function (opts, go) {
      var frameKey;
      var futures;
      var modelKey;
      if (lodash.isArray(opts)) {
        futures = lodash.map(opts, function (opt) {
          var frameKey;
          var modelKey;
          modelKey = opt.model, frameKey = opt.frame;
          return _fork(_.requestPredictions, modelKey, frameKey);
        });
        return Flow.Async.join(futures, function (error, predictions) {
          var uniquePredictions;
          if (error) {
            return go(error);
          }
          uniquePredictions = lodash.values(lodash.indexBy(lodash.flatten(predictions, true), function (prediction) {
            return prediction.model.name + prediction.frame.name;
          }));
          return go(null, extendPredictions(opts, uniquePredictions));
        });
      }
      modelKey = opts.model, frameKey = opts.frame;
      return _.requestPredictions(modelKey, frameKey, function (error, predictions) {
        if (error) {
          return go(error);
        }
        return go(null, extendPredictions(opts, predictions));
      });
    };
    getPrediction = function (opts) {
      var frame;
      var model;
      var predictions_frame;
      if (opts == null) {
        opts = {};
      }
      predictions_frame = opts.predictions_frame, model = opts.model, frame = opts.frame;
      if (model && frame) {
        return _fork(requestPrediction, model, frame);
      }
      return assist(getPrediction, {
        predictions_frame,
        model,
        frame
      });
    };
    getPredictions = function (opts) {
      if (opts == null) {
        opts = {};
      }
      return _fork(requestPredictions, opts);
    };
    requestCloud = function (go) {
      return _.requestCloud(function (error, cloud) {
        if (error) {
          return go(error);
        }
        return go(null, extendCloud(cloud));
      });
    };
    getCloud = function () {
      return _fork(requestCloud);
    };
    requestTimeline = function (go) {
      return _.requestTimeline(function (error, timeline) {
        if (error) {
          return go(error);
        }
        return go(null, extendTimeline(timeline));
      });
    };
    getTimeline = function () {
      return _fork(requestTimeline);
    };
    requestStackTrace = function (go) {
      return _.requestStackTrace(function (error, stackTrace) {
        if (error) {
          return go(error);
        }
        return go(null, extendStackTrace(stackTrace));
      });
    };
    getStackTrace = function () {
      return _fork(requestStackTrace);
    };
    requestLogFile = function (nodeIndex, fileType, go) {
      return _.requestCloud(function (error, cloud) {
        var NODE_INDEX_SELF;
        if (error) {
          return go(error);
        }
        if (nodeIndex < 0 || nodeIndex >= cloud.nodes.length) {
          NODE_INDEX_SELF = -1;
          nodeIndex = NODE_INDEX_SELF;
        }
        return _.requestLogFile(nodeIndex, fileType, function (error, logFile) {
          if (error) {
            return go(error);
          }
          return go(null, extendLogFile(cloud, nodeIndex, fileType, logFile));
        });
      });
    };
    getLogFile = function (nodeIndex, fileType) {
      if (nodeIndex == null) {
        nodeIndex = -1;
      }
      if (fileType == null) {
        fileType = 'info';
      }
      return _fork(requestLogFile, nodeIndex, fileType);
    };
    requestNetworkTest = function (go) {
      return _.requestNetworkTest(function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendNetworkTest(result));
      });
    };
    testNetwork = function () {
      return _fork(requestNetworkTest);
    };
    requestRemoveAll = function (go) {
      return _.requestRemoveAll(function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendDeletedKeys([]));
      });
    };
    deleteAll = function () {
      return _fork(requestRemoveAll);
    };
    extendRDDs = function (rdds) {
      render_(rdds, h2oRDDsOutput, rdds);
      return rdds;
    };
    requestRDDs = function (go) {
      return _.requestRDDs(function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendRDDs(result.rdds));
      });
    };
    getRDDs = function () {
      return _fork(requestRDDs);
    };
    extendDataFrames = function (dataframes) {
      render_(dataframes, h2oDataFramesOutput, dataframes);
      return dataframes;
    };
    requestDataFrames = function (go) {
      return _.requestDataFrames(function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendDataFrames(result.dataframes));
      });
    };
    getDataFrames = function () {
      return _fork(requestDataFrames);
    };
    extendAsH2OFrame = function (result) {
      render_(result, h2oH2OFrameOutput, result);
      return result;
    };
    requestAsH2OFrameFromRDD = function (rdd_id, name, go) {
      return _.requestAsH2OFrameFromRDD(rdd_id, name, function (error, h2oframe_id) {
        if (error) {
          return go(error);
        }
        return go(null, extendAsH2OFrame(h2oframe_id));
      });
    };
    asH2OFrameFromRDD = function (rdd_id, name) {
      if (name == null) {
        name = void 0;
      }
      return _fork(requestAsH2OFrameFromRDD, rdd_id, name);
    };
    requestAsH2OFrameFromDF = function (df_id, name, go) {
      return _.requestAsH2OFrameFromDF(df_id, name, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendAsH2OFrame(result));
      });
    };
    asH2OFrameFromDF = function (df_id, name) {
      if (name == null) {
        name = void 0;
      }
      return _fork(requestAsH2OFrameFromDF, df_id, name);
    };
    extendAsDataFrame = function (result) {
      render_(result, h2oDataFrameOutput, result);
      return result;
    };
    requestAsDataFrame = function (hf_id, name, go) {
      return _.requestAsDataFrame(hf_id, name, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendAsDataFrame(result));
      });
    };
    asDataFrame = function (hf_id, name) {
      if (name == null) {
        name = void 0;
      }
      return _fork(requestAsDataFrame, hf_id, name);
    };
    requestScalaCode = function (session_id, code, go) {
      return _.requestScalaCode(session_id, code, function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendScalaCode(result));
      });
    };
    extendScalaCode = function (result) {
      render_(result, h2oScalaCodeOutput, result);
      return result;
    };
    runScalaCode = function (session_id, code) {
      return _fork(requestScalaCode, session_id, code);
    };
    requestScalaIntp = function (go) {
      return _.requestScalaIntp(function (error, result) {
        if (error) {
          return go(error);
        }
        return go(null, extendScalaIntp(result));
      });
    };
    extendScalaIntp = function (result) {
      render_(result, h2oScalaIntpOutput, result);
      return result;
    };
    getScalaIntp = function () {
      return _fork(requestScalaIntp);
    };
    requestProfile = function (depth, go) {
      return _.requestProfile(depth, function (error, profile) {
        if (error) {
          return go(error);
        }
        return go(null, extendProfile(profile));
      });
    };
    getProfile = function (opts) {
      if (!opts) {
        opts = { depth: 10 };
      }
      return _fork(requestProfile, opts.depth);
    };
    loadScript = function (path, go) {
      var onDone;
      var onFail;
      onDone = function (script, status) {
        return go(null, {
          script,
          status
        });
      };
      onFail = function (jqxhr, settings, error) {
        return go(error);
      };
      return $.getScript(path).done(onDone).fail(onFail);
    };
    dumpFuture = function (result, go) {
      if (result == null) {
        result = {};
      }
      console.debug(result);
      return go(null, render_(result, Flow.ObjectBrowser, 'dump', result));
    };
    dump = function (f) {
      if (f != null ? f.isFuture : void 0) {
        return _fork(dumpFuture, f);
      }
      return Flow.Async.async(function () {
        return f;
      });
    };
    assist = function () {
      var args;
      var func;
      func = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
      if (func === void 0) {
        return _fork(proceed, h2oAssist, [_assistance]);
      }
      switch (func) {
        case importFiles:
          return _fork(proceed, h2oImportFilesInput, []);
        case buildModel:
          return _fork(proceed, H2O.ModelInput, args);
        case buildAutoModel:
          return _fork(proceed, h2oAutoModelInput, args);
        case predict:
        case getPrediction:
          return _fork(proceed, h2oPredictInput, args);
        case createFrame:
          return _fork(proceed, h2oCreateFrameInput, args);
        case splitFrame:
          return _fork(proceed, h2oSplitFrameInput, args);
        case mergeFrames:
          return _fork(proceed, h2oMergeFramesInput, args);
        case buildPartialDependence:
          return _fork(proceed, h2oPartialDependenceInput, args);
        case exportFrame:
          return _fork(proceed, h2oExportFrameInput, args);
        case imputeColumn:
          return _fork(proceed, H2O.ImputeInput, args);
        case importModel:
          return _fork(proceed, h2oImportModelInput, args);
        case exportModel:
          return _fork(proceed, h2oExportModelInput, args);
        default:
          return _fork(proceed, h2oNoAssist, []);
      }
    };
    Flow.Dataflow.link(_.ready, function () {
      Flow.Dataflow.link(_.ls, ls);
      Flow.Dataflow.link(_.inspect, inspect);
      Flow.Dataflow.link(_.plot, function (plot) {
        return plot(lightning);
      });
      Flow.Dataflow.link(_.grid, function (frame) {
        return lightning(lightning.select(), lightning.from(frame));
      });
      Flow.Dataflow.link(_.enumerate, function (frame) {
        return lightning(lightning.select(0), lightning.from(frame));
      });
      Flow.Dataflow.link(_.requestFrameDataE, requestFrameData);
      return Flow.Dataflow.link(_.requestFrameSummarySliceE, requestFrameSummarySlice);
    });
    initAssistanceSparklingWater = function () {
      _assistance.getRDDs = {
        description: 'Get a list of Spark\'s RDDs',
        icon: 'table'
      };
      return _assistance.getDataFrames = {
        description: 'Get a list of Spark\'s data frames',
        icon: 'table'
      };
    };
    Flow.Dataflow.link(_.initialized, function () {
      if (_.onSparklingWater) {
        return initAssistanceSparklingWater();
      }
    });
    routines = {
      fork: _fork,
      join: _join,
      call: _call,
      apply: _apply,
      isFuture: _isFuture,
      signal: Flow.Dataflow.signal,
      signals: Flow.Dataflow.signals,
      isSignal: Flow.Dataflow.isSignal,
      act: Flow.Dataflow.act,
      react: Flow.Dataflow.react,
      lift: Flow.Dataflow.lift,
      merge: Flow.Dataflow.merge,
      dump,
      inspect,
      plot,
      grid,
      get: _get,
      assist,
      gui,
      loadScript,
      getJobs,
      getJob,
      cancelJob,
      importFiles,
      setupParse,
      parseFiles,
      createFrame,
      splitFrame,
      mergeFrames,
      buildPartialDependence,
      getPartialDependence,
      getFrames,
      getFrame,
      bindFrames,
      getFrameSummary,
      getFrameData,
      deleteFrames,
      deleteFrame,
      exportFrame,
      getColumnSummary,
      changeColumnType,
      imputeColumn,
      buildModel,
      buildAutoModel,
      getGrids,
      getModels,
      getModel,
      getGrid,
      deleteModels,
      deleteModel,
      importModel,
      exportModel,
      predict,
      getPrediction,
      getPredictions,
      getCloud,
      getTimeline,
      getProfile,
      getStackTrace,
      getLogFile,
      testNetwork,
      deleteAll
    };
    if (_.onSparklingWater) {
      routinesOnSw = {
        getDataFrames,
        getRDDs,
        getScalaIntp,
        runScalaCode,
        asH2OFrameFromRDD,
        asH2OFrameFromDF,
        asDataFrame
      };
      for (attrname in routinesOnSw) {
        if ({}.hasOwnProperty.call(routinesOnSw, attrname)) {
          routines[attrname] = routinesOnSw[attrname];
        }
      }
    }
    return routines;
  };
}
