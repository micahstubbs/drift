export function h2oApplicationContext(_) {
  const Flow = window.Flow;
  _.requestFileGlob = Flow.Dataflow.slot();
  _.requestSplitFrame = Flow.Dataflow.slot();
  _.requestImportFile = Flow.Dataflow.slot();
  _.requestImportFiles = Flow.Dataflow.slot();
  _.requestFrames = Flow.Dataflow.slot();
  _.requestFrameSlice = Flow.Dataflow.slot();
  _.requestFrameSummary = Flow.Dataflow.slot();
  _.requestFrameDataE = Flow.Dataflow.slot();
  _.requestFrameSummarySlice = Flow.Dataflow.slot();
  _.requestFrameSummarySliceE = Flow.Dataflow.slot();
  _.requestFrameSummaryWithoutData = Flow.Dataflow.slot();
  _.requestDeleteFrame = Flow.Dataflow.slot();
  _.requestPutObject = Flow.Dataflow.slot();
  _.requestUploadObject = Flow.Dataflow.slot();
  _.requestUploadFile = Flow.Dataflow.slot();
  _.requestCloud = Flow.Dataflow.slot();
  _.requestTimeline = Flow.Dataflow.slot();
  _.requestProfile = Flow.Dataflow.slot();
  _.requestStackTrace = Flow.Dataflow.slot();
  _.requestRemoveAll = Flow.Dataflow.slot();
  _.requestEcho = Flow.Dataflow.slot();
  _.requestLogFile = Flow.Dataflow.slot();
  _.requestNetworkTest = Flow.Dataflow.slot();
  _.requestAbout = Flow.Dataflow.slot();
  _.requestShutdown = Flow.Dataflow.slot();
  _.requestEndpoints = Flow.Dataflow.slot();
  _.requestEndpoint = Flow.Dataflow.slot();
  _.requestSchemas = Flow.Dataflow.slot();
  _.requestSchema = Flow.Dataflow.slot();
  _.requestPacks = Flow.Dataflow.slot();
  _.requestPack = Flow.Dataflow.slot();
  _.requestFlow = Flow.Dataflow.slot();
  _.requestHelpIndex = Flow.Dataflow.slot();
  _.requestHelpContent = Flow.Dataflow.slot();
  _.ls = Flow.Dataflow.slot();
  _.inspect = Flow.Dataflow.slot();
  _.plot = Flow.Dataflow.slot();
  _.grid = Flow.Dataflow.slot();
  _.enumerate = Flow.Dataflow.slot();
  //
  // Sparkling-Water
  //
  _.scalaIntpId = Flow.Dataflow.signal(-1);
  _.requestRDDs = Flow.Dataflow.slot();
  _.requestDataFrames = Flow.Dataflow.slot();
  _.requestScalaIntp = Flow.Dataflow.slot();
  _.requestScalaCode = Flow.Dataflow.slot();
  _.requestAsH2OFrameFromRDD = Flow.Dataflow.slot();
  _.requestAsH2OFrameFromDF = Flow.Dataflow.slot();
  _.requestAsDataFrame = Flow.Dataflow.slot();
  return _.requestAsDataFrame;
}

