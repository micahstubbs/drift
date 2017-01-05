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
import { getLines } from './getLines';

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
  //
  // Sparkling-Water
  //
  Flow.Dataflow.link(_.requestScalaCode, requestScalaCode);
  Flow.Dataflow.link(_.requestAsH2OFrameFromDF, requestAsH2OFrameFromDF);
  Flow.Dataflow.link(_.requestAsH2OFrameFromRDD, requestAsH2OFrameFromRDD);
  return Flow.Dataflow.link(_.requestAsDataFrame, requestAsDataFrame);
}
