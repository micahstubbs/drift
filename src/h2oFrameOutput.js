import { flowPreludeFunction } from './flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oFrameOutput(_, _go, _frame) {
  var lodash = window._;
  var Flow = window.Flow;
  var MaxItemsPerPage;
  var createModel;
  var deleteFrame;
  var download;
  var exportFrame;
  var goToNextPage;
  var goToPreviousPage;
  var inspect;
  var inspectData;
  var predict;
  var refreshColumns;
  var renderFrame;
  var renderGrid;
  var renderPlot;
  var splitFrame;
  var _canGoToNextPage;
  var _canGoToPreviousPage;
  var _chunkSummary;
  var _columnNameSearchTerm;
  var _currentPage;
  var _distributionSummary;
  var _grid;
  var _lastUsedSearchTerm;
  var _maxPages;
  MaxItemsPerPage = 20;
  _grid = Flow.Dataflow.signal(null);
  _chunkSummary = Flow.Dataflow.signal(null);
  _distributionSummary = Flow.Dataflow.signal(null);
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
  renderGrid = function (render) {
    return render(function (error, vis) {
      if (error) {
        return console.debug(error);
      }
      $('a', vis.element).on('click', function (e) {
        var $a;
        $a = $(e.target);
        switch ($a.attr('data-type')) {
          case 'summary-link':
            return _.insertAndExecuteCell('cs', `getColumnSummary ${flowPrelude.stringify(_frame.frame_id.name)}, ${flowPrelude.stringify($a.attr('data-key'))}`);
          case 'as-factor-link':
            return _.insertAndExecuteCell('cs', `changeColumnType frame: ${flowPrelude.stringify(_frame.frame_id.name)}, column: ${flowPrelude.stringify($a.attr('data-key'))}, type: \'enum\'`);
          case 'as-numeric-link':
            return _.insertAndExecuteCell('cs', `changeColumnType frame: ${flowPrelude.stringify(_frame.frame_id.name)}, column: ${flowPrelude.stringify($a.attr('data-key'))}, type: \'int\'`);
        }
      });
      return _grid(vis.element);
    });
  };
  createModel = function () {
    return _.insertAndExecuteCell('cs', `assist buildModel, null, training_frame: ${flowPrelude.stringify(_frame.frame_id.name)}`);
  };
  inspect = function () {
    return _.insertAndExecuteCell('cs', `inspect getFrameSummary ${flowPrelude.stringify(_frame.frame_id.name)}`);
  };
  inspectData = function () {
    return _.insertAndExecuteCell('cs', `getFrameData ${flowPrelude.stringify(_frame.frame_id.name)}`);
  };
  splitFrame = function () {
    return _.insertAndExecuteCell('cs', `assist splitFrame, ${flowPrelude.stringify(_frame.frame_id.name)}`);
  };
  predict = function () {
    return _.insertAndExecuteCell('cs', `predict frame: ${flowPrelude.stringify(_frame.frame_id.name)}`);
  };
  download = function () {
    return window.open(`${window.Flow.ContextPath}${(`3/DownloadDataset?frame_id=${encodeURIComponent(_frame.frame_id.name)}`)}`, '_blank');
  };
  exportFrame = function () {
    return _.insertAndExecuteCell('cs', `exportFrame ${flowPrelude.stringify(_frame.frame_id.name)}`);
  };
  deleteFrame = function () {
    return _.confirm('Are you sure you want to delete this frame?', {
      acceptCaption: 'Delete Frame',
      declineCaption: 'Cancel'
    }, function (accept) {
      if (accept) {
        return _.insertAndExecuteCell('cs', `deleteFrame ${flowPrelude.stringify(_frame.frame_id.name)}`);
      }
    });
  };
  renderFrame = function (frame) {
    renderGrid(_.plot(function (g) {
      return g(g.select(), g.from(_.inspect('columns', frame)));
    }));
    renderPlot(_chunkSummary, _.plot(function (g) {
      return g(g.select(), g.from(_.inspect('Chunk compression summary', frame)));
    }));
    return renderPlot(_distributionSummary, _.plot(function (g) {
      return g(g.select(), g.from(_.inspect('Frame distribution summary', frame)));
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
    return _.requestFrameSummarySliceE(_frame.frame_id.name, searchTerm, startIndex, itemCount, function (error, frame) {
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
    template: 'flow-frame-output'
  };
};
  