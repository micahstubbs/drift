import { createCell } from './createCell';

export function cloneCell(_, _renderers, cell) {
  return createCell(_, _renderers, cell.type(), cell.input());
}
