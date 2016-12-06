export function h2oFrameDataOutput(_, _go, _frame) {
  var lodash = window._;
  var Flow = window.Flow;
  var MaxItemsPerPage;
  var goToNextPage;
  var goToPreviousPage;
  var refreshColumns;
  var renderFrame;
  var renderPlot;
  var _canGoToNextPage;
  var _canGoToPreviousPage;
  var _columnNameSearchTerm;
  var _currentPage;
  var _data;
  var _lastUsedSearchTerm;
  var _maxPages;
  MaxItemsPerPage = 20;
  _data = Flow.Dataflow.signal(null);
  _columnNameSearchTerm = Flow.Dataflow.signal(null);
  _currentPage = Flow.Dataflow.signal(0);
  _maxPages = Flow.Dataflow.signal(Math.ceil(_frame.total_column_count / MaxItemsPerPage));
  _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, function (index) {
    return index > 0;
  });
  _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, function (maxPages, index) {
    return index < maxPages - 1;
  });
  renderPlot = function (container, render) {
    return render(function (error, vis) {
      if (error) {
        return console.debug(error);
      }
      return container(vis.element);
    });
  };
  renderFrame = function (frame) {
    return renderPlot(_data, _.plot(function (g) {
      return g(g.select(), g.from(_.inspect('data', frame)));
    }));
  };
  _lastUsedSearchTerm = null;
  refreshColumns = function (pageIndex) {
    var itemCount;
    var searchTerm;
    var startIndex;
    searchTerm = _columnNameSearchTerm();
    if (searchTerm !== _lastUsedSearchTerm) {
      pageIndex = 0;
    }
    startIndex = pageIndex * MaxItemsPerPage;
    itemCount = startIndex + MaxItemsPerPage < _frame.total_column_count ? MaxItemsPerPage : _frame.total_column_count - startIndex;
    return _.requestFrameDataE(_frame.frame_id.name, searchTerm, startIndex, itemCount, function (error, frame) {
      if (error) {
        // empty
      } else {
        _lastUsedSearchTerm = searchTerm;
        _currentPage(pageIndex);
        return renderFrame(frame);
      }
    });
  };
  goToPreviousPage = function () {
    var currentPage;
    currentPage = _currentPage();
    if (currentPage > 0) {
      refreshColumns(currentPage - 1);
    }
  };
  goToNextPage = function () {
    var currentPage;
    currentPage = _currentPage();
    if (currentPage < _maxPages() - 1) {
      refreshColumns(currentPage + 1);
    }
  };
  Flow.Dataflow.react(_columnNameSearchTerm, lodash.throttle(refreshColumns, 500));
  renderFrame(_frame);
  lodash.defer(_go);
  return {
    key: _frame.frame_id.name,
    data: _data,
    columnNameSearchTerm: _columnNameSearchTerm,
    canGoToPreviousPage: _canGoToPreviousPage,
    canGoToNextPage: _canGoToNextPage,
    goToPreviousPage,
    goToNextPage,
    template: 'flow-frame-data-output'
  };
};
  