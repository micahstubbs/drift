import { insertBelow } from './insertBelow';
import { createCell } from './createCell';

export function insertCellBelow(_, _renderers, type, input) {
  return insertBelow(_, createCell(_, _renderers, type, input));
}
