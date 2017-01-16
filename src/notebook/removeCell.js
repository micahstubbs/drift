import { selectCell } from './selectCell';

export function removeCell(_, _cells) {
  const lodash = window._;
  let removedCell;
  const cells = _cells();
  if (cells.length > 1) {
    if (_.selectedCellIndex === cells.length - 1) {
          // TODO call dispose() on this cell
      removedCell = lodash.head(_cells.splice(_.selectedCellIndex, 1));
      selectCell(
            _,
            _cells,
            cells[_.selectedCellIndex - 1]
          );
    } else {
          // TODO call dispose() on this cell
      removedCell = lodash.head(_cells.splice(_.selectedCellIndex, 1));
      selectCell(
            _,
            _cells,
            cells[_.selectedCellIndex]
          );
    }
    if (removedCell) {
      _.saveClip('trash', removedCell.type(), removedCell.input());
    }
  }
}
