/* eslint-disable */
import { getTwoDimData } from './getTwoDimData';
import { format6fi } from './format6fi';
import { createArrays } from './createArrays';
import { parseAndFormatArray } from './parseAndFormatArray';
import { parseAndFormatObjectArray } from './parseAndFormatObjectArray';
import { _fork } from './_fork';
import { _join } from './_join';
import { _call } from './_call';
import { _apply } from './_apply';
import { _plot } from './_plot';
import { inspect_ } from './inspect_';
import { flow_ } from './flow_';
import { render_ } from './render_';
import { ls } from './ls';
import { transformBinomialMetrics } from './transformBinomialMetrics';
import { inspectTwoDimTable_ } from './inspectTwoDimTable_';
import { getModelParameterValue } from './getModelParameterValue';
import { inspectRawObject_ } from './inspectRawObject_';
import { inspectRawArray_ } from './inspectRawArray_';
import { inspectObjectArray_ } from './inspectObjectArray_';
import { inspectObject } from './inspectObject';
import { proceed } from './proceed';
import { gui } from './gui';
import { _assistance } from './_assistance';
import { extendCloud } from './extendCloud';
import { extendTimeline } from './extendTimeline';
import { extendStackTrace } from './extendStackTrace';
import { extendLogFile } from './extendLogFile';
import { extendNetworkTest } from './extendNetworkTest';
import { extendProfile } from './extendProfile';
import { extendJobs } from './extendJobs';
import { extendDeletedKeys } from './extendDeletedKeys';
import { extendFrameSummary } from './extendFrameSummary';
import { read } from './read';
import { extendPrediction } from './extendPrediction';
import { inspectFrameColumns } from './inspectFrameColumns';
import { inspectFrameData } from './inspectFrameData';
import { requestFrame } from './requestFrame';
import { requestFrameData } from './requestFrameData';
import { requestColumnSummary } from './requestColumnSummary';
import { requestCreateFrame } from './requestCreateFrame';
import { requestSplitFrame } from './requestSplitFrame';
import { requestMergeFrames } from './requestMergeFrames';
import { requestFrames } from './requestFrames';
import { requestDeleteFrame } from './requestDeleteFrame';
import { requestExportFrame } from './requestExportFrame';
import { requestGrids } from './requestGrids';
import { requestModels } from './requestModels';
import { requestImputeColumn } from './requestImputeColumn';
import { requestChangeColumnType } from './requestChangeColumnType';
import { requestDeleteModel } from './requestDeleteModel';
import { requestImportModel } from './requestImportModel';
import { requestJob } from './requestJob';
import { requestJobs } from './requestJobs';
import { extendImportResults } from './extendImportResults';
import { requestImportAndParseSetup } from './requestImportAndParseSetup';
import { requestImportAndParseFiles } from './requestImportAndParseFiles';
import { requestParseFiles } from './requestParseFiles';
import { requestModelBuild } from './requestModelBuild';
import { requestPredict } from './requestPredict';
import { unwrapPrediction } from './unwrapPrediction';
import { inspectModelParameters } from './inspectModelParameters';
import { requestParseSetup } from './requestParseSetup';
import { requestCancelJob } from './requestCancelJob';
import { requestPartialDependence } from './requestPartialDependence';
import { requestPartialDependenceData } from './requestPartialDependenceData';
import { requestExportModel } from './requestExportModel';

import { h2oInspectsOutput } from '../h2oInspectsOutput';
import { h2oInspectOutput } from '../h2oInspectOutput';
import { h2oPlotOutput } from '../h2oPlotOutput';
import { h2oPlotInput } from '../h2oPlotInput';
import { h2oCloudOutput } from '../h2oCloudOutput';
import { h2oPartialDependenceOutput } from '../h2oPartialDependenceOutput';
import { h2oGridOutput } from '../h2oGridOutput';
import { h2oPredictsOutput } from '../h2oPredictsOutput';
import { h2oH2OFrameOutput } from '../h2oH2OFrameOutput';
import { h2oFrameOutput } from '../h2oFrameOutput';
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
import { h2oModelOutput } from '../h2oModelOutput';

