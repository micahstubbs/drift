export function h2oFrameDataOutput(_, _go, _frame) {
  const lodash = window._;
  const Flow = window.Flow;
  let MaxItemsPerPage;
  let goToNextPage;
  let goToPreviousPage;
  let refreshColumns;
  let renderFrame;
  let renderPlot;
  let _canGoToNextPage;
  let _canGoToPreviousPage;
  let _columnNameSearchTerm;
  let _currentPage;
  let _data;
  let _lastUsedSearchTerm;
  let _maxPages;
  MaxItemsPerPage = 20;
  _data = Flow.Dataflow.signal(null);
  _columnNameSearchTerm = Flow.Dataflow.signal(null);
  _currentPage = Flow.Dataflow.signal(0);
  _maxPages = Flow.Dataflow.signal(Math.ceil(_frame.total_column_count / MaxItemsPerPage));
  _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, index => index > 0);
  _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, (maxPages, index) => index < maxPages - 1);
  renderPlot = (container, render) => render((error, vis) => {
    if (error) {
      return console.debug(error);
    }
    return container(vis.element);
  });
  renderFrame = frame => renderPlot(_data, _.plot(g => g(g.select(), g.from(_.inspect('data', frame)))));
  _lastUsedSearchTerm = null;
  refreshColumns = pageIndex => {
    let itemCount;
    let searchTerm;
    let startIndex;
    searchTerm = _columnNameSearchTerm();
    if (searchTerm !== _lastUsedSearchTerm) {
      pageIndex = 0;
    }
    startIndex = pageIndex * MaxItemsPerPage;
    itemCount = startIndex + MaxItemsPerPage < _frame.total_column_count ? MaxItemsPerPage : _frame.total_column_count - startIndex;
    return _.requestFrameDataE(_frame.frame_id.name, searchTerm, startIndex, itemCount, (error, frame) => {
      if (error) {
        // empty
      } else {
        _lastUsedSearchTerm = searchTerm;
        _currentPage(pageIndex);
        return renderFrame(frame);
      }
    });
  };
  goToPreviousPage = () => {
    let currentPage;
    currentPage = _currentPage();
    if (currentPage > 0) {
      refreshColumns(currentPage - 1);
    }
  };
  goToNextPage = () => {
    let currentPage;
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
}

