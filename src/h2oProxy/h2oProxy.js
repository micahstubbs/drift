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
import { encodeObjectForPost } from './encodeObjectForPost';
import { unwrap } from './unwrap';
import { requestSplitFrame } from './requestSplitFrame';
import { requestFrames } from './requestFrames';
import { requestFrameSlice } from './requestFrameSlice';
import { requestFrameSummary } from './requestFrameSummary';
import { requestFrameSummarySlice } from './requestFrameSummarySlice';
import { requestFrameSummaryWithoutData } from './requestFrameSummaryWithoutData';
import { requestDeleteFrame } from './requestDeleteFrame';
import { requestFileGlob } from './requestFileGlob';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oProxy(_) {
  const lodash = window._;
  const Flow = window.Flow;
  const $ = window.jQuery;
  let _storageConfigurations;

  // abstracting out these two functions
  // produces an error
  // defer for now
  const requestImportFiles = (paths, go) => {
    const tasks = lodash.map(paths, path => go => requestImportFile(path, go));
    return Flow.Async.iterate(tasks)(go);
  };
  const requestImportFile = (path, go) => {
    const opts = { path: encodeURIComponent(path) };
    return requestWithOpts(_, '/3/ImportFiles', opts, go);
  };

  // setup a __ namespace for our modelBuilders cache
  _.__ = {};
  _.__.modelBuilders = null;
  _.__.modelBuilderEndpoints = null;
  _.__.gridModelBuilderEndpoints = null;
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
  Flow.Dataflow.link(_.requestSplitFrame, requestSplitFrame);
  Flow.Dataflow.link(_.requestFrames, requestFrames);
  Flow.Dataflow.link(_.requestFrameSlice, requestFrameSlice);
  Flow.Dataflow.link(_.requestFrameSummary, requestFrameSummary);
  Flow.Dataflow.link(_.requestFrameSummaryWithoutData, requestFrameSummaryWithoutData);
  Flow.Dataflow.link(_.requestFrameSummarySlice, requestFrameSummarySlice);
  Flow.Dataflow.link(_.requestDeleteFrame, requestDeleteFrame);
  Flow.Dataflow.link(_.requestFileGlob, requestFileGlob);
  Flow.Dataflow.link(_.requestImportFiles, requestImportFiles);
  Flow.Dataflow.link(_.requestImportFile, requestImportFile);
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
