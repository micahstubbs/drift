import { insertAbove } from './insertAbove';
import { createCell } from './createCell';

export function insertCellAbove(_, _renderers, type, input) {
  return insertAbove(_, createCell(_, type, input));
}
