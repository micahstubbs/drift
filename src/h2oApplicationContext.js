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

