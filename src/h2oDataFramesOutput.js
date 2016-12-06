export function h2oDataFramesOutput(_, _go, _dataFrames) {
  var lodash = window._;
  var Flow = window.Flow;
  var createDataFrameView;
  var _dataFramesViews;
  _dataFramesViews = Flow.Dataflow.signal([]);
  createDataFrameView = function (dataFrame) {
    return {
      dataframe_id: dataFrame.dataframe_id,
      partitions: dataFrame.partitions
    };
  };
  _dataFramesViews(lodash.map(_dataFrames, createDataFrameView));
  lodash.defer(_go);
  return {
    dataFrameViews: _dataFramesViews,
    hasDataFrames: _dataFrames.length > 0,
    template: 'flow-dataframes-output'
  };
};
  