/* eslint no-unused-vars: "error"*/

import renderPlot from './renderPlot';
import renderGrid from './renderGrid';

import { formatBytes } from '../utils/formatBytes';

import { flowPreludeFunction } from '../flowPreludeFunction';
const flowPrelude = flowPreludeFunction();

export function h2oFrameOutput(_, _go, _frame) {
  const lodash = window._;
  const Flow = window.Flow;
  _.frame = _frame;
  let _lastUsedSearchTerm;
  const MaxItemsPerPage = 20;
  _.grid = Flow.Dataflow.signal(null);
  const _chunkSummary = Flow.Dataflow.signal(null);
  const _distributionSummary = Flow.Dataflow.signal(null);
  const _columnNameSearchTerm = Flow.Dataflow.signal(null);
  const _currentPage = Flow.Dataflow.signal(0);
  const _maxPages = Flow.Dataflow.signal(Math.ceil(_.frame.total_column_count / MaxItemsPerPage));
  const _canGoToPreviousPage = Flow.Dataflow.lift(_currentPage, index => index > 0);
  const _canGoToNextPage = Flow.Dataflow.lift(_maxPages, _currentPage, (maxPages, index) => index < maxPages - 1);
  const createModel = () => _.insertAndExecuteCell('cs', `assist buildModel, null, training_.frame: ${flowPrelude.stringify(_.frame.frame_id.name)}`);
  const inspect = () => _.insertAndExecuteCell('cs', `inspect getFrameSummary ${flowPrelude.stringify(_.frame.frame_id.name)}`);
  const inspectData = () => _.insertAndExecuteCell('cs', `getFrameData ${flowPrelude.stringify(_.frame.frame_id.name)}`);
  const splitFrame = () => _.insertAndExecuteCell('cs', `assist splitFrame, ${flowPrelude.stringify(_.frame.frame_id.name)}`);
  const predict = () => _.insertAndExecuteCell('cs', `predict frame: ${flowPrelude.stringify(_.frame.frame_id.name)}`);
  const download = () => window.open(`${window.Flow.ContextPath}${(`3/DownloadDataset?frame_id=${encodeURIComponent(_.frame.frame_id.name)}`)}`, '_blank');
  const exportFrame = () => _.insertAndExecuteCell('cs', `exportFrame ${flowPrelude.stringify(_.frame.frame_id.name)}`);
  const deleteFrame = () => _.confirm('Are you sure you want to delete this frame?', {
    acceptCaption: 'Delete Frame',
    declineCaption: 'Cancel',
  }, accept => {
    if (accept) {
      return _.insertAndExecuteCell('cs', `deleteFrame ${flowPrelude.stringify(_.frame.frame_id.name)}`);
    }
  });
  const renderFrame = frame => {
    renderGrid(_, _.plot(g => g(g.select(), g.from(_.inspect('columns', frame)))));
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
    const itemCount = startIndex + MaxItemsPerPage < _.frame.total_column_count ? MaxItemsPerPage : _.frame.total_column_count - startIndex;
    return _.requestFrameSummarySliceE(_, _.frame.frame_id.name, searchTerm, startIndex, itemCount, (error, frame) => {
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
  renderFrame(_.frame);
  lodash.defer(_go);
  return {
    key: _.frame.frame_id.name,
    rowCount: _.frame.rows,
    columnCount: _.frame.total_column_count,
    size: formatBytes(_.frame.byte_size),
    chunkSummary: _chunkSummary,
    distributionSummary: _distributionSummary,
    columnNameSearchTerm: _columnNameSearchTerm,
    grid: _.grid,
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

