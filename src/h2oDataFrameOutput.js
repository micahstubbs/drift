export function h2oDataFrameOutput(_, _go, _result) {
  var lodash = window._;
  var Flow = window.Flow;
  var createDataFrameView;
  var _dataFrameView;
  _dataFrameView = Flow.Dataflow.signal(null);
  createDataFrameView = function (result) {
    return { dataframe_id: result.dataframe_id };
  };
  _dataFrameView(createDataFrameView(_result));
  lodash.defer(_go);
  return {
    dataFrameView: _dataFrameView,
    template: 'flow-dataframe-output'
  };
};
  