import { download } from './download';
import { http } from './http';
import { doGet } from './doGet';
import { doPost } from './doPost';
import { doPostJSON } from './doPostJSON';
import { doUpload } from './doUpload';
import { doDelete } from './doDelete';
import { composePath } from './composePath';
import { requestWithOpts } from './requestWithOpts';
import { encodeArrayForPost } from './encodeArrayForPost';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oProxy(_) {
  const lodash = window._;
  const Flow = window.Flow;
  const $ = window.jQuery;
  let __gridModelBuilderEndpoints;
  let __modelBuilderEndpoints;
  let __modelBuilders;
  let _storageConfiguration;
  const encodeObject = source => {
    let k;
    let v;
    const target = {};
    for (k in source) {
      if ({}.hasOwnProperty.call(source, k)) {
        v = source[k];
        target[k] = encodeURIComponent(v);
      }
    }
    return target;
  };
  const encodeObjectForPost = source => {
    let k;
    let v;
    const target = {};
    for (k in source) {
      if ({}.hasOwnProperty.call(source, k)) {
        v = source[k];
        target[k] = lodash.isArray(v) ? encodeArrayForPost(v) : v;
      }
    }
    return target;
  };
  const unwrap = (go, transform) => (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, transform(result));
  };
  const requestExec = (ast, go) => doPost(_, '/99/Rapids', { ast }, (error, result) => {
    if (error) {
      return go(error);
    }
    // TODO HACK - this api returns a 200 OK on failures
    if (result.error) {
      return go(new Flow.Error(result.error));
    }
    return go(null, result);
  });
  const requestInspect = (key, go) => {
    const opts = { key: encodeURIComponent(key) };
    return requestWithOpts(_, '/3/Inspect', opts, go);
  };
  const requestCreateFrame = (opts, go) => doPost(_, '/3/CreateFrame', opts, go);
  const requestSplitFrame = (frameKey, splitRatios, splitKeys, go) => {
    const opts = {
      dataset: frameKey,
      ratios: encodeArrayForPost(splitRatios),
      dest_keys: encodeArrayForPost(splitKeys),
    };
    return doPost(_, '/3/SplitFrame', opts, go);
  };
  const requestFrames = go => doGet(_, '/3/Frames', (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, result.frames);
  });
  const requestFrame = (key, go) => doGet(_, `/3/Frames/${encodeURIComponent(key)}`, unwrap(go, result => lodash.head(result.frames)));
  const requestFrameSlice = (key, searchTerm, offset, count, go) => { // eslint-disable-line
    // TODO send search term
    return doGet(_, `/3/Frames/${encodeURIComponent(key)}?column_offset=${offset}&column_count=${count}`, unwrap(go, result => lodash.head(result.frames)));
  };
  const requestFrameSummary = (key, go) => doGet(_, `/3/Frames/${encodeURIComponent(key)}/summary`, unwrap(go, result => lodash.head(result.frames)));
  const requestFrameSummarySlice = (key, searchTerm, offset, count, go) => doGet(_, `/3/Frames/${encodeURIComponent(key)}/summary?column_offset=${offset}&column_count=${count}&_exclude_fields=frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, unwrap(go, result => lodash.head(result.frames)));
  const requestFrameSummaryWithoutData = (key, go) => doGet(_, `/3/Frames/${encodeURIComponent(key)}/summary?_exclude_fields=frames/chunk_summary,frames/distribution_summary,frames/columns/data,frames/columns/domain,frames/columns/histogram_bins,frames/columns/percentiles`, (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, lodash.head(result.frames));
  });
  const requestDeleteFrame = (key, go) => doDelete(_, `/3/Frames/${encodeURIComponent(key)}`, go);
  const requestExportFrame = (key, path, overwrite, go) => {
    const params = {
      path,
      force: overwrite ? 'true' : 'false',
    };
    return doPost(_, `/3/Frames/${encodeURIComponent(key)}/export`, params, go);
  };
  const requestColumnSummary = (frameKey, column, go) => doGet(_, `/3/Frames/${encodeURIComponent(frameKey)}/columns/${encodeURIComponent(column)}/summary`, unwrap(go, result => lodash.head(result.frames)));
  const requestJobs = go => doGet(_, '/3/Jobs', (error, result) => {
    if (error) {
      return go(new Flow.Error('Error fetching jobs', error));
    }
    return go(null, result.jobs);
  });
  const requestJob = (key, go) => doGet(_, `/3/Jobs/${encodeURIComponent(key)}`, (error, result) => {
    if (error) {
      return go(new Flow.Error(`Error fetching job \'${key}\'`, error));
    }
    return go(null, lodash.head(result.jobs));
  });
  const requestCancelJob = (key, go) => doPost(_, `/3/Jobs/${encodeURIComponent(key)}/cancel`, {}, (error, result) => {
    if (error) {
      return go(new Flow.Error(`Error canceling job \'${key}\'`, error));
    }
    return go(null);
  });
  const requestFileGlob = (path, limit, go) => {
    const opts = {
      src: encodeURIComponent(path),
      limit,
    };
    return requestWithOpts(_, '/3/Typeahead/files', opts, go);
  };
  const requestImportFiles = (paths, go) => {
    const tasks = lodash.map(paths, path => go => requestImportFile(path, go));
    return Flow.Async.iterate(tasks)(go);
  };
  const requestImportFile = (path, go) => {
    const opts = { path: encodeURIComponent(path) };
    return requestWithOpts(_, '/3/ImportFiles', opts, go);
  };
  const requestParseSetup = (sourceKeys, go) => {
    const opts = { source_frames: encodeArrayForPost(sourceKeys) };
    return doPost(_, '/3/ParseSetup', opts, go);
  };
  const requestParseSetupPreview = (
    sourceKeys,
    parseType,
    separator,
    useSingleQuotes,
    checkHeader,
    columnTypes,
    go
  ) => {
    const opts = {
      source_frames: encodeArrayForPost(sourceKeys),
      parse_type: parseType,
      separator,
      single_quotes: useSingleQuotes,
      check_header: checkHeader,
      column_types: encodeArrayForPost(columnTypes),
    };
    return doPost(_, '/3/ParseSetup', opts, go);
  };
  const requestParseFiles = (
    sourceKeys,
    destinationKey,
    parseType,
    separator,
    columnCount,
    useSingleQuotes,
    columnNames,
    columnTypes,
    deleteOnDone,
    checkHeader,
    chunkSize,
    go
  ) => {
    const opts = {
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
      chunk_size: chunkSize,
    };
    return doPost(_, '/3/Parse', opts, go);
  };

  // Create data for partial dependence plot(s)
  // for the specified model and frame.
  //
  // make a post request to h2o-3 to request
  // the data about the specified model and frame
  // subject to the other options `opts`
  //
  // returns a job
  const requestPartialDependence = (opts, go) => doPost(_, '/3/PartialDependence/', opts, go);

  // make a post request to h2o-3 to do request
  // the data about the specified model and frame
  // subject to the other options `opts`
  //
  // returns a json response that contains the data
  const requestPartialDependenceData = (key, go) => doGet(_, `/3/PartialDependence/${encodeURIComponent(key)}`, (error, result) => {
    if (error) {
      return go(error, result);
    }
    return go(error, result);
  });
  const requestGrids = (go, opts) => doGet(_, '/99/Grids', (error, result) => {
    if (error) {
      return go(error, result);
    }
    return go(error, result.grids);
  });
  const requestModels = (go, opts) => requestWithOpts(_, '/3/Models', opts, (error, result) => {
    if (error) {
      return go(error, result);
    }
    return go(error, result.models);
  });
  const requestGrid = (key, opts, go) => {
    let params;
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
    return doGet(_, composePath(`/99/Grids/${encodeURIComponent(key)}`, params), go);
  };
  const requestModel = (key, go) => doGet(_, `/3/Models/${encodeURIComponent(key)}`, (error, result) => {
    if (error) {
      return go(error, result);
    }
    return go(error, lodash.head(result.models));
  });
  const requestPojoPreview = (key, go) => download('text', `/3/Models.java/${encodeURIComponent(key)}/preview`, go);
  const requestDeleteModel = (key, go) => doDelete(_, `/3/Models/${encodeURIComponent(key)}`, go);
  const requestImportModel = (path, overwrite, go) => {
    const opts = {
      dir: path,
      force: overwrite,
    };
    return doPost(_, '/99/Models.bin/not_in_use', opts, go);
  };
  const requestExportModel = (key, path, overwrite, go) => doGet(_, `/99/Models.bin/${encodeURIComponent(key)}?dir=${encodeURIComponent(path)}&force=${overwrite}`, go);

  // TODO Obsolete
  const requestModelBuildersVisibility = go => doGet(_, '/3/Configuration/ModelBuilders/visibility', unwrap(go, result => result.value));
  __modelBuilders = null;
  __modelBuilderEndpoints = null;
  __gridModelBuilderEndpoints = null;
  const cacheModelBuilders = modelBuilders => {
    let modelBuilder;
    let _i;
    let _len;
    const modelBuilderEndpoints = {};
    const gridModelBuilderEndpoints = {};
    for (_i = 0, _len = modelBuilders.length; _i < _len; _i++) {
      modelBuilder = modelBuilders[_i];
      modelBuilderEndpoints[modelBuilder.algo] = `/${modelBuilder.__meta.schema_version}/ModelBuilders/${modelBuilder.algo}`;
      gridModelBuilderEndpoints[modelBuilder.algo] = `/99/Grid/${modelBuilder.algo}`;
    }
    __modelBuilderEndpoints = modelBuilderEndpoints;
    __gridModelBuilderEndpoints = gridModelBuilderEndpoints;
    __modelBuilders = modelBuilders;
    return __modelBuilders;
  };
  const getModelBuilders = () => __modelBuilders;
  const getModelBuilderEndpoint = algo => __modelBuilderEndpoints[algo];
  const getGridModelBuilderEndpoint = algo => __gridModelBuilderEndpoints[algo];
  const requestModelBuilders = go => {
    const modelBuilders = getModelBuilders();
    if (modelBuilders) {
      return go(null, modelBuilders);
    }
    const visibility = 'Stable';
    return doGet(_, '/3/ModelBuilders', unwrap(go, result => {
      let algo;
      let builder;
      const builders = (() => {
        const _ref = result.model_builders;
        const _results = [];
        for (algo in _ref) {
          if ({}.hasOwnProperty.call(_ref, algo)) {
            builder = _ref[algo];
            _results.push(builder);
          }
        }
        return _results;
      })();
      const availableBuilders = (() => {
        let _i;
        let _j;
        let _len;
        let _len1;
        let _results;
        let _results1;
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
      })();
      return cacheModelBuilders(availableBuilders);
    }));
  };
  const requestModelBuilder = (algo, go) => doGet(_, getModelBuilderEndpoint(algo), go);
  const requestModelInputValidation = (algo, parameters, go) => doPost(_, `${getModelBuilderEndpoint(algo)}/parameters`, encodeObjectForPost(parameters), go);
  const requestModelBuild = (algo, parameters, go) => {
    _.trackEvent('model', algo);
    if (parameters.hyper_parameters) {
      // super-hack: nest this object as stringified json
      parameters.hyper_parameters = flowPrelude.stringify(parameters.hyper_parameters);
      if (parameters.search_criteria) {
        parameters.search_criteria = flowPrelude.stringify(parameters.search_criteria);
      }
      return doPost(_, getGridModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
    }
    return doPost(_, getModelBuilderEndpoint(algo), encodeObjectForPost(parameters), go);
  };
  const requestAutoModelBuild = (parameters, go) => doPostJSON(_, '/3/AutoMLBuilder', parameters, go);
  const requestPredict = (destinationKey, modelKey, frameKey, options, go) => {
    let opt;
    const opts = {};
    if (destinationKey) {
      opts.predictions_frame = destinationKey;
    }
    opt = options.reconstruction_error;
    if (void 0 !== opt) {
      opts.reconstruction_error = opt;
    }
    opt = options.deep_features_hidden_layer;
    if (void 0 !== opt) {
      opts.deep_features_hidden_layer = opt;
    }
    opt = options.leaf_node_assignment;
    if (void 0 !== opt) {
      opts.leaf_node_assignment = opt;
    }
    opt = options.exemplar_index;
    if (void 0 !== opt) {
      opts.exemplar_index = opt;
    }
    return doPost(_, `/3/Predictions/models/${encodeURIComponent(modelKey)}/frames/${encodeURIComponent(frameKey)}`, opts, (error, result) => {
      if (error) {
        return go(error);
      }
      return go(null, result);
    });
  };
  const requestPrediction = (modelKey, frameKey, go) => doGet(_, `/3/ModelMetrics/models/${encodeURIComponent(modelKey)}/frames/${encodeURIComponent(frameKey)}`, (error, result) => {
    if (error) {
      return go(error);
    }
    return go(null, result);
  });
  const requestPredictions = (modelKey, frameKey, _go) => {
    const go = (error, result) => {
      let prediction;
      if (error) {
        return _go(error);
      }
      //
      // TODO workaround for a filtering bug in the API
      //
      const predictions = (() => {
        let _i;
        let _len;
        const _ref = result.model_metrics;
        const _results = [];
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
      })();
      return _go(null, (() => {
        let _i;
        let _len;
        const _results = [];
        for (_i = 0, _len = predictions.length; _i < _len; _i++) {
          prediction = predictions[_i];
          if (prediction) {
            _results.push(prediction);
          }
        }
        return _results;
      })());
    };
    if (modelKey && frameKey) {
      return doGet(_, `/3/ModelMetrics/models/${encodeURIComponent(modelKey)}/frames/'${encodeURIComponent(frameKey)}`, go);
    } else if (modelKey) {
      return doGet(_, `/3/ModelMetrics/models/${encodeURIComponent(modelKey)}`, go);
    } else if (frameKey) {
      return doGet(_, `/3/ModelMetrics/frames/${encodeURIComponent(frameKey)}`, go);
    }
    return doGet(_, '/3/ModelMetrics', go);
  };
  _storageConfiguration = null;
  const requestIsStorageConfigured = go => {
    if (_storageConfiguration) {
      return go(null, _storageConfiguration.isConfigured);
    }
    return doGet(_, '/3/NodePersistentStorage/configured', (error, result) => {
      _storageConfiguration = { isConfigured: error ? false : result.configured };
      return go(null, _storageConfiguration.isConfigured);
    });
  };
  const requestObjects = (type, go) => doGet(_, `/3/NodePersistentStorage/${encodeURIComponent(type)}`, unwrap(go, result => result.entries));
  const requestObjectExists = (type, name, go) => doGet(_, `/3/NodePersistentStorage/categories/${encodeURIComponent(type)}/names/${encodeURIComponent(name)}/exists`, (error, result) => go(null, error ? false : result.exists));
  const requestObject = (type, name, go) => doGet(_, `/3/NodePersistentStorage/${encodeURIComponent(type)}/${encodeURIComponent(name)}`, unwrap(go, result => JSON.parse(result.value)));
  const requestDeleteObject = (type, name, go) => doDelete(_, `/3/NodePersistentStorage/${encodeURIComponent(type)}/${encodeURIComponent(name)}`, go);
  const requestPutObject = (type, name, value, go) => {
    let uri;
    uri = `/3/NodePersistentStorage/${encodeURIComponent(type)}`;
    if (name) {
      uri += `/${encodeURIComponent(name)}`;
    }
    return doPost(_, uri, { value: JSON.stringify(value, null, 2) }, unwrap(go, result => result.name));
  };
  const requestUploadObject = (type, name, formData, go) => {
    let uri;
    uri = `/3/NodePersistentStorage.bin/${encodeURIComponent(type)}`;
    if (name) {
      uri += `/${encodeURIComponent(name)}`;
    }
    return doUpload(_, uri, formData, unwrap(go, result => result.name));
  };
  const requestUploadFile = (key, formData, go) => doUpload(_, `/3/PostFile?destination_frame=${encodeURIComponent(key)}`, formData, go);
  const requestCloud = go => doGet(_, '/3/Cloud', go);
  const requestTimeline = go => doGet(_, '/3/Timeline', go);
  const requestProfile = (depth, go) => doGet(_, `/3/Profiler?depth=${depth}`, go);
  const requestStackTrace = go => doGet(_, '/3/JStack', go);
  const requestRemoveAll = go => doDelete(_, '/3/DKV', go);
  const requestEcho = (message, go) => doPost(_, '/3/LogAndEcho', { message }, go);
  const requestLogFile = (nodeIndex, fileType, go) => doGet(_, `/3/Logs/nodes/${nodeIndex}/files/${fileType}`, go);
  const requestNetworkTest = go => doGet(_, '/3/NetworkTest', go);
  const requestAbout = go => doGet(_, '/3/About', go);
  const requestShutdown = go => doPost(_, '/3/Shutdown', {}, go);
  const requestEndpoints = go => doGet(_, '/3/Metadata/endpoints', go);
  const requestEndpoint = (index, go) => doGet(_, `/3/Metadata/endpoints/${index}`, go);
  const requestSchemas = go => doGet(_, '/3/Metadata/schemas', go);
  const requestSchema = (name, go) => doGet(_, `/3/Metadata/schemas/${encodeURIComponent(name)}`, go);
  const getLines = data => lodash.filter(data.split('\n'), line => {
    if (line.trim()) {
      return true;
    }
    return false;
  });
  const requestPacks = go => download('text', '/flow/packs/index.list', unwrap(go, getLines));
  const requestPack = (packName, go) => download('text', `/flow/packs/${encodeURIComponent(packName)}/index.list`, unwrap(go, getLines));
  const requestFlow = (packName, flowName, go) => download('json', `/flow/packs/${encodeURIComponent(packName)}/${encodeURIComponent(flowName)}`, go);
  const requestHelpIndex = go => download('json', '/flow/help/catalog.json', go);
  const requestHelpContent = (name, go) => download('text', `/flow/help/${name}.html`, go);
  const requestRDDs = go => doGet(_, '/3/RDDs', go);
  const requestDataFrames = go => doGet(_, '/3/dataframes', go);
  const requestScalaIntp = go => doPost(_, '/3/scalaint', {}, go);
  const requestScalaCode = (sessionId, code, go) => doPost(_, `/3/scalaint/${sessionId}`, { code }, go);
  const requestAsH2OFrameFromRDD = (rddId, name, go) => {
    if (name === void 0) {
      return doPost(_, `/3/RDDs/${rddId}/h2oframe`, {}, go);
    }
    return doPost(_, `/3/RDDs/${rddId}/h2oframe`, { h2oframe_id: name }, go);
  };
  const requestAsH2OFrameFromDF = (dfId, name, go) => {
    if (name === void 0) {
      return doPost(_, `/3/dataframes/${dfId}/h2oframe`, {}, go);
    }
    return doPost(_, `/3/dataframes/${dfId}/h2oframe`, { h2oframe_id: name }, go);
  };
  const requestAsDataFrame = (hfId, name, go) => {
    if (name === void 0) {
      return doPost(_, `/3/h2oframes/${hfId}/dataframe`, {}, go);
    }
    return doPost(_, `/3/h2oframes/${hfId}/dataframe`, { dataframe_id: name }, go);
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
  //
  // Sparkling-Water
  //
  Flow.Dataflow.link(_.requestRDDs, requestRDDs);
  Flow.Dataflow.link(_.requestDataFrames, requestDataFrames);
  Flow.Dataflow.link(_.requestScalaIntp, requestScalaIntp);
  Flow.Dataflow.link(_.requestScalaCode, requestScalaCode);
  Flow.Dataflow.link(_.requestAsH2OFrameFromDF, requestAsH2OFrameFromDF);
  Flow.Dataflow.link(_.requestAsH2OFrameFromRDD, requestAsH2OFrameFromRDD);
  return Flow.Dataflow.link(_.requestAsDataFrame, requestAsDataFrame);
}