import { getGridRequest } from '../h2oProxy/getGridRequest';
import { getModelRequest } from '../h2oProxy/getModelRequest';
import { getPredictionRequest } from '../h2oProxy/getPredictionRequest';
import { getPredictionsRequest } from '../h2oProxy/getPredictionsRequest';
import { getCloudRequest } from '../h2oProxy/getCloudRequest';
import { getTimelineRequest } from '../h2oProxy/getTimelineRequest';
import { getProfileRequest } from '../h2oProxy/getProfileRequest';
import { getStackTraceRequest } from '../h2oProxy/getStackTraceRequest';
import { deleteAllRequest } from '../h2oProxy/deleteAllRequest';
import { getLogFileRequest } from '../h2oProxy/getLogFileRequest';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function routines() {
  const lodash = window._;
  const Flow = window.Flow;
  const H2O = window.H2O;
  let createDataframe;
  let createFactor;
  let createList;
  let createVector;
  let lightning;
  const __slice = [].slice;
  lightning = (typeof window !== 'undefined' && window !== null ? window.plot : void 0) != null ? window.plot : {};
  if (lightning.settings) {
    lightning.settings.axisLabelFont = '11px "Source Code Pro", monospace';
    lightning.settings.axisTitleFont = 'bold 11px "Source Code Pro", monospace';
  }
  createVector = lightning.createVector;
  createFactor = lightning.createFactor;
  createList = lightning.createList;
  createDataframe = lightning.createFrame;
  H2O.Routines = _ => {
    let asDataFrame;
    let asH2OFrameFromDF;
    let asH2OFrameFromRDD;
    let assist;
    let attrname;
    let bindFrames;
    let buildAutoModel;
    let buildModel;
    let buildPartialDependence;
    let cancelJob;
    let changeColumnType;
    let createFrame;
    let createPlot;
    let deleteAll;
    let deleteFrame;
    let deleteFrames;
    let deleteModel;
    let deleteModels;
    let dump;
    let dumpFuture;
    let exportFrame;
    let exportModel;
    let extendAsDataFrame;
    let extendAsH2OFrame;
    let extendDataFrames;
    let extendGrid;
    let extendModel;
    let extendPlot;
    let extendPredictions;
    let extendRDDs;
    let extendScalaCode;
    let extendScalaIntp;
    let f;
    let getCloud;
    let getColumnSummary;
    let getDataFrames;
    let getFrame;
    let getFrameData;
    let getFrameSummary;
    let getFrames;
    let getGrid;
    let getGrids;
    let getJob;
    let getJobs;
    let getLogFile;
    let getModel;
    let getModels;
    let getPartialDependence;
    let getPrediction;
    let getPredictions;
    let getProfile;
    let getRDDs;
    let getScalaIntp;
    let getStackTrace;
    let getTimeline;
    let grid;
    let importFiles;
    let importModel;
    let imputeColumn;
    let initAssistanceSparklingWater;
    let inspect;
    let inspect$1;
    let inspect$2;
    let loadScript;
    let mergeFrames;
    let name;
    let parseFiles;
    let plot;
    let predict;
    let render_;
    let requestAsDataFrame;
    let requestAsH2OFrameFromDF;
    let requestAsH2OFrameFromRDD;
    let requestCloud;
    let requestDataFrames;
    let requestFrameSummary;
    let requestFrameSummarySlice;
    let requestGrid;
    let requestImportFiles;
    let requestLogFile;
    let requestModel;
    let requestNetworkTest;
    let requestPrediction;
    let requestPredictions;
    let requestPredicts;
    let requestProfile;
    let requestRDDs;
    let requestRemoveAll;
    let requestScalaCode;
    let requestScalaIntp;
    let requestStackTrace;
    let requestTimeline;
    let routines;
    let routinesOnSw;
    let runScalaCode;
    let setupParse;
    let splitFrame;
    let testNetwork;

    // TODO move these into Flow.Async
    let _async;
    let _get;
    let _isFuture;
    let _ref;
    let _schemaHacks;
    _isFuture = Flow.Async.isFuture;
    _async = Flow.Async.async;
    _get = Flow.Async.get;

    render_ = function () {
      let args;
      let raw;
      let render;
      raw = arguments[0], render = arguments[1], args = arguments.length >= 3 ? __slice.call(arguments, 2) : [];
      // Prepend current context (_) and a continuation (go)
      flow_(raw).render = go => render(...[
        _,
        go
      ].concat(args));
      return raw;
    };
    extendModel = (model) => {
      lodash.extend = model => {
        let table;
        let tableName;
        let _i;
        let _len;
        let _ref1;
        const inspections = {};
        inspections.parameters = inspectModelParameters(model);
        const origin = `getModel ${flowPrelude.stringify(model.model_id.name)}`;
        inspectObject(inspections, 'output', origin, model.output);

        // Obviously, an array of 2d tables calls for a megahack.
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
      const refresh = go => getModelRequest(_, model.model_id.name, (error, model) => {
        if (error) {
          return go(error);
        }
        return go(null, lodash.extend(model));
      });
      lodash.extend(model);
      return render_(model, h2oModelOutput, model, refresh);
    }
    requestModel = (modelKey, go) => {
      return getModelRequest(_, modelKey, (error, model) => {
        if (error) {
          return go(error);
        }
        return go(null, extendModel(model));
      });
    }
    extendPlot = vis => render_(vis, h2oPlotOutput, vis.element);
    createPlot = (f, go) => _plot(f(lightning), (error, vis) => {
      if (error) {
        return go(error);
      }
      return go(null, extendPlot(vis));
    });
    inspect = function (a, b) {
      if (arguments.length === 1) {
        return inspect$1(a);
      }
      return inspect$2(a, b);
    };
    inspect$1 = obj => {
      let attr;
      let inspections;
      let inspectors;
      let _ref1;
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
    inspect$2 = (attr, obj) => {
      let cached;
      let inspection;
      let inspectors;
      let key;
      let root;
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
    plot = f => {
      if (_isFuture(f)) {
        return _fork(proceed, h2oPlotInput, f);
      } else if (lodash.isFunction(f)) {
        return _fork(createPlot, f);
      }
      return assist(plot);
    };
    // depends on `plot`
    grid = f => plot(g => g(g.select(), g.from(f)));
    
    // depends on `grid`
    extendGrid = (grid, opts) => {
      let inspections;
      let origin;
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

    requestPrediction = (modelKey, frameKey, go) => {
      return postPredictionRequest(_, modelKey, frameKey, unwrapPrediction(_, go));
    }
    // abstracting this out produces an error
    // defer for now

    extendPredictions = (opts, predictions) => {
      render_(predictions, h2oPredictsOutput, opts, predictions);
      return predictions;
    };

    requestFrameSummarySlice = (frameKey, searchTerm, offset, length, go) => _.requestFrameSummarySlice(_, frameKey, searchTerm, offset, length, (error, frame) => {
      if (error) {
        return go(error);
      }
      return go(null, extendFrameSummary(_, frameKey, frame));
    });
    requestFrameSummary = (frameKey, go) => _.requestFrameSummarySlice(_, frameKey, void 0, 0, 20, (error, frame) => {
      if (error) {
        return go(error);
      }
      return go(null, extendFrameSummary(_, frameKey, frame));
    });
    // depends on `assist`
    createFrame = opts => {
      if (opts) {
        return _fork(requestCreateFrame, _, opts);
      }
      return assist(createFrame);
    };
    // depends on `assist`
    splitFrame = (frameKey, splitRatios, splitKeys, seed) => {
      if (seed == null) {
        seed = -1;
      }
      if (frameKey && splitRatios && splitKeys) {
        return _fork(requestSplitFrame, _, frameKey, splitRatios, splitKeys, seed);
      }
      return assist(splitFrame);
    };
    // depends on `assist`
    mergeFrames = (
      destinationKey,
      leftFrameKey,
      leftColumnIndex,
      includeAllLeftRows,
      rightFrameKey,
      rightColumnIndex,
      includeAllRightRows
    ) => {
      if (destinationKey && leftFrameKey && rightFrameKey) {
        return _fork(requestMergeFrames, _, destinationKey, leftFrameKey, leftColumnIndex, includeAllLeftRows, rightFrameKey, rightColumnIndex, includeAllRightRows);
      }
      return assist(mergeFrames);
    };

    // depends on `assist`
    // define the function that is called when 
    // the Partial Dependence plot input form
    // is submitted
    buildPartialDependence = opts => {
      if (opts) {
        return _fork(requestPartialDependence, _, opts);
      }
      // specify function to call if user
      // provides malformed input
      return assist(buildPartialDependence);
    };
    // depends on `assist`
    getPartialDependence = destinationKey => {
      if (destinationKey) {
        return _fork(requestPartialDependenceData, _, destinationKey);
      }
      return assist(getPartialDependence);
    };
    // abstracting this out causes a bug
    // need to figure out how to insert a `_` variable
    // into coffeescript that is then executed
    // so that `_`'s meaning is preserved
    // rather that being stringified into [object Object]
    getFrames = () => _fork(requestFrames, _);
    // depends on `assist`
    getFrame = frameKey => {
      switch (flowPrelude.typeOf(frameKey)) {
        case 'String':
          return _fork(requestFrame, _, frameKey);
        default:
          return assist(getFrame);
      }
    };
    // blocked by CoffeeScript codecell `_` issue
    bindFrames = (key, sourceKeys) => _fork(requestBindFrames, _, key, sourceKeys);
    // depends on `assist`
    getFrameSummary = frameKey => {
      switch (flowPrelude.typeOf(frameKey)) {
        case 'String':
          return _fork(requestFrameSummary, frameKey);
        default:
          return assist(getFrameSummary);
      }
    };
    // depends on `assist`
    getFrameData = frameKey => {
      switch (flowPrelude.typeOf(frameKey)) {
        case 'String':
          return _fork(requestFrameData, _, frameKey, void 0, 0, 20);
        default:
          return assist(getFrameSummary);
      }
    };
    // depends on `assist`
    deleteFrame = frameKey => {
      if (frameKey) {
        return _fork(requestDeleteFrame, _, frameKey);
      }
      return assist(deleteFrame);
    };

    // depends on `assist`
    exportFrame = (frameKey, path, opts) => {
      if (opts == null) {
        opts = {};
      }
      if (frameKey && path) {
        return _fork(requestExportFrame, _, frameKey, path, opts);
      }
      return assist(exportFrame, frameKey, path, opts);
    };
    // depends on `assist`
    deleteFrames = frameKeys => {
      switch (frameKeys.length) {
        case 0:
          return assist(deleteFrames);
        case 1:
          return deleteFrame(lodash.head(frameKeys));
        default:
          return _fork(requestDeleteFrames, _, frameKeys);
      }
    };
    // blocked by CoffeeScript codecell `_` issue
    getColumnSummary = (frameKey, columnName) => _fork(requestColumnSummary, _, frameKey, columnName);
    // blocked by CoffeeScript codecell `_` issue
    getModels = modelKeys => {
      if (lodash.isArray(modelKeys)) {
        if (modelKeys.length) {
          return _fork(requestModelsByKeys, _, modelKeys);
        }
        return _fork(requestModels, _);
      }
      return _fork(requestModels, _);
    };
    // blocked by CoffeeScript codecell `_` issue
    getGrids = () => _fork(requestGrids, _);
    // depends on `assist`
    getModel = modelKey => {
      switch (flowPrelude.typeOf(modelKey)) {
        case 'String':
          return _fork(requestModel, modelKey);
        default:
          return assist(getModel);
      }
    };
    // depends on `extendGrid`
    requestGrid = (gridKey, opts, go) => getGridRequest(_, gridKey, opts, (error, grid) => {
      if (error) {
        return go(error);
      }
      return go(null, extendGrid(grid, opts));
    });
    // depends on `assist`
    getGrid = (gridKey, opts) => {
      switch (flowPrelude.typeOf(gridKey)) {
        case 'String':
          return _fork(requestGrid, gridKey, opts);
        default:
          return assist(getGrid);
      }
    };
    // depends on `assist`
    imputeColumn = opts => {
      if (opts && opts.frame && opts.column && opts.method) {
        return _fork(requestImputeColumn, _, opts);
      }
      return assist(imputeColumn, opts);
    };
    // depends on `assist`
    changeColumnType = opts => {
      if (opts && opts.frame && opts.column && opts.type) {
        return _fork(requestChangeColumnType, _, opts);
      }
      return assist(changeColumnType, opts);
    };
    // depends on `assist`
    deleteModel = modelKey => {
      if (modelKey) {
        return _fork(requestDeleteModel, _, modelKey);
      }
      return assist(deleteModel);
    };

    // depends on `assist`
    importModel = (path, opts) => {
      if (path && path.length) {
        return _fork(requestImportModel, _, path, opts);
      }
      return assist(importModel, path, opts);
    };

    // depends on `assist`
    exportModel = (modelKey, path, opts) => {
      if (modelKey && path) {
        return _fork(requestExportModel, _, modelKey, path, opts);
      }
      return assist(exportModel, modelKey, path, opts);
    };
    // depends on `assist`
    deleteModels = modelKeys => {
      switch (modelKeys.length) {
        case 0:
          return assist(deleteModels);
        case 1:
          return deleteModel(lodash.head(modelKeys));
        default:
          return _fork(requestDeleteModels, _, modelKeys);
      }
    };
    // blocked by CoffeeScript codecell `_` issue
    getJobs = () => _fork(requestJobs, _);
    // depends on `assist`
    getJob = arg => {
      switch (flowPrelude.typeOf(arg)) {
        case 'String':
          return _fork(requestJob, _, arg);
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
    // depends on `assist`
    cancelJob = arg => {
      switch (flowPrelude.typeOf(arg)) {
        case 'String':
          return _fork(requestCancelJob, _, arg);
        default:
          return assist(cancelJob);
      }
    };

    // some weird recursion and function scope things happening here
    // abstracting this out causes an error
    // defer for now
    requestImportFiles = (paths, go) => _.requestImportFiles(paths, (error, importResults) => {
      if (error) {
        return go(error);
      }
      return go(null, extendImportResults(_, importResults));
    });
    // depends on `assist`
    importFiles = paths => {
      switch (flowPrelude.typeOf(paths)) {
        case 'Array':
          return _fork(requestImportFiles, paths);
        default:
          return assist(importFiles);
      }
    };

    // depends on `assist`
    setupParse = args => {
      if (args.paths && lodash.isArray(args.paths)) {
        return _fork(requestImportAndParseSetup, _, args.paths);
      } else if (args.source_frames && lodash.isArray(args.source_frames)) {
        return _fork(requestParseSetup, _, args.source_frames);
      }
      return assist(setupParse);
    };

    // blocked by CoffeeScript codecell `_` issue
    parseFiles = opts => {
      let checkHeader;
      let chunkSize;
      let columnCount;
      let columnNames;
      let columnTypes;
      let deleteOnDone;
      let destinationKey;
      let parseType;
      let separator;
      let useSingleQuotes;
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
        return _fork(requestImportAndParseFiles, _, opts.paths, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize);
      }
      return _fork(requestParseFiles, _, opts.source_frames, destinationKey, parseType, separator, columnCount, useSingleQuotes, columnNames, columnTypes, deleteOnDone, checkHeader, chunkSize);
    };
    // depends on `assist`
    buildAutoModel = opts => {
      if (opts && lodash.keys(opts).length > 1) {
        return _fork(requestAutoModelBuild, _, opts);
      }
      return assist(buildAutoModel, opts);
    };
    // depends on `assist`
    buildModel = (algo, opts) => {
      if (algo && opts && lodash.keys(opts).length > 1) {
        return _fork(requestModelBuild, _, algo, opts);
      }
      return assist(buildModel, algo, opts);
    };
    // depends on `extendPredictions`
    requestPredicts = (opts, go) => {
      let futures;
      futures = lodash.map(opts, opt => {
        let frameKey;
        let modelKey;
        let options;
        modelKey = opt.model, frameKey = opt.frame, options = opt.options;
        return _fork(_.requestPredict, _, null, modelKey, frameKey, options || {});
      });
      return Flow.Async.join(futures, (error, predictions) => {
        if (error) {
          return go(error);
        }
        return go(null, extendPredictions(opts, predictions));
      });
    };
    // depends on `assist`
    predict = opts => {
      let combos;
      let deep_features_hidden_layer;
      let exemplar_index;
      let frame;
      let frames;
      let leaf_node_assignment;
      let model;
      let models;
      let predictions_frame;
      let reconstruction_error;
      let _i;
      let _j;
      let _len;
      let _len1;
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
        return _fork(requestPredict, _, predictions_frame, model, frame, {
          reconstruction_error,
          deep_features_hidden_layer,
          leaf_node_assignment
        });
      } else if (model && exemplar_index !== void 0) {
        return _fork(requestPredict, _, predictions_frame, model, null, { exemplar_index });
      }
      return assist(predict, {
        predictions_frame,
        model,
        frame
      });
    };
    // depends on `extendPredictions`
    requestPredictions = (opts, go) => {
      let frameKey;
      let futures;
      let modelKey;
      if (lodash.isArray(opts)) {
        futures = lodash.map(opts, opt => {
          let frameKey;
          let modelKey;
          modelKey = opt.model, frameKey = opt.frame;
          return _fork(getPredictionsRequest, _, modelKey, frameKey);
        });
        return Flow.Async.join(futures, (error, predictions) => {
          let uniquePredictions;
          if (error) {
            return go(error);
          }
          uniquePredictions = lodash.values(lodash.indexBy(lodash.flatten(predictions, true), prediction => prediction.model.name + prediction.frame.name));
          return go(null, extendPredictions(opts, uniquePredictions));
        });
      }
      modelKey = opts.model, frameKey = opts.frame;
      return getPredictionsRequest(_, modelKey, frameKey, (error, predictions) => {
        if (error) {
          return go(error);
        }
        return go(null, extendPredictions(opts, predictions));
      });
    };
    // blocked by CoffeeScript codecell `_` issue
    getPrediction = opts => {
      let frame;
      let model;
      let predictions_frame;
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
    // blocked by CoffeeScript codecell `_` issue
    getPredictions = opts => {
      if (opts == null) {
        opts = {};
      }
      return _fork(requestPredictions, opts);
    };
    // calls _.self
    requestCloud = go => getCloudRequest(_, (error, cloud) => {
      if (error) {
        return go(error);
      }
      return go(null, extendCloud(_, cloud));
    });
    // blocked by CoffeeScript codecell `_` issue
    getCloud = () => _fork(requestCloud);
    // calls _.self
    requestTimeline = go => getTimelineRequest(_, (error, timeline) => {
      if (error) {
        return go(error);
      }
      return go(null, extendTimeline(_, timeline));
    });
    // blocked by CoffeeScript codecell `_` issue
    getTimeline = () => _fork(requestTimeline);
    requestStackTrace = go => getStackTraceRequest(_, (error, stackTrace) => {
      if (error) {
        return go(error);
      }
      return go(null, extendStackTrace(_, stackTrace));
    });
    // depends on requestStackTrace
    getStackTrace = () => _fork(requestStackTrace);
    // calls _.self
    requestLogFile = (nodeIndex, fileType, go) => getCloudRequest(_, (error, cloud) => {
      let NODE_INDEX_SELF;
      if (error) {
        return go(error);
      }
      if (nodeIndex < 0 || nodeIndex >= cloud.nodes.length) {
        NODE_INDEX_SELF = -1;
        nodeIndex = NODE_INDEX_SELF;
      }
      return getLogFileRequest(_, nodeIndex, fileType, (error, logFile) => {
        if (error) {
          return go(error);
        }
        return go(null, extendLogFile(_, cloud, nodeIndex, fileType, logFile));
      });
    });
    // blocked by CoffeeScript codecell `_` issue
    getLogFile = (nodeIndex, fileType) => {
      if (nodeIndex == null) {
        nodeIndex = -1;
      }
      if (fileType == null) {
        fileType = 'info';
      }
      return _fork(requestLogFile, nodeIndex, fileType);
    };
    // calls _.self
    requestNetworkTest = go => _.requestNetworkTest((error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendNetworkTest(_, result));
    });
    //
    //
    //
    //  v  continue abstracting out here  v
    //
    //
    //
    testNetwork = () => _fork(requestNetworkTest);
    // calls _.self
    requestRemoveAll = go => deleteAllRequest(_, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendDeletedKeys(_, []));
    });
    deleteAll = () => _fork(requestRemoveAll);
    extendRDDs = rdds => {
      render_(rdds, h2oRDDsOutput, rdds);
      return rdds;
    };
    // calls _.self
    requestRDDs = go => _.requestRDDs((error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendRDDs(result.rdds));
    });
    getRDDs = () => _fork(requestRDDs);
    extendDataFrames = dataframes => {
      render_(dataframes, h2oDataFramesOutput, dataframes);
      return dataframes;
    };
    // calls _.self
    requestDataFrames = go => _.requestDataFrames((error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendDataFrames(result.dataframes));
    });
    getDataFrames = () => _fork(requestDataFrames);
    extendAsH2OFrame = result => {
      render_(result, h2oH2OFrameOutput, result);
      return result;
    };
    // calls _.self
    requestAsH2OFrameFromRDD = (rddId, name, go) => _.requestAsH2OFrameFromRDD(rddId, name, (error, h2oframe_id) => {
      if (error) {
        return go(error);
      }
      return go(null, extendAsH2OFrame(h2oframe_id));
    });
    asH2OFrameFromRDD = (rddId, name) => {
      if (name == null) {
        name = void 0;
      }
      return _fork(requestAsH2OFrameFromRDD, rddId, name);
    };
    // calls _.self
    requestAsH2OFrameFromDF = (dfId, name, go) => _.requestAsH2OFrameFromDF(dfId, name, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendAsH2OFrame(result));
    });
    asH2OFrameFromDF = (dfId, name) => {
      if (name == null) {
        name = void 0;
      }
      return _fork(requestAsH2OFrameFromDF, dfId, name);
    };
    extendAsDataFrame = result => {
      render_(result, h2oDataFrameOutput, result);
      return result;
    };
    // calls _.self
    requestAsDataFrame = (hfId, name, go) => _.requestAsDataFrame(hfId, name, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendAsDataFrame(result));
    });
    asDataFrame = (hfId, name) => {
      if (name == null) {
        name = void 0;
      }
      return _fork(requestAsDataFrame, hfId, name);
    };
    // calls _.self
    requestScalaCode = (sessionId, code, go) => _.requestScalaCode(sessionId, code, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendScalaCode(result));
    });
    extendScalaCode = result => {
      render_(result, h2oScalaCodeOutput, result);
      return result;
    };
    runScalaCode = (sessionId, code) => _fork(requestScalaCode, sessionId, code);
    // calls _.self
    requestScalaIntp = go => _.requestScalaIntp((error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, extendScalaIntp(result));
    });
    extendScalaIntp = result => {
      render_(result, h2oScalaIntpOutput, result);
      return result;
    };
    getScalaIntp = () => _fork(requestScalaIntp);
    requestProfile = (depth, go) => getProfileRequest(_, depth, (error, profile) => {
      if (error) {
        return go(error);
      }
      return go(null, extendProfile(_, profile));
    });
    getProfile = opts => {
      if (!opts) {
        opts = { depth: 10 };
      }
      return _fork(requestProfile, opts.depth);
    };
    loadScript = (path, go) => {
      let onDone;
      let onFail;
      onDone = (script, status) => go(null, {
        script,
        status
      });
      onFail = (jqxhr, settings, error) => go(error);
      return $.getScript(path).done(onDone).fail(onFail);
    };
    dumpFuture = (result, go) => {
      if (result == null) {
        result = {};
      }
      console.debug(result);
      return go(null, render_(result, Flow.objectBrowser, 'dump', result));
    };
    dump = f => {
      if (f != null ? f.isFuture : void 0) {
        return _fork(dumpFuture, f);
      }
      return Flow.Async.async(() => f);
    };
    // abstracting this out produces errors
    // defer for now
    assist = function () {
      let args;
      let func;
      func = arguments[0], args = arguments.length >= 2 ? __slice.call(arguments, 1) : [];
      if (func === void 0) {
        return _fork(proceed, _, h2oAssist, [_assistance]);
      }
      switch (func) {
        case importFiles:
          return _fork(proceed, _, h2oImportFilesInput, []);
        case buildModel:
          return _fork(proceed, _, H2O.ModelInput, args);
        case buildAutoModel:
          return _fork(proceed, _, h2oAutoModelInput, args);
        case predict:
        case getPrediction:
          return _fork(proceed, _, h2oPredictInput, args);
        case createFrame:
          return _fork(proceed, _, h2oCreateFrameInput, args);
        case splitFrame:
          return _fork(proceed, _, h2oSplitFrameInput, args);
        case mergeFrames:
          return _fork(proceed, _, h2oMergeFramesInput, args);
        case buildPartialDependence:
          return _fork(proceed, _, h2oPartialDependenceInput, args);
        case exportFrame:
          return _fork(proceed, _, h2oExportFrameInput, args);
        case imputeColumn:
          return _fork(proceed, _, H2O.ImputeInput, args);
        case importModel:
          return _fork(proceed, _, h2oImportModelInput, args);
        case exportModel:
          return _fork(proceed, _, h2oExportModelInput, args);
        default:
          return _fork(proceed, _, h2oNoAssist, []);
      }
    };
    Flow.Dataflow.link(_.ready, () => {
      Flow.Dataflow.link(_.ls, ls);
      Flow.Dataflow.link(_.inspect, inspect);
      Flow.Dataflow.link(_.plot, plot => plot(lightning));
      Flow.Dataflow.link(_.grid, frame => lightning(lightning.select(), lightning.from(frame)));
      Flow.Dataflow.link(_.enumerate, frame => lightning(lightning.select(0), lightning.from(frame)));
      Flow.Dataflow.link(_.requestFrameDataE, requestFrameData);
      return Flow.Dataflow.link(_.requestFrameSummarySliceE, requestFrameSummarySlice);
    });
    initAssistanceSparklingWater = () => {
      _assistance.getRDDs = {
        description: 'Get a list of Spark\'s RDDs',
        icon: 'table'
      };
      return _assistance.getDataFrames = {
        description: 'Get a list of Spark\'s data frames',
        icon: 'table'
      };
    };
    Flow.Dataflow.link(_.initialized, () => {
      if (_.onSparklingWater) {
        return initAssistanceSparklingWater();
      }
    });
    routines = {
      //
      // fork/join
      //
      fork: _fork,
      join: _join,
      call: _call,
      apply: _apply,
      isFuture: _isFuture,
      //
      // Dataflow
      //
      signal: Flow.Dataflow.signal,
      signals: Flow.Dataflow.signals,
      isSignal: Flow.Dataflow.isSignal,
      act: Flow.Dataflow.act,
      react: Flow.Dataflow.react,
      lift: Flow.Dataflow.lift,
      merge: Flow.Dataflow.merge,
      //
      // Generic
      //
      dump,
      inspect,
      plot,
      grid,
      get: _get,
      //
      // Meta
      //
      assist,
      //
      // GUI
      //
      gui,
      //
      // Util
      //
      loadScript,
      //
      // H2O
      //
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
