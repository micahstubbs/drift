import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oFrameOutput(_, _go, _frame) {
  const lodash = window._;
  const Flow = window.Flow;
  const $ = window.jQuery;
  let _lastUsedSearchTerm;
  const MaxItemsPerPage = 20;
  const _grid = Flow.Dataflow.signal(null);
  const _chunkSummary = Flow.Dataflow.signal(null);
  const _distributionSummary = Flow.Dataflow.signal(null);
  const _columnNameSearchTerm = Flow.Dataflow.signal(null);
  const _currentPage = Flow.Dataflow.signal(0);
  const _maxPages = Flow.Dataflow.signal(Math.ceil(_frame.total_column_count / MaxItemsPerPage));
  const _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, index => index > 0);
  const _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, (maxPages, index) => index < maxPages - 1);
  const renderPlot = (container, render) => render((error, vis) => {
    if (error) {
      return console.debug(error);
    }
    return container(vis.element);
  });
  const renderGrid = render => render((error, vis) => {
    if (error) {
      return console.debug(error);
    }
    $('a', vis.element).on('click', e => {
      const $a = $(e.target);
      switch ($a.attr('data-type')) {
        case 'summary-link':
          return _.insertAndExecuteCell('cs', `getColumnSummary ${flowPrelude.stringify(_frame.frame_id.name)}, ${flowPrelude.stringify($a.attr('data-key'))}`);
        case 'as-factor-link':
          return _.insertAndExecuteCell('cs', `changeColumnType frame: ${flowPrelude.stringify(_frame.frame_id.name)}, column: ${flowPrelude.stringify($a.attr('data-key'))}, type: \'enum\'`);
        case 'as-numeric-link':
          return _.insertAndExecuteCell('cs', `changeColumnType frame: ${flowPrelude.stringify(_frame.frame_id.name)}, column: ${flowPrelude.stringify($a.attr('data-key'))}, type: \'int\'`);
        default:
          // do nothing
      }
    });
    return _grid(vis.element);
  });
  const createModel = () => _.insertAndExecuteCell('cs', `assist buildModel, null, training_frame: ${flowPrelude.stringify(_frame.frame_id.name)}`);
  const inspect = () => _.insertAndExecuteCell('cs', `inspect getFrameSummary ${flowPrelude.stringify(_frame.frame_id.name)}`);
  const inspectData = () => _.insertAndExecuteCell('cs', `getFrameData ${flowPrelude.stringify(_frame.frame_id.name)}`);
  const splitFrame = () => _.insertAndExecuteCell('cs', `assist splitFrame, ${flowPrelude.stringify(_frame.frame_id.name)}`);
  const predict = () => _.insertAndExecuteCell('cs', `predict frame: ${flowPrelude.stringify(_frame.frame_id.name)}`);
  const download = () => window.open(`${window.Flow.ContextPath}${(`3/DownloadDataset?frame_id=${encodeURIComponent(_frame.frame_id.name)}`)}`, '_blank');
  const exportFrame = () => _.insertAndExecuteCell('cs', `exportFrame ${flowPrelude.stringify(_frame.frame_id.name)}`);
  const deleteFrame = () => _.confirm('Are you sure you want to delete this frame?', {
    acceptCaption: 'Delete Frame',
    declineCaption: 'Cancel',
  }, accept => {
    if (accept) {
      return _.insertAndExecuteCell('cs', `deleteFrame ${flowPrelude.stringify(_frame.frame_id.name)}`);
    }
  });
  const renderFrame = frame => {
    renderGrid(_.plot(g => g(g.select(), g.from(_.inspect('columns', frame)))));
    renderPlot(_chunkSummary, _.plot(g => g(g.select(), g.from(_.inspect('Chunk compression summary', frame)))));
    return renderPlot(_distributionSummary, _.plot(g => g(g.select(), g.from(_.inspect('Frame distribution summary', frame)))));
  };
  _lastUsedSearchTerm = null;
  const refreshColumns = pageIndex => {
    const searchTerm = _columnNameSearchTerm();
    if (searchTerm !== _lastUsedSearchTerm) {
      pageIndex = 0;
    }
    const startIndex = pageIndex * MaxItemsPerPage;
    const itemCount = startIndex + MaxItemsPerPage < _frame.total_column_count ? MaxItemsPerPage : _frame.total_column_count - startIndex;
    return _.requestFrameSummarySliceE(_, _frame.frame_id.name, searchTerm, startIndex, itemCount, (error, frame) => {
      if (error) {
        // empty
        // TODO
      } else {
        _lastUsedSearchTerm = searchTerm;
        _currentPage(pageIndex);
        return renderFrame(frame);
      }
    });
  };
  const goToPreviousPage = () => {
    const currentPage = _currentPage();
    if (currentPage > 0) {
      refreshColumns(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    const currentPage = _currentPage();
    if (currentPage < _maxPages() - 1) {
      refreshColumns(currentPage + 1);
    }
  };
  Flow.Dataflow.react(_columnNameSearchTerm, lodash.throttle(refreshColumns, 500));
  renderFrame(_frame);
  lodash.defer(_go);
  return {
    key: _frame.frame_id.name,
    rowCount: _frame.rows,
    columnCount: _frame.total_column_count,
    size: Flow.Util.formatBytes(_frame.byte_size),
    chunkSummary: _chunkSummary,
    distributionSummary: _distributionSummary,
    columnNameSearchTerm: _columnNameSearchTerm,
    grid: _grid,
    inspect,
    createModel,
    inspectData,
    splitFrame,
    predict,
    download,
    exportFrame,
    canGoToPreviousPage: _canGoToPreviousPage,
    canGoToNextPage: _canGoToNextPage,
    goToPreviousPage,
    goToNextPage,
    deleteFrame,
    template: 'flow-frame-output',
  };
}

