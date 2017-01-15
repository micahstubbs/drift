import { checkConsistency } from './checkConsistency';

export function selectCell(
  _,
  _selectedCellIndex,
  _cells,
  target,
  scrollIntoView,
  scrollImmediately
) {
  const lodash = window._;
  if (scrollIntoView == null) {
    scrollIntoView = true;
  }
  if (scrollImmediately == null) {
    scrollImmediately = false;
  }
  if (_.selectedCell === target) {
    return;
  }
  if (_.selectedCell) {
    _.selectedCell.isSelected(false);
  }
  _.selectedCell = target;
      // TODO also set focus so that tabs don't jump to the first cell
  _.selectedCell.isSelected(true);
  _selectedCellIndex = _cells.indexOf(_.selectedCell);
  checkConsistency(_cells);
  if (scrollIntoView) {
    lodash.defer(() => _.selectedCell.scrollIntoView(scrollImmediately));
  }
}
