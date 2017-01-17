import { createCell } from './createCell';

export function cloneCell(_, _renderers, cell) {
  return createCell(_, cell.type(), cell.input());
}
